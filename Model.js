"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = require("mobx");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var globalOid = 0;

var Model = function () {
  _createClass(Model, [{
    key: "setLoaded",
    value: function setLoaded() {
      this._loaded.set(true);
    }
  }, {
    key: "setLoading",
    value: function setLoading() {
      this._loaded.set(false);
    }
  }, {
    key: "loaded",
    get: function get() {
      return this._loaded.get();
    }
  }, {
    key: "loading",
    get: function get() {
      return !this.loaded;
    }
  }], [{
    key: "process",
    value: function process(data) {
      return data;
    }
  }]);

  function Model(data) {
    var _this = this;

    _classCallCheck(this, Model);

    this._oid = null;
    this._loaded = (0, _mobx.observable)(false);

    data = data || {};
    data = this.constructor.process(data);

    this._oid = globalOid += 1;

    // Loop through the data and replace each instance of a nested object, recognized through the nested
    // stores object with the instances of that nested object. Handles arrays as well as singletons.
    Object.keys(data).forEach(function (key) {
      if (_this.constructor.nestedStores[key]) {
        (function () {
          var store = _this.constructor.nestedStores[key];

          if (isArray(data[key])) {
            data[key] = data[key].map(function (val) {
              return store.findOrInitialize(val);
            });
          } else {
            data[key] = store.findOrInitialize(data[key]);
          }
        })();
      }
    });

    // Ensure that the ID property exists.
    if (!data.id) {
      data.id = null;
    }

    // Initialize the fields to a null value. Essentially is an easier way of defining observables,
    // especially if you don't have access to decorators.
    this.constructor.fields.forEach(function (field) {
      if (!data[field]) {
        data[field] = null;
      }
    });

    this.assign = (0, _mobx.action)(this.constructor.name + "." + this._oid + "#assign", this.assign);

    this.onAssign(data);

    (0, _mobx.extendObservable)(this, data);
  }

  _createClass(Model, [{
    key: "assign",
    value: function assign(data) {
      var _this2 = this;

      data = data || {};
      data = this.constructor.process(data);

      this.onAssign(data);

      // Loop through all of the items to assign. If there is are nested objects, meaning that the object
      // has 'assign' defined, then we call this. Otherwise we just set the value.
      // todo: should use Object#assign for Objects?
      Object.keys(data).forEach(function (param) {

        if (_this2[param] && _this2[param].assign) {
          _this2[param].assign(data[param]);
          return;
        }

        _this2[param] = data[param];
      });
    }
  }, {
    key: "onAssign",
    value: function onAssign() {}
  }, {
    key: "insert",
    value: function insert() {
      throw new Error("Insert must be implemented");
    }
  }, {
    key: "update",
    value: function update() {
      throw new Error("Update must be implemented");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      throw new Error("Delete must be implemented");
    }
  }, {
    key: "retrieve",
    value: function retrieve() {
      throw new Error("Retrieve must be implemented");
    }
  }, {
    key: "load",
    value: function load() {
      var _this3 = this;

      return this.retrieve().then(function (data) {
        _this3.assign(data);
        _this3.setLoaded();
      });
    }
  }, {
    key: "save",
    value: function save() {
      if (this.id) {
        return this.update();
      } else {
        return this.insert();
      }
    }
  }, {
    key: "toJS",
    value: function toJS() {
      return (0, _mobx.toJS)(this);
    }
  }, {
    key: "data",
    get: function get() {
      return this.toJS();
    }
  }]);

  return Model;
}();

Model.nestedStores = {};
Model.fields = [];
exports.default = Model;


function isArray(item) {
  return Object.prototype.toString.call(item) === '[object Array]';
}