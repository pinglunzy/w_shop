"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      /*数据*/
      listData: [],
      isLoading: true,
      // 是否正在加载中
      storeList: [],
      // 门店列表,
      longitude: "",
      latitude: "",
      selectedId: -1
    };
  },
  onLoad(options) {
    this.selectedId = options.store_id;
    this.getData();
  },
  methods: {
    /**
     * 授权启用定位权限
     */
    onAuthorize() {
      let self = this;
      common_vendor.index.openSetting({
        success(res) {
          if (res.authSetting["scope.userLocation"]) {
            console.log("授权成功");
            self.isAuthor = true;
            setTimeout(() => {
              self.getLocation((res2) => {
              });
            }, 1e3);
          }
        }
      });
    },
    /**
     * 获取用户坐标
     */
    getLocation(callback) {
      let self = this;
      common_vendor.index.getLocation({
        type: "wgs84",
        success(res) {
          self.longitude = res.longitude;
          self.latitude = res.latitude;
          self.getData();
        },
        fail() {
          common_vendor.index.showToast({
            title: "获取定位失败，请点击右下角按钮打开定位权限",
            duration: 2e3
          });
          self.isAuthor = false;
        }
      });
    },
    /*获取数据*/
    getData() {
      let self = this;
      self.isLoading = true;
      self._get("store.store/lists", {
        longitude: self.longitude,
        latitude: self.latitude
      }, function(res) {
        self.isLoading = false;
        self.storeList = res.data.list;
      });
    },
    /**
     * 选择门店
     */
    onSelectedStore(e) {
      let self = this;
      self.selectedId = e;
      let pages = getCurrentPages();
      if (pages.length < 2) {
        return false;
      }
      self.$fire.fire("selectStoreId", e);
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.storeList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.store_name),
        b: common_vendor.t(item.phone),
        c: common_vendor.t(item.region.province),
        d: common_vendor.t(item.region.city),
        e: common_vendor.t(item.region.region),
        f: common_vendor.t(item.address),
        g: common_vendor.t(item.distance_unit),
        h: item.store_id == $data.selectedId
      }, item.store_id == $data.selectedId ? {} : {}, {
        i: common_vendor.o(($event) => $options.onSelectedStore(item), index),
        j: index
      });
    }),
    b: !$data.isLoading && !$data.storeList.length
  }, !$data.isLoading && !$data.storeList.length ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/store/address/address.vue"]]);
wx.createPage(MiniProgramPage);
