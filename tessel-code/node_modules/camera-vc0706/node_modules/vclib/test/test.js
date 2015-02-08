var vc = new require('../vclib');
var should = require('chai').should();

var vclib = new vc();

var versionPacket,
  resetPacket,
  frameControlPacket,
  bufferLengthPacket,
  readLengthPacket,
  readFramePacket,
  baudratePacket,
  resolutionPacket,
  compressionPacket;


describe("Packet Generation", function() {
  it("Should generate a valid version packet", function() {
    vclib.getCommandPacket('version', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      versionPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x11, 0x0]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid reset packet", function() {
    vclib.getCommandPacket('reset', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      resetPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x26, 0x0]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid frame control packet with no options", function() {
    vclib.getCommandPacket('frameControl', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      frameControlPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x36, 0x01, 0x00]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid frame control packet with the resume option", function() {
    vclib.getCommandPacket('frameControl',{'command':'resume'}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x36, 0x01, 0x03]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid buffer length packet", function() {
    vclib.getCommandPacket('bufferLength', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      bufferLengthPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x34, 0x01, 0x00]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid read frame packet with no options set", function() {
    vclib.getCommandPacket('readFrame', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid read frame packet with delay option set", function() {
    vclib.getCommandPacket('readFrame', {delay:1250}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0xe2]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid read frame packet with length option set", function() {
    vclib.getCommandPacket('readFrame', {length:10}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      readFramePacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x64]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid read frame packet with both options set", function() {
    vclib.getCommandPacket('readFrame', {length:0x21214523, delay:0x2000}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x21, 0x21, 0x45, 0x23, 0x20, 0x00]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid baudrate packet with no options", function() {
    vclib.getCommandPacket('baudrate', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      baudratePacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, 0xae, 0xc8]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate a valid baudrate packet with baudrate option set", function() {
    vclib.getCommandPacket('baudrate', {baudrate:38400}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, 0x2a, 0xf2]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an invalid baudrate packet with baudrate invalid option set", function() {
    vclib.getCommandPacket('baudrate', {baudrate:20000}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, 0xae, 0xc8]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid resolution packet with no option set", function() {
    vclib.getCommandPacket('resolution', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      resolutionPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, 0x00]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid resolution packet with qvga option set", function() {
    vclib.getCommandPacket('resolution', {size:'qvga'}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, 0x11]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid resolution packet with qqvga option set", function() {
    vclib.getCommandPacket('resolution', {size:'qqvga'}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, 0x22]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an vga resolution for an invalid size", function() {
    vclib.getCommandPacket('resolution', {size:'invalid'}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, 0x00]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid packet for compression", function() {
    vclib.getCommandPacket('compression', function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      compressionPacket = packet;
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x1a, 0x35]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid packet for compression with ratio option", function() {
    vclib.getCommandPacket('compression', {ratio:0x55}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x1a, 0x55]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });

  it("Should generate an valid packet for compression with oversized ratio", function() {
    vclib.getCommandPacket('compression', {ratio:0x285}, function(err, packet) {
      should.not.exist(err);
      should.exist(packet);
      (function () {
        bufferMatcher(new Buffer([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x1a, 0xff]), packet.buffer);
      }).should.not.throw(Error);
    }); 
  });
});

describe("Packet Parsing", function() {
  it("Should Correctly Parse the version packet", function() {
    vclib.parseIncoming(versionPacket, new Buffer([0x76, 0x00, 0x11, 0x00, 0x0b, 0x56, 0x43, 0x30, 0x37, 0x30, 0x36, 0x20, 0x31, 0x2e, 0x30, 0x30]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('version');
        result.response.should.equal('VC0706 1.00');
      }
    )
  });

  it("Should Correctly Parse the reset packet", function() {
    vclib.parseIncoming(resetPacket, new Buffer([0x76, 0x00, 0x26, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('reset');
      }
    )
  });

  it("Should Correctly Parse the frame control packet", function() {
    vclib.parseIncoming(frameControlPacket, new Buffer([0x76, 0x00, 0x36, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('frameControl');
      }
    )
  });

  it("Should Correctly Parse the buffer length packet", function() {
    vclib.parseIncoming(bufferLengthPacket, new Buffer([0x76, 0x00, 0x34, 0x00, 0x04, 0x00, 0x01, 0x2c, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('bufferLength');
        result.response.should.equal(76800);
      }
    )
  });

  it("Should Correctly Parse the read frame packet", function() {
    vclib.parseIncoming(readFramePacket, new Buffer([0x76, 0x00, 0x32, 0x00, 0x00, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0x76, 0x00, 0x32, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('readFrame');
        (function () {
          bufferMatcher(new Buffer([0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa]), result.response);
        }).should.not.throw(Error);
      }
    )
  });

  it("Should Correctly Parse the baudrate packet", function() {
    vclib.parseIncoming(baudratePacket, new Buffer([0x76, 0x00, 0x31, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('baudrate');
      }
    )
  });

  it("Should Correctly Parse the resolution packet", function() {
    vclib.parseIncoming(resolutionPacket, new Buffer([0x76, 0x00, 0x31, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('resolution');
      }
    )
  });

  it("Should Correctly Parse the compression packet", function() {
    vclib.parseIncoming(compressionPacket, new Buffer([0x76, 0x00, 0x31, 0x00, 0x00]),
      function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.name.should.equal('compression');
      }
    )
  });
});


// // image resolution
// vclib.getCommandPacket('resolution', {size:'qvga'}, function(err, packet) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log("Got this ", packet);
//     vclib.parseIncoming(packet, new Buffer([0x76, 0x00, 0x31, 0x00, 0x00]),
//       function(err, response) {
//         if (err) {
//           return console.log(err);
//         }
//         else {
//           console.log("Yeah, we got our parsed packet",  response);
//         }
//       });
//   }
// });

function bufferMatcher(expected, actual) {
  if (actual.length != expected.length) {
    throw new Error("Actual length doesn't match expected.");
  }
  else {
    for (var i = 0; i < expected.length; i++) {
      if (expected[i] != actual[i]) {
        throw new Error("Actual value doesn't match expected");
      }
    }
  }
}



