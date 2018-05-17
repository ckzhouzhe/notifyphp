//获取应用实例
var util = require('../../utils/util.js');
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp();
Page({
    data: {
        has_get_vcode: false,//默认
        mobile_login: false,//默认
        vcodeGetTime: 0,
        inputVcode: '',
        userInfo: {},
        inputMobileNumber: '',
        checkMobilePass: false,
        systemInfo: {},
        fromPage: ''
    },
    onLoad: function (obj) {
        var that = this;
        var fromPage;
        console.log(obj);
        if (obj && obj.fromPage) {
            fromPage = obj.fromPage.replace("pages", "..");
            that.setData({
                fromPage : fromPage
            });
        }

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    systemInfo: res
                });
            }
        })
        // console.log(wx.getStorageSync('userInfo'))
    },
    onShow: function () {
        var str='{"openId":"ojyrq0Ejt3bZFQtVREhC50Mjd15w","nickName":"\u6cfd\u5bb8\u5b9d\u7238","gender":1,"language":"zh_CN","city":"Xingtai","province":"Hebei","country":"China","avatarUrl":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/FaIPHUdtoBduVpKIhKzZ3c5xrySMTRoCIC1eRIHv9JUic3icEbIKgPiaaIgIPEUiaXCCOp0qrZ5eBmIuotCscZevUg\/0","watermark":{"timestamp":1524413492,"appid":"wx3d891dc322b247a0"}}'
        console.log(JSON.parse(str))
        console.log('dfff')
        console.log(this.data);

    },
    //选择微信号登录
    tapWeixinLogin: function (cal) {
        var that = this;
        // var userInfo = {};
        wx.showToast({
            title: '正在登录……',
            icon: 'loading',
            duration: 3000
        });
        // util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    // util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                    app.setUserInfo(result);
                    console.log('shouci')
                } else {
                    console.log('erci')
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            // util.showSuccess('登录成功')
                            that.setData({
                                userInfo1: result.data.data,
                                logged: true
                            })
                            app.setUserInfo(result.data.data);
                        },

                        fail(error) {
                            // util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                // util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
        console.log(that)
        console.log(that.data);
        console.log(that.data.userInfo1);
        console.log(that.data.systemInfo);
        // wx.login({
        //     success: function (wxRes) {
        //         if (wxRes.code) {
        //             util.JFrequest({
        //                 url: 'https://t.superabc.cn/c/s/wxapplogin',
        //                 param: {
        //                     js_code: wxRes.code,
        //                 },
        //                 success: function (res) {
        //                     if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
        //                         userInfo = {
        //                             mobile_no: res.data.data.mobile_no,
        //                             openid: res.data.data.openid,
        //                             portrait: res.data.data.portrait,
        //                             user_id: res.data.data.user_id,
        //                             user_name: res.data.data.user_name
        //                         };
        //                         //种下utoken
        //                         wx.setStorage({
        //                             key: "utoken",
        //                             data: res.data.data.utoken
        //                         });
        //                         //存储个人信息
        //                         app.setUserInfo(userInfo);
        //                         wx.hideToast();
        //                         //跳转到首页
        //                         wx.navigateTo({
        //                             url: '../index/index'
        //                         });

        //                         if (typeof cal == 'function') {
        //                             cal(res.data.data);
        //                         }
        //                     } else {
        //                         wx.showToast({
        //                             title: '当前环境无法使用wx.login，请使用手机号登录',
        //                             icon: 'success',
        //                             duration: 3000
        //                         });
        //                     }
        //                 }
        //             });
        //         } else {
        //             console.log("调用wx.login获取code失败");
        //         }
        //     }
        // })
        // userInfo = {
        //     mobile_no: 15130977141,
        //     openid: '123',
        //     portrait: 'http://img.hb.aicdn.com/fdfac3da6e315666c67b4fde6573bc35f2131e13f8d-dPynRl_sq75sf',
        //     user_id: '1',
        //     user_name: '慧读书馆'
        // };
        //种下utoken
        // wx.setStorage({
        //     key: "userInfo",
        //     data: that.data.userInfo.openId
        // });
        
        //存储个人信息
        // app.setUserInfo(that.data.userInfo);

        
        // app.globalData.userInfo=that.data.userInfo;
        wx.hideToast();
        // 跳转到首页
        wx.switchTab({
            url: '../index/index'
        });
        // console.log(that)
    },
    //选择手机号登录
    tapMobileLogin: function () {
        this.setData({
            mobile_login: true,
        })
    },
    tapGetVcode: function (e) {
        //获取vcode
        var that = this;
        if (that.data.checkMobilePass) {
            that._initVcodeTimer();
            //执行请求，获取vcode
            that.getVcode(function (data) {
                if (data.vcode) {
                    that.setData({
                        inputVcode: data.vcode
                    })
                }
            });
        } else {
            return false;
        }

    },
    //获取验证码
    getVcode: function (cal) {
        var that = this;
        util.JFrequest({
            url: 'https://t.superabc.cn/c/s/getvcode',
            param: {
                mobile_no: that.data.inputMobileNumber
            },
            success: function (res) {
                if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
                    if (typeof cal == 'function') {
                        cal(res.data.data);
                    }
                } else {
                    wx.showToast({
                        title: res.err_msg,
                        icon: 'success',
                        duration: 1000
                    });
                    //
                }
            }
        });
    },
    //tapMobileLoginSubmit
    tapMobileLoginSubmit: function (cal) {
        var that = this;
        var userInfo = {};
        util.JFrequest({
            url: 'https://t.superabc.cn/c/s/mobilelogin',
            param: {
                mobile_no: that.data.inputMobileNumber,
                vcode: that.data.inputVcode
            },
            success: function (res) {
                if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
                    userInfo = {
                        mobile_no: res.data.data.mobile_no,
                        openid: res.data.data.openid,
                        portrait: res.data.data.portrait,
                        user_id: res.data.data.user_id,
                        user_name: res.data.data.user_name
                    };
                    //种下utoken
                    wx.setStorage({
                        key: "utoken",
                        data: res.data.data.utoken
                    });
                    //存储个人信息
                    app.setUserInfo(userInfo);
                    //跳转到首页
                    wx.navigateTo({
                        url: '../index/index'
                    });


                    if (typeof cal == 'function') {
                        cal(res.data.data);
                    }
                } else {
                    console.log("请求数据失败，读取缓存");
                    //
                }


            }
        });
    },

    //校验手机号
    checkMobileRegExp: function (e) {
        var that = this;
        var number = e.detail.value;
        if (number.isPhoneNumber()) {
            that.setData({
                checkMobilePass: true,
                inputMobileNumber: number
            });
        } else {
            that.setData({
                checkMobilePass: false,
            });
        }
    },
    _initVcodeTimer: function () {
        var that = this;
        var initTime = 60;
        that.setData({
            has_get_vcode: true,
            vcodeGetTime: initTime
        });
        var vcodeTimer = setInterval(function () {
            initTime--;
            that.setData({
                vcodeGetTime: initTime
            });
            if (initTime <= 0) {
                clearInterval(vcodeTimer);
                that.setData({
                    has_get_vcode: false
                });
            }
        }, 1000);
    }

});
