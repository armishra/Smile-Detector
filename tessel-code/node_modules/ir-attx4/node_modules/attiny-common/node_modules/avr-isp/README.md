# Tessel AVR ISP

Use this library to reflash the firmware on any Tessel module which uses an ATTiny44 microcontroller. Currently this includes the Ambient and IR modules.

## Usage
### Configuring Custom Firmware
If you have your own firmware you wish to flash to a module, first make sure it is compiled to [Intel HEX format](http://en.wikipedia.org/wiki/Intel_HEX). Next, place the `.hex` file in your project directory to ensure it gets uploaded to the Tessel with the script.

Finally, set the configuration parameters in the `.use` method as in the example script.

```js
var avrLib = require('../');

var isp = avrLib.use(tessel.port['A'], {
  pageSize : 64, // Microcontroller memory page size in bytes. 64 bytes for the ATTiny44
  fileName : 'my-firmware.hex' // File path to your custom firmware
});

```

### ISP Object
The following methods are implemented to assist in flashing new firmware:

&#x20;<a href="#api-isp-startProgramming-callback-error-Enters-the-AVR-device-into-a-programmable-state" name="api-isp-startProgramming-callback-error-Enters-the-AVR-device-into-a-programmable-state">#</a> isp<b>.startProgramming</b>( callback(error) )  
 Enters the AVR device into a programmable state.  

&#x20;<a href="#api-isp-endProgramming-callback-Takes-the-device-out-of-programming-mode" name="api-isp-endProgramming-callback-Takes-the-device-out-of-programming-mode">#</a> isp<b>.endProgramming</b>( callback() )  
 Takes the device out of programming mode.  

&#x20;<a href="#api-isp-eraseChip-callback-Tells-the-device-bootloader-to-overwrite-all-program-memory-bytes-with-0xff" name="api-isp-eraseChip-callback-Tells-the-device-bootloader-to-overwrite-all-program-memory-bytes-with-0xff">#</a> isp<b>.eraseChip</b>( callback() )  
 Tells the device bootloader to overwrite all program memory bytes with 0xff  

&#x20;<a href="#api-isp-readSignature-callback-error-signature-Asks-device-for-its-device-signature" name="api-isp-readSignature-callback-error-signature-Asks-device-for-its-device-signature">#</a> isp<b>.readSignature</b>( callback(error, signature) )  
 Asks device for its device signature.  

&#x20;<a href="#api-isp-programFuses-callback-error-Program-and-verify-the-device-s-fuse-bits-Currently-only-programs-and-verifies-the-low-bits-Currently-only-allows-the-hardcoded-fuse-bits-for-the-ATTiny-series-of-microcontrollers" name="api-isp-programFuses-callback-error-Program-and-verify-the-device-s-fuse-bits-Currently-only-programs-and-verifies-the-low-bits-Currently-only-allows-the-hardcoded-fuse-bits-for-the-ATTiny-series-of-microcontrollers">#</a> isp<b>.programFuses</b>( callback(error) )  
 Program and verify the device's fuse bits. Currently only programs and verifies the 'low' bits. Currently only allows the hardcoded fuse bits for the ATTiny series of microcontrollers.  

&#x20;<a href="#api-isp-verifyFuses-fuses-fuseMask-callback-error-Verify-the-device-s-fuse-bits-No-need-to-call-this-if-programFuses-has-already-been-called" name="api-isp-verifyFuses-fuses-fuseMask-callback-error-Verify-the-device-s-fuse-bits-No-need-to-call-this-if-programFuses-has-already-been-called">#</a> isp<b>.verifyFuses</b>( fuses, fuseMask, callback(error) ) <i>Verify</i>&nbsp; the device's fuse bits\. No need to call this if programFuses()  
 has already been called.  

&#x20;<a href="#api-isp-readPagesFromHexFile-callback-error-pages-Will-read-and-parse-the-configured-firmware-hex-file-into-memory-pages-of-the-configured-length-Returns-array-of-page-buffers-through-callback" name="api-isp-readPagesFromHexFile-callback-error-pages-Will-read-and-parse-the-configured-firmware-hex-file-into-memory-pages-of-the-configured-length-Returns-array-of-page-buffers-through-callback">#</a> isp<b>.readPagesFromHexFile</b>( callback(error, pages) )  
 Will read and parse the configured firmware .hex file into memory pages of the configured length. Returns array of page buffers through callback.  

&#x20;<a href="#api-isp-flashImage-pages-callback-Flashes-the-provided-array-of-page-buffers-onto-the-connected-AVR-device" name="api-isp-flashImage-pages-callback-Flashes-the-provided-array-of-page-buffers-onto-the-connected-AVR-device">#</a> isp<b>.flashImage</b>( pages, callback() )  
 Flashes the provided array of page buffers onto the connected AVR device.  

&#x20;<a href="#api-isp-verifyImage-pages-callback-error-incorrect-_Not-yet-fully-supported_-Read-back-device-s-program-memory-and-verify-that-it-matches-the-provided-array-of-page-buffers-Currently-a-very-slow-process-Returns-number-of-non-matching-bytes-through-callback" name="api-isp-verifyImage-pages-callback-error-incorrect-_Not-yet-fully-supported_-Read-back-device-s-program-memory-and-verify-that-it-matches-the-provided-array-of-page-buffers-Currently-a-very-slow-process-Returns-number-of-non-matching-bytes-through-callback">#</a> isp<b>.verifyImage</b>( pages, callback(error, incorrect) )  
 _Not yet fully supported_ - Read back device's program memory and verify that it matches the provided array of page buffers. Currently a very slow process. Returns number of non-matching bytes through callback.  

## Example
Use the file `flashAmbient.js` in the examples folder of this repo to reflash the firmware on the ambient module.


### License
MIT or Apache 2.0, at your option  
