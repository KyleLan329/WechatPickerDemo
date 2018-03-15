// pages/house_estimate/estimate.js
var tcity = require("../../utils/citys.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    searchResults: [],
    searchResult: '请输入具体楼/栋/门牌号',
    houseArea: '',
    houseAvgPrice: '',
    condition: false,
    isSearching: false,
    hasSelected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '载入中(•ᴗ•)',
      icon: 'loading',
      mask: true
    });

    var _that = this;

    console.log("onLoad");
    var that = this;

    tcity.init(that); //将城市列表载入data

    var cityData = that.data.cityData;


    const provinces = [];


    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name); //将省份信息记入provinces数组
    }
    console.log('省份完成');


    that.setData({
      'provinces': provinces //储存在Page.data中 
    })

    if (options.hasSelected) { //从搜索页面回到主页
      this.setData({
        searchResult: options.searchResult,
        houseArea: options.houseArea,
        houseAvgPrice: options.housePrice,
        hasSelected: options.hasSelected,
        province: options.province,
        city: options.city,
        county: options.county,
        active: options.active
      });
      _that.syncAddress();
      wx.hideToast();
    }else{

    wx.getLocation({  //获取地理位置信息-经度纬度
      type: 'wgs84',
      success: function (res) {
        console.log("获取客户当前位置完成");
        var latitude = res.latitude;
        var longitude = res.longitude;
        _that.queryAddress(latitude, longitude); //将经纬度转化成地理位置信息
        wx.hideToast();   
      },
      fail: function () {
        wx.showModal({
          title: '获取地理位置失败',
          content: '请您允许小程序获取您所在的位置信息。',
          showCancel: false
        })
      }
    });
    }
    
    

    

    
    console.log('初始化完成');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  bindChange: function (event) {  //当picker列表变化时，相应修改地区input中显示的位置值

    var val = event.detail.value;
    var t = this.data.values;
    var cityData = this.data.cityData;

    this.setData({
      hasSelected: false
    });

    if (val[0] != t[0]) { //省份是否相同
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) { //城市是否相同
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) { //区县是否相同
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

    
  },

  areaInput:function (event) {
    console.log(event.detail.value);
    this.setData({
      houseArea: event.detail.value
    });
  },

  onfocus: function (event) {  //打开搜索页面
    // var isSearching = this.data.isSearching;
    // isSearching = !isSearching;
    // this.setData({
    //   searchResult: '',
    //   isSearching: isSearching,
    //   hasSelected: false
    // });

    var city = this.data.city;
    var county = this.data.county;
    var province = this.data.province;

    wx.navigateTo({
      url: '../house_search/search?city='+city+'&county='+county+'&province='+province
    })
  },

  

  queryAddress: function (latitude, longitude) {  //调用腾讯地图API进行经纬度转换，API限制-每秒5次，单日10000次,下面的key换成自己申请的
    var _that = this;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=LCMBZ-NMFWS-XUTOR-6CNF5-TNN3Q-X3FAG',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var province = res.data.result.ad_info.province;
        var city = res.data.result.ad_info.city;
        var district = res.data.result.ad_info.district;
        _that.setData({ //结果更新至data中
          province: province,
          city: city,
          county: district
        });
        _that.syncAddress();

      }
    });

  },

  syncAddress: function () {
    //获取用户所在地区并转换成相应的value记入data
    var val = this.data.value;
    var t = this.data.values;
    var cityData = this.data.cityData;

    var curProvince = this.data.province;
    var curCity = this.data.city;
    var curCounty = this.data.county;

    for (let i = 0; i < cityData.length; i++) {
      if (curProvince == cityData[i].name) {
        val[0] = i;
      }
    }

    for (let j = 0; j < cityData[val[0]].sub.length; j++) {
      if (curCity == cityData[val[0]].sub[j].name) {
        val[1] = j;
      }
    }

    for (let k = 0; k < cityData[val[0]].sub[val[1]].sub.length; k++) {
      if (curCounty == cityData[val[0]].sub[val[1]].sub[k].name) {
        val[2] = k;
      }
    }

    console.log(val[0], val[1], val[2]);

    //将客户所在地区的城市与区县记录进Page.data
    const citys = [];
    const countys = [];

    // console.log(cityData[val[0]].sub[val[1]].sub[val[2]].name);

    for (var l = 0; l < cityData[val[0]].sub.length; l++) {
      citys.push(cityData[val[0]].sub[l].name);
    }

    for (var m = 0; m < cityData[val[0]].sub[val[1]].sub.length; m++) {
      countys.push(cityData[val[0]].sub[val[1]].sub[m].name);
    }

    console.log('city,county完成');

    this.setData({
      'citys': citys,
      'countys': countys,
      'value': val,
      'values': val
    });
  },

  open: function (event) { //打开地址选择picker

    this.setData({
      condition: true
    });
  },

  close: function () {
    this.setData({
      condition: false
    });
  },


  getEstimateResult: function () { //点击查询房产后返回产值
    if (this.data.hasSelected) {
      wx.navigateTo({
        url: '../house_estimate_result/result?searchResult=' + this.data.searchResult + '&houseArea=' + this.data.houseArea + '&houseAvgPrice=' + this.data.houseAvgPrice
      });
    } else {
      wx.showModal({
        title: '咦？您还没有选择具体房产哦(￣.￣)',
        content: '请选择详细地址后再查询估值ヽ(￣▽￣)ﾉ',
        showCancel: false
      })
    }
    
  },

  moveToHistory: function (){ //点击前往历史记录
      wx.navigateTo({
        url: '../house_estimate_history/history'
      })
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