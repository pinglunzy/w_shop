"use strict";
const common_vendor = require("../../common/vendor.js");
const timepicker = () => "../../components/timepicker/timepicker.js";
const _sfc_main = {
  components: {
    timepicker
  },
  data() {
    return {
      /*是否加载完成*/
      loading: true,
      options: {},
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      tab_type: 0,
      /*商品id*/
      product_id: "",
      /*商品数量*/
      product_num: "",
      /*商品数据*/
      ProductData: [],
      /*订单数据数据*/
      OrderData: [],
      // 是否存在收货地址
      exist_address: false,
      /*默认地址*/
      Address: {
        region: []
      },
      extract_store: {},
      last_extract: {},
      product_sku_id: 0,
      /*配送方式*/
      /* 10配送20自提30打包40店内 */
      delivery: 0,
      /*自提店id*/
      store_id: 1,
      linkman: "",
      phone: "",
      remark: "",
      deliverySetting: [],
      /*消息模板*/
      temlIds: [],
      /*是否显示支付宝支付，只有在h5，非微信内打开才显示*/
      showAlipay: false,
      takeout_address: {},
      isTimer: false,
      mealtime: "",
      wmtime: "",
      estitime: "",
      is_pack: 1,
      supplier: {},
      dinner_type: 10,
      cart_type: 0,
      store_set: [],
      delivery_set: [],
      table_id: 0,
      min_money: 0
    };
  },
  onLoad(options) {
    let self2 = this;
    self2.options = options;
    self2.cart_type = options.cart_type;
    self2.table_id = options.table_id || 0;
    self2.dinner_type = options.dinner_type;
    self2.delivery = options.delivery;
  },
  onShow() {
    this.$fire.on("takeout", function(e) {
      self.takeout_address = e;
      self.orderType = "takeout";
    });
    this.getData();
  },
  methods: {
    /**/
    hasType(e) {
      if (this.deliverySetting.indexOf(e) != -1) {
        return true;
      } else {
        return false;
      }
    },
    changeTime(n) {
    },
    getTime(type) {
      let myDate = /* @__PURE__ */ new Date();
      let myhours = myDate.getHours();
      if (myhours < 10) {
        myhours = "0" + myhours;
      }
      let myminute = myDate.getMinutes();
      if (myminute < 10) {
        myminute = "0" + myminute;
      }
      let wmhours = myDate.getHours();
      let wmminute = myDate.getMinutes() + 15;
      if (wmminute >= 60) {
        wmminute = wmminute - 60;
        wmhours = wmhours + 1;
      }
      if (wmminute < 10) {
        wmminute = "0" + wmminute;
      }
      if (wmhours < 10) {
        wmhours = "0" + wmhours;
      }
      if (type == "my") {
        return myhours + ":" + myminute;
      } else if (type == "wm") {
        return wmhours + ":" + wmminute;
      }
    },
    /*获取数据*/
    getData() {
      let self2 = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self2.loading = true;
      let callback = function(res) {
        self2.OrderData = res.data.orderInfo;
        self2.min_money = res.data.orderInfo.supplier.min_money;
        self2.temlIds = res.data.template_arr;
        self2.exist_address = self2.OrderData.exist_address;
        self2.Address = self2.OrderData.address;
        self2.extract_store = self2.OrderData.extract_store;
        self2.last_extract = self2.OrderData.last_extract;
        self2.ProductData = self2.OrderData.product_list;
        self2.supplier = res.data.orderInfo.supplier;
        self2.linkman = res.data.orderInfo.last_extract.linkman;
        self2.phone = res.data.orderInfo.last_extract.phone;
        self2.delivery_set = res.data.orderInfo.supplier.delivery_set;
        self2.store_set = res.data.orderInfo.supplier.store_set;
        if (self2.OrderData.delivery == "10") {
          self2.tab_type = 0;
        }
        if (self2.OrderData.delivery == "20") {
          self2.tab_type = 1;
        }
        if (self2.OrderData.delivery == "30") {
          self2.tab_type = 3;
        }
        if (self2.OrderData.delivery == "40") {
          self2.tab_type = 4;
        }
        if (self2.cart_type == 0) {
          if (self2.delivery_set.indexOf(self2.delivery) == -1) {
            if (self2.delivery_set[0] == "10") {
              console.log("执行");
              self2.tabFunc(0, true);
            } else {
              self2.tabFunc(1, true);
            }
          }
        } else {
          if (self2.store_set.indexOf(self2.delivery) == -1) {
            if (self2.store_set[0] == "30") {
              self2.tabFunc(3, true);
            } else {
              self2.tabFunc(4, true);
            }
          }
        }
        self2.wmtime = self2.getTime("wm");
        self2.mealtime = self2.getTime("my");
        self2.estitime = self2.getTime("wm");
        self2.deliverySetting = self2.OrderData.deliverySetting;
        self2.loading = false;
      };
      let params = {
        delivery: self2.delivery || 0,
        store_id: 1,
        mealtime: "",
        pay_source: self2.getPlatform()
      };
      if (self2.table_id) {
        params.table_id = self2.table_id;
      }
      if (self2.options.order_type === "buy") {
        self2._get(
          "order.order/buy",
          Object.assign({}, params, {
            product_id: self2.options.product_id,
            product_num: self2.options.product_num,
            product_sku_id: self2.options.product_sku_id
          }),
          function(res) {
            callback(res);
          }
        );
      } else if (self2.options.order_type === "cart") {
        self2._get(
          "order.order/cart",
          Object.assign({}, params, {
            cart_ids: self2.options.cart_ids || 0,
            shop_supplier_id: self2.options.shop_supplier_id || 0,
            order_type: self2.options.cart_type,
            table_id: self2.table_id
          }),
          function(res) {
            callback(res);
          },
          function(err) {
            if (self2.tab_type == 1) {
              self2.tabFunc(0);
            } else if (self2.tab_type == 0) {
              self2.tabFunc(1);
            }
          }
        );
      }
    },
    /*选择配送方式*/
    tabFunc(e, flag) {
      if (e == 0) {
        if (this.min_money * 1 > this.OrderData.order_pay_price * 1) {
          this.showError("未满足最低配送费用!");
          return;
        }
      }
      this.tab_type = e;
      if (e == 0) {
        this.delivery = "10";
        this.dinner_type = 10;
      } else if (e == 1) {
        this.delivery = "20";
        this.dinner_type = 20;
      } else if (e == 3) {
        this.delivery = "30";
        this.dinner_type = 30;
      } else if (e == 4) {
        this.delivery = "40";
        this.dinner_type = 30;
      }
      if (!flag) {
        console.log("切换");
        this.getData();
      }
    },
    /*提交订单*/
    SubmitOrder() {
      let self2 = this;
      if (this.loading) {
        return;
      }
      if (self2.$refs != null) {
        if (self2.$refs.getShopinfoData != null) {
          self2.$refs.getShopinfoData.phone;
          self2.$refs.getShopinfoData.linkman;
        }
      }
      let params = {
        delivery: self2.delivery,
        store_id: 1,
        linkman: self2.linkman,
        phone: self2.phone,
        remark: self2.remark,
        mealtime: self2.mealtime,
        shop_supplier_id: self2.options.shop_supplier_id,
        pay_source: self2.getPlatform()
      };
      if (self2.delivery == 10) {
        params.mealtime = self2.wmtime;
      }
      if (self2.tab_type == 1 && self2.delivery != 10) {
        params.mealtime = self2.getTime("my");
      }
      let url = "";
      if (self2.options.order_type === "buy") {
        url = "order.order/buy";
        params = Object.assign(params, {
          product_id: self2.options.product_id,
          product_num: self2.options.product_num,
          product_sku_id: self2.options.product_sku_id
        });
      }
      if (self2.options.order_type === "cart") {
        url = "order.order/cart";
        params = Object.assign(params, {
          cart_ids: self2.options.cart_ids || 0,
          dinner_type: self2.dinner_type,
          shop_supplier_id: self2.options.shop_supplier_id || 0,
          order_type: self2.options.cart_type,
          table_id: self2.table_id
        });
      }
      let callback = function() {
        self2.loading = true;
        common_vendor.index.showLoading({
          title: "加载中",
          mask: true
        });
        self2._post(
          url,
          params,
          function(result) {
            let pages = "/pages/order/cashier?order_type=10&order_id=" + result.data.order_id;
            self2.gotoPage(pages, "reLaunch");
          },
          (err) => {
            self2.loading = false;
          }
        );
      };
      self2.subMessage(self2.temlIds, callback);
    },
    timepick() {
      this.isTimer = true;
    },
    closetimer(e) {
      if (e != "") {
        this.wmtime = e;
        this.mealtime = e;
      }
      this.isTimer = false;
    },
    packTypeFunc(n) {
      this.is_pack = n;
    }
  }
};
if (!Array) {
  const _easycom_timepicker2 = common_vendor.resolveComponent("timepicker");
  _easycom_timepicker2();
}
const _easycom_timepicker = () => "../../components/timepicker/timepicker.js";
if (!Math) {
  _easycom_timepicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.loading
  }, !$data.loading ? common_vendor.e({
    b: $data.cart_type == 0
  }, $data.cart_type == 0 ? {
    c: common_vendor.f($data.delivery_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "10"
      }, item == "10" ? {
        b: common_vendor.n($data.tab_type == 0 ? "active" : ""),
        c: common_vendor.o(($event) => $options.tabFunc(0), index + "1")
      } : {}, {
        d: index + "1"
      });
    }),
    d: common_vendor.f($data.delivery_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "20"
      }, item == "20" ? {
        b: common_vendor.n($data.tab_type == 1 ? "active" : ""),
        c: common_vendor.o(($event) => $options.tabFunc(1), index + "2")
      } : {}, {
        d: index + "2"
      });
    })
  } : {}, {
    e: $data.cart_type == 1
  }, $data.cart_type == 1 ? {
    f: common_vendor.f($data.store_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "30"
      }, item == "30" ? {
        b: common_vendor.n($data.tab_type == 3 ? "active" : ""),
        c: common_vendor.o(($event) => $options.tabFunc(3), item)
      } : {}, {
        d: item
      });
    }),
    g: common_vendor.f($data.store_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "40"
      }, item == "40" ? {
        b: common_vendor.n($data.tab_type == 4 ? "active" : ""),
        c: common_vendor.o(($event) => $options.tabFunc(4), item)
      } : {}, {
        d: item
      });
    })
  } : {}, {
    h: $data.cart_type == 0
  }, $data.cart_type == 0 ? common_vendor.e({
    i: $data.tab_type != 1
  }, $data.tab_type != 1 ? common_vendor.e({
    j: $data.Address != null
  }, $data.Address != null ? {
    k: common_vendor.t($data.Address.detail + $data.Address.address + " " + $data.Address.name + " " + $data.Address.phone)
  } : {}, {
    l: common_vendor.o(($event) => _ctx.gotoPage("/pages/user/address/storeaddress?shop_supplier_id=" + $data.options.shop_supplier_id))
  }) : {}, {
    m: $data.tab_type == 1
  }, $data.tab_type == 1 ? {
    n: $data.phone,
    o: common_vendor.o(($event) => $data.phone = $event.detail.value)
  } : {}) : {}, {
    p: $data.tab_type == 0 && $data.delivery != 10
  }, $data.tab_type == 0 && $data.delivery != 10 ? {
    q: common_vendor.t($data.mealtime),
    r: common_vendor.o(($event) => $options.timepick())
  } : {}, {
    s: $data.tab_type == 1 && $data.delivery != 10
  }, $data.tab_type == 1 && $data.delivery != 10 ? {
    t: common_vendor.t($data.estitime)
  } : {}, {
    v: $data.tab_type == 0 && $data.delivery == 10
  }, $data.tab_type == 0 && $data.delivery == 10 ? {
    w: common_vendor.t($data.wmtime),
    x: common_vendor.o(($event) => $options.timepick())
  } : {}, {
    y: common_vendor.t($data.supplier.name),
    z: common_vendor.f($data.ProductData, (item, index, i0) => {
      return {
        a: item.image.file_path,
        b: common_vendor.t(item.product.product_name),
        c: common_vendor.t(item.describe),
        d: common_vendor.t(item.product_num),
        e: common_vendor.t(item.price),
        f: common_vendor.t(item.product_price),
        g: index
      };
    }),
    A: common_vendor.t($data.OrderData.order_total_price),
    B: $data.tab_type != 1 && $data.OrderData.express_price != 0
  }, $data.tab_type != 1 && $data.OrderData.express_price != 0 ? {
    C: common_vendor.t($data.OrderData.express_price)
  } : {}, {
    D: common_vendor.t($data.OrderData.order_bag_price),
    E: $data.OrderData.reduce
  }, $data.OrderData.reduce ? {
    F: common_vendor.t($data.OrderData.reduce.active_name),
    G: common_vendor.t($data.OrderData.reduce.reduced_price)
  } : {}, {
    H: $data.OrderData.table_no
  }, $data.OrderData.table_no ? {
    I: common_vendor.t($data.OrderData.table_no)
  } : {}, {
    J: common_vendor.t($data.OrderData.order_total_num),
    K: common_vendor.t($data.OrderData.order_pay_price),
    L: $data.remark,
    M: common_vendor.o(($event) => $data.remark = $event.detail.value),
    N: !$data.OrderData.force_points
  }, !$data.OrderData.force_points ? {
    O: common_vendor.t($data.OrderData.order_pay_price)
  } : {}, {
    P: common_vendor.o((...args) => $options.SubmitOrder && $options.SubmitOrder(...args)),
    Q: common_vendor.o($options.closetimer),
    R: common_vendor.p({
      isTimer: $data.isTimer
    })
  }) : {}, {
    S: _ctx.theme(),
    T: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/order/confirm-order.vue"]]);
wx.createPage(MiniProgramPage);
