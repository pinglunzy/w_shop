"use strict";
const common_vendor = require("./vendor.js");
const tabBarLinks = [
  "/pages/index/index",
  "/pages/order/myorder",
  "/pages/user/index/index"
];
const gotopage = (url, type) => {
  if (!url || url.length == 0) {
    return false;
  }
  if (url.substr(0, 1) !== "/") {
    url = "/" + url;
  }
  let p = url;
  if (url.indexOf("?") != -1) {
    p = url.substr(0, url.indexOf("?"));
  }
  if (tabBarLinks.indexOf(p) > -1) {
    common_vendor.index.reLaunch({
      url
    });
  } else {
    if (type == "redirect") {
      common_vendor.index.redirectTo({
        url
      });
      return;
    }
    if (type == "reLaunch") {
      common_vendor.index.reLaunch({
        url
      });
      return;
    }
    common_vendor.index.navigateTo({
      url
    });
  }
};
exports.gotopage = gotopage;
