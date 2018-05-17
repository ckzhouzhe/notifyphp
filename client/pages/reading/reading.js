//logs.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var app = getApp();
Page({
    progressTimer: null,
    data: {
        cs_id: 0,
        sub_cs_id: 0,
        readingInfo: [],
        '---音频相关---': '----',
        JFAudio: [],
        recording: false,
        currentProgress: 0,
        lefttime:60,
        imgs: [],
        shuping:'',
        imgLen: 0,
        upload: false,
        uploading: false,
        audio_url:'',
        imgsurl:''
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },
    onLoad: function (obj) {
        //接收上一个页面传过来的参数
        if (obj) {
            this.setData({
                cs_id: obj.cs_id,
            })
        }
        var userinfo=app.getUserInfo()
        console.log(userinfo)
    },
    onShow: function () {
        var that = this;
        // that.getReadingInfo(function (data) {
        //     that.setData({
        //         readingInfo: data.readingInfo
        //     })
        // })
        var materialList=require('../../res/data/material.js');
        console.log(materialList)
        that.setData({
            readingInfo: materialList.readingInfo
        })
    },
    getReadingInfo: function (cal) {
        var that = this;
        util.JFrequest({
            url: 'https://t.superabc.cn/c/os/reading/getreadinginfo',
            param : {
                'sub_cs_id': that.data.sub_cs_id,
                'cs_id': that.data.cs_id
            },
            method:'post',
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
    bindTextAreaBlur:function(e) {
        var _this = this;
        _this.setData({
          shuping: e.detail.value
        })
        
    },
    choosePhoto: function() {
        var _this = this;
        // wx.showModal({
        //   title: '提示',
        //   content: '上传图片需要消耗流量，是否继续？',
        //   confirmText: '继续',
        //   success: function(res) {
        //     if (res.confirm) {
              
        //     }
        //   }
        // });
        wx.chooseImage({
          count: 3,
          sourceType: ['album'],
          success: function (res) {
            var tempFilePaths = res.tempFilePaths, imgLen = tempFilePaths.length;
            _this.setData({
              uploading: true,
              imgLen: _this.data.imgLen + imgLen
            });
            tempFilePaths.forEach(function(e){
              _this.uploadImg(e);
            });
          }
        });
      },
      uploadImg: function(path){
        var _this = this;
        // if(app.g_status){
        //   app.showErrorModal(app.g_status, '上传失败');
        //   return;
        // }
        wx.showNavigationBarLoading();
        // 上传图片
        wx.uploadFile({
          url: 'https://law.wxxsq.cn/api/upload',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          filePath: path,
          name: 'file',
          formData:{
            // token: _this.data.qiniu
          },
          success: function(res){
            // var data = JSON.parse(res.data);
            console.log(res.data)
            if(res.data){
                var imgs=_this.data.imgs.concat('https://law.wxxsq.cn/image/show/'+res.data)
              _this.setData({
                imgs: imgs,
                imgsurl: imgs.join(",")
              });
            }
            if(_this.data.imgs.length === _this.data.imgLen){
              _this.setData({
                uploading: false
              });
            }
          },
          fail: function(res){
            _this.setData({
              imgLen: _this.data.imgLen - 1
            });
          },
          complete: function() {
            wx.hideNavigationBarLoading();
          }
        });
      },
      previewPhoto: function(e){
        var _this = this;
        //预览图片
        if(_this.data.uploading){
          app.showErrorModal('正在上传图片', '预览失败');
          return false;
        }
        wx.previewImage({
          current: _this.data.imgs[e.target.dataset.index],
          urls: _this.data.imgs
        });
      },
    //点击提交作业
    tapSubmitReadingResult: function (e) {
        if (!app.getUserInfo()) {
            wx.navigateTo({
              url: '../login/login'
            })
            return false
        }
        var that = this;
        var jfAudio = that.data.JFAudio;
        var audioUrlList = [];
        console.log(that.data)
        //如果音频数目不够，不让提交
        // if (len < that.data.readingInfo.length) {
        //     wx.showToast({
        //         title: '请完成所有跟读再提交作业！',
        //         icon: 'success',
        //         duration: 1000
        //     });
        //     return false;
        // }
        wx.showToast({
            title: '正在提交作业……',
            icon: 'loading',
            duration: 5000
        });
        var userinfo=app.getUserInfo()
        qcloud.request({
            url: config.service.putread,
            data: {
                'cs_id': that.data.cs_id,
                'imgs': that.data.imgsurl,
                'audio_url': that.data.audio_url,
                'shuping': that.data.shuping,
                'openId':userinfo.openId
            },
            success(result) {
                // util.showSuccess('请求成功')
                that.setData({
                    content: result.data
                })
                wx.hideToast();
                if (result.data.code) {
                    wx.showModal({
                      title: '提示',
                      content: '发布成功',
                      success: function(res) {
                        // if (res.confirm) {
                        //   console.log('用户点击确定')
                        // } else if (res.cancel) {
                        //   console.log('用户点击取消')
                        // }
                        wx.redirectTo({
                            url: '../courseintro/courseintro?cs_id=' + that.data.cs_id
                        });
                      }
                    })

                }
                // console.log(result)
            },

            fail(error) {
                // util.showModel('请求失败1', error)
                console.log('request fail', error)
            }
        })
        // util.JFuploadfile({
        //     url: 'https://law.wxxsq.cn/api/wxupload',
        //     filePath: jfAudio[0].tempFilePath || '',
        //     name: 'wx_file_' + 1,
        //     formData: {
        //         'part_index': 1,
        //         'file_type': 3,
        //         'file_prefix': 'wx_file_'
        //     },
        //     success: function (res) {
        //         console.log(res);
                
                
        //         if (res) {
        //             that.setData({
			     //        audio_url: res
			     //    });

			     //    wx.showToast({
	       //              title: res.data.err_msg,
	       //              icon: 'success',
	       //              duration: 500
	       //          });
	       //          // 加入跟读（报名 + 提交作业）
        //             that.joinReading(res, function (data) {
        //                 //提交作业成功，跳转到结果页
        //                 var record_id = data.joinRes.record_id;
        //                 wx.hideToast();
        //                 setTimeout(function () {
        //                     wx.redirectTo({
        //                         url: '../result/result?record_id=' + record_id
        //                     });
        //                 },300);

        //                     });
        //         } else {
        //             console.warn("上传失败！");
        //         }

        //         // if (successNum == len) {
        //         //     //加入跟读（报名 + 提交作业）
        //         //     that.joinReading(audioUrlList, function (data) {
        //         //         //提交作业成功，跳转到结果页
        //         //         var record_id = data.joinRes.record_id;
        //         //         wx.hideToast();
        //         //         setTimeout(function () {
        //         //             wx.redirectTo({
        //         //                 url: '../result/result?record_id=' + record_id
        //         //             });
        //         //         },300);

        //         //     });
        //         // }
        //     }
        // })
        // for (var i = 0; i < len; i++) {
        //     (function (i) {
        //         console.log(jfAudio[i].tempFilePath);
        //         util.JFuploadfile({
        //             url: 'https://law.wxxsq.cn/api/wxupload',
        //             filePath: jfAudio[i].tempFilePath || '',
        //             name: 'wx_file_' + i,
        //             formData: {
        //                 'part_index': i,
        //                 'file_type': 3,
        //                 'file_prefix': 'wx_file_'
        //             },
        //             success: function (res) {
        //                 console.log(res);
        //                 var retData = JSON.parse(res.data);
        //                 if (retData && retData.code == 0) {
        //                     audioUrlList[i] = retData.data.url;
        //                     successNum++;
        //                 } else {
        //                     console.warn("上传失败！");
        //                 }
        //                 if (successNum == len) {
        //                     //加入跟读（报名 + 提交作业）
        //                     that.joinReading(audioUrlList, function (data) {
        //                         //提交作业成功，跳转到结果页
        //                         var record_id = data.joinRes.record_id;
        //                         wx.hideToast();
        //                         setTimeout(function () {
        //                             wx.redirectTo({
        //                                 url: '../result/result?record_id=' + record_id
        //                             });
        //                         },300);

        //                     });
        //                 }
        //             }
        //         })
        //     })(i);
        // }
    },
    //加入跟读
    joinReading: function (audioUrlList, cal) {
        var that = this;
        console.log(that.data.audio_url);
        util.JFrequest({
            url: 'https://t.superabc.cn/c/os/reading/joinreading',
            param: {
                'cs_id': that.data.cs_id,
                'imgs': that.data.imgs,
                'audio_url': that.data.audio_url,
                'shuping': that.data.shuping
            },
            success: function (res) {
                if (res && res.statusCode == 200 && res.data && res.data.code == 0) {
                    if (typeof cal == 'function') {
                        cal(res.data.data);
                    }
                }else {
                    if(res.data.code == 600004){
                        wx.showToast({
                            title: res.data.err_msg,
                            icon: 'success',
                            duration: 500
                        });
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '../course/course?cs_id=' + that.data.cs_id
                            });
                        },800);

                    }
                }
            },
            complete: function (res) {
                console.log(res);
            }
        });
    },
    //播放标准片段音
    tapPlayPartAudio: function (e) {
        var thisAudioId = 'partaudio-' + e.currentTarget.id;
        var thisAudioCtx = wx.createAudioContext(thisAudioId);
        thisAudioCtx.play();
    },
    emptyAudio: {
        'recording': null,
        'playing': null,
        'hasRecord': false,
        'tempFilePath': ''
    },
    //录音
    tapCompleteUserAudio: function (e, itemIndex) {
        var that = this;
        var readingItem=0;
        // if (itemIndex) {
        //     readingItem = itemIndex;
        // } else {
        //     readingItem = e.currentTarget.dataset.reading_item;
        // }
        wx.stopRecord();
        that.updateJFAudio(readingItem, 'recording', false);
        that.setData({
            recording: false
        });
        clearInterval(that.progressTimer);
        clearInterval(that.leftTimer);
    },
    tapRecordUserAudio: function (e) {
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        wx.getSetting({
            success(res) {
                console.log(res)
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success() {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            wx.startRecord()
                        }
                    })
                }
            }
        })
        var that = this;
        // var readingItem = e.currentTarget.dataset.reading_item;
        var readingItem=0
        //当前所在页面
        var jfAudio = that.data.JFAudio;
        var curAudioModel = that.updateJFAudioModel(readingItem, jfAudio[readingItem]);
        //
        wx.showToast({
            title: '开始录音',
            icon: 'success',
            duration: 500
        });

        that.updateJFAudio(readingItem, 'recording', true);
        that.setData({
            recording: true
        });
        //更新进度条
        var size = 100;
        that.setData({
            currentProgress: 0
        });
        that.progressTimer = setInterval(function () {
            // var num = Math.ceil(parseFloat(that.data.readingInfo[readingItem]['audio_duration']) * 1000);
            var num = Math.ceil(parseFloat(60) * 1000);
            var newPro = that.data.currentProgress;
            newPro += size / num * 100;
            if (newPro >= 100) {
                that.setData({
                    currentProgress: 100
                });
                that.tapCompleteUserAudio(null, readingItem);
            } else {
                that.setData({
                    currentProgress: newPro
                });
            }

        }, size);
        var lefttime=60
        that.leftTimer=setInterval(function () {
            // var num = Math.ceil(parseFloat(that.data.readingInfo[readingItem]['audio_duration']) * 1000);
            
                that.setData({
                    lefttime: lefttime--
                });
            

        }, 1000);
        //
        wx.startRecord({
            success: function (res) {
                that.updateJFAudio(readingItem, 'tempFilePath', res.tempFilePath);
                that.updateJFAudio(readingItem, 'hasRecord', true);
                //
                that.setData({
                    recording: false
                });
            },
            complete: function () {
                that.updateJFAudio(readingItem, 'recording', false);
                that.setData({
                    recording: false
                });
                clearInterval(that.progressTimer);
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    //回放
    tapRePlayUserAudio: function (e) {
        var that = this;
        // var readingItem = e.currentTarget.dataset.reading_item;
        var readingItem = 0;
        //当前所在页面
        var jfAudio = that.data.JFAudio;
        wx.playVoice({
            filePath: jfAudio[readingItem].tempFilePath,
            success: function () {
                that.updateJFAudio(readingItem, 'playing', false);
            }
        })
    },

    //****封装一下**** start
    updateJFAudio: function (index, key, value) {
        var that = this;
        var jfAudio = that.data.JFAudio;
        jfAudio[index][key] = value;
        that.setData({
            JFAudio: jfAudio
        });
        return jfAudio;
    },
    updateJFAudioModel: function (index, model) {
        var that = this;
        var jfAudio = that.data.JFAudio;
        var _model = model || that.emptyAudio;
        jfAudio[index] = _model;
        that.setData({
            JFAudio: jfAudio
        });

        return _model;
    }
    //****封装一下**** end
});
