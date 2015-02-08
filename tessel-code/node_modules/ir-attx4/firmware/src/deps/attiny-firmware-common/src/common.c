#include "../include/common.h"

unsigned short calculate_checksum( unsigned short length)
{
  unsigned char i;
  unsigned int data;
  unsigned int crc = 0xffff;
  char *data_p = 0x0000;

  if (length == 0)
        return (~crc);
  do
  {
        for (i=0, data= pgm_read_byte(data_p++);
             i < 8;
             i++, data >>= 1)
        {
              if ((crc & 0x0001) ^ (data & 0x0001))
                    crc = (crc >> 1) ^ POLY;
              else  crc >>= 1;
        }
  } while (--length);
  crc = ~crc;
  data = crc;
  crc = (crc << 8) | (data >> 8 & 0xff);

  return (crc);
}

uint8_t read_module_id() {
  return eeprom_read_byte((const uint8_t *)MODULE_ID_ADDRESS);
}

uint8_t read_firmware_version() {
  return eeprom_read_byte((const uint8_t *)FIRMWARE_VERSION_ADDRESS); 
}