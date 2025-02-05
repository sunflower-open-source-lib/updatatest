// pages/publish/publish.js
var constants = require('../../vendor/wafer2-client-sdk/lib/constants.js');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    skey: '',
    publish: {},
    hasLocation: 'false',
    location: {},
    address: '',
    goldsNumber: 10,
    goldsNumMin: 5,
    goldsNumMax: 25,
    gold: "",
  },
  onLoad: function () {
    var that = this
    var temp = wx.getStorageSync(SESSION_KEY)
    var gold = wx.getStorageSync('gold')
    that.setData({
      userInfo: temp.userinfo,
      skey: temp.skey,
      gold: gold,
    })
  },

  add_gold: function (e) {
    console.log(e.userInfo.gold)
  },
  /**
   * 提交表单
   */
  formSubmit: function (e) {
    var that = this
    console.log('start formSubmit')
    console.log(e)
    if (that.data.location.address == undefined
      || e.detail.value.title == ''
      || e.detail.value.description == '') {
      util.showModel('提示', '请完善信息');
    }
    else {
      wx.showModal({
        title: '提示',
        content: '是否发布任务',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: 'https://800321007.littlemonster.xyz/weapp/task/',
              data: {
                skey: that.data.skey,
                title: e.detail.value.title,
                description: e.detail.value.description,
                adress: that.data.location.address,
                latitude: that.data.location.latitude,
                longitude: that.data.location.longitude,
                gold: that.data.goldsNumber,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'post',
              dataType: 'json',
              responseType: 'text',

              success: function (res) {
                if (res.data.code == '0') {
                  console.log("任务post成功")
                  console.log(res.data)
                  wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000,
                    complete: function () {
                      setTimeout(function () {
                        wx.reLaunch({
                          url: '/pages/my/my'
                        })
                      }, 2000)
                    }
                  })
                  wx.setStorageSync('gold', res.data.data.msg[0].gold)
                }
                else {
                  console.log("任务post失败")
                  util.showModel('error', '发布失败')
                }
              },
              fail: function (res) {
                console.log("任务post失败")
                util.showModel('error', '发布失败')
              },
              complete: function (res) { },
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  /**
   * 打开腾讯位置
   */
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            address: res.address + res.name,
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
    })
  },
  /**
   * 减少赏金
   */
  numJianTap: function () {
    var that = this
    if (that.data.goldsNumber > that.data.goldsNumMin) {
      var tempgolds = that.data.goldsNumber;
      tempgolds--;
      that.setData({
        goldsNumber: tempgolds
      })
    } else
      util.showModel('提示', '抠门可不太好哦！')
  },
  /**
   * 增加赏金
   */
  numJiaTap: function () {
    var that = this
    if (that.data.goldsNumber < that.data.gold && that.data.goldsNumber < that.data.goldsNumMax) {
      var tempgolds = that.data.goldsNumber;
      tempgolds++;
      that.setData({
        goldsNumber: tempgolds
      })
    } else
      util.showModel('提示', '赏金已达最大值！')
  },
  /**
   * 分享页面
   */
  onShareAppMessage: function () {
    return {
      title: '看哪小程序',
      desc: '你想看哪，我帮你',
      path: '/pages/start/start?id=123',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})