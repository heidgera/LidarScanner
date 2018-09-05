'use strict';

var remote = require('electron').remote;

var process = remote.process;

//remote.getCurrentWindow().closeDevTools();

var obtains = [
  './src/Hardware.js',
];

obtain(obtains, ({ Hardware })=> {

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

  exports.app.start = ()=> {

    for (var i = 0; i < 128; i++) {
      var next = µ('+div', µ('#bins'));
      next.className = 'bin';
      next.style.transform = `rotate(${180 * i / 127}deg)`;
      bin.push(next);

    }

    console.log('started');

    sensor.on('lidarRead', (data)=> {
      console.log(data);
      bin[data.angle].style.width = ((data.distance / 127) * 75) + 'vw';
    });

    document.onkeypress = (e)=> {
      //if (e.key == ' ') console.log('Space pressed'), hardware.digitalWrite(13, 1);
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
