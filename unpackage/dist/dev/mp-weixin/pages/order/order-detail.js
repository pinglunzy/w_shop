"use strict";
const common_vendor = require("../../common/vendor.js");
const common_pay = require("../../common/pay.js");
const cashier = () => "../../components/cashier/cashier.js";
const _sfc_main = {
  components: {
    cashier
  },
  data() {
    return {
      checkedPay: [10, 20],
      /*支付方式*/
      pay_type: 20,
      /*是否加载完成*/
      loadding: true,
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      /*是否显示支付类别弹窗*/
      isPayPopup: false,
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
      },
      extractStore: {},
      /*是否显示拼团*/
      is_fightgroup: false,
      /*是否显示支付宝支付，只有在h5，非微信内打开才显示*/
      showAlipay: false,
      qrimg: ""
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
    /*获取数据*/
    getData() {
      let self = this;
      let order_id = self.order_id;
      self._get(
        "user.order/detail",
        {
          order_id
        },
        function(res) {
          self.detail = res.data.order;
          self.extractStore = res.data.order.extractStore;
          self.loadding = false;
          common_vendor.index.hideLoading();
        }
      );
    },
    /*显示支付方式*/
    hidePopupFunc() {
      this.isPayPopup = false;
    },
    /*取消订单*/
    cancelOrder(e) {
      let self = this;
      let order_id = e;
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要取消当前订单吗?",
        success: function(o) {
          if (o.confirm) {
            common_vendor.index.showLoading({
              title: "正在处理"
            });
            self._get(
              "user.order/cancel",
              {
                order_id
              },
              function(res) {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "操作成功",
                  duration: 2e3,
                  icon: "success"
                });
                self.getData();
              }
            );
          }
        }
      });
    },
    /*确认收货*/
    orderReceipt(order_id) {
      let self = this;
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要收货吗?",
        success: function(o) {
          if (o.confirm) {
            common_vendor.index.showLoading({
              title: "正在处理"
            });
            self._post(
              "user.order/receipt",
              {
                order_id
              },
              function(res) {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: res.msg,
                  duration: 2e3,
                  icon: "success"
                });
                self.getData();
              }
            );
          }
        }
      });
    },
    /*查看物流*/
    gotoExpress(order_id) {
      common_vendor.index.navigateTo({
        url: "/pages/order/express/express?order_id=" + order_id
      });
    },
    /*申请售后*/
    onApplyRefund(e) {
      common_vendor.index.navigateTo({
        url: "/pages/order/refund/apply/apply?order_product_id=" + e
      });
    },
    /*去支付*/
    payTypeFunc(payType) {
      let self = this;
      self.pay_type = payType;
    },
    subFunc(e) {
      let self = this;
      if (!self.isPayPopup) {
        return;
      }
      self.isPayPopup = false;
      let order_id = self.order_id;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._post(
        "user.order/pay",
        {
          payType: e,
          order_id,
          pay_source: self.getPlatform()
        },
        function(res) {
          common_vendor.index.hideLoading();
          common_pay.pay(res, self);
        }
      );
    },
    /*支付方式选择*/
    onPayOrder(orderId) {
      let self = this;
      self.isPayPopup = true;
      self.order_id = orderId;
    }
  }
};
if (!Array) {
  const _easycom_cashier2 = common_vendor.resolveComponent("cashier");
  _easycom_cashier2();
}
const _easycom_cashier = () => "../../components/cashier/cashier.js";
if (!Math) {
  _easycom_cashier();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.loadding
  }, !$data.loadding ? common_vendor.e({
    b: common_vendor.t($data.detail.state_text),
    c: $data.detail.pay_status.value == 10 && $data.detail.order_status.value != 20
  }, $data.detail.pay_status.value == 10 && $data.detail.order_status.value != 20 ? {
    d: common_vendor.t($data.detail.pay_end_time)
  } : {}, {
    e: $data.detail.order_type != 1 && $data.detail.delivery_type.value == 10 && $data.detail.order_status.value == 10
  }, $data.detail.order_type != 1 && $data.detail.delivery_type.value == 10 && $data.detail.order_status.value == 10 ? {
    f: common_vendor.t($data.detail.mealtime)
  } : {}, {
    g: common_vendor.t($data.detail.supplier.name),
    h: common_vendor.f($data.detail.product, (good, index, i0) => {
      return {
        a: good.image.file_path,
        b: common_vendor.t(good.product_name),
        c: common_vendor.t(good.product_attr),
        d: common_vendor.t(good.total_num),
        e: common_vendor.t(good.product_price),
        f: common_vendor.t(good.line_price),
        g: index
      };
    }),
    i: common_vendor.t($data.detail.total_price),
    j: $data.detail.bag_price != 0
  }, $data.detail.bag_price != 0 ? {
    k: common_vendor.t($data.detail.bag_price)
  } : {}, {
    l: $data.detail.express_price > 0
  }, $data.detail.express_price > 0 ? {
    m: common_vendor.t($data.detail.express_price)
  } : {}, {
    n: common_vendor.t($data.detail.product.length),
    o: common_vendor.t($data.detail.pay_price),
    p: common_vendor.t($data.detail.order_type_text),
    q: $data.detail.mealtime
  }, $data.detail.mealtime ? {
    r: common_vendor.t($data.detail.mealtime)
  } : {}, {
    s: $data.detail.order_type != 1 && $data.detail.address != null
  }, $data.detail.order_type != 1 && $data.detail.address != null ? {
    t: common_vendor.t($data.detail.address.detail + $data.detail.address.address),
    v: common_vendor.t($data.detail.address.name + " " + $data.detail.address.phone)
  } : {}, {
    w: common_vendor.t($data.detail.order_no),
    x: $data.detail.table_no
  }, $data.detail.table_no ? {
    y: common_vendor.t($data.detail.table_no)
  } : {}, {
    z: common_vendor.t($data.detail.create_time),
    A: common_vendor.t($data.detail.pay_price),
    B: common_vendor.t($data.detail.pay_type.text),
    C: common_vendor.t($data.detail.buyer_remark),
    D: $data.detail.pay_status.value == 10 && $data.detail.order_status == 10
  }, $data.detail.pay_status.value == 10 && $data.detail.order_status == 10 ? {
    E: common_vendor.o(($event) => $options.onPayOrder($data.detail.order_id))
  } : {}, {
    F: common_vendor.o($options.hidePopupFunc),
    G: common_vendor.o($options.subFunc),
    H: common_vendor.p({
      isPayPopup: $data.isPayPopup
    })
  }) : {}, {
    I: _ctx.theme(),
    J: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/order/order-detail.vue"]]);
wx.createPage(MiniProgramPage);
