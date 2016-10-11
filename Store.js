'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = require('mobx');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = exports.State = {
  toJS: function toJS() {
    return (0, _mobx.toJS)(this);
  }
};

var Store = function () {
  function Store(object) {
    _classCallCheck(this, Store);

    this.objects = (0, _mobx.observable)([]);
    this.callbacks = [];

    // the object is a constructor function used to provide new instances.
    if (object) {
      this.object = object;
    } else {
      this.object = _Model2.default;
    }

    // initialize this in the global State object, this contains all objects
    State[object.name] = this;
  }

  _createClass(Store, [{
    key: 'find',
    value: function find(id) {
      return this.objects.find(function (o) {
        return o.id === id;
      });
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      var obj = this.objects.find(function (o) {
        return o.id === id;
      });
      if (obj) {
        this.objects.remove(obj);
      }
    }
  }, {
    key: 'listen',
    value: function listen(fn) {
      this.callbacks.push(fn);
    }
  }, {
    key: 'findOrInitialize',
    value: function findOrInitialize(params) {
      var obj = void 0;

      if (params.id) {
        obj = this.objects.find(function (o) {
          return !!o.id && o.id === params.id;
        });
      }

      if (obj) {
        console.log('store ' + this.object.name + ' > initialize', obj.id, obj._oid);
        obj.assign(params);
      } else {
        obj = new this.object(params);
        console.log('store ' + this.object.name + ' > new', obj.id, obj._oid);
        this.objects.push(obj);
        this.callbacks.forEach(function (cb) {
          cb(obj);
        });
      }

      return obj;
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      return (0, _mobx.toJS)(this);
    }
  }]);

  return Store;
}();

exports.default = Store;


try {
  if (process.env.NODE_ENV !== 'production') {
    window.State = State;
  }
} catch (e) {}