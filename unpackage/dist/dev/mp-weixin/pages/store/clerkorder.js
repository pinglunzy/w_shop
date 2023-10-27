"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      /*是否显示支付类别弹窗*/
      isPayPopup: false,
      /*订单id*/
      order_no: 0,
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
      extractStore: {}
    };
  },
  components: {},
  onLoad(e) {
    this.order_no = e.order_no;
  },
  mounted() {
    this.getData();
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._get(
        "store.order/detail",
        {
          order_no: self.order_no
        },
        function(res) {
          self.detail = res.data.order;
          self.extractStore = res.data.order.extractStore;
          common_vendor.index.hideLoading();
        },
        function(res) {
          common_vendor.index.switchTab({
            url: "/pages/user/my_shop/my_shop"
          });
        }
      );
    },
    /*核销*/
    onSubmitExtract(order_id) {
      let self = this;
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定要核销吗?",
        success: function(o) {
          o.confirm && self._post(
            "store.order/extract",
            {
              order_id
            },
            function(res) {
              common_vendor.index.showToast({
                title: res.msg,
                duration: 2e3,
                icon: "success"
              });
              setTimeout(function() {
                self.getData();
              }, 2e3);
            }
          );
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.detail.state_text),
    b: $data.detail.delivery_type.value == 20
  }, $data.detail.delivery_type.value == 20 ? {
    c: common_vendor.t($data.extractStore.store_name),
    d: common_vendor.t($data.extractStore.phone),
    e: common_vendor.t($data.extractStore.region.province),
    f: common_vendor.t($data.extractStore.region.city),
    g: common_vendor.t($data.extractStore.region.region),
    h: common_vendor.t($data.extractStore.address)
  } : {}, {
    i: common_vendor.f($data.detail.product, (item, index, i0) => {
      return {
        a: item.image.file_path,
        b: common_vendor.t(item.product_name),
        c: common_vendor.t(item.product_price),
        d: common_vendor.t(item.total_num),
        e: index
      };
    }),
    j: common_vendor.t($data.detail.order_no),
    k: common_vendor.t($data.detail.create_time),
    l: common_vendor.t($data.detail.pay_type.text),
    m: common_vendor.t($data.detail.delivery_type.text),
    n: common_vendor.t($data.detail.order_price),
    o: common_vendor.t($data.detail.express_price),
    p: common_vendor.t($data.detail.order_price),
    q: $data.detail.order_status.value != 20
  }, $data.detail.order_status.value != 20 ? common_vendor.e({
    r: $data.detail.pay_status.value == 20 && $data.detail.delivery_type.value == 20 && $data.detail.delivery_status.value == 10
  }, $data.detail.pay_status.value == 20 && $data.detail.delivery_type.value == 20 && $data.detail.delivery_status.value == 10 ? {
    s: common_vendor.o(($event) => $options.onSubmitExtract($data.detail.order_id))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3647fb18"], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/store/clerkorder.vue"]]);
wx.createPage(MiniProgramPage);
