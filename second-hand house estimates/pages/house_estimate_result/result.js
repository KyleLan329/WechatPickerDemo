// pages/house_estimate_result/result.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNumber: 0,
    isHistory: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //导入房产信息，展示总价
    console.log(options.hisPrice);
    var isHistory = options.isHistory;
    var _that = this;
    if (isHistory) {
      this.setData({
        searchResult: options.searchResult,
        totalPrice: options.hisPrice,
        totalNumber: _that.randomNumber(),
        isHistory: isHistory
      });
      return;
    } else {
    
      var totalPrice = (options.houseArea * options.houseAvgPrice).toFixed(2);
      console.log(totalPrice);
      totalPrice = util.toThousands(totalPrice);
      var totalNumber = options.totalNumber;

      this.setData({
        searchResult: options.searchResult,
        houseArea: options.houseArea,
        houseAvgPrice: options.houseAvgPrice,
        totalPrice: totalPrice,
        totalNumber: _that.randomNumber()
      });
    }

    
    if (!this.data.isHistory) {
      var searchHistory = wx.getStorageSync('searchHistory') || [];
      var temp = {
        searchResult: this.data.searchResult,
        houseArea: this.data.houseArea,
        houseAvgPrice: this.data.houseAvgPrice,
        totalPrice: this.data.totalPrice,
        totalNumber: this.data.totalNumber,
        log: Date.now()
      };
      searchHistory.unshift(temp);
      wx.setStorageSync('searchHistory', searchHistory);
    }
  },



  reEstimate: function () {
    wx.redirectTo({
      url: '../house_estimate/estimate'
    })
  },

  randomNumber: function () {
    var num = (Math.random() * 100).toFixed(0) + this.data.totalNumber;
    this.setData({
      totalNumber: num
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})