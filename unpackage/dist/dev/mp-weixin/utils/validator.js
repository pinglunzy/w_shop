"use strict";
const common_vendor = require("../common/vendor.js");
const common_utils = require("../common/utils.js");
function validator(app) {
  app.config.globalProperties.getAppId = function() {
    return this.app_id || 10001;
  };
  app.config.globalProperties.compareVersion = function(v1, v2) {
    v1 = v1.split(".");
    v2 = v2.split(".");
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push("0");
    }
    while (v2.length < len) {
      v2.push("0");
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  };
  app.config.globalProperties.getVisitcode = function() {
    let visitcode = common_vendor.index.getStorageSync("visitcode");
    if (!visitcode) {
      visitcode = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
      visitcode = visitcode.replace(/-/g, "");
      common_vendor.index.setStorageSync("visitcode", visitcode);
    }
    return visitcode;
  };
  app.config.globalProperties.subMessage = function(temlIds, callback) {
    let self = this;
    const version = common_vendor.wx$1.getSystemInfoSync().SDKVersion;
    if (temlIds && temlIds.length != 0 && self.compareVersion(version, "2.8.2") >= 0) {
      common_vendor.index.hideLoading();
      common_vendor.wx$1.requestSubscribeMessage({
        tmplIds: temlIds,
        success(res) {
        },
        fail(res) {
        },
        complete(res) {
          callback();
        }
      });
    } else {
      callback();
    }
  };
  app.config.globalProperties.showError = function(msg, callback) {
    common_vendor.index.showModal({
      title: "友情提示",
      content: msg,
      showCancel: false,
      success: function(res) {
        callback && callback();
      }
    });
  };
  app.config.globalProperties.showSuccess = function(msg, callback) {
    common_vendor.index.showModal({
      title: "友情提示",
      content: msg,
      showCancel: false,
      success: function(res) {
        callback && callback();
      }
    });
  };
  app.config.globalProperties.getShareUrlParams = function(params) {
    let self = this;
    return common_utils.utils.urlEncode(Object.assign({
      referee_id: self.getUserId(),
      app_id: self.getAppId()
    }, params));
  };
  app.config.globalProperties.getUserId = function() {
    return common_vendor.index.getStorageSync("user_id");
  };
  app.config.globalProperties.ios = function() {
    const u = navigator.userAgent.toLowerCase();
    if (u.indexOf("like mac os x") < 0 || u.match(/MicroMessenger/i) != "micromessenger") {
      return false;
    }
    return true;
  };
  app.config.globalProperties.isWeixin = function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  };
  app.config.globalProperties.getPlatform = function(params) {
    let platform = "wx";
    return platform;
  };
  app.config.globalProperties.topBarTop = function() {
    return common_vendor.index.getMenuButtonBoundingClientRect().top;
  };
  app.config.globalProperties.topBarHeight = function() {
    return common_vendor.index.getMenuButtonBoundingClientRect().height;
  };
  app.config.globalProperties.subPrice = function(str, val) {
    let strs = String(str);
    if (val == 1) {
      return strs.substring(0, strs.indexOf("."));
    } else if (val == 2) {
      let indof = strs.indexOf(".");
      return strs.slice(indof + 1, indof + 3);
    }
  };
  app.config.globalProperties.convertTwo = function(n) {
    let str = "";
    if (n < 10) {
      str = "0" + n;
    } else {
      str = n;
    }
    return str;
  };
  app.config.globalProperties.yulan = function(e, i) {
    let image_path_arr = [];
    if (!Array.isArray(e)) {
      image_path_arr = [e];
    } else {
      if (e[0].file_path) {
        e.forEach((item, index) => {
          image_path_arr.push(item.file_path);
        });
      } else {
        image_path_arr = e;
      }
    }
    let picnum = i * 1;
    common_vendor.index.previewImage({
      urls: image_path_arr,
      current: picnum
    });
  };
  app.config.globalProperties.subpoint = function(str, val) {
    let strs = String(str);
    if (val == 1) {
      return strs.substring(0, strs.indexOf("."));
    } else if (val == 2) {
      let indof = strs.indexOf(".");
      return strs.slice(indof + 1, indof + 3);
    }
  };
}
exports.validator = validator;
