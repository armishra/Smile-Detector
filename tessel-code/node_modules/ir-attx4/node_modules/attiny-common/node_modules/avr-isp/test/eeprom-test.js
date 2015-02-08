var avrLib = require('../');
var test = require('tinytap');
var tessel = require('tessel');
var async = require('async');
var port = 'A' || process.argv[2];
var isp;
console.log('port', port);

test.count(11);

async.series([

  test('can create an ISP object', function(t) {
    isp = avrLib.use(tessel.port['A'], { pageSize : 64});
    t.ok(isp, "can't create an ISP object");
    t.end();
  }),

  test('can read and write a single byte', function(t) {
    var testByte = 0x27;
    var address = 0x0;
    isp.writeEEPROMByte(testByte, address, function(err) {
      t.equal(err, undefined, 'error writing single byte');
      isp.readEEPROMByte(address, function(err, readByte) {
        t.equal(err, undefined, 'error retrieving byte');
        t.equal(testByte, readByte, 'read byte differs from written byte');
        t.end();
      });
    });
  }),

  test('can read multiple bytes', function(t) {
    var testBytes = [0x07, 0x27, 0x19, 0x91];
    var startAddress = 0xA0;
    isp.writeEEPROM(testBytes, startAddress, function(err, response) {
      t.equal(err, undefined, 'error writing multiple bytes');
      isp.readEEPROM(testBytes.length, startAddress, function(err, readBytes) {
        t.equal(err, undefined, 'error retrieving byte');
        t.equal(testBytes.length, readBytes.length, 'invalid return length');
        for (var i = 0; i < testBytes.length; i++) {
          t.equal(testBytes[i], readBytes[i], 'what was written is not what was read back');
        }
        t.end();
      });
    });
  }),

  ],
  function(err) {
    console.log("Error running tests.", err);
  }
);


