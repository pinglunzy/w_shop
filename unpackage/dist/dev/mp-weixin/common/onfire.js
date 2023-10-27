"use strict";
var OnFire = (
  /** @class */
  function() {
    function OnFire2() {
      this.es = {};
      this.emit = this.fire;
    }
    OnFire2.prototype.on = function(eventName, cb, once) {
      if (once === void 0) {
        once = false;
      }
      if (!this.es[eventName]) {
        this.es[eventName] = [];
      }
      this.es[eventName].push({
        cb,
        once
      });
    };
    OnFire2.prototype.once = function(eventName, cb) {
      this.on(eventName, cb, true);
    };
    OnFire2.prototype.fire = function(eventName) {
      var params = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
      }
      var listeners = this.es[eventName] || [];
      for (var i = 0; i < listeners.length; i++) {
        var _a = listeners[i], cb = _a.cb, once = _a.once;
        cb.apply(this, params);
        if (once) {
          listeners.splice(i, 1);
          i--;
        }
      }
    };
    OnFire2.prototype.off = function(eventName, cb) {
      if (eventName === void 0) {
        this.es = {};
      } else {
        if (cb === void 0) {
          delete this.es[eventName];
        } else {
          var listeners = this.es[eventName] || [];
          for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].cb === cb) {
              listeners.splice(i, 1);
              i--;
            }
          }
        }
      }
    };
    OnFire2.ver = "2.0.0";
    return OnFire2;
  }()
);
exports.OnFire = OnFire;
