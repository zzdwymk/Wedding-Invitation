Page({
  data: {
    navBarHeight: 180,
    navTitleTop: 60,
    giftRecords: []
  },

  onLoad() {
    const app = getApp();
    if (app.globalData.giftRecords) {
      this.setData({
        giftRecords: app.globalData.giftRecords
      });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});