Page({
  data: {
    navBarHeight: 180,
    navTitleTop: 60,
    comments: []
  },

  onLoad() {
    const app = getApp();
    if (app.globalData.comments) {
      this.setData({
        comments: app.globalData.comments
      });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});