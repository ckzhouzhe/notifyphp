//logs.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({
    audioCtx: null,
    data: {
        courseInfo: {},
        replayinfo: {},
        cs_id: 0,
        title: '',
        course_status : 0
    },
    onReady: function () {
        this.audioCtx = wx.createAudioContext('courseIntroAudio');
    },
    onLoad: function (obj) {
        //接收上一个页面传过来的参数
        console.log(obj);
        if (obj) {
            this.setData({
                cs_id: obj.cs_id,
                title : obj.material
            })
        }

    },
    onShow: function () {
        var that = this;
        // that.getCourseIntro(function (data) {
        //     that.setData({
        //         courseInfo: data
        //     })
        // })
        var recordList=require('../../res/data/material.js');
        // console.log(recordList)
        that.setData({
            recordList: recordList.recordList
        })
        wx.showToast({
            title: '正在加载……',
            icon: 'loading',
            duration: 5000
        });
        qcloud.request({
            url: config.service.getcourseinfoUrl,
            data: {
                'cs_id': that.data.cs_id
            },
            success(result) {
                // util.showSuccess('请求成功')
                for (var i = 0; i < result.data.replayinfo.length; i++) {
                    if (result.data.replayinfo[i].userinfo.user_info) {
                        result.data.replayinfo[i].userinfo.user_info=JSON.parse(result.data.replayinfo[i].userinfo.user_info)
                    }
                    // console.log(JSON.parse(result.data.replayinfo[i].userinfo.user_info))
                    
                }
                
                console.log(result.data.replayinfo)
                
                that.setData({
                    courseInfo: result.data.courseInfo,
                    replayinfo: result.data.replayinfo
                })
                wx.hideToast();

                // console.log(result.data.replayinfo[i].userinfo.user_info)
            },

            fail(error) {
                // util.showModel('请求失败1', error)
                console.log('request fail', error)
            }
        })
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    getCourseIntro: function (cal) {
        var that = this;
        util.JFrequest({
            url: config.service.getcourseUrl,
            param : {
                'cs_id' : that.data.cs_id
            },
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

    //播放课程介绍
    tapPlayIntroAudio: function (e) {
        this.audioCtx.play();
    },
    //播放重点单词
    tapPlayWordAudio: function (e) {
        var thisAudioId = 'audio-' + e.currentTarget.id;
        var thisAudioCtx = wx.createAudioContext(thisAudioId);
        thisAudioCtx.play();
    },
    //播放用户跟读记录
    tapPlayUserRecord: function (e) {
        console.log(e);
        var thisAudioId = 'reaudio-' + e.currentTarget.id;
        var thisAudioCtx = wx.createAudioContext(thisAudioId);
        thisAudioCtx.play();
    },
    tapJoinReadingBtn: function () {
        var that = this;
        console.log(that);
        wx.navigateTo({
            url: '../reading/reading?cs_id=' + that.data.cs_id
        })
    }
});
