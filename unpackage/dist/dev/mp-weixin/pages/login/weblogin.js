"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      /*表单数据对象*/
      formData: {
        /*手机号*/
        mobile: ""
      },
      loging_password: "",
      register: {
        mobile: "",
        password: "",
        repassword: ""
      },
      resetpassword: {
        mobile: "",
        password: "",
        repassword: ""
      },
      /*是否已发验证码*/
      is_send: false,
      /*发送按钮文本*/
      send_btn_txt: "获取验证码",
      /*当前秒数*/
      second: 60,
      ip: "",
      isShow: true,
      is_login: 1,
      is_code: false,
      phoneHeight: 0
    };
  },
  onLoad() {
  },
  onShow() {
    this.init();
  },
  methods: {
    /*初始化*/
    init() {
      let self = this;
      common_vendor.index.getSystemInfo({
        success(res) {
          self.phoneHeight = res.windowHeight;
        }
      });
    },
    /*提交*/
    formSubmit() {
      let self = this;
      let formdata = {
        mobile: self.formData.mobile
      };
      let url = "";
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
        common_vendor.index.showToast({
          title: "手机有误,请重填！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (self.loging_password == "") {
        common_vendor.index.showToast({
          title: "密码不能为空！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      formdata.password = self.loging_password;
      url = "user.useropen/phonelogin";
      common_vendor.index.showLoading({
        title: "正在提交"
      });
      self._post(
        url,
        formdata,
        (result) => {
          common_vendor.index.setStorageSync("token", result.data.token);
          common_vendor.index.setStorageSync("user_id", result.data.user_id);
          common_vendor.index.navigateBack({
            delta: 2
          });
        },
        false,
        () => {
          common_vendor.index.hideLoading();
        }
      );
    },
    /*注册*/
    registerSub() {
      let self = this;
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.register.mobile)) {
        common_vendor.index.showToast({
          title: "手机有误,请重填！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (self.register.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码至少6位数！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (self.register.password !== self.register.repassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      self.register.invitation_id = common_vendor.index.getStorageSync("invitation_id") || 0;
      self.register.referee_id = common_vendor.index.getStorageSync("referee_id") || 0;
      common_vendor.index.showLoading({
        title: "正在提交"
      });
      self._post(
        "user.useropen/register",
        self.register,
        (result) => {
          common_vendor.index.showToast({
            title: "注册成功",
            duration: 3e3
          });
          self.formData.mobile = self.register.mobile;
          self.register = {
            mobile: "",
            password: "",
            repassword: ""
          };
          self.second = 0;
          self.changeMsg();
          self.is_login = 1;
        },
        false,
        () => {
          common_vendor.index.hideLoading();
        }
      );
    },
    resetpasswordSub() {
      let self = this;
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.resetpassword.mobile)) {
        common_vendor.index.showToast({
          title: "手机有误,请重填！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (self.resetpassword.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码至少6位数！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (self.resetpassword.password !== self.resetpassword.repassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致！",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在提交"
      });
      self._post(
        "user.useropen/resetpassword",
        self.resetpassword,
        (result) => {
          common_vendor.index.showToast({
            title: "重置成功",
            duration: 3e3
          });
          self.formData.mobile = self.resetpassword.mobile;
          self.resetpassword = {
            mobile: "",
            password: "",
            repassword: ""
          };
          self.second = 0;
          self.changeMsg();
          self.is_login = 1;
        },
        false,
        () => {
          common_vendor.index.hideLoading();
        }
      );
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => _ctx.gotoPage("/pages/index/index")),
    b: $data.is_login == 2
  }, $data.is_login == 2 ? {
    c: common_vendor.o(($event) => $data.is_login = 1),
    d: $data.is_send,
    e: $data.register.mobile,
    f: common_vendor.o(($event) => $data.register.mobile = $event.detail.value),
    g: $data.register.password,
    h: common_vendor.o(($event) => $data.register.password = $event.detail.value),
    i: $data.register.repassword,
    j: common_vendor.o(($event) => $data.register.repassword = $event.detail.value)
  } : {}, {
    k: $data.is_login == 1
  }, $data.is_login == 1 ? {
    l: common_vendor.o(($event) => $data.is_login = 2),
    m: $data.formData.mobile,
    n: common_vendor.o(($event) => $data.formData.mobile = $event.detail.value),
    o: $data.loging_password,
    p: common_vendor.o(($event) => $data.loging_password = $event.detail.value)
  } : {}, {
    q: $data.is_login == 0
  }, $data.is_login == 0 ? {
    r: common_vendor.o(($event) => $data.is_login = 1),
    s: $data.is_send,
    t: $data.resetpassword.mobile,
    v: common_vendor.o(($event) => $data.resetpassword.mobile = $event.detail.value),
    w: $data.resetpassword.password,
    x: common_vendor.o(($event) => $data.resetpassword.password = $event.detail.value),
    y: $data.resetpassword.repassword,
    z: common_vendor.o(($event) => $data.resetpassword.repassword = $event.detail.value)
  } : {}, {
    A: $data.is_login == 2
  }, $data.is_login == 2 ? {
    B: common_vendor.o((...args) => $options.registerSub && $options.registerSub(...args))
  } : {}, {
    C: $data.is_login == 1
  }, $data.is_login == 1 ? {
    D: common_vendor.o((...args) => $options.formSubmit && $options.formSubmit(...args))
  } : {}, {
    E: $data.is_login == 0
  }, $data.is_login == 0 ? {
    F: common_vendor.o((...args) => $options.resetpasswordSub && $options.resetpasswordSub(...args))
  } : {}, {
    G: common_vendor.s("height: " + $data.phoneHeight + "px;")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-761a79ba"], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/login/weblogin.vue"]]);
wx.createPage(MiniProgramPage);
