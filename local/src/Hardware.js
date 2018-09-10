obtain(['µ/serialParser.js', 'events'], ({ serialParser }, EventEmitter)=> {
  const POT_CHANGE = 1;
  const LIDAR_READ = 2;
  //const GET_DISTANCE = 4;
  const READY = 127;

  class Hardware extends EventEmitter{
    constructor(conf) {
      super();
      var _this = this;
      var parser = new serialParser();

      parser.on(LIDAR_READ, (data)=> {
        _this.emit('lidarRead', {
          angle: data[0] + (data[1] << 7),
          distance: data[2] + (data[3] << 7),
        });
      });

      _this.read = ()=> {
        parser.sendPacket([1, LIDAR_READ]);
      };

      var readyInt;

      parser.onOpen = ()=> {
        parser.sendPacket([1, READY]);
      };

      parser.on(READY, ()=> {
        if (!_this.ready) {
          console.log('Arduino ready');
          clearInterval(readyInt);
          _this.ready = true;
          _this.emit('ready');
        }
      });

      _this.whenReady = (cb)=> {
        if (_this.ready) {
          cb();
        } else {
          this.on('ready', cb);
        }
      };

      if (conf.name) parser.setup({ name: conf.name, baud: 115200 });
      else if (conf.manufacturer) parser.setup({ manufacturer: conf.manufacturer, baud: 115200 });

    }

    set onready(cb) {
      //this.on_load = val;
      if (this.ready) {
        cb();
      } else {
        this.on('ready', cb);
      }
    }

  };

  exports.Hardware = Hardware;
});
