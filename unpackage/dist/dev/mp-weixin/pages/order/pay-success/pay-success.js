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
      /*订单id*/
      order_id: 0,
      /*订单详情*/
      detail: {
        order_status: [],
        address: {
          region: []
        },
        product: [],
        pay_type: [],
        delivery_type: [],
        pay_status: []
      }
    };
  },
  onLoad(e) {
    this.order_id = e.order_id;
  },
  mounted() {
    common_vendor.index.showLoading({
      title: "加载中"
    });
    this.getData();
  },
  methods: {
    /*获取订单详情*/
    getData() {
      let _this = this;
      let order_id = _this.order_id;
      _this._get(
        "user.order/paySuccess",
        {
          order_id
        },
        function(res) {
          _this.detail = res.data.order;
          _this.loadding = false;
          common_vendor.index.hideLoading();
        }
      );
    },
    /*返回首页*/
    goHome() {
      this.gotoPage("/pages/index/index");
    },
    /*返回我的订单*/
    goMyorder() {
      this.gotoPage("/pages/order/myorder");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.loadding
  }, !$data.loadding ? {
    b: common_vendor.t($data.detail.pay_price),
    c: common_vendor.o(($event) => $options.goHome()),
    d: common_vendor.o((...args) => $options.goMyorder && $options.goMyorder(...args))
  } : {}, {
    e: _ctx.theme(),
    f: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/order/pay-success/pay-success.vue"]]);
wx.createPage(MiniProgramPage);
