"use strict";
const common_vendor = require("../../common/vendor.js");
const common_pay = require("../../common/pay.js");
const _sfc_main = {
  data() {
    return {
      balance: "",
      balanceType: false,
      type: 0,
      loading: true,
      order_id: 0,
      // 10 普通订单 20积分兑换 30会员卡 40充值 50券包  60骑手 70团购
      order_type: 0,
      pay_type: 0,
      checkedPay: [],
      payPrice: "",
      hasBanlance: false
    };
  },
  computed: {},
  onLoad(e) {
    this.order_id = e.order_id;
    if (e.order_type) {
      this.order_type = e.order_type;
    }
    this.getData();
  },
  methods: {
    getData() {
      let self = this;
      self.loading = true;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let url = "user.order/pay";
      if (self.order_type == 30) {
        url = "user.UserCard/pay";
      }
      if (self.order_type == 40) {
        url = "balance.plan/pay";
      }
      if (self.order_type == 50) {
        url = "plus.package.Package/pay";
      }
      if (self.order_type == 60) {
        url = "plus.driver.apply/pay";
      }
      if (self.order_type == 70) {
        url = "plus.group.Order/pay";
      }
      let params = {
        order_id: self.order_id,
        pay_source: self.getPlatform()
      };
      self._get(
        url,
        params,
        function(res) {
          self.loading = false;
          self.payPrice = res.data.payPrice;
          self.balance = res.data.balance || "";
          self.checkedPay = res.data.payTypes.payType;
          self.hasBanlance = res.data.payTypes.use_balance;
          if (self.checkedPay.length > 0) {
            self.pay_type = self.checkedPay[0];
          } else {
            self.pay_type = 0;
          }
          common_vendor.index.hideLoading();
        }
      );
    },
    switch2Change(e) {
      this.balanceType = e.detail.value;
    },
    submit() {
      let self = this;
      self.loading = true;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let url = "user.order/pay";
      if (self.order_type == 30) {
        url = "user.UserCard/pay";
      }
      if (self.order_type == 40) {
        url = "balance.plan/pay";
      }
      if (self.order_type == 50) {
        url = "plus.package.Package/pay";
      }
      if (self.order_type == 60) {
        url = "plus.driver.apply/pay";
      }
      if (self.order_type == 70) {
        url = "plus.group.Order/pay";
      }
      let use_balance = self.balanceType == true ? 1 : 0;
      if (self.payPrice == 0) {
        use_balance = 1;
      }
      let payType = self.pay_type;
      if (payType == 10) {
        payType = 0;
      }
      let params = {
        order_id: self.order_id,
        pay_source: self.getPlatform(),
        payType,
        use_balance
      };
      self._post(
        url,
        params,
        function(res) {
          self.loading = false;
          common_vendor.index.hideLoading();
          common_pay.pay(res, self, self.paySuccess, self.payError);
        }
      );
    },
    paySuccess(result) {
      let self = this;
      if (self.order_type == 30 || self.order_type == 40 || self.order_type == 50) {
        common_vendor.index.showModal({
          title: "提示",
          content: "支付成功",
          success() {
            common_vendor.index.navigateBack({
              delta: parseInt(1)
            });
          }
        });
      } else if (self.order_type == 60) {
        common_vendor.index.showModal({
          title: "提示",
          content: "支付成功",
          success() {
            self.gotoPage("/pages/user/index/index");
          }
        });
      } else if (self.order_type == 70) {
        self.gotoPage("/pages/order/group/pay-success?order_id=" + result.data.order_id, "reLaunch");
      } else {
        self.gotoPage("/pages/order/pay-success/pay-success?order_id=" + result.data.order_id, "reLaunch");
      }
    },
    payError(result) {
      let self = this;
      if (self.order_type == 30 || self.order_type == 40 || self.order_type == 50) {
        common_vendor.index.showModal({
          title: "提示",
          content: "支付失败",
          success() {
            common_vendor.index.navigateBack({
              delta: parseInt(1)
            });
          }
        });
      } else if (self.order_type == 60) {
        common_vendor.index.showModal({
          title: "提示",
          content: "支付失败",
          success() {
            self.gotoPage("/pages/user/index/index");
          }
        });
      } else if (self.order_type == 70) {
        self.gotoPage("/pages/order/group/detail?order_id=" + result.data.order_id, "reLaunch");
      } else {
        self.gotoPage("/pages/order/order-detail?order_id=" + result.data.order_id, "redirect");
      }
    },
    payTypeFunc(n) {
      this.pay_type = n;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.payPrice || ""),
    b: common_vendor.f($data.checkedPay, (item, index, i0) => {
      return common_vendor.e({
        a: item == 20
      }, item == 20 ? {
        b: common_vendor.n($data.pay_type == 20 ? "item active" : "item"),
        c: common_vendor.o(($event) => $options.payTypeFunc(20), index)
      } : {}, {
        d: index
      });
    }),
    c: $data.hasBanlance && $data.order_type != 40
  }, $data.hasBanlance && $data.order_type != 40 ? {
    d: common_vendor.t($data.balance),
    e: _ctx.getThemeColor(),
    f: $data.balanceType,
    g: common_vendor.o((...args) => $options.switch2Change && $options.switch2Change(...args))
  } : {}, {
    h: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    i: _ctx.theme(),
    j: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/order/cashier.vue"]]);
wx.createPage(MiniProgramPage);
