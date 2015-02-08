#include <avr/eeprom.h>
#include <avr/pgmspace.h> // Used for getting the CRC

// For CRC calculation
#define POLY 0x8408
#define MODULE_ID_ADDRESS 0
#define FIRMWARE_VERSION_ADDRESS 1

// Calculates the checksum of the flash
unsigned short calculate_checksum( unsigned short length);

// Reads the module ID from EEPROM
uint8_t read_module_id(void);

// Reads th firmware version from EEPROM
uint8_t read_firmware_version(void);

