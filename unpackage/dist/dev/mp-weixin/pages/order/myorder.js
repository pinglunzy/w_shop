"use strict";
const common_vendor = require("../../common/vendor.js");
const Popup = () => "../../components/uni-popup.js";
const uniLoadMore = () => "../../components/uni-load-more.js";
const _sfc_main = {
  components: {
    Popup,
    uniLoadMore
  },
  data() {
    return {
      checkedPay: [10, 20],
      order_type: 0,
      /*手机高度*/
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollviewHigh: 0,
      /*状态选中*/
      state_active: 0,
      /*顶部刷新*/
      topRefresh: false,
      /*数据*/
      listData: [],
      /*数据类别*/
      dataType: 0,
      /*是否显示支付类别弹窗*/
      isPayPopup: false,
      /*订单id*/
      order_id: 0,
      /*最后一页码数*/
      last_page: 0,
      /*当前页面*/
      page: 1,
      /*每页条数*/
      list_rows: 10,
      /*有没有等多*/
      no_more: false,
      /*是否正在加载*/
      loading: true,
      /*是否显示核销二维码*/
      isCodeImg: false,
      codeImg: "",
      /*是否显示支付宝支付，只有在h5，非微信内打开才显示*/
      showAlipay: false,
      isfirst: false,
      statusBarHeight: 0,
      titleBarHeight: 0,
      delivery_type: 10
    };
  },
  computed: {
    /*加载中状态*/
    loadingType() {
      if (this.loading) {
        return 1;
      } else {
        if (this.listData.length != 0 && this.no_more) {
          return 2;
        } else {
          return 0;
        }
      }
    }
  },
  onReady(e) {
    this.init();
  },
  mounted() {
  },
  onShow() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      let self = this;
      self.page = 1;
      self.listData = [];
      self.no_more = false;
    },
    /*初始化*/
    init() {
      let self = this;
      common_vendor.index.getSystemInfo({
        success(res) {
          self.phoneHeight = res.windowHeight;
          let view = common_vendor.index.createSelectorQuery().in(self).select(".top-tabbar");
          view.boundingClientRect((data) => {
            let h = self.phoneHeight - data.height;
            self.scrollviewHigh = h;
          }).exec();
        }
      });
    },
    ordertypeFunc(e) {
      let self = this;
      if (self.loading) {
        return;
      }
      if (self.order_type != e && e == 0) {
        self.page = 1;
        self.loading = true;
        this.order_type = e;
        self.listData = [];
        this.delivery_type = 10;
        this.dataType = 0;
        self.getData();
      } else if (self.order_type != e && e == 1) {
        self.page = 1;
        self.loading = true;
        self.listData = [];
        this.order_type = e;
        this.delivery_type = 40;
        this.dataType = 0;
        self.getData();
      }
    },
    /*状态切换*/
    orderStateFunc(e) {
      let self = this;
      if (self.loading) {
        return;
      }
      if (self.delivery_type != e) {
        self.page = 1;
        self.loading = true;
        self.listData = [];
        self.delivery_type = e;
        self.getData();
      }
    },
    /*可滚动视图区域到底触发*/
    scrolltolowerFunc() {
      let self = this;
      if (self.no_more) {
        return;
      }
      self.page++;
      if (self.page <= self.last_page) {
        self.getData();
      } else {
        self.no_more = true;
      }
    },
    /*获取数据*/
    getData() {
      if (!this.getUserId()) {
        this.loading = false;
        return;
      }
      let self = this;
      self.loading = true;
      self._get(
        "user.order/lists",
        {
          dataType: self.dataType,
          page: self.page,
          list_rows: self.list_rows,
          order_type: self.order_type,
          delivery_type: self.delivery_type
        },
        function(res) {
          self.loading = false;
          self.listData = self.listData.concat(res.data.list.data);
          self.last_page = res.data.list.last_page;
          if (res.data.list.last_page <= 1) {
            self.no_more = true;
          } else {
            self.no_more = false;
          }
          self.isfirst = true;
        }
      );
    },
    /*跳转页面*/
    gotoOrder(e) {
      this.gotoPage("/pages/order/order-detail?order_id=" + e);
    },
    /*支付方式选择*/
    onPayOrder(orderId) {
      let self = this;
      let pages = "/pages/order/cashier?order_type=10&order_id=" + orderId;
      self.gotoPage(pages, "reLaunch");
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
                self.listData = [];
                self.getData();
              }
            );
          } else {
            common_vendor.index.showToast({
              title: "取消收货",
              duration: 1e3,
              icon: "none"
            });
          }
        }
      });
    },
    /*取消订单*/
    cancelOrder(e) {
      let self = this;
      let order_id = e;
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要取消吗?",
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
                self.listData = [];
                self.getData();
              }
            );
          }
        }
      });
    },
    addOrder(order_id, store_id) {
      common_vendor.index.setStorageSync("selectedId", store_id);
      this.gotoPage("pages/product/list/store?order_id=" + order_id);
    },
    /*去评论*/
    gotoEvaluate(e) {
      common_vendor.index.navigateTo({
        url: "/pages/order/evaluate/evaluate?order_id=" + e
      });
    },
    /*核销码*/
    onQRCode(e) {
      let self = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let order_id = e;
      let source = self.getPlatform();
      self._get(
        "user.order/qrcode",
        {
          order_id,
          source
        },
        function(res) {
          common_vendor.index.hideLoading();
          self.isCodeImg = true;
          self.codeImg = res.data.qrcode;
        }
      );
    },
    /*关闭核销二维码*/
    hideCodePopupFunc() {
      this.isCodeImg = false;
    },
    /*分享拼团*/
    gotoAssembleShare(e) {
      common_vendor.index.navigateTo({
        url: "/pages/plus/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=" + e
      });
    },
    gohome() {
      this.gotoPage("/pages/index/index");
    }
  }
};
if (!Array) {
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  const _component_Popup = common_vendor.resolveComponent("Popup");
  (_component_uni_load_more + _component_Popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.s("height:" + _ctx.topBarTop() + "px;"),
    b: common_vendor.n($data.order_type == 0 ? "tab-item-top active" : "tab-item-top"),
    c: common_vendor.o(($event) => $options.ordertypeFunc(0)),
    d: common_vendor.n($data.order_type == 1 ? "tab-item-top active" : "tab-item-top"),
    e: common_vendor.o(($event) => $options.ordertypeFunc(1)),
    f: common_vendor.s(_ctx.topBarHeight() == 0 ? "" : "height:" + _ctx.topBarHeight() + "px;"),
    g: $data.order_type == 0
  }, $data.order_type == 0 ? {
    h: common_vendor.n($data.delivery_type == 10 ? "tab-item active" : "tab-item"),
    i: common_vendor.o(($event) => $options.orderStateFunc(10)),
    j: common_vendor.n($data.delivery_type == 20 ? "tab-item active" : "tab-item"),
    k: common_vendor.o(($event) => $options.orderStateFunc(20))
  } : {}, {
    l: $data.order_type == 1
  }, $data.order_type == 1 ? {
    m: common_vendor.n($data.delivery_type == 40 ? "tab-item active" : "tab-item"),
    n: common_vendor.o(($event) => $options.orderStateFunc(40)),
    o: common_vendor.n($data.delivery_type == 30 ? "tab-item active" : "tab-item"),
    p: common_vendor.o(($event) => $options.orderStateFunc(30))
  } : {}, {
    q: common_vendor.f(3, (circle, n, i0) => {
      return {
        a: n
      };
    }),
    r: common_vendor.n($data.topRefresh ? "top-refresh open" : "top-refresh"),
    s: common_vendor.f($data.listData, (item, index, i0) => {
      return common_vendor.e({
        a: item.supplier.logo || "/static/default.png",
        b: item.supplier
      }, item.supplier ? {
        c: common_vendor.t(item.supplier.name)
      } : {}, {
        d: common_vendor.t(item.state_text),
        e: common_vendor.t(item.create_time),
        f: common_vendor.f(item.product, (img, num, i1) => {
          return {
            a: img.image ? img.image.file_path : "",
            b: common_vendor.t(img.product_name),
            c: num
          };
        }),
        g: item.order_status.value == 10
      }, item.order_status.value == 10 ? common_vendor.e({
        h: item.pay_status.value == 10 && item.order_source != 30
      }, item.pay_status.value == 10 && item.order_source != 30 ? {
        i: common_vendor.o(($event) => $options.cancelOrder(item.order_id), index)
      } : {}, {
        j: item.pay_status.value == 10
      }, item.pay_status.value == 10 ? {
        k: common_vendor.o(($event) => $options.onPayOrder(item.order_id), index)
      } : {}, {
        l: item.pay_status.value == 10 && item.delivery_type == 40
      }, item.pay_status.value == 10 && item.delivery_type == 40 ? {
        m: common_vendor.o(($event) => $options.addOrder(item.order_id, item.supplier.shop_supplier_id), index)
      } : {}) : {}, {
        n: index,
        o: common_vendor.o(($event) => $options.gotoOrder(item.order_id), index)
      });
    }),
    t: $data.listData.length == 0 && !$data.loading
  }, $data.listData.length == 0 && !$data.loading ? {
    v: common_vendor.o(($event) => _ctx.gotoPage("/pages/index/index"))
  } : {
    w: common_vendor.p({
      loadingType: $options.loadingType
    })
  }, {
    x: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    y: common_vendor.o((...args) => $options.scrolltolowerFunc && $options.scrolltolowerFunc(...args)),
    z: $data.codeImg,
    A: common_vendor.o($options.hideCodePopupFunc),
    B: common_vendor.p({
      show: $data.isCodeImg,
      type: "middle"
    }),
    C: _ctx.theme(),
    D: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/order/myorder.vue"]]);
wx.createPage(MiniProgramPage);
