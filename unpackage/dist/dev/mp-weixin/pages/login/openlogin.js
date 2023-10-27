"use strict";
const common_vendor = require("../../common/vendor.js");
const common_gotopage = require("../../common/gotopage.js");
const _sfc_main = {
  data() {
    return {
      /*表单数据对象*/
      formData: {
        /*手机号*/
        mobile: "",
        /*验证码*/
        code: ""
      },
      loging_password: "",
      register: {
        mobile: "",
        password: "",
        repassword: "",
        code: ""
      },
      resetpassword: {
        mobile: "",
        password: "",
        repassword: "",
        code: ""
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
      if (self.is_code) {
        if (self.formData.code == "") {
          common_vendor.index.showToast({
            title: "验证码不能为空！",
            duration: 2e3,
            icon: "none"
          });
          return;
        }
        formdata.code = self.formData.code;
        url = "user.useropen/smslogin";
      } else {
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
      }
      common_vendor.index.showLoading({
        title: "正在提交"
      });
      self._post(
        url,
        formdata,
        (result) => {
          common_vendor.index.setStorageSync("token", result.data.token);
          common_vendor.index.setStorageSync("user_id", result.data.user_id);
          let url2 = common_vendor.index.getStorageSync("currentPage");
          let pageOptions = common_vendor.index.getStorageSync("currentPageOptions");
          if (Object.keys(pageOptions).length > 0) {
            url2 += "?";
            for (let i in pageOptions) {
              url2 += i + "=" + pageOptions[i] + "&";
            }
            url2 = url2.substring(0, url2.length - 1);
          }
          common_gotopage.gotopage(url2);
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
      if (self.register.code == "") {
        common_vendor.index.showToast({
          title: "验证码不能为空！",
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
            repassword: "",
            code: ""
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
      if (self.resetpassword.code == "") {
        common_vendor.index.showToast({
          title: "验证码不能为空！",
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
            repassword: "",
            code: ""
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
    isCode() {
      if (this.is_code) {
        this.$set(this, "is_code", false);
      } else {
        this.$set(this, "is_code", true);
      }
    },
    /*发送短信*/
    sendCode() {
      let self = this;
      if (self.is_login == 1) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
          common_vendor.index.showToast({
            title: "手机有误,请重填！",
            duration: 2e3,
            icon: "none"
          });
          return;
        }
      } else if (self.is_login == 2) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.register.mobile)) {
          common_vendor.index.showToast({
            title: "手机有误,请重填！",
            duration: 2e3,
            icon: "none"
          });
          return;
        }
      } else if (self.is_login == 0) {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.resetpassword.mobile)) {
          common_vendor.index.showToast({
            title: "手机有误,请重填！",
            duration: 2e3,
            icon: "none"
          });
          return;
        }
      }
      let type = "register";
      let mobile = self.register.mobile;
      if (self.is_login == 1) {
        type = "login";
        mobile = self.formData.mobile;
      } else if (self.is_login == 0) {
        type = "login";
        mobile = self.resetpassword.mobile;
      }
      self._post(
        "user.useropen/sendCode",
        {
          mobile,
          type
        },
        (result) => {
          if (result.code == 1) {
            common_vendor.index.showToast({
              title: "发送成功"
            });
            self.is_send = true;
            self.changeMsg();
          }
        }
      );
    },
    login() {
      let self = this;
      plus.oauth.getServices(function(servies) {
        let s = servies[0];
        if (!s.authResult) {
          s.authorize(function(e) {
            common_vendor.index.showLoading({
              title: "登录中",
              mask: true
            });
            self._post("user.useropen/login", {
              code: e.code,
              source: "app"
            }, (result) => {
              common_vendor.index.setStorageSync("token", result.data.token);
              common_vendor.index.setStorageSync("user_id", result.data.user_id);
              let url = common_vendor.index.getStorageSync("currentPage");
              let pageOptions = common_vendor.index.getStorageSync("currentPageOptions");
              if (Object.keys(pageOptions).length > 0) {
                url += "?";
                for (let i in pageOptions) {
                  url += i + "=" + pageOptions[i] + "&";
                }
                url = url.substring(0, url.length - 1);
              }
              console.log("url = " + url);
              common_gotopage.gotopage(url);
            }, false, () => {
              common_vendor.index.hideLoading();
            });
          }, function(e) {
            console.log("登陆认证失败!");
            common_vendor.index.showModal({
              title: "认证失败1",
              content: JSON.stringify(e)
            });
          });
        } else {
          console.log("已经登陆认证");
        }
      }, function(e) {
        console.log("获取服务列表失败：" + JSON.stringify(e));
      });
    },
    /*改变发送验证码按钮文本*/
    changeMsg() {
      if (this.second > 0) {
        this.send_btn_txt = this.second + "秒";
        this.second--;
        setTimeout(this.changeMsg, 1e3);
      } else {
        this.send_btn_txt = "获取验证码";
        this.second = 60;
        this.is_send = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.is_login == 2
  }, $data.is_login == 2 ? {
    b: common_vendor.o(($event) => $data.is_login = 1),
    c: $data.is_send,
    d: $data.register.mobile,
    e: common_vendor.o(($event) => $data.register.mobile = $event.detail.value),
    f: $data.register.password,
    g: common_vendor.o(($event) => $data.register.password = $event.detail.value),
    h: $data.register.repassword,
    i: common_vendor.o(($event) => $data.register.repassword = $event.detail.value),
    j: $data.register.code,
    k: common_vendor.o(($event) => $data.register.code = $event.detail.value),
    l: common_vendor.t($data.send_btn_txt),
    m: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    n: $data.is_send
  } : {}, {
    o: $data.is_login == 1
  }, $data.is_login == 1 ? common_vendor.e({
    p: common_vendor.o(($event) => $data.is_login = 2),
    q: $data.formData.mobile,
    r: common_vendor.o(($event) => $data.formData.mobile = $event.detail.value),
    s: !$data.is_code
  }, !$data.is_code ? {
    t: $data.loging_password,
    v: common_vendor.o(($event) => $data.loging_password = $event.detail.value)
  } : {}, {
    w: $data.is_code
  }, $data.is_code ? {
    x: $data.formData.code,
    y: common_vendor.o(($event) => $data.formData.code = $event.detail.value),
    z: common_vendor.t($data.send_btn_txt),
    A: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    B: $data.is_send
  } : {}) : {}, {
    C: $data.is_login == 0
  }, $data.is_login == 0 ? {
    D: common_vendor.o(($event) => $data.is_login = 1),
    E: $data.is_send,
    F: $data.resetpassword.mobile,
    G: common_vendor.o(($event) => $data.resetpassword.mobile = $event.detail.value),
    H: $data.resetpassword.password,
    I: common_vendor.o(($event) => $data.resetpassword.password = $event.detail.value),
    J: $data.resetpassword.repassword,
    K: common_vendor.o(($event) => $data.resetpassword.repassword = $event.detail.value),
    L: $data.resetpassword.code,
    M: common_vendor.o(($event) => $data.resetpassword.code = $event.detail.value),
    N: common_vendor.t($data.send_btn_txt),
    O: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    P: $data.is_send
  } : {}, {
    Q: $data.is_login == 1
  }, $data.is_login == 1 ? common_vendor.e({
    R: !$data.is_code
  }, !$data.is_code ? {
    S: common_vendor.o(($event) => $data.is_login = 0)
  } : {}, {
    T: common_vendor.t($data.is_code ? "使用密码登录" : "使用验证码登录"),
    U: common_vendor.o(($event) => $options.isCode()),
    V: common_vendor.n($data.is_code ? "d-e-c" : "d-b-c")
  }) : {}, {
    W: $data.is_login == 2
  }, $data.is_login == 2 ? {
    X: common_vendor.o((...args) => $options.registerSub && $options.registerSub(...args))
  } : {}, {
    Y: $data.is_login == 1
  }, $data.is_login == 1 ? {
    Z: common_vendor.o((...args) => $options.formSubmit && $options.formSubmit(...args))
  } : {}, {
    aa: $data.is_login == 0
  }, $data.is_login == 0 ? {
    ab: common_vendor.o((...args) => $options.resetpasswordSub && $options.resetpasswordSub(...args))
  } : {}, {
    ac: $data.is_login == 1
  }, $data.is_login == 1 ? {
    ad: common_vendor.o((...args) => $options.login && $options.login(...args))
  } : {}, {
    ae: common_vendor.s("height: " + $data.phoneHeight + "px;")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-facbca1a"], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/login/openlogin.vue"]]);
wx.createPage(MiniProgramPage);
