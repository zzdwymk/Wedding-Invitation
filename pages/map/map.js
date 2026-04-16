Page({
  data: {
    deviceType: '',
    statusBarHeight: 0,
    navBarHeight: 180,
    navTitleTop: 85,
    latitude: 23.061390729240788,
    longitude: 113.58065185774706,
    markers: [{
      id: 0,
      latitude: 23.060780729230777,
      longitude: 113.58075185774706,
      width: 40,
      height: 40,
      iconPath: '/images/定位.svg'
    }],
    address: '广东省东莞市麻涌镇广州新华学院',
    phone: '027-12345678'
  },

  onLoad() {
    this.getDeviceInfo();
    const app = getApp();
    if (app.globalData.weddingLocation) {
      this.setData({
        latitude: app.globalData.weddingLocation.latitude,
        longitude: app.globalData.weddingLocation.longitude,
        address: app.globalData.weddingLocation.address
      });
    }
  },

  getDeviceInfo() {
    try {
      if (wx.getDeviceInfo) {
        const deviceInfo = wx.getDeviceInfo();
        const platform = deviceInfo.system;
        const statusBarHeight = deviceInfo.statusBarHeight || 0;
        let deviceType = '';
        let navBarHeight = 44;
        let navTitleTop;

        if (platform.includes('iOS')) {
          deviceType = 'apple';
          navBarHeight = 180;
          navTitleTop = 85;
        } else if (platform.includes('Android')) {
          deviceType = 'android';
          navBarHeight = 180;
          navTitleTop = 90;
        } else if (platform.includes('HarmonyOS')) {
          deviceType = 'harmony';
          navBarHeight = 170;
          navTitleTop = 70;
        } else {
          deviceType = 'other';
        }

        this.setData({
          deviceType: deviceType,
          statusBarHeight: statusBarHeight,
          navBarHeight: navBarHeight,
          navTitleTop: navTitleTop
        });
      } else {
        const systemInfo = wx.getSystemInfoSync();
        const platform = systemInfo.platform;
        const statusBarHeight = systemInfo.statusBarHeight || 0;
        let deviceType = '';
        let navBarHeight = 180;
        let navTitleTop = 85;

        if (platform === 'ios') {
          deviceType = 'apple';
          navTitleTop = 85;
        } else if (platform === 'android') {
          deviceType = 'android';
          navTitleHeight = 90;
        } else {
          deviceType = 'other';
        }

        this.setData({
          deviceType: deviceType,
          statusBarHeight: statusBarHeight,
          navBarHeight: navBarHeight,
          navTitleTop: navTitleTop
        });
      }
    } catch (error) {
      console.log('Error getting device info:', error);
    }
  },

  goBack() {
    wx.navigateBack();
  },

  openLocation() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: '婚礼地点',
      address: this.data.address,
      scale: 18
    });
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    });
  }
});