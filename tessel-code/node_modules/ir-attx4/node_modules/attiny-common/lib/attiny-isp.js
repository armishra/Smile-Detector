var tessel = require('tessel');
var Queue = require('sync-queue');

var avrLib = require('avr-isp');

var debug = false;

function setup(isp, expectedSignature, callback) {
  debug && console.log('Verifying signature...');
  // First make sure we can read the signature
  isp.readSignature(function(err, readSignature){
    // If there was a problem, abort
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    } 

    // If the signatures don't match
    else if (expectedSignature != readSignature) {
      // Throw an error, this isn't the right module or it's not plugged in
      if (callback) {
        callback(new Error("Invalid Module signature. Are you sure you plugged in the right module?"));
      }
      return;
    }
    else {
      debug && console.log('Verified');
      // Erase old firmware
      isp.eraseChip(function(){
        debug && console.log("Flash cleared.");
        // Program the fuses for upcoming flash
        isp.programFuses(function(err){
          if (err) {
            console.log(err);
          } else {
            callback();
          }
        });
      });
    }
  });
}

function writeHexFile(isp, callback){
  debug && console.log('Parsing hex file...');
  // Read the pages from the file path
  isp.readPagesFromHexFile(function(err, pages){
    // If there was an issue, report it!
    if (err) {
      debug && console.log('Parse error: ',err);
      if (callback) {
        callback(err);
      }
      return;
    } else {
      debug && console.log('Flashing chip memory');
      console.warn('Uploading new firmware...');
      // Flash the new image
      isp.flashImage(pages, function(){
        console.warn('Update finished!');
        callback();
      });
    }
  });
}

function abort(err, callback) {
  if (err) {
    if (callback) {
      callback(err);
    }
    return true;
  }
  return false;
}

function updateEEPROM(isp, moduleID, firmwareVersion, callback) {

  // First read EEPROM and make sure we don't overwrite the same thing
  // Flash has a limited number of writes
  checkEEPROM(isp, moduleID, firmwareVersion, function readVersion(err, readModuleID, readFirmwareVersion) {
    // If there was an error, return
    if (abort(err, callback)) { return; }
    // If the request ID and firmware already exist as such

    else if (readModuleID === moduleID && readFirmwareVersion === firmwareVersion) {
      // Call callback and return
      if (callback) {
        callback();
      }
      return;
    }
    else {
      // Write the module ID and firmware version to addresses 0 and 1
      isp.writeEEPROM([moduleID, firmwareVersion], 0x00, function confirm(err) {
        // If there was an error, abort
        if (abort(err, callback)) { return; }
        // If there was no error
        else {
          // Read the written versions to confirm that we wrote what we think we wrote
          checkEEPROM(isp, moduleID, firmwareVersion, function(err, confirmModuleID, confirmFirmwareVersion) {
            if (callback) {
              var err;
              if (confirmModuleID != moduleID && confirmFirmwareVersion != firmwareVersion) {
                // Call callback and return
                err = new Error("Unable to write to EEPROM.");
              }
              callback(err);
            }
            return;
         });
        }
      });
    }
  });
}

function checkEEPROM(isp, moduleID, firmwareVersion, callback) {
  // Read the first two bytes from EEPROM
  isp.readEEPROM(2, 0x00, function(err, response) {
    // Return an error
    if (callback) {
      if (err) {
        callback(err);
      }
      // Or return the respons
      else {
        callback(null, response[0], response[1]);
      }
    }
  }); 
}

function updateFirmware(hardware, firmwareOptions, callback){

  var isp = avrLib.use(hardware, {
    pageSize : 64,
    fileName : firmwareOptions.firmwareFile,
  });

  var queue = new Queue();

  // Step 1: Setup
  queue.place(function(){
    setup(isp, firmwareOptions.signature, function(err){
      if (err) {
        if (callback) {
          callback(err);
        }
        return;
      }
      else {
        queue.next();
      }
    });
  });

  // Step 2: Write New Firmware Image
  queue.place(function() {
    writeHexFile(isp, function(err){
      if (err) {
        if (callback) {
          callback(err);
        }
        return;
      }
      else {
        queue.next();
      }
      
    });
  });

  // Step 3: Update EEPROM w/ module ID and firmware version
  queue.place(function() {
    setTimeout(function() {
      updateEEPROM(isp, firmwareOptions.moduleID, firmwareOptions.firmwareVersion, function() {
        if (callback) {
          callback();
        }
      });
    }, 1000)
  });
}

function getSignature(hardware, callback) {
  avrLib.use(hardware).readSignature(callback);
}

module.exports.updateFirmware = updateFirmware;
module.exports.getSignature = getSignature;
