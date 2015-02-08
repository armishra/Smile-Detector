var test = require('tinytap');
var tessel = require('tessel');
var async = require('async');
var AttinyLib = require('../lib');

var irTiny;
var ambientTiny;
var irPort = process.argv[2] || 'A';
var ambientPort = process.argv[3] || 'B';
var irTiny = new AttinyLib(tessel.port[irPort]);
var ambientTiny = new AttinyLib(tessel.port[ambientPort]);

test.count(5);

async.series([
  test('creating a new attiny', function(t) {
    t.ok(irTiny, 'could not create the IR tiny object');
    t.ok(ambientTiny, 'could not create the Ambient tiny object');
    t.ok(irTiny.hardware, 'did not initialize hardware properties correctly');
    t.end();
  }),

  test('initializing the ir tiny', function(t) {

    var firmwareOptions = {
      firmwareFile : './test/infrared-attx4.hex',
      firmwareVersion : 0x03,
      moduleID : 0x08,
      signature : 0x930C,
      crc : 13777,
    } 

    irTiny.initialize(firmwareOptions, function(err) {
      console.log('err', err);
      t.equal(err, undefined, 'error thrown on valid initialization');
      t.end();
    });
  }),

  test('initializing the tiny with no module plugged in', function(t) {

    var noTiny = new AttinyLib(tessel.port['D']);
    var firmwareOptions = {
      firmwareFile : './test/infrared-attx4.hex',
      firmwareVersion : 0x03,
      moduleID : 0x08,
      signature : 0x930C,
      crc : 13777,
    } 

    noTiny.initialize(firmwareOptions, function(err) {
      t.ok(err, 'error not thrown on invalid initialization');
      t.end();
    });
  }),

  ],
  function(err) {
    console.log('err running tests', err);
  }
);
