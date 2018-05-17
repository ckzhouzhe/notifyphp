//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();
Page({
    data: {
        materialList: [],
        userInfo: {}
    },
    //事件处理函数
    tapMaterialItem: function (e) {
        var cs_id = e.currentTarget.id;
        var material = e.currentTarget.dataset.material;
        wx.navigateTo({
            url: '../courseintro/courseintro?cs_id=' + cs_id + '&material=' + material
        })
    },
    onLoad: function () {
        var that = this;


        console.log(app.getUserInfo())
        // console.log(app.getUserInfo())
        // that.getMaterialList(function (data) {
        //     that.setData({
        //         materialList: data.materialList
        //     })
        // });


        // var materialList=require('../../res/data/material.js');
        // that.setData({
        //     materialList: materialList.materialList
        // })

        qcloud.request({
            url: config.service.getcourseUrl,
            login: true,
            success(result) {
                // util.showSuccess('请求成功')
                that.setData({
                    materialList: result.data
                })
                console.log(result)
            },

            fail(error) {
                // util.showModel('请求失败1', error)
                console.log('request fail', error)
            }
        })
        
        var banners=[
            {imgs:'http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg'},
            {imgs:'http://p3.so.qhimgs1.com/bdr/_240_/t0161ca102a71fc4713.jpg'},
            {imgs:'http://pic2.ooopic.com/12/61/94/59bOOOPIC3c_1024.jpg'}
        ]
        that.setData({
            banners: banners
        })
        var notices=[
            {id:1,title:'为天地立心，为生民立命，为往圣继绝学，为万世开太平。——北宋 张载'},
            {id:2,title:'红包只为娱乐，活跃气氛。不要只抢红包不干二事，也不要拉抢红包机器人入群哦！奖励只是手段，目的是读书，欢迎弃奖。 张载'},
        ]
        that.setData({
            notices: notices
        })
    },
    onPullDownRefresh: function () {
        // this.pullUpdateMaterialList();
    },
    pullUpdateMaterialList: function () {
        var that = this;
        wx.showNavigationBarLoading();
        that.getMaterialList(function (data) {
            that.setData({
                materialList: data.materialList
            });
            wx.stopPullDownRefresh();
            setTimeout(function () {
                wx.hideNavigationBarLoading();
            },1000);

        });
    },
    getMaterialList: function (cal) {
        util.JFrequest({
            url: 'https://t.superabc.cn/c/os/reading/getcoursemateriallist',
            success: function (res) {
                if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
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
    tapShowFlowerRank : function () {
        wx.navigateTo({
            url: '../flowerrank/flowerrank'
        })
    }

});
