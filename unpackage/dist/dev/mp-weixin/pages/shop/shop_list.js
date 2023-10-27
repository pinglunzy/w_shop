"use strict";
const common_vendor = require("../../common/vendor.js");
const uniLoadMore = () => "../../components/uni-load-more.js";
const _sfc_main = {
  components: {
    uniLoadMore
  },
  data() {
    return {
      /*数据*/
      distance: "",
      loading: true,
      // 是否正在加载中
      storeList: [],
      // 门店列表,
      longitude: "",
      latitude: "",
      selectedId: {
        region: {
          city: "",
          store_id: -1,
          distance_unit: "",
          log: {
            file_path: ""
          }
        },
        store_name: ""
      },
      /* 搜索关键字 */
      store_name: "",
      list_rows: 10,
      last_page: 0,
      page: 1,
      /*没有更多*/
      no_more: false,
      scrollviewHigh: 0,
      longitude: "",
      latitude: "",
      selectedId: ""
    };
  },
  computed: {
    /*加载中状态*/
    loadingType() {
      if (this.loading) {
        return 1;
      } else {
        if (this.storeList.length != 0 && this.no_more) {
          return 2;
        } else {
          return 0;
        }
      }
    }
  },
  onLoad(options) {
  },
  onShow() {
    this.restoreData();
    this.getcityData();
  },
  mounted() {
    this.selectedId = common_vendor.index.getStorageSync("selectedId");
    this.init();
  },
  methods: {
    /*初始化*/
    init() {
      let _this = this;
      common_vendor.index.getSystemInfo({
        success(res) {
          _this.scrollviewHigh = res.windowHeight;
        }
      });
    },
    /*还原初始化*/
    restoreData() {
      this.storeList = [];
      this.search = "";
      this.no_more = false;
      this.page = 1;
    },
    /*可滚动视图区域到底触发*/
    scrolltolowerFunc() {
      let self = this;
      self.bottomRefresh = true;
      self.page++;
      self.loading = true;
      if (self.page > self.last_page) {
        self.loading = false;
        self.no_more = true;
        return;
      }
      self.getData();
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
          self.getData();
        },
        fail(err) {
          self.getData();
          common_vendor.index.showToast({
            title: "获取定位失败，请点击右下角按钮打开定位权限",
            duration: 2e3,
            icon: "none"
          });
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
            self.getData();
          },
          fail(err) {
            self.getData();
          }
        });
      });
      jweixin.error(function(res) {
        console.log(res);
      });
    },
    /*获取数据*/
    getData() {
      let self = this;
      self.loading = true;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._get("supplier.index/list", {
        longitude: self.longitude || 0,
        latitude: self.latitude || 0
      }, function(res) {
        common_vendor.index.hideLoading();
        self.loading = false;
        self.storeList = self.storeList.concat(res.data.list.data);
        self.last_page = res.data.list.last_page;
        if (res.data.list.last_page <= 1) {
          self.no_more = true;
        }
      });
    },
    chooseLocation() {
      let self = this;
      common_vendor.index.chooseLocation({
        success: function(res) {
          console.log("位置名称：" + res.name);
          console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
          self.longitude = res.longitude;
          self.latitude = res.latitude;
          self.getrecord();
          self.getData();
        }
      });
    },
    search() {
      let self = this;
      self.loading = true;
      self._get("store.store/lists", {
        store_name: self.store_name,
        longitude: self.longitude,
        latitude: self.latitude
      }, function(res) {
        self.loading = false;
        self.storeList = res.data.list;
      });
    },
    /**
     * 选择门店
     */
    onSelectedStore(e, flag) {
      let self = this;
      self.selectedId = e;
      common_vendor.index.setStorageSync("selectedId", self.selectedId);
      if (flag) {
        common_vendor.index.navigateBack();
      }
    },
    getrecord() {
      let self = this;
      let store_id = self.selectedId.store_id;
      self._post(
        "user.storelog/record",
        {
          store_id,
          longitude: self.longitude,
          latitude: self.latitude
        },
        function(res) {
          self.distance = res.data.detail.distance_unit;
        }
      );
    },
    addSotre(e) {
      let self = this;
      let store_id = e.store_id;
      self._post(
        "user.storelog/add",
        {
          store_id
        },
        function(res) {
        }
      );
    },
    /* 是否选择 */
    isShopid(id) {
      let s_id = common_vendor.index.getStorageSync("selectedId");
      return s_id == id;
    }
  }
};
if (!Array) {
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  _component_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.storeList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.n(item.shop_supplier_id != $data.selectedId ? "select-id" : "select-id icon iconfont icon-tijiaochenggong"),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.distance),
        d: common_vendor.t(item.address),
        e: item.delivery_time.length > 0
      }, item.delivery_time.length > 0 ? {
        f: common_vendor.t(item.delivery_time[0] + "-" + item.delivery_time[1])
      } : {}, {
        g: item.status == 0
      }, item.status == 0 ? {} : {}, {
        h: common_vendor.o(($event) => _ctx.callPhone(item.link_phone), index),
        i: common_vendor.o(($event) => _ctx.openmap(item.latitude, item.longitude), index),
        j: common_vendor.o(($event) => $options.onSelectedStore(item.shop_supplier_id, true), index),
        k: common_vendor.o(($event) => $options.onSelectedStore(item.shop_supplier_id), index),
        l: common_vendor.n($options.isShopid(item.shop_supplier_id) ? "active" : ""),
        m: index
      });
    }),
    b: $data.storeList.length == 0 && !$data.loading
  }, $data.storeList.length == 0 && !$data.loading ? {} : {
    c: common_vendor.p({
      loadingType: $options.loadingType
    })
  }, {
    d: common_vendor.s("height:" + $data.scrollviewHigh + "px;"),
    e: common_vendor.o((...args) => $options.scrolltolowerFunc && $options.scrolltolowerFunc(...args)),
    f: _ctx.theme(),
    g: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/shop/shop_list.vue"]]);
wx.createPage(MiniProgramPage);
