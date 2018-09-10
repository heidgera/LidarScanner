'use strict';

var remote = require('electron').remote;

var process = remote.process;

remote.getCurrentWindow().closeDevTools();

var obtains = [
  './src/Hardware.js',
  'µ/utilities.js',
  'fs',
];

obtain(obtains, ({ Hardware }, { map }, fs)=> {

  exports.app = {};

  var sensor = new Hardware({
    manufacturer: 'ftdi',
  });

  var sent = false;

  var data = [];

  var fadeInt;
  var dir = 1;
  var val = 0;

  var bin = [];
  var segments = 128;

  var calib = {
    minAngle: 0,
    maxAngle: 2000,
    minDist: 0,
    maxDist: 2000,
  };

  var keys = {
    z: 'minAngle',
    x: 'maxAngle',
    q: 'minDist',
    w: 'maxDist',
  };

  var confDir = '.currentConfig.json';
  if (fs.existsSync(confDir)) {
    let data = fs.readFileSync(confDir); //file exists, get the contents
    calib = JSON.parse(data);
  }

  exports.app.start = ()=> {

    for (var i = 0; i < segments; i++) {
      var next = µ('+div', µ('#bins'));
      next.className = 'bin';
      next.style.transform = `rotate(${1.05 * (180 * i / segments)}deg)`;
      bin.push(next);

    }

    console.log('started');

    sensor.on('lidarRead', (data)=> {
      if (calib.minAngle == -1) calib.minAngle = data.angle;
      else if (calib.maxAngle == -1) calib.maxAngle = data.angle;
      else if (calib.minDist == -1) calib.minDist = data.distance;
      else if (calib.maxDist == -1) calib.maxDist = data.distance;

      console.log(data);

      var angle = Math.floor(map(data.angle, calib.minAngle, calib.maxAngle, 0, segments - 1));

      console.log(angle);

      var dist = data.distance / calib.maxDist;
      if (bin[angle]) bin[angle].style.width = (dist * 100) + 'vh';
    });

    document.onkeypress = (e)=> {
      if (keys.hasOwnProperty(e.key)) {
        calib[keys[e.key]] = -1;
        console.log('Calibrating ' + keys[e.key]);
        sensor.read();
      } else if (e.key == 's') {
        fs.writeFileSync(confDir, JSON.stringify(calib));
      }
    };

    document.onkeyup = (e)=> {
      if (e.which == 27) {
        var electron = require('electron');
        process.kill(process.pid, 'SIGINT');
      } else if (e.which == 73 && e.getModifierState('Control') &&  e.getModifierState('Shift')) {
        remote.getCurrentWindow().toggleDevTools();
      }
    };

    process.on('SIGINT', ()=> {
      process.nextTick(function () { process.exit(0); });
    });
  };

  provide(exports);
});
