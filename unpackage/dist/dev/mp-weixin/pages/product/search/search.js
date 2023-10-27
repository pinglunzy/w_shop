"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {},
      arr: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    /*获取缓存里的搜索历史*/
    getData() {
      let self = this;
      common_vendor.index.getStorage({
        key: "search_list",
        success: function(res) {
          if (res != null && res.data != null) {
            self.arr = res.data;
          }
        }
      });
    },
    /*搜索*/
    search(str) {
      let search = null;
      if (str != null) {
        search = str;
      } else {
        search = this.form.keyWord;
        let arrs = this.arr;
        if (typeof search != "undefined" && search != null && search != "") {
          arrs.push(search);
        } else {
          common_vendor.index.showToast({
            title: "请输入搜索的关键字",
            icon: "none",
            duration: 2e3
          });
          return false;
        }
        common_vendor.index.setStorage({
          key: "search_list",
          data: arrs,
          success: function() {
            console.log("success");
          }
        });
      }
      let category_id = 0;
      let sortType = "all";
      common_vendor.index.navigateTo({
        url: "/pages/product/list/list?search=" + search + "&category_id=" + category_id + "&sortType=" + sortType
      });
    },
    /*清楚缓存*/
    clearStorage() {
      let self = this;
      common_vendor.index.removeStorage({
        key: "search_list",
        success: function(res) {
          self.arr = [];
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.search()),
    b: $data.form.keyWord,
    c: common_vendor.o(($event) => $data.form.keyWord = $event.detail.value),
    d: common_vendor.o((...args) => $options.clearStorage && $options.clearStorage(...args)),
    e: common_vendor.f($data.arr, (item, index, i0) => {
      return {
        a: common_vendor.t($data.arr[index]),
        b: index,
        c: common_vendor.o(($event) => $options.search($data.arr[index]), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/product/search/search.vue"]]);
wx.createPage(MiniProgramPage);
