obtain(['µ/serialParser.js', 'events'], ({ serialParser }, EventEmitter)=> {
  const POT_CHANGE = 1;
  const LIDAR_READ = 2;
  const REQUEST_READ = 3;
  const READY = 127;

  ////////// Light strip defines:
  const BEGIN =  1;
  const SHOW =  2;
  const SET_COLOR =  3;

  class Hardware extends EventEmitter{
    constructor(conf) {
      super();
      var _this = this;
      var parser = new serialParser();

      parser.on(LIDAR_READ, (data)=> {
        _this.emit('lidarRead', {
          angle: data[0],
          distance: data[1],
        });
      });

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
