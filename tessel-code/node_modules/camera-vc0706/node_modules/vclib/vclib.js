var DEBUG = false;

var headerSize = 5;

function vclib() {
  this.rxBuffer = [];
  this.rxBufferPos = 0;
  this.rxDataLen = 0;
}

vclib.prototype.parseIncomingImageData = function(commandPacket, incomingBytes, callback) {

  this.rxBuffer = [];
  this.rxBufferPos = 0;
  this.rxDataLen = 0;

  var length = commandPacket.dataLen;


  for (var i = 0; i < incomingBytes.length; i++) {

    var ch = incomingBytes[i];

    if (this.rxBufferPos === 0) {
      if (ch === 0x76) {
      // store new character in RX buffer
        this.rxBuffer[this.rxBufferPos++] = ch;
      } 
      else {
        return callback && callback(new Error("Out of frame packet on image read"));
      }
    }
    else {
    // Add the byte to the rx Buffer
      this.rxBuffer[this.rxBufferPos] = ch;
      // If this is the final byte of the header, verify
      if (this.rxBufferPos === 4) {
        if (!(this.validImagePacketTerminus())) {
          return callback && callback(new Error("Invalid Image data packet terminus."));
        }
      }
      else if (this.rxBufferPos === (8 + length)){
        if (!(this.validImagePacketTerminus())) {
          return callback && callback(new Error("Invalid Image data packet terminus."));
        }
        else {
          var imageData = new Buffer(this.rxBuffer.splice(5, length));

          this.rxBuffer = [];
          this.rxBufferPos = 0;
          this.rxDataLen = 0;

          var packet = new ResponsePacket(commandPacket.name, imageData);

          return callback && callback(null, packet);
        }
      }
      this.rxBufferPos++;
    }
  }
  return callback && callback();
};

vclib.prototype.validImagePacketTerminus = function() {
  return (this.rxBuffer[0] === 0x76 &&
      this.rxBuffer[1] === 0x00 &&
      this.rxBuffer[2] === 0x32 &&
      this.rxBuffer[3] === 0x00 &&
      this.rxBuffer[4] === 0x00); 
};

// Parse bytes as they come in
// The API is stupid so we have to supply a command that we're looking for a response to
vclib.prototype.parseIncoming = function(commandPacket, incomingBytes, callback) {

  // Image Capture has it's own parsing structure (such a idiotic protocol)
  if (commandPacket.name === 'readFrame') {
    return this.parseIncomingImageData(commandPacket, incomingBytes, callback);
  }
  else {
    // Create the packets
    for (var i = 0; i < incomingBytes.length; i++) {

      // Gran the callback byte
      var ch = incomingBytes[i];

      // If this is the beginning of the packet
      if (this.rxBufferPos === 0 && ch != 0x76) {

        if (callback) callback(new Error("Packet Frame Issue. Start byte should be 0x76 but is instead " + ch.toString()));

        return;
      }
      else {
        // Add the byte to the rx Buffer
        this.rxBuffer[this.rxBufferPos++] = ch;

          // If this it the command id byte
          if (this.rxBufferPos === 3 && ch != commandPacket.commandID) {

            if (callback) callback(new Error("Invalid response. Wrong Command ID"));

            return;
          }

        // If this is the "length" byte
          if (this.rxBufferPos === headerSize) {

            // store expected packet length so we know when this packet is complete
            this.rxDataLen = ch;

            if (this.rxDataLen !== 0) {
              continue;
            }
          }

        // If the packet is completed (data + header size)
        if (this.rxBufferPos === this.rxDataLen + headerSize) {
          // just received last expected bytes
          // reset RX packet buffer position to be ready for new packet
          this.rxBufferPos = 0;

          var payload = new Buffer(this.rxBuffer.splice(this.rxBuffer.length - this.rxDataLen, this.rxDataLen));
          // Remove the header as well
          this.rxBuffer.splice(this.rxBuffer.length -headerSize, headerSize);

          var packet = new ResponsePacket(commandPacket.name, payload);

          // If we successfully created the packet
          if (packet) {

            if (callback) callback(null, packet);

            return;

          }
          else {
            console.warn('Warning, packet creation was obstructed somehow.');
          }
        }
      }
    }
    callback(null, null);
  }  
};

vclib.prototype.getCommandPacket = function(commandString, args, callback) {

  if (!args) {
    args = {};
  }
  else if (typeof args === 'function') {
    callback = args;
    args = {};
  }

  // Grab the appropriate command packet constructor
  var command = vclib.api[commandString];
  // If it exists
  if (command) {
    // Create it with provided args
    var packet = new command.construct(args, command.commandID);
    // Return packet
    if (callback) callback(null, packet);

    return;
  }
  else {
    // Return error
    if (callback) callback(new Error("Invalid Command."));

    return;
  }
};

function CommandPacket(name, id, dataLen) {
  this.name = name;
  this.commandID = id;
  this.dataLen = dataLen;
}

function versionPacket(args, id) {
  CommandPacket.call(this, 'version', id, 0x00);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x00]);
}

function resetPacket(args, id) {
  CommandPacket.call(this, 'reset', id, 0x00);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x00]);
}

function frameControlPacket(args, id) {
  CommandPacket.call(this, 'frameControl', id, 0x01);

  var param = args.command;

  if (param === 'resume') {
    param = 3;
  }
  else if (param === 'stop') {
    param = 0;
  }

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x01, param]);
}

function bufferLengthPacket(args, id) {
  CommandPacket.call(this, 'bufferLength', id, 0x01);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x01, 0x00]);
}

function readFramePacket(args, id) {

  var length = args.length || 0;

  CommandPacket.call(this, 'readFrame', id, length);

  var delay = args.delay || 100;

  var delayBuf = new Buffer(2);
  delayBuf.writeUInt16BE(delay, 0);

  var lenBuf = new Buffer(4);
  lenBuf.writeUInt32BE(length, 0);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x0C, 0x00, 0x0A, 0x00, 0x00, 0x00, 0x00]);
  this.buffer = Buffer.concat([this.buffer, lenBuf, delayBuf]);
}

function readFrameSPIPacket(args, id) {

  var length = args.length || 0;

  CommandPacket.call(this, 'readFrameSPI', id, length);

  var delay = args.delay || 100;

  var delayBuf = new Buffer(2);
  delayBuf.writeUInt16BE(delay, 0);

  var lenBuf = new Buffer(4);
  lenBuf.writeUInt32BE(length, 0);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, 0x0C, 0x00, 0x0F, 0x00, 0x00, 0x00, 0x00]);
  this.buffer = Buffer.concat([this.buffer, lenBuf, new Buffer([0xFF, 0xFF])]);
}
function baudratePacket(args, id) {
  CommandPacket.call(this, 'baudrate', id, 0x06);

  var baud = baudrates[args.baudrate] || baudrates[9600];

  var baudBuf = new Buffer(2);
  baudBuf.writeUInt16BE(baud, 0);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, this.dataLen, 0x04, 0x02, 0x00, 0x08]);
  this.buffer = Buffer.concat([this.buffer, baudBuf]);
}

function resolutionPacket(args, id) {
  CommandPacket.call(this, 'resolution', id, 0x05);

  var size = args.size || 'vga';
  size = size.toLowerCase();

  // TODO: use switch/case once tessel/beta#181 is fixed
  if (size === 'qvga') {
    size = 0x11;
  }
  else if (size === 'qqvga') {
    size = 0x22;
  }
  else {
    size = 0x00;
  }

  this.buffer = new Buffer([0x56, 0x00, this.commandID, this.dataLen, 0x04, 0x01, 0x00, 0x19, size]);
}

function getResolutionPacket(args, id) {
  CommandPacket.call(this, 'getResolution', id, 0x04);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, this.dataLen, 0x04, 0x01, 0x00, 0x19]);
}

function compressionPacket(args, id) {
  CommandPacket.call(this, 'compression', id, 0x05);

  if (args.ratio === undefined || args.ratio === null) {
    args.ratio = 0x35;
  }

  if (args.ratio > 255) {
    args.ratio = 255;
  }

  this.buffer = new Buffer([0x56, 0x00, this.commandID, this.dataLen, 0x04, 0x01, 0x00, 0x1a, args.ratio]);
}

function getCompressionPacket(args, id) {
  CommandPacket.call(this, 'getCompression', id, 0x04);

  this.buffer = new Buffer([0x56, 0x00, this.commandID, this.dataLen, 0x01, 0x01, 0x12, 0x04]);
}

vclib.api = {
  'version': {resolve: versionResolve, construct:versionPacket, commandID:0x11},
  'reset' : {resolve: systemResetResolve, construct:resetPacket, commandID:0x26},
  'frameControl' : {resolve: bufControlResolve, construct:frameControlPacket, commandID:0x36},
  'bufferLength' : {resolve: bufLengthResolve, construct:bufferLengthPacket, commandID:0x34},
  'readFrame' : {resolve: readBufResolve, construct:readFramePacket, commandID:0x32},
  'readFrameSPI' : {resolve: readBufSPIResolve, construct:readFrameSPIPacket, commandID:0x32},
  'baudrate' : {resolve: setBaudrateResolve, construct:baudratePacket, commandID:0x31},
  'resolution' : {resolve: setResolutionResolve, construct:resolutionPacket, commandID:0x31},
  'getResolution': {resolve: getResolutionResolve, construct:getResolutionPacket, commandID:0x30},
  'compression' : {resolve: setCompressionResolve, construct:compressionPacket, commandID:0x31},
  'getCompression' : {resolve: getCompressionResolve, construct:getCompressionPacket, commandID:0x30},
};

vclib.resolutions = {
  'vga' : [640,320],
  'qvga' : [320,240],
  'qqvga' : [160,120]
};

var baudrates = {
  9600 : 0xAEC8,
  19200 : 0x56E4,
  38400 : 0x2AF2,
  57600 : 0x1C4C,
  115200 : 0x0DA6
};

function versionResolve(payload) {
  return payload.toString();
}

function systemResetResolve(payload) {
  return "Restarting in 10ms...";
}

function bufControlResolve(payload) {
  return "Control Command Received.";
}

function bufLengthResolve(payload) {
  return payload.readUInt32BE(0);
}

function readBufResolve(payload) {
  return payload;
}

function readBufSPIResolve(payload) {
  return "Begin Reading Over SPI";
}

function setBaudrateResolve(payload) {
  return "Baudrate Set.";
}

function setResolutionResolve(payload) {
  return "Resolution Set.";
}

function getResolutionResolve(payload) {
  return payload.readUInt8(0);
}

function setCompressionResolve(payload) {
  return "Compression Set.";
}

function getCompressionResolve(payload) {
  return payload.readUInt8(0);
}

function ResponsePacket(name, payload) {
  this.name = name;
  this.payload = payload;
  this.commandID = vclib.api[name].commandID;
  this.response = vclib.api[name].resolve(payload);
}


module.exports = vclib;