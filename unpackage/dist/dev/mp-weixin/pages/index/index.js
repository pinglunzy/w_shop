"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils = require("../../common/utils.js");
const diy = () => "../../components/diy/diy.js";
const _sfc_main = {
  components: {
    diy
  },
  data() {
    return {
      user: "",
      /*是否正在加载*/
      loadding: true,
      listData: [],
      urldata: "",
      longitude: 0,
      latitude: 0,
      delivery_set: [],
      items: []
    };
  },
  mounted() {
    let self = this;
    self.getcityData();
    self.getData();
  },
  onLoad(e) {
    let scene = common_utils.utils.getSceneData(e);
    let s_id = e.shop_supplier_id ? e.shop_supplier_id : scene.sid;
    if (s_id) {
      common_vendor.index.setStorageSync("selectedId", s_id);
    }
  },
  methods: {
    getData() {
      let self = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._post(
        "index/index",
        {
          url: self.urldata,
          longitude: self.longitude || "0",
          latitude: self.latitude || "0"
        },
        function(res) {
          if (res.data.getPhone) {
            common_vendor.index.navigateTo({
              url: "/pages/login/bindmobile"
            });
            return;
          }
          common_vendor.index.setStorageSync("sign", res.data.signPackage);
          if (common_vendor.index.getStorageSync("selectedId") == "") {
            common_vendor.index.setStorageSync("selectedId", res.data.supplier ? res.data.supplier.shop_supplier_id : 0);
          }
          self.items = res.data.data.items;
          self.user = res.data.user;
          common_vendor.index.hideLoading();
        }
      );
    },
    /*扫一扫核销*/
    scanQrcode: function() {
      let self = this;
      common_vendor.index.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          if (res.errMsg == "scanCode:ok") {
            self.gotoPage(res.path);
          } else {
            common_vendor.index.showToast({
              title: "扫码失败，请重试"
            });
          }
        }
      });
    },
    /*分享当前页面*/
    onShareAppMessage() {
      let self = this;
      return {
        title: self.page.params.share_title,
        path: "/pages/index/index?" + self.getShareUrlParams()
      };
    },
    /*获取定位方式*/
    getcityData() {
      let self = this;
      self.getLocation();
    },
    /*授权启用定位权限*/
    onAuthorize() {
      let self = this;
      common_vendor.index.openSetting({
        success(res) {
          if (res.authSetting["scope.userLocation"]) {
            self.isAuthor = true;
            setTimeout(() => {
              self.getLocation((res2) => {
              });
            }, 1e3);
          }
        }
      });
    },
    /*获取用户坐标*/
    getLocation(callback) {
      let self = this;
      common_vendor.index.getLocation({
        type: "wgs84",
        success(res) {
          self.longitude = res.longitude;
          self.latitude = res.latitude;
          self.getData();
        },
        fail(err) {
          self.longitude = 0;
          self.latitude = 0;
          common_vendor.index.showToast({
            title: "获取定位失败，请点击右下角按钮打开定位权限",
            duration: 2e3,
            icon: "none"
          });
          self.getData();
        }
      });
    },
    /* 公众号获取坐标 */
    getWxLocation(signPackage, callback) {
      let self = this;
      var jweixin = require("jweixin-module");
      jweixin.config(JSON.parse(signPackage));
      jweixin.ready(function(res) {
        jweixin.getLocation({
          type: "wgs84",
          success: function(res2) {
            self.longitude = res2.longitude;
            self.latitude = res2.latitude;
            self.getData();
          },
          fail(err) {
            self.longitude = 0;
            self.latitude = 0;
            self.getData();
          }
        });
      });
      jweixin.error(function(res) {
        console.log(res);
      });
    }
  }
};
if (!Array) {
  const _easycom_diy2 = common_vendor.resolveComponent("diy");
  _easycom_diy2();
}
const _easycom_diy = () => "../../components/diy/diy.js";
if (!Math) {
  _easycom_diy();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.scanQrcode),
    b: common_vendor.p({
      diyItems: $data.items
    }),
    c: _ctx.is_collection
  }, _ctx.is_collection ? {
    d: common_vendor.o(($event) => _ctx.is_collection = false),
    e: common_vendor.s("top:" + (_ctx.topBarTop() + _ctx.topBarHeight() + 10) + "px;")
  } : {}, {
    f: _ctx.is_follow == "1"
  }, _ctx.is_follow == "1" ? {
    g: common_vendor.o(($event) => _ctx.is_follow = 0)
  } : {}, {
    h: _ctx.theme(),
    i: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
