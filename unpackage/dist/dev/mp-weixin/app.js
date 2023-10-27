"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_utils = require("./common/utils.js");
const common_onfire = require("./common/onfire.js");
const config = require("./config.js");
const common_gotopage = require("./common/gotopage.js");
const utils_request = require("./utils/request.js");
const utils_validator = require("./utils/validator.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/login/mplogin.js";
  "./pages/login/bindmobile.js";
  "./pages/user/userinfo/userinfo.js";
  "./pages/product/detail/detail.js";
  "./pages/order/confirm-order.js";
  "./pages/user/address/address.js";
  "./pages/user/index/index.js";
  "./pages/order/myorder.js";
  "./pages/order/order-detail.js";
  "./pages/user/my-wallet/my-wallet.js";
  "./pages/user/my-wallet/my-balance.js";
  "./pages/user/address/add/add.js";
  "./pages/product/search/search.js";
  "./pages/user/address/edit/edit.js";
  "./pages/store/address/address.js";
  "./pages/store/clerkorder.js";
  "./pages/order/pay-success/pay-success.js";
  "./pages/login/weblogin.js";
  "./pages/order/pay-h5/pay-h5.js";
  "./pages/user/set/set.js";
  "./pages/login/openlogin.js";
  "./pages/product/list/takeaway.js";
  "./pages/user/address/storeaddress.js";
  "./pages/product/list/store.js";
  "./pages/shop/shop_list.js";
  "./pages/service/service.js";
  "./pages/service/privacy.js";
  "./pages/order/cashier.js";
}
const _sfc_main = {
  onLaunch: function(e) {
    console.log("App Launch");
    this.updateManager();
    common_vendor.wx$1.login();
    this.onStartupScene(e.query);
    this.getTabBarLinks();
  },
  onShow: function() {
  },
  onHide: function() {
  },
  methods: {
    updateManager: function() {
      const updateManager = common_vendor.index.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function(res2) {
            common_vendor.index.showModal({
              title: "更新提示",
              content: "新版本已经准备好，即将重启应用",
              showCancel: false,
              success(res22) {
                if (res22.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
      updateManager.onUpdateFailed(function(res) {
        common_vendor.index.showModal({
          title: "更新提示",
          content: "检查到有新版本，但下载失败，请检查网络设置",
          showCancel: false
        });
      });
    },
    /**
     * 小程序启动场景
     */
    onStartupScene(query) {
      let scene = common_utils.utils.getSceneData(query);
      let refereeId = query.referee_id;
      if (refereeId > 0) {
        if (!common_vendor.index.getStorageSync("referee_id")) {
          common_vendor.index.setStorageSync("referee_id", refereeId);
          console.log("refereeId=" + refereeId);
        }
      }
      let uid = scene.uid;
      if (uid > 0) {
        if (!common_vendor.index.getStorageSync("referee_id")) {
          common_vendor.index.setStorageSync("referee_id", uid);
        }
      }
    },
    getTabBarLinks() {
      common_vendor.index.request({
        url: this.config.app_url + "/index.php/api/index/nav",
        data: {
          app_id: this.config.app_id
        },
        success: (result) => {
          let theme = 0;
          this.$store.commit("changeTheme", theme);
          let color = [
            "#ffcc00",
            "#623ceb",
            "#1774ff",
            "#19ad57",
            "#ff5704",
            "#c8ba97"
          ];
          common_vendor.index.setTabBarStyle({
            color: "#333333",
            selectedColor: color[theme]
          });
          common_vendor.index.setTabBarItem({
            index: 0,
            text: "首页",
            iconPath: "/static/tab/home.png",
            selectedIconPath: "/static/tab/home_" + theme + ".png"
          });
          common_vendor.index.setTabBarItem({
            index: 1,
            text: "订单",
            iconPath: "/static/tab/order.png",
            selectedIconPath: "/static/tab/order_" + theme + ".png"
          });
          common_vendor.index.setTabBarItem({
            index: 2,
            text: "我的",
            iconPath: "/static/tab/user.png",
            selectedIconPath: "/static/tab/user_" + theme + ".png"
          });
          common_vendor.index.setStorageSync("theme", theme);
        }
      });
    }
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/App.vue"]]);
const headerBar = () => "./components/header.js";
const tabBar = () => "./components/tabbar/footTabbar.js";
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.component("header-bar", headerBar);
  app.component("tabBar", tabBar);
  app.use(store_index.store);
  app.config.globalProperties.$store = store_index.store;
  app.config.globalProperties.footTabberData = {
    active: "home"
  };
  app.config.globalProperties.$fire = new common_onfire.OnFire();
  app.config.globalProperties.config = config.config;
  app.config.globalProperties.websiteUrl = config.config.app_url;
  app.config.globalProperties.app_id = config.config.app_id;
  app.config.globalProperties.h5_addr = config.config.h5_addr;
  app.config.globalProperties.gotoPage = common_gotopage.gotopage;
  app.config.globalProperties.font_url = config.config.font_url;
  utils_request.requestFun(app);
  utils_validator.validator(app);
  app.config.globalProperties.theme = function() {
    return "theme" + this.$store.state.theme || "";
  };
  app.config.globalProperties.callPhone = function(phone) {
    common_vendor.index.makePhoneCall({
      phoneNumber: phone
      //仅为示例
    });
  };
  app.config.globalProperties.openmap = function(latitude, longitude) {
    common_vendor.index.openLocation({
      longitude: Number(longitude),
      latitude: Number(latitude)
    });
  };
  app.config.globalProperties.footTab = function() {
    return this.$store.state.footTab || "";
  };
  app.config.globalProperties.getTabBarLinks = function() {
    let varsParams = common_vendor.index.getStorageSync("TabBar");
    let theme = common_vendor.index.getStorageSync("theme");
    if (varsParams != null && varsParams != "") {
      this.setTabBarLinks(varsParams, theme);
    } else {
      common_vendor.index.request({
        url: this.config.app_url + "/index.php/api/index/nav",
        data: {
          app_id: this.config.app_id
        },
        success: (result) => {
          let varsParams2 = result.data.data.vars.data;
          let theme2 = result.data.data.theme.theme;
          this.$store.commit("changeTheme", theme2);
          common_vendor.index.setStorageSync("TabBar", varsParams2);
          common_vendor.index.setStorageSync("theme", theme2);
          this.setTabBarLinks(varsParams2, theme2);
        }
      });
    }
  };
  app.config.globalProperties.getThemeColor = function() {
    let theme = this.$store.state.theme;
    let color = ["#ff5704", "#19ad57", "#ffcc00", "#1774ff", "#e4e4e4", "#c8ba97", "#623ceb"];
    return color[theme];
  };
  app.config.globalProperties.getTimeData = function(timestamp) {
    if (typeof timestamp === "string") {
      timestamp = Number(timestamp);
    }
    if (typeof timestamp !== "number") {
      alert("输入参数无法识别为时间戳");
    }
    let date = new Date(timestamp);
    let Y = date.getFullYear() + "-";
    let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    let D = date.getDate() + " ";
    let h = date.getHours() + ":";
    let m = date.getMinutes() + ":";
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
  };
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
