//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },
    onLoad: function () {
        
    },
    makePhoneCall:function (e) {
    // body...
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel, //仅为示例，并非真实的电话号码
      success: function() {
        console.log('success') // data
      },
      fail: function() {
        console.log('fail') // data
      }
    })
  },

    
})
