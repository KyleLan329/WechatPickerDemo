// pages/house_estimate_history/history.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchHistory = wx.getStorageSync('searchHistory') || [];
    console.log(searchHistory);

    var historyItem = [];
    for (var i = 0; i < searchHistory.length; i++) {
      var totalPrice = (searchHistory[i].houseArea * searchHistory[i].houseAvgPrice).toFixed(2);
      totalPrice = util.toThousands(totalPrice);
      var log = util.formatTime(new Date((searchHistory[i].log)));
      var temp = {
        searchResult: searchHistory[i].searchResult,
        houseArea: searchHistory[i].houseArea,
        houseAvgPrice: searchHistory[i].houseAvgPrice,
        totalPrice: totalPrice,
        log: log
      };
      historyItem.push(temp);
    }
    this.setData({
      searchHistory: historyItem
    });
  },

  onHistoryTap:function (event) {
    var searchResult = event.currentTarget.dataset.searchresult;
    var totalPrice = event.currentTarget.dataset.totalprice;
    wx.navigateTo({
      url: '../house_estimate_result/result?searchResult=' + searchResult + '&hisPrice=' + totalPrice + '&isHistory=true'
    })
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