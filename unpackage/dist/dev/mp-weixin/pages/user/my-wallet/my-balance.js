"use strict";
const common_vendor = require("../../../common/vendor.js");
const uniLoadMore = () => "../../../components/uni-load-more.js";
const _sfc_main = {
  components: {
    uniLoadMore
  },
  data() {
    return {
      /*是否加载完成*/
      loading: true,
      /*顶部刷新*/
      topRefresh: false,
      /*手机高度*/
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollviewHigh: 0,
      /*数据列表*/
      tableData: [],
      /*最后一页码数*/
      last_page: 0,
      /*当前页面*/
      page: 1,
      /*每页条数*/
      list_rows: 20,
      no_more: false,
      type: "all"
    };
  },
  computed: {
    /*加载中状态*/
    loadingType() {
      if (this.loading) {
        return 1;
      } else {
        if (this.tableData.length != 0 && this.no_more) {
          return 2;
        } else {
          return 0;
        }
      }
    }
  },
  onLoad(e) {
    this.type = e.type;
    this.getData();
  },
  onReachBottom() {
    let self = this;
    if (self.page < self.last_page) {
      self.page++;
      self.getData();
    }
    self.no_more = true;
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      let page = self.page;
      let list_rows = self.list_rows;
      self.loading = true;
      self._get(
        "balance.log/lists",
        {
          page: page || 1,
          list_rows,
          type: self.type
        },
        function(data) {
          self.loading = false;
          self.tableData = self.tableData.concat(data.data.list.data);
          self.last_page = data.data.list.last_page;
          if (data.data.list.last_page <= 1) {
            self.no_more = true;
            return false;
          }
        }
      );
    }
  }
};
if (!Array) {
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  _component_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tableData, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.scene.text),
        b: common_vendor.t(item.create_time),
        c: item.money > 0
      }, item.money > 0 ? {
        d: common_vendor.t(item.money)
      } : {
        e: common_vendor.t(item.money)
      }, {
        f: index
      });
    }),
    b: $data.tableData.length == 0 && !$data.loading
  }, $data.tableData.length == 0 && !$data.loading ? {} : {
    c: common_vendor.p({
      loadingType: $options.loadingType
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/user/my-wallet/my-balance.vue"]]);
wx.createPage(MiniProgramPage);
