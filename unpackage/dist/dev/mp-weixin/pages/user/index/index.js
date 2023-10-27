"use strict";
const common_vendor = require("../../../common/vendor.js");
const Upload = () => "../../../components/upload/upload.js";
const _sfc_main = {
  components: {
    Upload
  },
  data() {
    return {
      isloadding: true,
      /*签到数据*/
      sign: {},
      /*是否加载完成*/
      loadding: true,
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      /*菜单*/
      menus: [],
      detail: {
        balance: 0,
        grade: {
          name: ""
        },
        mobile: ""
      },
      orderCount: {},
      setting: {},
      card_detail: null,
      sessionKey: "",
      urldata: "",
      isPopup: false,
      avatarUrl: "",
      nickName: "",
      imageList: [],
      isUpload: false
    };
  },
  onPullDownRefresh() {
    let self = this;
    self.getData();
  },
  onLoad(e) {
    let self = this;
    if (e.invitation_id) {
      common_vendor.index.setStorageSync("invitation_id", e.invitation_id);
    }
    if (e.referee_id) {
      common_vendor.index.setStorageSync("referee_id", e.referee_id);
    }
    common_vendor.wx$1.login({
      success(res) {
        self._post("user.user/getSession", {
          code: res.code
        }, (result) => {
          self.sessionKey = result.data.session_key;
        });
      }
    });
  },
  onShow() {
    this.getData();
  },
  methods: {
    /* 修改头像 */
    changeAvatarUrl() {
      let self = this;
      self.isUpload = true;
    },
    changeInfo() {
      this.avatarUrl = this.detail.avatarUrl;
      this.nickName = this.detail.nickName;
      this.isPopup = true;
    },
    /*获取数据*/
    getData() {
      let self = this;
      self.isloadding = true;
      self._get("user.index/detail", {
        url: self.urldata
      }, function(res) {
        if (res.data.getPhone) {
          self.gotoPage("/pages/login/bindmobile");
          return;
        }
        self.detail = res.data.userInfo;
        self.sign = res.data.sign;
        self.menus = res.data.menus;
        self.setting = res.data.setting;
        self.loadding = false;
        self.card_detail = res.data.cardDetail;
        common_vendor.index.stopPullDownRefresh();
        self.isloadding = false;
      });
    },
    bindMobile() {
      this.gotoPage("/pages/user/modify-phone/modify-phone");
    },
    /*跳转页面*/
    jumpPage(path) {
      let self = this;
      if (self.isloadding) {
        return;
      }
      if (path.startsWith("/")) {
        self.gotoPage(path);
      } else {
        self[path]();
      }
    },
    toinvitation(id) {
      if (id == 0) {
        common_vendor.index.showToast({
          title: "暂无活动"
        });
      } else {
        this.gotoPage("/pages/user/invite/invite?invitation_gift_id=" + id);
      }
    },
    /*扫一扫核销*/
    scanQrcode: function() {
      this.gotoPage("/pages/user/scan/scan");
    },
    /*扫一扫核销*/
    receipt: function() {
      let self = this;
      common_vendor.index.scanCode({
        onlyFromCamera: true,
        success: function(res) {
          let ulr = res.path;
          console.log(res);
          console.log(ulr);
          if (res.errMsg == "scanCode:ok") {
            self.gotoPage(ulr);
          } else {
            common_vendor.index.showToast({
              title: "扫码失败，请重试"
            });
          }
        }
      });
    },
    getQr(url) {
      var querys = url.substring(url.indexOf("?") + 1).split("&");
      var result = [];
      for (var i = 0; i < querys.length; i++) {
        var temp = querys[i].split("=");
        if (temp.length < 2) {
          result[temp[0]] = "";
        } else {
          result[temp[0]] = temp[1];
        }
      }
      return "/pages/order/group/receipt?scene=" + result.scene;
    },
    getPhoneNumber(e) {
      var self = this;
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        return false;
      }
      common_vendor.index.showLoading({
        title: "加载中"
      });
      self._post("user.user/bindMobile", {
        session_key: self.sessionKey,
        encrypted_data: e.detail.encryptedData,
        iv: e.detail.iv
      }, (result) => {
        common_vendor.index.showToast({
          title: "绑定成功"
        });
        self.getData();
      }, false, () => {
        common_vendor.index.hideLoading();
      });
    },
    copyFunc(e) {
      common_vendor.index.setClipboardData({
        //准备复制的数据
        data: e,
        success: function(res) {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success",
            mask: true,
            duration: 2e3
          });
        }
      });
    },
    onChooseAvatar(e) {
      let self = this;
      console.log(e);
      self.uploadFile([e.detail.avatarUrl]);
    },
    /*上传图片*/
    uploadFile: function(tempList) {
      let self = this;
      let i = 0;
      let img_length = tempList.length;
      let params = {
        token: common_vendor.index.getStorageSync("token"),
        app_id: self.getAppId()
      };
      common_vendor.index.showLoading({
        title: "图片上传中"
      });
      tempList.forEach(function(filePath, fileKey) {
        common_vendor.index.uploadFile({
          url: self.websiteUrl + "/index.php?s=/api/file.upload/image",
          filePath,
          name: "iFile",
          formData: params,
          success: function(res) {
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
            if (result.code === 1) {
              self.imageList.push(result.data);
            } else {
              self.showError(result.msg);
            }
          },
          complete: function() {
            i++;
            if (img_length === i) {
              common_vendor.index.hideLoading();
              self.getImgsFunc(self.imageList);
            }
          }
        });
      });
    },
    /*获取上传的图片*/
    getImgsFunc(e) {
      if (e && typeof e != "undefined") {
        let self = this;
        self.avatarUrl = e[0].file_path;
        self.isUpload = false;
      }
    },
    changeinput(e) {
      this.nickName = e.target.value;
    },
    closeFunc(e) {
      this.isPopup = false;
    },
    subName(e) {
      let self = this;
      if (self.loading) {
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中"
      });
      let params = {
        avatarUrl: self.avatarUrl,
        nickName: e.detail.value.nickName
      };
      self.loading = true;
      self._post("user.user/updateInfo", params, function(res) {
        self.showSuccess(
          "修改成功",
          function() {
            self.loading = false;
            self.isPopup = false;
            common_vendor.index.hideLoading();
            self.getData();
          },
          function(err) {
            common_vendor.index.hideLoading();
            self.loading = false;
            self.isPopup = false;
          }
        );
      });
    }
  }
};
if (!Array) {
  const _component_Upload = common_vendor.resolveComponent("Upload");
  _component_Upload();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.loadding
  }, !$data.loadding ? common_vendor.e({
    b: $data.detail.avatarUrl,
    c: common_vendor.o((...args) => $options.changeInfo && $options.changeInfo(...args)),
    d: common_vendor.t($data.detail.nickName),
    e: $data.detail.grade
  }, $data.detail.grade ? {
    f: common_vendor.t($data.detail.grade.name)
  } : {}, {
    g: common_vendor.t($data.detail.user_id),
    h: common_vendor.o(($event) => $options.copyFunc($data.detail.user_id + "")),
    i: common_vendor.o(($event) => _ctx.gotoPage("/pages/order/myorder")),
    j: common_vendor.t($data.detail.balance),
    k: common_vendor.o(($event) => _ctx.gotoPage("/pages/user/my-wallet/my-wallet")),
    l: common_vendor.f($data.menus, (item, index, i0) => {
      return common_vendor.e({
        a: item.status == 1
      }, item.status == 1 ? {
        b: item.image_url,
        c: common_vendor.t(item.title),
        d: common_vendor.o(($event) => $options.jumpPage(item.link_url), index)
      } : {}, {
        e: index
      });
    })
  }) : {}, {
    m: $data.isPopup
  }, $data.isPopup ? {
    n: common_vendor.o(($event) => $options.closeFunc(null)),
    o: common_vendor.o(($event) => $options.closeFunc(null)),
    p: $data.avatarUrl || "/static/login-log.jpg",
    q: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    r: $data.nickName,
    s: common_vendor.o((...args) => $options.changeinput && $options.changeinput(...args)),
    t: common_vendor.o((...args) => $options.subName && $options.subName(...args))
  } : {}, {
    v: $data.isUpload
  }, $data.isUpload ? {
    w: common_vendor.o($options.getImgsFunc),
    x: common_vendor.p({
      num: 1
    })
  } : {}, {
    y: _ctx.theme(),
    z: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/user/index/index.vue"]]);
wx.createPage(MiniProgramPage);
