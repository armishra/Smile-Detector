var tessel = require('tessel');
var Queue = require('sync-queue');


var avrLib = require('../');

var isp = avrLib.use(tessel.port['A'], {
  pageSize : 64,
  fileName : 'examples/ambient-attx4.hex'
  });


function setup(next) {
  console.log('Verifying signature...');
  isp.readSignature(function(err, sig){
    if (err) {
      console.log(err);
    } else {
      console.log('Verified');
      isp.eraseChip(function(){
        console.log("Flash cleared.");
        isp.programFuses(function(err){
          if (err) {
            console.log(err);
          } else {
            next();
          }
        });
      });
    }
  });
}

function writeHexFile(next){
  console.log('Parsing hex file...');
  isp.readPagesFromHexFile(function(err, pages){
    if (err) {
      console.log('Parse error: ',err);
    } else {
      console.log('Flashing chip memory...');
      isp.flashImage(pages, function(){
          console.log('Done programming!');
          next(pages);
      });
    }
  });
}

function verifyHexFile(pages, next){
  console.log('Verifying flash was written properly - please wait as this will take a while...');
  isp.verifyImage(pages, next);
}

function execute(){
  var queue = new Queue();

  queue.place(function(){
    setup(function(){
      queue.next();
    });
  });

  queue.place(function(){
    writeHexFile(function(pages){
      queue.place(function(){
        verifyHexFile(pages, function(){
        console.log('Verification complete.');
        })
      });
      queue.next();
    });
  });
}

execute();
