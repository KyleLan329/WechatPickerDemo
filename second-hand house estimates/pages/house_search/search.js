// pages/house_search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "",
    county: '',
    searchResults: [],
    searchResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      province: options.province,
      city: options.city,
      county: options.county
    });
  },

  searhAddress: function (event) { //搜索小区并返回模糊查询结果
    console.log(event.detail.value);
    var _that = this;
    this.data.searchResult = [];
    var curCity = this.data.city;
    var curCounty = this.data.county;
    var address = event.detail.value;

    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion/?region=' + curCity + curCounty + '&region_fix=1&filter=category=住宅区&keyword=' + address + '&key=LCMBZ-NMFWS-XUTOR-6CNF5-TNN3Q-X3FAG',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.data.length == 0) { //若无搜索结果则提示用户
          _that.setData({
            searchResults: [{
              title: curCounty + "暂无此小区",
              address: "请确认后再次输入"
            }]
          });
          return;
        }
        var searchResults = [];
        for (var i = 0; i < res.data.data.length; i++) {
          var result = res.data.data[i];
          var title = result.title;
          var address = result.address;
          if (address.length >= 20) {
            address = address.substring(0, 20) + "...";
          }

          var temp = {
            title: title,
            address: address
          }

          searchResults.push(temp);
        }
        _that.setData({ //结果更新至data中
          searchResults: searchResults
        });
      },
    });
  },

  tapOnSearchResult: function (event) { //点击选中小区标题修改搜索地址（ps:并且虚构一个均价与房产面积，没接口我也不想这样- -）
    var searchResult = event.currentTarget.dataset.text;

    this.setData({
      searchResult: searchResult
    });


    var houseArea = (Math.random() * 260 + 40).toFixed(2);
    var housePrice = (Math.random() * 100000 + 30000).toFixed(2);

    this.setData({
      hasSelected: true
    });

    wx.redirectTo({
      url: '../house_estimate/estimate?searchResult=' + searchResult+'&houseArea='+houseArea+'&housePrice='+housePrice+'&hasSelected='+true +'&province='+this.data.province+'&city='+this.data.city+'&county='+this.data.county+ '&active='+true
    });

  },
  clearInput: function (event) { //关闭搜索页面
    this.setData({
      searchResult: ''
    });
  },
  completeInput: function () {
    this.setData({
      searchResult: ''
    });
    wx.navigateBack({
      delta: 1
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