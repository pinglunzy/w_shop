"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_utils = require("../../../common/utils.js");
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
      total_bag_price: 0,
      cart_list: [],
      orderType: "takein",
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
      addclock: false,
      longitude: 0,
      latitude: 0,
      bag_type: 1,
      shop_supplier_id: 0,
      /* 10配送20自提30店内 */
      dinner_type: 30,
      cart_type: 1,
      table_id: 0,
      order_id: 0,
      addorder_id: 0,
      reduceList: [],
      reduce: {},
      reduce_diff_value: 0,
      line_price: 0,
      isFirst: true,
      store_set: [],
      num: 1,
      table_detail: null,
      options: {},
      settle_type: 0
    };
  },
  onLoad(e) {
    let self = this;
    let scene = common_utils.utils.getSceneData(e);
    self.options = e;
    self.shop_supplier_id = e.shop_supplier_id ? e.shop_supplier_id : scene.sid;
    self.table_id = e.table_id ? e.table_id : scene.tid;
    if (!self.table_id) {
      self.table_id = 0;
    }
    if (!self.shop_supplier_id) {
      self.shop_supplier_id = common_vendor.index.getStorageSync("selectedId") ? common_vendor.index.getStorageSync("selectedId") : 0;
    }
    self.num = e.num || 0;
    self.addorder_id = e.order_id || 0;
    common_vendor.index.setNavigationBarTitle({
      title: self.table_id == 0 ? "快餐模式" : "堂食点餐"
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
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    scrollInit() {
      let self = this;
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
    takout() {
      if (this.orderType == "takeout")
        return;
      this.orderType = "takeout";
      this.dinner_type = 10;
      this.init();
    },
    takein() {
      if (this.orderType == "takein")
        return;
      this.orderType = "takein";
      this.dinner_type = 20;
      this.init();
    },
    init() {
      this.addclock = false;
      this.category = {};
      this.good = {};
      this.goodDetailModalVisible = false;
      this.clock = false;
      this.loading = true;
      this.isLoading = true;
      this.getCategory();
      this.sizeCalcState = false;
    },
    /* 获取商品类型 */
    getCategory() {
      let self = this;
      this.sizeCalcState = false;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._get(
        "product.category/index",
        {
          /* 0外卖分类，1堂食分类 */
          type: 1,
          shop_supplier_id: self.shop_supplier_id,
          longitude: 0,
          latitude: 0,
          table_id: self.table_id,
          /* 30 打包 40店内 */
          delivery: self.orderType == "takeout" ? 30 : 40,
          order_type: self.table_id == 0 ? 1 : 2
        },
        function(res) {
          self.settle_type = res.data.supplier.settle_type;
          self.reduceList = res.data.reduceList;
          self.goods_list = res.data.list;
          self.supplier = res.data.supplier;
          self.store_set = res.data.supplier.store_set;
          if (self.table_id != 0) {
            self.orderType = "takein";
          } else if (self.isFirst && self.orderType == "") {
            if (self.store_set.indexOf(30) != -1) {
              self.orderType = "takeout";
            } else {
              self.orderType = "takein";
            }
            self.isFirst = false;
          }
          self.shop_supplier_id = res.data.supplier.shop_supplier_id;
          self.bag_type = res.data.supplier.storebag_type;
          self.loading = false;
          self.isLoading = false;
          self.$nextTick(function() {
            self.scrollInit();
          });
          if (self.getUserId()) {
            self.getCart();
          }
          common_vendor.index.hideLoading();
        },
        function() {
          self.gotoPage("/pages/index/index");
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
    reCart(res) {
      let self = this;
      self.cart_total_num = res.data.cartInfo.cart_total_num;
      self.total_price = res.data.cartInfo.total_pay_price;
      self.line_price = res.data.cartInfo.total_line_money;
      self.total_bag_price = res.data.cartInfo.total_bag_price;
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
        shop_supplier_id: self.shop_supplier_id,
        table_id: self.table_id,
        cart_type: 1,
        dinner_type: self.dinner_type,
        product_price: goods.sku[0].line_price,
        delivery: self.orderType == "takeout" ? 30 : 40
      };
      self.addclock = true;
      let url = "order.cart/add";
      self._post(
        url,
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
      self.addclock = true;
      let url = "order.cart/productSub";
      self._post(
        url,
        {
          product_id,
          type: "down",
          cart_type: 1,
          shop_supplier_id: self.shop_supplier_id,
          table_id: self.table_id,
          dinner_type: self.dinner_type,
          delivery: self.orderType == "takeout" ? 30 : 40
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
      common_vendor.index.showLoading({
        title: "加载中",
        mask: true
      });
      self.getFastCart();
    },
    getFastCart() {
      let self = this;
      self._get(
        "order.cart/lists",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 1,
          delivery: self.orderType == "takeout" ? 30 : 40
        },
        function(res) {
          common_vendor.index.hideLoading();
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
      let url = "order.cart/sub";
      self._post(
        url,
        {
          product_id,
          total_num,
          cart_id: goods.cart_id,
          type: "up",
          cart_type: 1,
          dinner_type: self.dinner_type,
          shop_supplier_id: self.shop_supplier_id,
          table_id: self.table_id,
          delivery: self.orderType == "takeout" ? 30 : 40
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
      let url = "order.cart/sub";
      self._post(
        url,
        {
          product_id,
          total_num: 1,
          cart_id: goods.cart_id,
          type: "down",
          cart_type: 1,
          dinner_type: self.dinner_type,
          shop_supplier_id: self.shop_supplier_id,
          table_id: self.table_id,
          delivery: self.orderType == "takeout" ? 30 : 40
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
    //清空购物车
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
    /*  清空 */
    clearCart() {
      let self = this;
      let url = "order.cart/delete";
      let params = {
        shop_supplier_id: self.shop_supplier_id,
        cart_type: 1
      };
      self._post(url, params, function(res) {
        self.cartPopupVisible = false;
        self.cart_list = [];
        self.init();
      });
    },
    /* 提交 */
    toPay() {
      let self = this;
      self.fastToPay();
    },
    /* 快餐结算 */
    fastToPay() {
      let self = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let delivery = self.orderType == "takeout" ? 30 : 40;
      self._get(
        "order.cart/lists",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 1,
          delivery
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
          common_vendor.index.hideLoading();
          common_vendor.index.navigateTo({
            url: "/pages/order/confirm-order?order_type=cart&cart_ids=" + arrIds.join(",") + "&delivery=" + delivery + "&shop_supplier_id=" + self.shop_supplier_id + "&cart_type=1&dinner_type=30&table_id=" + self.table_id
          });
        }
      );
    },
    submitOrder(arrIds) {
      let self = this;
      let params = {
        delivery: self.orderType == "takeout" ? 30 : 40,
        linkman: "",
        phone: "",
        remark: "",
        mealtime: "",
        meal_num: self.num,
        cart_ids: arrIds.join(",") || 0,
        dinner_type: self.dinner_type,
        shop_supplier_id: self.shop_supplier_id || 0,
        order_type: 1,
        table_id: self.table_id
      };
      self._post(
        "order.order/tableBuy",
        params,
        function(res) {
          self.order_id = res.data.order_id;
          self.gotoPage("/pages/order/store_order?order_id=" + self.order_id + "&pnum=" + self.num);
        },
        function(err) {
          self.init();
        }
      );
    },
    /* 加餐 */
    addpay() {
      let self = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self.addpayFunc();
    },
    /* 快餐模式加餐 */
    addpayFunc() {
      let self = this;
      self._get(
        "order.cart/lists",
        {
          shop_supplier_id: self.shop_supplier_id,
          cart_type: 1,
          delivery: self.orderType == "takeout" ? 30 : 40
        },
        function(res) {
          self.cart_total_num = res.data.cartInfo.cart_total_num;
          self.total_price = res.data.cartInfo.total_price;
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
          common_vendor.index.hideLoading();
          let url = "/pages/order/addorder?order_type=cart&cart_ids=" + arrIds.join(",") + "&delivery=40&shop_supplier_id=" + self.shop_supplier_id + "&cart_type=1&dinner_type=30&table_id=" + self.table_id + "&order_id=" + self.addorder_id;
          self.gotoPage(url);
        }
      );
    },
    /* 堂食模式加餐 */
    tableAddOrder(arrIds) {
      let self = this;
      let params = {
        delivery: self.orderType == "takeout" ? 30 : 40,
        linkman: "",
        phone: "",
        remark: "",
        mealtime: "",
        meal_num: self.num,
        cart_ids: arrIds.join(",") || 0,
        dinner_type: self.dinner_type,
        shop_supplier_id: self.shop_supplier_id || 0,
        order_type: 1,
        table_id: self.table_id,
        order_id: self.order_id
      };
      self._post(
        "order.order/tableAddMeal",
        params,
        function(res) {
          self.order_id = res.data.order_id;
          self.gotoPage("/pages/order/store_order?order_id=" + self.order_id + "&pnum=" + self.num);
        },
        function(err) {
          self.init();
        }
      );
    },
    gotoDetail(e) {
      let self = this;
      let delivery = self.orderType == "takeout" ? 30 : 40;
      let url = "/pages/product/detail/detail?product_id=" + e.product_id + "&delivery=" + delivery + "&bag_type=" + this.bag_type + "&dinner_type=" + this.dinner_type + "&cart_type=" + this.cart_type;
      if (self.table_id != 0) {
        url = url + "&table_id=" + this.table_id;
      }
      common_vendor.index.navigateTo({
        url
      });
    },
    //点击菜单项事件
    handleMenuTap(id) {
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      this.currentCateId = id;
      this.$nextTick(() => this.cateScrollTop = this.goods_list.find((item) => item.category_id == id).top);
    },
    //商品列表滚动事件
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
    //打开商品详情模态框
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
    //关闭商品详情模态框
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
    //打开/关闭购物车列表popup
    openCartPopup() {
      this.getCart();
      this.cartPopupVisible = !this.cartPopupVisible;
    },
    time_to_sec(time) {
      if (time !== null) {
        var s = "";
        var hour = time.split(":")[0];
        var min = time.split(":")[1];
        s = Number(hour * 3600) + Number(min * 60);
        return s;
      }
    }
  }
};
if (!Array) {
  const _component_u_icon = common_vendor.resolveComponent("u-icon");
  const _easycom_popup_layer2 = common_vendor.resolveComponent("popup-layer");
  (_component_u_icon + _easycom_popup_layer2)();
}
const _easycom_popup_layer = () => "../../../components/popup-layer/popup-layer.js";
if (!Math) {
  _easycom_popup_layer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.table_id != 0 && $data.table_detail
  }, $data.table_id != 0 && $data.table_detail ? common_vendor.e({
    b: common_vendor.t($data.table_detail.table_no),
    c: $data.order_id
  }, $data.order_id ? {
    d: common_vendor.o(($event) => _ctx.gotoPage("/pages/order/store_order?order_id=" + $data.order_id + "&pnum=" + $data.num))
  } : {}, {
    e: common_vendor.t($data.num),
    f: common_vendor.p({
      name: "edit-pen-fill",
      size: "19"
    }),
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  }) : {}, {
    h: common_vendor.t($data.supplier.name),
    i: $data.table_id == 0
  }, $data.table_id == 0 ? {
    j: common_vendor.f($data.store_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "30"
      }, item == "30" ? {
        b: common_vendor.n($data.orderType == "takeout" ? "active" : ""),
        c: common_vendor.o((...args) => $options.takout && $options.takout(...args), item)
      } : {}, {
        d: item
      });
    }),
    k: common_vendor.f($data.store_set, (item, index, i0) => {
      return common_vendor.e({
        a: item == "40"
      }, item == "40" ? {
        b: common_vendor.n($data.orderType == "takein" ? "active" : ""),
        c: common_vendor.o((...args) => $options.takein && $options.takein(...args), item)
      } : {}, {
        d: item
      });
    })
  } : {}, {
    l: $data.table_id == 0
  }, $data.table_id == 0 ? {
    m: common_vendor.f($data.reduceList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.active_name),
        b: index
      };
    })
  } : {}, {
    n: common_vendor.f($data.goods_list, (item, index, i0) => {
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
    o: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    p: $data.menuScrollIntoView,
    q: common_vendor.f($data.goods_list, (item, index, i0) => {
      return common_vendor.e({
        a: item.products.length != 0
      }, item.products.length != 0 ? {
        b: common_vendor.t(item.name),
        c: common_vendor.f(item.products, (good, key, i1) => {
          return common_vendor.e({
            a: good.product_image,
            b: common_vendor.t(good.product_name),
            c: common_vendor.t(good.selling_point),
            d: common_vendor.t(good.product_price * 1),
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
    r: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    s: $data.cateScrollTop,
    t: common_vendor.o((...args) => $options.handleGoodsScroll && $options.handleGoodsScroll(...args)),
    v: $data.cart_total_num > 0
  }, $data.cart_total_num > 0 ? common_vendor.e({
    w: common_vendor.o((...args) => $options.openCartPopup && $options.openCartPopup(...args)),
    x: common_vendor.t($data.cart_total_num),
    y: common_vendor.t($data.total_price),
    z: common_vendor.t($data.line_price),
    A: $data.total_bag_price != 0
  }, $data.total_bag_price != 0 ? {
    B: common_vendor.t($data.total_bag_price)
  } : {}, {
    C: $data.table_id != 0
  }, $data.table_id != 0 ? common_vendor.e({
    D: $data.order_id == 0
  }, $data.order_id == 0 ? {
    E: common_vendor.o((...args) => $options.toPay && $options.toPay(...args))
  } : {
    F: common_vendor.o((...args) => $options.addpay && $options.addpay(...args))
  }) : common_vendor.e({
    G: $data.addorder_id == 0
  }, $data.addorder_id == 0 ? {
    H: common_vendor.o((...args) => $options.toPay && $options.toPay(...args))
  } : {
    I: common_vendor.o((...args) => $options.addpay && $options.addpay(...args))
  })) : {}, {
    J: $data.cart_total_num > 0
  }, $data.cart_total_num > 0 ? common_vendor.e({
    K: $data.reduce && $data.table_id == 0
  }, $data.reduce && $data.table_id == 0 ? common_vendor.e({
    L: $data.reduce.now
  }, $data.reduce.now ? common_vendor.e({
    M: common_vendor.t($data.reduce.now.active_name),
    N: $data.reduce.next
  }, $data.reduce.next ? {} : {}) : {}, {
    O: $data.reduce.next
  }, $data.reduce.next ? {
    P: common_vendor.t($data.reduce.next.active_name),
    Q: common_vendor.t($data.reduce_diff_value),
    R: common_vendor.t($data.reduce.next.full_type == 1 ? "元" : "件")
  } : {}) : {}, {
    S: common_vendor.o((...args) => $options.handleCartClear && $options.handleCartClear(...args)),
    T: common_vendor.f($data.cart_list, (item, index, i0) => {
      return common_vendor.e({
        a: item.product_num > 0
      }, item.product_num > 0 ? common_vendor.e({
        b: item.image.file_path,
        c: common_vendor.t(item.product.product_name),
        d: common_vendor.t(item.describe),
        e: common_vendor.t(item.price),
        f: $data.bag_type != 1 && item.bag_price > 0 && $data.orderType == "takeout"
      }, $data.bag_type != 1 && item.bag_price > 0 && $data.orderType == "takeout" ? {
        g: common_vendor.t(item.bag_price)
      } : {}, {
        h: common_vendor.o(($event) => $options.cartReduce(item), index),
        i: common_vendor.t(item.product_num),
        j: common_vendor.o(($event) => $options.cartAdd(item), index)
      }) : {}, {
        k: index
      });
    }),
    U: common_vendor.p({
      direction: "top",
      ["show-pop"]: $data.cartPopupVisible
    })
  }) : {}, {
    V: _ctx.theme(),
    W: common_vendor.n(_ctx.theme() || ""),
    X: $data.loading
  }, $data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/product/list/store.vue"]]);
wx.createPage(MiniProgramPage);
