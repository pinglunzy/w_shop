"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_utils = require("../../../common/utils.js");
const _sfc_main = {
  components: {},
  data() {
    return {
      detail: {
        product_attr: [],
        product_feed: [],
        sku: []
      },
      /*是否可见*/
      Visible: false,
      /*表单对象*/
      form: {
        attr: [],
        product_sku_id: [],
        feed: [],
        detail: {},
        show_sku: {
          sku_image: "",
          bag_price: ""
        },
        shop_supplier_id: 0
      },
      /*当前商品总库存*/
      stock: 0,
      /*选择提示*/
      selectSpec: "",
      /*是否打开过多规格选择框*/
      isOpenSpec: false,
      type: "",
      product_price: "",
      feed_price: 0,
      space_name: "",
      attr_name: [],
      feed_name: [],
      product_lineprice: "",
      delivery: "",
      bag_type: 1,
      dinner_type: 20,
      cart_type: 0,
      table_id: 0,
      clock: false,
      discount_price: 0
    };
  },
  computed: {
    price: function() {
      if (this.discount_price) {
        return ((this.discount_price * 1 + this.product_price * 1) * this.form.show_sku.sum).toFixed(2);
      } else {
        return ((this.feed_price * 1 + this.product_price * 1) * this.form.show_sku.sum).toFixed(2);
      }
    },
    lineprice: function() {
      return ((this.feed_price * 1 + this.product_lineprice * 1) * this.form.show_sku.sum).toFixed(2);
    },
    /*判断增加数量*/
    isadd: function() {
      return this.form.show_sku.sum >= this.stock || this.form.show_sku.sum >= this.form.detail.limit_num;
    },
    /*判断减少数量*/
    issub: function() {
      return this.form.show_sku.sum <= 1;
    }
  },
  watch: {},
  onLoad(e) {
    this.product_id = e.product_id;
    this.delivery = e.delivery;
    this.bag_type = e.bag_type;
    this.dinner_type = e.dinner_type;
    this.cart_type = e.cart_type;
    this.table_id = e.table_id || 0;
    this.shop_supplier_id = e.shop_supplier_id || 0;
  },
  onShow() {
    this.getData();
  },
  methods: {
    bag_price: function() {
      let price = this.form.show_sku.bag_price * this.form.show_sku.sum;
      return price.toFixed(2);
    },
    goback() {
      common_vendor.index.navigateBack();
    },
    getData() {
      let self = this;
      self._get("product.product/detail", {
        product_id: self.product_id,
        table_id: self.table_id || 0,
        shop_supplier_id: self.shop_supplier_id || 0
      }, (res) => {
        if (!res.data.detail) {
          self.showError("商品已下架", () => {
            common_vendor.index.navigateBack();
          });
          return;
        }
        res.data.detail.content = common_utils.utils.format_content(res.data.detail.content);
        self.detail = res.data.detail;
        this.showGoodDetailModal();
      });
    },
    showGoodDetailModal() {
      let self = this;
      this.detail.sku.forEach((item, index) => {
        item.checked = false;
      });
      let obj = {
        specData: this.detail.sku,
        detail: this.detail,
        shop_supplier_id: this.detail.shop_supplier_id,
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
      self.form = obj;
      self.space_name = "";
      self.attr_name = [];
      self.feed_name = [];
      self.isOpenSpec = true;
      self.initShowSku();
      if (self.form.detail.sku[0].checked == false) {
        self.selecedtSpec(self.form.detail.sku[0], 0);
      }
      if (self.form.detail.product_attr == "") {
        return;
      }
      self.form.detail.product_attr.forEach((item, index) => {
        if (!self.form.show_sku.attr[index]) {
          self.selectAttr(item.attribute_value[0], 0, index);
        }
      });
    },
    describe: function() {
      let space_name = this.space_name;
      if (space_name != "") {
        space_name += ";";
      }
      let attr_name = this.attr_name.join(";");
      if (attr_name != "") {
        attr_name += ";";
      }
      let feed_name = this.feed_name.join(",");
      if (feed_name != "") {
        feed_name += ";";
      }
      return space_name + attr_name + feed_name;
    },
    /*初始化*/
    initShowSku() {
      this.form.show_sku.sku_image = this.form.detail.product_image;
      this.form.show_sku.product_price = this.form.detail.product_price;
      this.form.show_sku.bag_price = this.form.detail.bag_price;
      this.form.show_sku.product_sku_id = [];
      this.form.show_sku.attr = [];
      this.form.show_sku.feed = [];
      this.form.show_sku.feed.length = this.form.detail.product_feed.length;
      this.form.show_sku.line_price = this.form.detail.line_price;
      this.form.show_sku.stock_num = this.form.detail.product_stock;
      this.form.show_sku.sum = 1;
      this.stock = this.form.detail.product_stock;
    },
    /*选择属性*/
    selecedtSpec(item, index) {
      let self = this;
      if (item.checked) {
        item.checked = false;
        self.form.show_sku.product_sku_id[0] = null;
      } else {
        self.form.detail.sku.forEach((sitem, sindex) => {
          sitem.checked = false;
        });
        item.checked = true;
        self.form.show_sku.product_sku_id[0] = item.product_sku_id;
        self.space_name = item.spec_name;
        self.$set(self.form.show_sku, "product_price", item.product_price);
        self.$set(self.form.show_sku, "bag_price", item.bag_price);
        self.$set(self.form.show_sku, "line_price", item.line_price);
        self.$set(self.form.show_sku, "stock_num", item.stock_num);
      }
      if (self.form.show_sku.product_sku_id[0] == null) {
        self.initShowSku();
        return;
      }
      self.updateSpecProduct();
    },
    /*选择属性*/
    selectAttr(item, index, aindex) {
      let self = this;
      self.$set(self.form.show_sku.attr, aindex, index);
      self.attr_name[aindex] = item;
      self.updateSpecProduct();
    },
    /*选择加料*/
    selectFeed(item, index) {
      let self = this;
      if (self.form.show_sku.feed[index] || self.form.show_sku.feed[index] === 0) {
        self.$set(self.form.show_sku.feed, index, null);
        self.feed_price -= item.price * 1;
        if (item.discount_price) {
          self.discount_price -= item.discount_price;
        } else {
          self.discount_price -= 0;
        }
        let n = self.feed_name.indexOf(item.feed_name);
        if (n > -1) {
          self.feed_name.splice(n, 1);
        }
      } else {
        self.$set(self.form.show_sku.feed, index, index);
        self.feed_price += item.price * 1;
        if (item.discount_price) {
          self.discount_price += item.discount_price;
        } else {
          self.discount_price += 0;
        }
        self.feed_name.push(item.feed_name);
      }
      self.updateSpecProduct();
    },
    updateSpecProduct() {
      this.product_price = this.form.show_sku.product_price;
      console.log(this.product_lineprice);
      this.product_lineprice = this.form.show_sku.line_price;
    },
    /*商品增加*/
    add() {
      if (this.stock <= 0) {
        common_vendor.index.showToast({
          title: "商品库存不足",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.form.show_sku.sum++;
    },
    /*商品减少*/
    sub() {
      if (this.stock <= 0) {
        return;
      }
      if (this.form.show_sku.sum < 2) {
        common_vendor.index.showToast({
          title: "商品数量至少为1",
          icon: "none",
          duration: 2e3
        });
        return false;
      }
      this.form.show_sku.sum--;
    },
    /*确认提交*/
    confirmFunc() {
      if (this.clock) {
        return;
      }
      if (this.form.show_sku.product_sku_id[0] == null && this.form.detail.spec_type == 20) {
        common_vendor.index.showToast({
          title: "请选择规格",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (this.form.detail.product_attr != null) {
        for (let i = 0; i < this.form.detail.product_attr.length; i++) {
          if (this.form.show_sku.attr[i] == null) {
            common_vendor.index.showToast({
              title: "请选择属性",
              icon: "none",
              duration: 2e3
            });
            return;
          }
        }
      }
      if (this.form.show_sku.sum > this.form.show_sku.stock_num) {
        common_vendor.index.showToast({
          title: "商品库存不足",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.addCart();
    },
    /*加入购物车*/
    addCart() {
      let self = this;
      let feed = [];
      self.form.show_sku.feed.forEach((item, index) => {
        if (item != null) {
          feed.push(item);
        }
      });
      if (feed.length <= 0) {
        feed = "";
      } else {
        feed = feed.join(",");
      }
      let price = "";
      if (self.discount_price) {
        price = self.discount_price * 1 + self.product_price * 1;
      } else {
        price = self.feed_price * 1 + self.product_price * 1;
      }
      let params = {
        product_id: self.form.detail.product_id,
        product_num: self.form.show_sku.sum,
        product_sku_id: self.form.show_sku.product_sku_id[0],
        attr: self.form.show_sku.attr.join(","),
        feed,
        describe: self.describe(),
        price,
        product_price: self.feed_price * 1 + self.form.show_sku.line_price * 1,
        bag_price: self.form.show_sku.bag_price,
        shop_supplier_id: self.form.shop_supplier_id,
        cart_type: self.cart_type,
        dinner_type: self.dinner_type,
        delivery: self.delivery
      };
      let url = "order.cart/add";
      self.clock = true;
      self._post(url, params, function(res) {
        self.clock = false;
        common_vendor.index.navigateBack();
      }, (err) => {
        self.clock = false;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goback && $options.goback(...args)),
    b: common_vendor.s(_ctx.topBarHeight() == 0 ? "" : "height:" + _ctx.topBarHeight() + "px;"),
    c: common_vendor.s(_ctx.topBarHeight() == 0 ? "" : "height:" + _ctx.topBarHeight() + "px;padding-top:" + _ctx.topBarTop() + "px"),
    d: $data.detail.product_image
  }, $data.detail.product_image ? {
    e: $data.detail.product_image
  } : {}, {
    f: common_vendor.t($data.detail.product_name || ""),
    g: common_vendor.t($data.detail.product_sales || ""),
    h: common_vendor.t($data.detail.selling_point || ""),
    i: $data.detail.spec_type == 20
  }, $data.detail.spec_type == 20 ? {
    j: common_vendor.f($data.detail.sku, (value, key, i0) => {
      return {
        a: common_vendor.t(value.spec_name),
        b: common_vendor.o(($event) => $options.selecedtSpec(value, key), key),
        c: key,
        d: value.checked ? 1 : ""
      };
    })
  } : {}, {
    k: $data.detail.product_attr.length > 0
  }, $data.detail.product_attr.length > 0 ? {
    l: common_vendor.f($data.detail.product_attr, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.attribute_name || "")
      }, _ctx.value != "" ? {
        b: common_vendor.f(item.attribute_value, (value, key, i1) => {
          return {
            a: common_vendor.t(value),
            b: common_vendor.o(($event) => $options.selectAttr(value, key, index), key),
            c: key,
            d: $data.form.show_sku.attr[index] == key ? 1 : ""
          };
        })
      } : {}, {
        c: index
      });
    }),
    m: _ctx.value != ""
  } : {}, {
    n: $data.detail.product_feed.length > 0
  }, $data.detail.product_feed.length > 0 ? {
    o: common_vendor.f($data.detail.product_feed, (item, index, i0) => {
      return {
        a: common_vendor.t(item.feed_name),
        b: common_vendor.o(($event) => $options.selectFeed(item, index), index),
        c: index,
        d: $data.form.show_sku.feed[index] != null ? 1 : ""
      };
    })
  } : {}, {
    p: common_vendor.t($options.price),
    q: common_vendor.t($options.lineprice),
    r: $data.bag_type != 1
  }, $data.bag_type != 1 ? {
    s: common_vendor.t($options.bag_price())
  } : {}, {
    t: common_vendor.t($options.describe()),
    v: common_vendor.o(($event) => $options.sub()),
    w: common_vendor.t($data.form.show_sku.sum),
    x: common_vendor.o(($event) => $options.add()),
    y: common_vendor.o((...args) => $options.confirmFunc && $options.confirmFunc(...args)),
    z: $data.detail.content,
    A: _ctx.theme(),
    B: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/product/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
