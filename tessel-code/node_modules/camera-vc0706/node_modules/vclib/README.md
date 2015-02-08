# VCLIB
##What is it?
VCLib is a library to parse buffers of packets from the vc0706 camera. It can also construct the packets to send for all documented commands.

##Installation
```.js 
npm install vclib
```
##Examples

### Generating Packets
```.js
var vc = require('vclib');

var vclib = new vc();

vclib.getCommandPacket('frameControl', {controlParam:'stop'}, function(err, packet) {
  console.log("Send this to stop image capture", packet.buffer);
}
```

Each command packet has an optional arguments object that can be passed in with *getCommandPacket*:

```.js
/*
  Get Firmware Version Request Packet
    No Optional Params
*/
getCommandPacket('version', function(err, packet) {...} ); 

/*
  Get Reset Command Packet
    No Optional Params
*/
getCommandPacket('reset') 

/*
  Stop or resume frame capture
  controlString can be 'stop' or 'resume'. Default is stop.
*/
getCommandPacket('frameControl', {'command': controlstring},  function(err, packet) {...} );

/*
  Get the length of captured buffer
    No Optional Params
*/
getCommandPacket('bufferLength',  function(err, packet) {...} );

/*
  Start reading over bytes captured
  delayAmount is a 16-bit number in units of 0.01ms to delay before sending bytes. Default is 100.
    readLength is a 32-bit number of number of bytes to read. Default is 0.
    
*/
getCommandPacket('readFrame', {'delay': delayAmount, 'length':readLength}, function(err, packet) {...} );

/*
  Set the baud rate for comms
  rate can be 9600, 19200, 38400, 57600, or 115200. Default is 9600.
    
*/
getCommandPacket('baudrate', {'baudrate':rate}, function(err, packet) {...} );

/*
  Set the size of captured images
  reSize can be 'vga' (640x320), 'qvga'(320x240) or 'qqvga' (160x120). Default is 'vga'
    
*/
getCommandPacket('resolution', {'size':resSize}, function(err, packet) {...} );

/*
  Set the amount of compression
  ratio can be 0-255. The higher the value, the more compressed the image. Default is 0x35.
    
*/
getCommandPacket('compression', {'ratio':ratio}, function(err, packet) {...} );

```
### Parsing Packets
The library can also parse packets. Due to a really poorly made api (several commands have the same command ID...), a command packet must be passed into the parser so it knows what it's looking for. The function can be passed data over several calls (you don't need to have it all at once) and will call the provided callback with the results.

```.js
vclib.getCommandPacket('version', function(err, packet) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Got this ", packet);
    vclib.parseIncoming(packet, new Buffer([0x76, 0x00, 0x11, 0x00, 0x0b, 0x56, 0x43, 0x30, 0x37, 0x30, 0x36, 0x20, 0x31, 0x2e, 0x30, 0x30]),
      function(err, response) {
        if (err) {
          return console.log(err);
        }
        else {
          // prints out 'VC0706 1.00'
          console.log("Our nicely parsed packet",  response.response);
        }
      });
  }
});
```

