const fs = require('fs');
// const UdpParser = require('./udp-parser');
// const parser = new UdpParser('./SMS_UDP_Definitions.hpp');
const samples = fs.readdirSync('./sample');
const dgram = require('dgram');

const client = dgram.createSocket('udp4');

let samplesIndex = 0;
let samplesLoop = setInterval(() => {
  // parser.pushBuffer(fs.readFileSync('sample/' + samples[samplesIndex]));
  pushBuffer(fs.readFileSync('sample/' + samples[samplesIndex]))
  samplesIndex++;
  if (samplesIndex == samples.length) {
    clearInterval(samplesLoop);
  }
}, 50)

function pushBuffer(buffer) {
  const PORT = 5606;
  const HOST = '0.0.0.0';

  client.send(buffer, 0, buffer.length, PORT, HOST, function (err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST + ':' + PORT);
  });
}
