"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      /*当前选中*/
      activeTabber: "首页",
      /*打开直播菜单*/
      open_liveMenu: false,
      /*底部菜单*/
      detail: {},
      /*是否微信小程序*/
      platform: "wx",
      hasTab: false
    };
  },
  watch: {},
  created() {
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      if (currentPage.route == "pages/index/index") {
        this.$store.commit("changefootTab", "首页");
      }
    }
    this.platform = this.getPlatform();
    this.detail = common_vendor.index.getStorageSync("TabBar");
    this.getData();
  },
  methods: {
    hasmenu() {
      let self = this;
      let curRoute = self.getRoute();
      let res = self.detail.list.some((item) => {
        if (item.link_url == curRoute) {
          return true;
        }
      });
      self.hasTab = res;
      if (common_vendor.index.getStorageSync("TabBar").is_auto && common_vendor.index.getStorageSync("TabBar").is_auto != 0) {
        common_vendor.index.hideTabBar();
      }
    },
    getRoute() {
      let routes = getCurrentPages();
      let curRoute = "/" + routes[routes.length - 1].route;
      if (curRoute == "/pages/diy-page/diy-page" || curRoute == "/pages/article/detail/detail") {
        if (routes[routes.length - 1]["$page"]) {
          curRoute = routes[routes.length - 1]["$page"].fullPath;
        }
      }
      return curRoute;
    },
    /*点击菜单*/
    tabBarFunc(e) {
      if (this.footTabberData.active == e.text) {
        return;
      }
      this.$store.commit("changefootTab", e.text);
      this.gotoPage(e.link_url);
    },
    /*获取首页分类*/
    getData() {
      let self = this;
      self._get("index/nav", {}, function(res) {
        self.detail = res.data.vars.data;
        common_vendor.index.setStorageSync("TabBar", res.data.vars.data);
        self.hasmenu();
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.detail.is_auto != 0 && $data.hasTab
  }, $data.detail.is_auto != 0 && $data.hasTab ? common_vendor.e({
    b: $data.detail.list != ""
  }, $data.detail.list != "" ? {
    c: common_vendor.f($data.detail.list, (item, index, i0) => {
      return common_vendor.e($data.detail.type != 2 ? {
        a: item.link_url == $options.getRoute() ? item.selectedIconPath : item.iconPath
      } : {}, $data.detail.type != 1 ? {
        b: common_vendor.t(item.text),
        c: common_vendor.s(item.link_url == $options.getRoute() ? "color:" + $data.detail.textHoverColor + ";" : "color:" + $data.detail.textColor + ";")
      } : {}, {
        d: item.link_url == $options.getRoute() ? 1 : "",
        e: index,
        f: common_vendor.o(($event) => $options.tabBarFunc(item), index)
      });
    }),
    d: common_vendor.t($options.getRoute()),
    e: $data.detail.type != 2,
    f: $data.detail.type != 1,
    g: common_vendor.s("background:" + $data.detail.backgroundColor || ";")
  } : {}, {
    h: common_vendor.o(() => {
    })
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/tabbar/footTabbar.vue"]]);
wx.createComponent(Component);
