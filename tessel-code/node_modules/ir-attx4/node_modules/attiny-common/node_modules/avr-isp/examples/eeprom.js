var tessel = require('tessel');
var Queue = require('sync-queue');


var avrLib = require('../');

var isp = avrLib.use(tessel.port['A'], {
  pageSize : 64,
  });


function run() {
  console.log('Writing EEPROM...');
  isp.writeEEPROMByte(0x27, 0x00, function(err, response) {
    console.log('write response', response);
    console.log('Reading EEPROM...');
    isp.readEEPROMByte(0, function(err, response) {
      console.log('we got this response', err, response);
    })
  })
}

run();

