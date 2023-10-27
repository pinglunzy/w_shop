"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      /*是否加载完成*/
      loadding: true,
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      /*数据*/
      listData: [],
      /*默认地址id*/
      default_id: "0",
      options: {}
    };
  },
  onLoad: function(options) {
    this.options = options;
  },
  onShow: function() {
    common_vendor.index.showLoading({
      title: "加载中"
    });
    this.getData();
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      self.dataType;
      self._get("user.address/lists", {}, function(res) {
        self.listData = res.data.list;
        self.default_id = res.data.default_id + "";
        self.loadding = false;
        common_vendor.index.hideLoading();
      });
    },
    /*跳转页面*/
    addAddress() {
      let delta = 1;
      if (this.options.source === "order") {
        delta = 2;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/address/add/add?delta=" + delta
      });
    },
    /*点击单选*/
    radioChange(e) {
      let self = this;
      self.default_id = e;
      self._post("user.address/setDefault", {
        address_id: e
      }, function(res) {
        if (self.options.source === "order") {
          common_vendor.index.navigateBack();
        }
      });
      return false;
    },
    /*编辑地址*/
    editAddress(e) {
      common_vendor.index.navigateTo({
        url: "/pages/user/address/edit/edit?address_id=" + e
      });
    },
    /*删除地址*/
    delAddress(e) {
      let self = this;
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要移除当前收货地址吗?",
        success: function(o) {
          o.confirm && self._get("user.address/delete", {
            address_id: e
          }, function(result) {
            if (result.code == 1) {
              common_vendor.index.showToast({
                title: "删除成功",
                duration: 2e3
              });
              self.getData();
            }
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.loadding
  }, !$data.loadding ? common_vendor.e({
    b: $data.listData.length > 0
  }, $data.listData.length > 0 ? {
    c: common_vendor.f($data.listData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: common_vendor.t(item.detail),
        d: common_vendor.t(item.address),
        e: item.address_id + "",
        f: $data.default_id == item.address_id + "",
        g: common_vendor.o(($event) => $options.radioChange(item.address_id), index),
        h: common_vendor.o(($event) => $options.delAddress(item.address_id), index),
        i: common_vendor.o(($event) => $options.editAddress(item.address_id), index),
        j: index
      };
    }),
    d: _ctx.getThemeColor(),
    e: common_vendor.o(($event) => $options.addAddress())
  } : {
    f: common_vendor.o(($event) => $options.addAddress())
  }, {
    g: _ctx.theme(),
    h: common_vendor.n(_ctx.theme() || "")
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/user/address/address.vue"]]);
wx.createPage(MiniProgramPage);
