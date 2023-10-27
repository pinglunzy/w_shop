"use strict";
const common_vendor = require("./vendor.js");
const pay = (result, self, success, fail) => {
  if (result.code === -10) {
    self.showError(result.msg);
    return false;
  }
  if (result.data.pay_type == 20) {
    common_vendor.index.requestPayment({
      provider: "wxpay",
      timeStamp: result.data.payment.timeStamp,
      nonceStr: result.data.payment.nonceStr,
      package: result.data.payment.package,
      signType: result.data.payment.signType,
      paySign: result.data.payment.paySign,
      success: (res) => {
        paySuccess(result, self, success);
      },
      fail: (res) => {
        self.showError("订单未支付成功", () => {
          payError(result, fail);
        });
      }
    });
  }
  if (result.data.pay_type == 10) {
    paySuccess(result, self, success);
  }
  if (result.data.pay_type == 30) {
    aliAppPay(result, self, success, fail);
  }
};
function paySuccess(result, self, success) {
  if (success) {
    success(result);
    return;
  }
  gotoSuccess(result);
}
function gotoSuccess(result) {
  common_vendor.index.reLaunch({
    url: "/pages/order/pay-success/pay-success?order_id=" + result.data.order_id
  });
}
function payError(result, fail) {
  if (fail) {
    fail(result);
    return;
  }
  if (result.data.order_type == 50) {
    return;
  }
  common_vendor.index.redirectTo({
    url: "/pages/order/order-detail?order_id=" + result.data.order_id
  });
}
function aliAppPay(result, self, success, fail) {
  console.log(result.data.payment);
  common_vendor.index.requestPayment({
    provider: "alipay",
    orderInfo: result.data.payment,
    success(res) {
      paySuccess(result, self, success);
    },
    fail(error) {
      console.log(error);
      self.showError("订单未支付成功", () => {
        payError(result, fail);
      });
    }
  });
}
exports.pay = pay;
