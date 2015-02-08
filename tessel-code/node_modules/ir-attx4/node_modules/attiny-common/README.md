Attiny-common
-----------------
This library is designed to encapsulate all of the shared behavior of Tessel's `attiny-attx4` and `ir-attx4` libraries. They share much of the same hardware design so most of the non-domain specific logic can be abstracted out. These features include:

* Initilization
* Firmware Updating
* CRC Checking
* SPI Transmissions
* IRQ Handling

## Install
`npm install attiny-common`

## Usage

```.js
var Attiny = require('attiny-common');

// Create a new tiny agent
var attiny = new Attiny(hardware);

// Store our firmware checking and updating options
var firmwareOptions = {
  firmwareFile : FIRMWARE_FILE,
  firmwareVersion : FIRMWARE_VERSION,
  moduleID : MODULE_ID,
  signature : TINY84_SIGNATURE,
  crc : (CRC_HIGH << 8) | CRC_LOW,
}

// Initialize (check firmware version, update as necessary)
attiny.initialize(firmwareOptions, function(err) {
  console.log('done initializing module!');

  attiny.setIRQCallback(irqHit);
});

function irqHit() {
  console.log("IRQ is active");
}
```