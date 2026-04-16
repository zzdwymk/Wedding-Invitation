Page({
  data: {
    navBarHeight: 180,
    navTitleTop: 60,
    currentVideo: '',
    videoList: []
  },

  onLoad(options) {
    if (options.url) {
      this.setData({
        currentVideo: decodeURIComponent(options.url)
      });
    }
    const app = getApp();
    if (app.globalData.videoList) {
      this.setData({
        videoList: app.globalData.videoList
      });
    }
  },

  onShow() {
  },

  onHide() {
    this.pauseAllVideos();
  },

  onUnload() {
    this.pauseAllVideos();
  },

  goBack() {
    this.pauseAllVideos();
    wx.navigateBack();
  },

  onVideoPlay(e) {
    wx.pauseBackgroundAudio();
    const app = getApp();
    app.globalData.isMusicPlaying = false;
    const currentId = e.currentTarget.id;
    if (currentId === 'currentVideo') {
      for (let i = 0; i < this.data.videoList.length; i++) {
        const videoContext = wx.createVideoContext('video_' + i);
        if (videoContext) videoContext.pause();
      }
    } else {
      const currentIndex = parseInt(currentId.split('_')[1]);
      const mainVideoContext = wx.createVideoContext('currentVideo');
      if (mainVideoContext) mainVideoContext.pause();
      for (let i = 0; i < this.data.videoList.length; i++) {
        if (i !== currentIndex) {
          const videoContext = wx.createVideoContext('video_' + i);
          if (videoContext) videoContext.pause();
        }
      }
    }
  },

  pauseAllVideos() {
    const mainVideoContext = wx.createVideoContext('currentVideo');
    if (mainVideoContext) mainVideoContext.pause();
    for (let i = 0; i < this.data.videoList.length; i++) {
      const videoContext = wx.createVideoContext('video_' + i);
      if (videoContext) videoContext.pause();
    }
  }
});