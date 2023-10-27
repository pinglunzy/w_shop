"use strict";
const common_vendor = require("../../../common/vendor.js");
const modal = () => "../../../components/modal/modal.js";
const popupLayer = () => "../../../components/popup-layer/popup-layer.js";
const _sfc_main = {
  components: {
    modal,
    popupLayer
  },
  data() {
    return {
      isLoading: true,
      goods: [],
      //所有商品
      supplier: {
        name: ""
      },
      ads: [],
      loading: true,
      currentCateId: 6905,
      //默认分类
      cateScrollTop: 0,
      menuScrollIntoView: "",
      cart: [],
      //购物车
      goodDetailModalVisible: false,
      //是否饮品详情模态框
      good: {},
      //当前饮品
      category: {},
      //当前饮品所在分类
      cartPopupVisible: false,
      sizeCalcState: false,
      listData: [],
      goods_list: [],
      productModel: {},
      clock: false,
      cart_total_num: 0,
      total_price: 0,
      cart_list: [],
      orderType: "",
      takeout_address: {},
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollviewHigh: 0,
      delivery_time: ["00:00", "00:00"],
      store_time: ["00:00", "00:00"],
      officeTime: {
        now: 0,
        delivery_start: 0,
        delivery_end: 0,
        store_start: 0,
        store_end: 0
      },
      businessOpen: 1,
      addclock: false,
      longitude: 0,
      latitude: 0,
      bag_type: 1,
      shop_supplier_id: 0,
      /* 10配送20自提30店内40外卖 */
      dinner_type: 20,
      cart_type: 0,
      delivery_set: [],
      isFirst: true,
      address_id: 0,
      min_money: 0,
      min_money_diff: 0,
      reduceList: [],
      total_bag_price: 0,
      reduce: {},
      reduce_diff_value: 0,
      line_price: 0
    };
  },
  onLoad(e) {
    let self = this;
    self.orderType = e.orderType;
    self.shop_supplier_id = common_vendor.index.getStorageSync("selectedId") ? common_vendor.index.getStorageSync("selectedId") : 0;
    self.$fire.on("takeout", function(e2) {
      if (e2) {
        self.orderType = "takeout";
        self.dinner_type = 10;
      }
    });
    self.$fire.on("selectShop", function(e2) {
      if (e2) {
        self.shop_supplier_id = common_vendor.index.getStorageSync("selectedId") || 0;
      }
    });
  },
  onShow() {
    let self = this;
    self.init();
  },
  computed: {
    menuCartNum() {
      return (id) => this.cart.reduce((acc, cur) => {
        if (cur.cate_id === id) {
          return acc += cur.number;
        }
        return acc;
      }, 0);
    }
  },
  methods: {
    scrollInit() {
      let self = this;
      if (self.scrollviewHigh) {
        return;
      }
      common_vendor.index.getSystemInfo({
        success(res) {
          self.phoneHeight = res.windowHeight;
          let view = common_vendor.index.createSelectorQuery().select(".nav");
          view.boundingClientRect((data) => {
            let h = self.phoneHeight - data.height;
            self.scrollviewHigh = h;
          }).exec();
        }
      });
    },
    init() {
      this.addclock = false;
      this.category = {};
      this.good = {};
      this.goodDetailModalVisible = false;
      this.clock = false;
      this.loading = true;
      this.isLoading = true;
      this.goods_list = [];
      this.getcityData();
      this.sizeCalcState = false;
    },
    /* 获取商品类型 */
    getCategory() {
      let self = this;
      this.sizeCalcState = false;
      let delivery = self.orderType == "takeout" ? 10 : 20;
      self._get(
        "product.category/index",
        {
          type: 0,
          /* 0外卖，1店内 */
          shop_supplier_id: self.shop_supplier_id,
          longitude: self.longitude,
          latitude: self.latitude,
          delivery,
          order_type: 0,
          table_id: 0
        },
        function(res) {
          if (self.getUserId() && res.data.address_id == 0 && self.orderType == "takeout") {
            self.showError("未选择收货地址，请设置收货地址", function() {
              self.gotoPage("/pages/user/address/storeaddress?shop_supplier_id=" + self.shop_supplier_id);
              return;
            });
          }
          self.reduceList = res.data.reduceList;
          self.min_money = (res.data.supplier.min_money * 1).toFixed(2);
          self.goods_list = res.data.list;
          self.supplier = res.data.supplier;
          self.delivery_set = res.data.supplier.delivery_set;
          if (self.isFirst && self.orderType == "") {
            if (self.delivery_set.indexOf(10) != -1) {
              self.orderType = "takeout";
            } else {
              self.orderType = "takein";
            }
            self.isFirst = false;
          }
          self.address_id = res.data.address_id;
          self.shop_supplier_id = res.data.supplier.shop_supplier_id;
          self.bag_type = res.data.supplier.bag_type;
          self.loading = false;
          self.isLoading = false;
          self.$nextTick(function() {
            self.scrollInit();
          });
          self.getCart();
          self.isBusiness();
          common_vendor.index.hideLoading();
        },
        function(err) {
          self.showError(err.msg, () => {
            self.gotoPage("/pages/index/index");
          });
        }
      );
    },
    /*获取数据*/
    getProduct(item) {
      let self = this;
      if (self.clock == true) {
        return;
      }
      self.clock = true;
      self.good = item;
      item.product_id;
      self.detail = item;
      self.showGoodDetailModal();
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
          self.getCategory();
        },
        fail(err) {
          self.longitude = 0;
          self.latitude = 0;
          common_vendor.index.showToast({
            title: "获取定位失败，请点击右下角按钮打开定位权限",
            duration: 2e3,
            icon: "none"
          });
          self.getCategory();
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
            self.getCategory();
          },
          fail(err) {
            self.longitude = 0;
            self.latitude = 0;
            self.getCategory();
          }
        });
      });
      jweixin.error(function(res) {
        console.log(res);
      });
    },
    reCart(res) {
      let self = this;
      self.cart_total_num = res.data.cartInfo.cart_total_num;
      self.line_price = res.data.cartInfo.total_line_money;
      self.total_price = res.data.cartInfo.total_pay_price;
      self.total_bag_price = res.data.cartInfo.total_bag_price;
      self.min_money_diff = res.data.cartInfo.min_money_diff;
      self.reduce = res.data.cartInfo.reduce;
      self.reduce_diff_value = res.data.cartInfo.reduce_diff_value;
    },
    addCart(goods) {
      let self = this;
      if (self.addclock) {
        return;
      }
      if (goods.limit_num != 0 && goods.limit_num <= goods.cart_num) {
        common_vendor.index.showToast({
          icon: "none",
          title: "超过限购数量"
        });
        return;
      }
      if (goods.product_stock <= 0 || goods.product_stock <= goods.cart_num) {
        common_vendor.index.showToast({
          icon: "none",
          title: "没有更多库存了"
        });
        return;
      }
      let params = {
        product_id: goods.product_id,
        product_num: 1,
        product_sku_id: goods.sku[0].product_sku_id,
        attr: "",
        feed: "",
        describe: "",
        price: goods.sku[0].product_price,
        bag_price: goods.sku[0].bag_price,
        shop_supplier_id: goods.supplier.shop_supplier_id,
        cart_type: 0,
        dinner_type: self.dinner_type,
        product_price: goods.sku[0].line_price,
        delivery: self.orderType == "takeout" ? 10 : 20
      };
      self.addclock = true;
      self._post(
        "order.cart/add",
        params,
        function(res) {
          self.reCart(res);
          if (goods.cart_num) {
            goods.cart_num + 1;
          }
          self.goods_list.forEach((item, index) => {
            item.products.forEach((product, product_index) => {
              if (product.product_id == goods.product_id) {
                self.$set(product, "cart_num", product.cart_num + 1);
              }
            });
          });
          self.addclock = false;
          self.getCategory();
        },
        function(err) {
          self.addclock = false;
        }
      );
    },
    reduceFunc(goods) {
      let self = this;
      if (self.addclock || goods.cart_num <= 0) {
        return;
      }
      let product_id = goods.product_id;
      goods.cart_num;
      self.addclock = true;
      self._post(
        "order.cart/productSub",
        {
          product_id,
          type: "down",
          cart_type: 0,
          dinner_type: self.dinner_type,
          shop_supplier_id: self.shop_supplier_id,
          delivery: self.orderType == "takeout" ? 10 : 20
        },
        function(res) {
          self.reCart(res);
          self.goods_list.forEach((item, index) => {
            item.products.forEach((product, product_index) => {
              if (product.product_id == goods.product_id) {
                self.$set(product, "cart_num", product.cart_num - 1);
              }
            });
          });
          self.addclock = false;
          self.getCategory();
        },
        function() {
          self.addclock = false;
        }
      );
    },
    getCart() {
      let id = common_vendor.index.getStorageSync("user_id");
      if (!id) {
        return;
      }
      let self = this;
      self._get(
        "order.cart/lists",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 0,
          delivery: self.orderType == "takeout" ? 10 : 20
        },
        function(res) {
          self.isLoading = true;
          self.reCart(res);
          self.cart_list = res.data.productList;
        }
      );
    },
    /* 购物车商品添加 */
    cartAdd(goods) {
      let self = this;
      if (self.addclock) {
        return;
      }
      self.addclock = true;
      let num = goods.product_num + 1;
      let product_id = goods.product_id;
      let total_num = 1;
      self._post(
        "order.cart/sub",
        {
          product_id,
          total_num,
          cart_id: goods.cart_id,
          type: "up",
          cart_type: 0,
          dinner_type: self.dinner_type,
          shop_supplier_id: self.shop_supplier_id,
          delivery: self.orderType == "takeout" ? 10 : 20
        },
        function(res) {
          self.addclock = false;
          self.reCart(res);
          self.goods_list.forEach((item, index) => {
            item.products.forEach((product, product_index) => {
              if (product.product_id == goods.product_id) {
                self.$set(product, "cart_num", product.cart_num + 1);
              }
            });
          });
          self.$set(goods, "product_num", num);
          self.$set(goods, "total_num", goods.total_num + 1);
          self.addclock = false;
          self.getCategory();
        },
        function() {
          self.addclock = false;
        }
      );
    },
    /* 购物车商品减少 */
    cartReduce(goods) {
      let self = this;
      if (self.addclock) {
        return;
      }
      self.addclock = true;
      let product_id = goods.product_id;
      let num = goods.product_num;
      self._post(
        "order.cart/sub",
        {
          product_id,
          total_num: 1,
          cart_id: goods.cart_id,
          type: "down",
          cart_type: 0,
          dinner_type: self.dinner_type,
          shop_supplier_id: self.shop_supplier_id,
          delivery: self.orderType == "takeout" ? 10 : 20
        },
        function(res) {
          num--;
          self.reCart(res);
          self.goods_list.forEach((item, index) => {
            item.products.forEach((product, product_index) => {
              if (product.product_id == goods.product_id) {
                self.$set(product, "cart_num", product.cart_num - 1);
              }
            });
          });
          self.$set(goods, "product_num", num);
          self.$set(goods, "total_num", goods.total_num - 1);
          self.addclock = false;
          self.getCategory();
        },
        function() {
          self.addclock = false;
        }
      );
    },
    takout() {
      if (this.orderType == "takeout")
        return;
      this.orderType = "takeout";
      this.dinner_type = 10;
      this.isBusiness();
      this.init();
    },
    takein() {
      if (this.orderType == "takein")
        return;
      this.orderType = "takein";
      this.dinner_type = 20;
      this.isBusiness();
      this.init();
    },
    handleMenuTap(id) {
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      this.currentCateId = id;
      this.$nextTick(() => this.cateScrollTop = this.goods_list.find((item) => item.category_id == id).top);
    },
    handleGoodsScroll({
      detail
    }) {
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      const {
        scrollTop
      } = detail;
      let tabs = this.goods_list.filter((item) => item.top <= scrollTop).reverse();
      if (tabs.length > 0) {
        this.currentCateId = tabs[0].category_id;
      }
    },
    calcSize() {
      let h = 10;
      this.goods_list.forEach((item) => {
        let view = common_vendor.index.createSelectorQuery().select(`#cate-${item.category_id}`);
        view.fields(
          {
            size: true
          },
          (data) => {
            item.top = h;
            if (data != null) {
              h += data.height;
            }
            item.bottom = h;
          }
        ).exec();
      });
      this.sizeCalcState = true;
    },
    showGoodDetailModal() {
      this.detail.sku.forEach((item, index) => {
        item.checked = false;
      });
      let obj = {
        specData: this.detail.sku,
        detail: this.detail,
        shop_supplier_id: this.shop_supplier_id,
        productSpecArr: this.specData != null ? new Array(this.specData.spec_attr.length) : [],
        show_sku: {
          sku_image: "",
          seckill_price: 0,
          attr: [],
          product_sku_id: [],
          feed: [],
          line_price: 0,
          seckill_stock: 0,
          seckill_product_sku_id: 0,
          sum: 1
        }
      };
      this.productModel = obj;
      this.goodDetailModalVisible = true;
    },
    closeGoodDetailModal(num, res) {
      this.goodDetailModalVisible = false;
      this.clock = false;
      if (num) {
        this.$set(this.good, "cart_num", this.good.cart_num ? this.good.cart_num + num : num);
        this.reCart(res);
      }
      this.category = {};
      this.good = {};
    },
    openCartPopup() {
      this.getCart();
      this.cartPopupVisible = !this.cartPopupVisible;
    },
    handleCartClear() {
      let self = this;
      common_vendor.index.showModal({
        title: "提示",
        content: "确定清空购物车么",
        success(res) {
          if (res.confirm) {
            self.clearCart();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    clearCart() {
      let self = this;
      self._post(
        "order.cart/delete",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 0
        },
        function(res) {
          self.cartPopupVisible = false;
          self.cart_list = [];
          self.init();
        }
      );
    },
    isBusiness() {
      let nowH = (/* @__PURE__ */ new Date()).getHours();
      let nowM = (/* @__PURE__ */ new Date()).getMinutes();
      let now = this.time_to_sec(nowH + ":" + nowM);
      if (this.orderType == "takeout") {
        if (this.supplier.delivery_time[0] <= now && this.supplier.delivery_time[1] >= now) {
          this.businessOpen = 0;
        } else {
          this.businessOpen = 1;
        }
      } else if (this.orderType == "takein") {
        if (this.supplier.pick_time[0] <= now && this.supplier.pick_time[1] >= now) {
          this.businessOpen = 0;
        } else {
          this.businessOpen = 1;
        }
      }
    },
    time_to_sec(time) {
      if (time !== null) {
        var s = "";
        var hour = time.split(":")[0];
        var min = time.split(":")[1];
        s = Number(hour * 3600) + Number(min * 60);
        return s;
      }
    },
    selectShop(url) {
      let self = this;
      let delivery = self.orderType == "takeout" ? 10 : 20;
      self.gotoPage(url + "?dinner_type=" + delivery);
    },
    toPay() {
      let self = this;
      if (self.address_id == 0 && self.orderType == "takeout") {
        common_vendor.index.showModal({
          title: "提示",
          content: "您还没选择收货地址,请先选择收货地址",
          success() {
            self.gotoPage("/pages/user/address/storeaddress?shop_supplier_id=" + self.shop_supplier_id);
          }
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._get(
        "order.cart/lists",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 0,
          delivery: self.orderType == "takeout" ? 10 : 20
        },
        function(res) {
          self.reCart(res);
          self.cart_list = res.data.productList;
          let arrIds = [];
          self.cart_list.forEach((item) => {
            arrIds.push(item.cart_id);
          });
          if (arrIds.length == 0) {
            common_vendor.index.showToast({
              title: "请选择商品",
              icon: "none"
            });
            return false;
          }
          let delivery = self.orderType == "takeout" ? 10 : 20;
          common_vendor.index.hideLoading();
          common_vendor.index.navigateTo({
            url: "/pages/order/confirm-order?order_type=cart&cart_ids=" + arrIds.join(",") + "&delivery=" + delivery + "&shop_supplier_id=" + self.shop_supplier_id + "&cart_type=0&dinner_type=" + delivery
          });
        }
      );
    },
    gotoDetail(e) {
      let delivery = this.orderType == "takeout" ? 10 : 20;
      common_vendor.index.navigateTo({
        url: "/pages/product/detail/detail?product_id=" + e.product_id + "&delivery=" + delivery + "&bag_type=" + this.bag_type + "&dinner_type=" + this.dinner_type + "&cart_type=" + this.cart_type
      });
    }
  }
};
if (!Array) {
  const _easycom_popup_layer2 = common_vendor.resolveComponent("popup-layer");
  _easycom_popup_layer2();
}
const _easycom_popup_layer = () => "../../../components/popup-layer/popup-layer.js";
if (!Math) {
  _easycom_popup_layer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.supplier.name),
    b: common_vendor.t($data.supplier.distance),
    c: common_vendor.o(($event) => $options.selectShop("/pages/shop/shop_storelist")),
    d: common_vendor.f($data.delivery_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "10"
      }, item == "10" ? {
        b: common_vendor.n($data.orderType == "takeout" ? "active" : ""),
        c: common_vendor.o((...args) => $options.takout && $options.takout(...args), item)
      } : {}, {
        d: item
      });
    }),
    e: common_vendor.f($data.delivery_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "20"
      }, item == "20" ? {
        b: common_vendor.n($data.orderType == "takein" ? "active" : ""),
        c: common_vendor.o((...args) => $options.takein && $options.takein(...args), item)
      } : {}, {
        d: item
      });
    }),
    f: common_vendor.f($data.reduceList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.active_name),
        b: index
      };
    }),
    g: common_vendor.f($data.goods_list, (item, index, i0) => {
      return common_vendor.e({
        a: item.products.length != 0
      }, item.products.length != 0 ? common_vendor.e({
        b: item.images
      }, item.images ? {
        c: item.images.file_path
      } : {}, {
        d: common_vendor.t(item.name),
        e: $options.menuCartNum(item.category_id)
      }, $options.menuCartNum(item.category_id) ? {
        f: common_vendor.t($options.menuCartNum(item.category_id))
      } : {}, {
        g: `menu-${item.category_id}`,
        h: item.category_id === $data.currentCateId ? 1 : "",
        i: common_vendor.o(($event) => $options.handleMenuTap(item.category_id), index)
      }) : {}, {
        j: index
      });
    }),
    h: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    i: $data.menuScrollIntoView,
    j: common_vendor.f($data.goods_list, (item, index, i0) => {
      return common_vendor.e({
        a: item.products.length != 0
      }, item.products.length != 0 ? {
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.products, (good, key, i1) => {
          return common_vendor.e({
            a: good.product_image,
            b: common_vendor.t(good.product_name),
            c: common_vendor.t(good.selling_point),
            d: common_vendor.t(good.product_price),
            e: good.product_price * 1 != good.line_price * 1
          }, good.product_price * 1 != good.line_price * 1 ? {
            f: common_vendor.t(good.line_price * 1)
          } : {}, {
            g: good.spec_types == 20
          }, good.spec_types == 20 ? common_vendor.e({
            h: common_vendor.o(($event) => $options.gotoDetail(good), key),
            i: good.cart_num != 0
          }, good.cart_num != 0 ? {
            j: common_vendor.t(good.cart_num)
          } : {}) : common_vendor.e({
            k: good.cart_num != 0
          }, good.cart_num != 0 ? {
            l: common_vendor.o(($event) => $options.reduceFunc(good), key)
          } : {}, {
            m: good.cart_num != 0
          }, good.cart_num != 0 ? {
            n: common_vendor.t(good.cart_num)
          } : {}, {
            o: common_vendor.o(($event) => $options.addCart(good), key)
          }), {
            p: common_vendor.o(($event) => $options.gotoDetail(good), key),
            q: key
          });
        }),
        d: `cate-${item.category_id}`
      } : {}, {
        e: index
      });
    }),
    k: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    l: $data.cateScrollTop,
    m: common_vendor.o((...args) => $options.handleGoodsScroll && $options.handleGoodsScroll(...args)),
    n: $data.cart_total_num > 0
  }, $data.cart_total_num > 0 ? common_vendor.e({
    o: common_vendor.o((...args) => $options.openCartPopup && $options.openCartPopup(...args)),
    p: common_vendor.t($data.cart_total_num),
    q: common_vendor.t($data.total_price),
    r: common_vendor.t($data.line_price),
    s: $data.total_bag_price != 0
  }, $data.total_bag_price != 0 ? {
    t: common_vendor.t($data.total_bag_price)
  } : {}, {
    v: $data.min_money_diff <= 0 || $data.orderType != "takeout"
  }, $data.min_money_diff <= 0 || $data.orderType != "takeout" ? {
    w: common_vendor.o((...args) => $options.toPay && $options.toPay(...args))
  } : {}, {
    x: $data.min_money_diff > 0 && $data.total_price == 0 && $data.orderType == "takeout"
  }, $data.min_money_diff > 0 && $data.total_price == 0 && $data.orderType == "takeout" ? {
    y: common_vendor.t("￥" + $data.min_money + "起送")
  } : {}, {
    z: $data.min_money_diff > 0 && $data.total_price != 0 && $data.orderType == "takeout"
  }, $data.min_money_diff > 0 && $data.total_price != 0 && $data.orderType == "takeout" ? {
    A: common_vendor.t("还差￥" + $data.min_money_diff + "起送")
  } : {}) : {}, {
    B: $data.cart_total_num > 0
  }, $data.cart_total_num > 0 ? common_vendor.e({
    C: $data.reduce && ($data.reduce.now || $data.reduce.next)
  }, $data.reduce && ($data.reduce.now || $data.reduce.next) ? common_vendor.e({
    D: $data.reduce.now
  }, $data.reduce.now ? {
    E: common_vendor.t($data.reduce.now.active_name)
  } : {}, {
    F: $data.reduce.next
  }, $data.reduce.next ? {
    G: common_vendor.t($data.reduce.next.active_name),
    H: common_vendor.t($data.reduce_diff_value),
    I: common_vendor.t($data.reduce.next.full_type == 1 ? "元" : "件")
  } : {}) : {}, {
    J: common_vendor.o((...args) => $options.handleCartClear && $options.handleCartClear(...args)),
    K: common_vendor.f($data.cart_list, (item, index, i0) => {
      return common_vendor.e({
        a: item.product_num > 0
      }, item.product_num > 0 ? common_vendor.e({
        b: item.image.file_path,
        c: common_vendor.t(item.product.product_name),
        d: common_vendor.t(item.describe),
        e: common_vendor.t(item.price),
        f: $data.bag_type != 1
      }, $data.bag_type != 1 ? {
        g: common_vendor.t(item.bag_price)
      } : {}, {
        h: common_vendor.o(($event) => $options.cartReduce(item), index),
        i: common_vendor.t(item.product_num),
        j: common_vendor.o(($event) => $options.cartAdd(item), index)
      }) : {}, {
        k: index
      });
    }),
    L: common_vendor.p({
      direction: "top",
      ["show-pop"]: $data.cartPopupVisible
    })
  }) : {}, {
    M: _ctx.theme(),
    N: common_vendor.n(_ctx.theme() || ""),
    O: $data.loading
  }, $data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/product/list/takeaway.vue"]]);
wx.createPage(MiniProgramPage);
