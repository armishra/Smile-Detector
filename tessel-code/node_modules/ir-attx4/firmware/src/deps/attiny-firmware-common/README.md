Attiny-Firmware-Common
-------------------------

Exposes functions shared by multiple attiny based modules.

## API

```.c

// Calculates the checksum of the flash
unsigned short calculate_checksum( unsigned short length);

// Reads the module ID from EEPROM
uint8_t read_module_id(void);

// Reads th firmware version from EEPROM
uint8_t read_firmware_version(void);
```
