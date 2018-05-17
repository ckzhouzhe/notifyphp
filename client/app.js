//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    setUserInfo: function (userInfo) {
        var that = this;
        that.globalData.userInfo = userInfo;
        that.globalData.hasLogin = true;
    },
    getUserInfo: function () {
        var that = this;
        return that.globalData.userInfo;
    },
    checkLogin: function () {
        var that = this;
        if (that.globalData.hasLogin) {
            return true;
        } else {
            return false;
        }
    },
    loginOut: function (obj) {
        var that = this;
        that.globalData.userInfo = null;
        that.globalData.hasLogin = false;
        wx.removeStorage({
            key: 'utoken',
            success: function () {
                wx.navigateTo({
                    url: '../login/login'
                });
            }
        })
    },
    showErrorModal: function(content, title){
        wx.showModal({
          title: title || '加载失败',
          content: content || '未知错误',
          showCancel: false
        });
      },
      showLoadToast: function(title, duration){
        wx.showToast({
          title: title || '加载中',
          icon: 'loading',
          mask: true,
          duration: duration || 10000
        });
      },
    globalData: {
        userInfo: null,
        hasLogin: false
    }
})