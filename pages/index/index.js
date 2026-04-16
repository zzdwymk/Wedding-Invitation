// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    showElements: {
      userinfo: false,
      nicknameWrapper: false,
      userinfoAvatar: false,
      userinfoNickname: false,
      usermotto: false,
      content1: false,
      content2: false,
      content3: false,
      section1: false,
      section2: false,
      section3: false
    },
    navTitleColor: 'white',
    navBarOpacity: 1,
    navBarTop: 0,
    navBarHeight: 44,
    statusBarHeight: 0,
    deviceType: '',
    navTitleTop: 60,
    currentPage: 1,
    totalPages: 3,
    showShareModal: false,
    showSaveQRModal: false,
    qrcodeUrl: '',
    showFireworks: false,
    fireworks: [],
    particles: [],
    showCommentModal: false,
    commentName: '',
    commentText: '',
    userAvatar: '',
    scrollToViewId: '',
    highlightComment: false,
    showGiftModal: false,
    selectedGiftIndex: -1,
    customAmount: '',
    gifts: [
      { name: '蛋糕', price: 66, icon: '/images/蛋糕.svg' },
      { name: '鲜花', price: 99, icon: '/images/鲜花.svg' },
      { name: '钻戒', price: 520, icon: '/images/钻戒.svg' },
      { name: '红酒', price: 188, icon: '/images/红酒.svg' },
      { name: '奶茶', price: 20, icon: '/images/奶茶.svg' },
      { name: '鞭炮', price: 50, icon: '/images/鞭炮.svg' },
      { name: '烟花', price: 100, icon: '/images/烟花.svg' },
      { name: '祝福', price: 10, icon: '/images/祝福.svg' }
    ],
    giftRecords: [
      { id: 1, name: '小红', avatar: '', giftName: '蛋糕', count: 1, amount: 66 },
      { id: 2, name: '小明', avatar: '', giftName: '鲜花', count: 2, amount: 198 }
    ],
    comments: [
      { id: 1, name: '小明', text: '祝你们百年好合，永结同心！', time: '2026-04-10', avatar: '' },
      { id: 2, name: '小红', text: '新婚快乐，甜甜蜜蜜！', time: '2026-04-11', avatar: '' },
      { id: 3, name: '新郎好友', text: '哥们又闪婚呢！', time: '2026-04-12', avatar: '' }
    ],
    weddingDate: '2026/5/20 8:00',
    countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    weddingInfo: {
      lunar: '农历四月初四',
      week: '星期三'
    },
    videoUrl: 'http://localhost:3000/videos/video_1776313276435_1rv90x.mp4',
    videoCover: '',
    videoList: [
      { id: 1, url: 'http://localhost:3000/videos/video_1776313284167_1cnmox.mp4', title: '婚礼花絮1' },
      { id: 2, url: 'http://localhost:3000/videos/video_1776313280101_qwsbms.mp4', title: '婚礼花絮2' },
      { id: 3, url: 'http://localhost:3000/videos/video_1776313276435_1rv90x.mp4', title: '婚礼预告' },
      { id: 4, url: 'http://localhost:3000/videos/%E7%94%9F%E6%88%90%E5%A9%9A%E7%A4%BC%E9%A2%84%E5%91%8A%E7%89%87.mp4', title: '婚礼成品预告' }
    ],
    guestList: [
      { id: 1, name: '张三', avatar: '', count: 2 },
      { id: 2, name: '李四', avatar: '', count: 3 },
      { id: 3, name: '王五', avatar: '', count: 1 },
      { id: 4, name: '赵六', avatar: '', count: 4 }
    ],
    musicUrl: 'http://localhost:3000/music/Westlife - My Love.mp3',
    isMusicPlaying: false,
    musicPosition: { x: 173, y: 618 },
    hearts: [],
    showHeartCanvas: false,
    showZanCanvas: false,
    zanList: []
  },
  lifetimes: {
    attached() {
      this.getDeviceInfo();
      this.setData({
        'showElements.section1': true
      });
      this.startCountdown();
      this.checkElementsVisibility();
      const app = getApp();
      app.globalData.comments = this.data.comments;
      app.globalData.giftRecords = this.data.giftRecords;
      app.globalData.videoList = this.data.videoList;
      wx.onBackgroundAudioStop(() => {
        this.setData({ isMusicPlaying: false });
      });
    },
  },

  onShow() {
    const app = getApp();
    this.setData({ isMusicPlaying: app.globalData.isMusicPlaying });
  },

  methods: {
    // 事件处理函数
    bindViewTap() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },

    // 音乐播放/暂停
    toggleMusic() {
      if (this.data.isMusicPlaying) {
        wx.pauseBackgroundAudio();
        this.setData({ isMusicPlaying: false });
        getApp().globalData.isMusicPlaying = false;
      } else {
        wx.stopVoice();
        wx.pauseBackgroundAudio();
        const videoContext = wx.createVideoContext('indexVideo');
        if (videoContext) videoContext.pause();
        wx.playBackgroundAudio({
          dataUrl: this.data.musicUrl,
          success: () => {
            this.setData({ isMusicPlaying: true });
            getApp().globalData.isMusicPlaying = true;
          }
        });
      }
    },

    // 暂停音乐
    pauseMusic() {
      wx.pauseBackgroundAudio();
      this.setData({ isMusicPlaying: false });
      getApp().globalData.isMusicPlaying = false;
    },

    // 音乐拖动
    onMusicTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.musicStartX = this.data.musicPosition.x;
      this.musicStartY = this.data.musicPosition.y;
    },

    onMusicTouchMove(e) {
      const deltaX = e.touches[0].clientX - this.startX;
      const deltaY = e.touches[0].clientY - this.startY;
      const systemInfo = wx.getWindowInfo();
      const newX = Math.max(0, Math.min(systemInfo.windowWidth - 40, this.musicStartX + deltaX));
      const newY = Math.max(0, Math.min(systemInfo.windowHeight - 80, this.musicStartY + deltaY));
      this.setData({
        musicPosition: { x: newX, y: newY }
      });
    },

    // 点击永结同心，画爱心
    onHeartTap() {
      this.setData({ showHeartCanvas: true });
      const query = wx.createSelectorQuery();
      query.select('#heartCanvas').fields({ node: true, size: true }).exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const systemInfo = wx.getWindowInfo();
        // console.log(systemInfo);
        canvas.width = systemInfo.windowWidth;
        canvas.height = systemInfo.windowHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 - 50;
        const scale = 8;

        const heartPath = (t) => {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          return { x: centerX + x * scale, y: centerY + y * scale };
        };

        let progress = 0;
        const totalPoints = 100;
        const drawFrame = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const currentPoints = Math.floor(progress * totalPoints);

          ctx.strokeStyle = '#b71c1c';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#b71c1c';

          ctx.beginPath();
          for (let i = 0; i <= currentPoints; i++) {
            const t = (i / totalPoints) * Math.PI * 2;
            const point = heartPath(t);
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.stroke();

          progress += 0.02;
          if (progress < 1) {
            setTimeout(drawFrame, 16);
          } else {
            setTimeout(() => {
              this.setData({ showHeartCanvas: false });
            }, 1500);
          }
        };
        drawFrame();
      });
    },

    // 点击点赞，飘浮点赞效果
    onZanTap() {
      const systemInfo = wx.getWindowInfo();
      const newZanList = [];
      for (let i = 0; i < 6; i++) {
        newZanList.push({
          id: Date.now() + i,
          x: 80 + Math.random() * (systemInfo.windowWidth - 160),
          delay: Math.random() * 0.3,
          type: (i % 3) + 1,
          expireTime: Date.now() + 2500
        });
      }
      const zanList = [...this.data.zanList, ...newZanList];
      this.setData({ showZanCanvas: true, zanList });
      if (!this.zanCleanTimer) {
        this.zanCleanTimer = setInterval(() => {
          const now = Date.now();
          const filtered = this.data.zanList.filter(item => item.expireTime > now);
          if (filtered.length === 0) {
            clearInterval(this.zanCleanTimer);
            this.zanCleanTimer = null;
            this.setData({ showZanCanvas: false, zanList: [] });
          } else {
            this.setData({ zanList: filtered });
          }
        }, 500);
      }
    },

    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
      // 选择头像后检查元素
      setTimeout(() => {
        this.checkElementsVisibility();
      }, 100);
    },
    onInputChange(e) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          // 获取用户信息后检查元素
          setTimeout(() => {
            this.checkElementsVisibility();
          }, 100);
        }
      })
    },
    
    // 获取设备信息，识别机型并计算导航栏高度
    getDeviceInfo() {
      try {
        // 优先使用wx.getDeviceInfo()获取设备信息，支持HarmonyOS平台
        if (wx.getDeviceInfo) {
          const deviceInfo = wx.getDeviceInfo();
          const platform = deviceInfo.system;
          console.log(platform);
          const statusBarHeight = deviceInfo.statusBarHeight || 0;
          let deviceType = '';
          let navBarHeight = 44;
          let navTitleTop;
          
          // 识别设备类型
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
          // 兼容旧版本，使用wx.getSystemInfoSync()
          const systemInfo = wx.getSystemInfoSync();
          const platform = systemInfo.platform;
          const statusBarHeight = systemInfo.statusBarHeight || 0;
          let deviceType = '';
          let navBarHeight = 44;
          
          // 识别设备类型
          if (platform === 'ios') {
            deviceType = 'apple';
            // iOS设备导航栏高度通常为44px
          } else if (platform === 'android') {
            deviceType = 'android';
            // Android设备导航栏高度通常为48px
            navBarHeight = 48;
          } else {
            deviceType = 'other';
          }
          
          this.setData({
            deviceType: deviceType,
            statusBarHeight: statusBarHeight,
            navBarHeight: navBarHeight
          });
        }
      } catch (error) {
        console.log('Error getting device info:', error);
      }
    },

    // 启动倒计时
    startCountdown() {
      this.getWeddingInfo();
      this.updateCountdown();
      this.countdownTimer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },

    // 获取婚礼日期的万年历信息
    getWeddingInfo() {
      const weddingDate = this.parseDate(this.data.weddingDate);
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const week = weekDays[weddingDate.getDay()];

      this.setData({
        'weddingInfo.week': week,
        'weddingInfo.lunar': '农历四月初四'
      });
    },

    // 解析日期字符串为 Date 对象（兼容 iOS）
    parseDate(dateStr) {
      const parts = dateStr.replace(/\//g, ' ').split(' ');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      const timeParts = parts[3] ? parts[3].split(':') : [0, 0, 0];
      const hours = parseInt(timeParts[0]) || 0;
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;
      return new Date(year, month, day, hours, minutes, seconds);
    },

    // 更新倒计时
    updateCountdown() {
      const weddingDate = this.parseDate(this.data.weddingDate);
      const now = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        this.setData({
          countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 }
        });
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.setData({
        countdown: { days, hours, minutes, seconds }
      });
    },

    // 防抖函数
    debounce(func, delay) {
      let timer = null;
      return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, arguments);
        }, delay);
      };
    },
    
    onScroll(e) {
      this.setData({
        scrollTop: e.detail.scrollTop
      });

      // 使用防抖处理，减少检查频率，但保持流畅度
      if (!this.debouncedCheck) {
        this.debouncedCheck = this.debounce(this.checkElementsVisibility, 50);
      }
      this.debouncedCheck();
    },
    
    checkElementsVisibility() {
      const windowInfo = wx.getWindowInfo();
      const windowHeight = windowInfo.windowHeight;

      try {
        wx.createSelectorQuery().selectAll('#section1, #section2, #section3').boundingClientRect((rects) => {
          if (rects && rects.length > 0) {
            const elementIds = ['section1', 'section2', 'section3'];
            const newShowElements = { ...this.data.showElements };
            let hasChanges = false;
            let newNavTitleColor = this.data.navTitleColor;
            let newNavBarOpacity = this.data.navBarOpacity;
            let newNavBarTop = this.data.navBarTop;
            let newCurrentPage = this.data.currentPage;

            rects.forEach((rect, index) => {
              if (rect) {
                const key = elementIds[index];
                const isInView = rect.top < windowHeight * 0.8 && rect.bottom > 0;

                if (isInView !== newShowElements[key]) {
                  newShowElements[key] = isInView;
                  hasChanges = true;
                }

                // 确定当前显示的页面
                if (isInView && rect.top > -windowHeight * 0.5) {
                  newCurrentPage = index + 1;
                }

                newNavTitleColor = '#333333';
                newNavBarOpacity = 1;
                newNavBarTop = 0;
              }
            });

            if (hasChanges || newNavTitleColor !== this.data.navTitleColor || newNavBarOpacity !== this.data.navBarOpacity || newNavBarTop !== this.data.navBarTop || newCurrentPage !== this.data.currentPage) {
              this.setData({
                showElements: newShowElements,
                navTitleColor: newNavTitleColor,
                navBarOpacity: newNavBarOpacity,
                navBarTop: newNavBarTop,
                currentPage: newCurrentPage
              });
            }
          }
        }).exec();
      } catch (error) {
        console.log('Error checking element visibility:', error);
      }
    },
    
    // 处理宾客信息提交
    submitGuestInfo(e) {
      const guestInfo = e.detail.value;
      console.log('提交的宾客信息:', guestInfo);

      // 这里可以添加表单验证逻辑
      if (!guestInfo.name || !guestInfo.phone) {
        wx.showToast({
          title: '请填写姓名和电话',
          icon: 'none'
        });
        return;
      }

      // 模拟提交成功
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });

      // 可以在这里添加数据存储逻辑，如发送到后端服务器
    },

    // 宾客回执表单提交
    onSubmitRSVP(e) {
      const { guestName, guestCount } = e.detail.value;

      if (!guestName || !guestCount) {
        wx.showToast({ title: '请填写姓名和人数', icon: 'none' });
        return;
      }

      const newGuest = {
        id: Date.now(),
        name: guestName,
        avatar: '',
        count: parseInt(guestCount) || 2
      };

      this.setData({
        guestList: [newGuest, ...this.data.guestList]
      });

      wx.showToast({ title: '提交成功', icon: 'success' });
    },

    // 滚动到指定页面
    scrollToPage(pageNum) {
      const sectionId = `section${pageNum}`;
      wx.createSelectorQuery().select(`#${sectionId}`).boundingClientRect((rect) => {
        if (rect) {
          wx.pageScrollTo({
            scrollTop: rect.top + this.data.scrollTop,
            duration: 500
          });
        }
      }).exec();
    },

    // 上一页
    onPreviousPage() {
      if (this.data.currentPage > 1) {
        const newPage = this.data.currentPage - 1;
        this.setData({
          currentPage: newPage
        });
        this.scrollToPage(newPage);
        wx.showToast({
          title: `第${newPage}页`,
          icon: 'none',
          duration: 1000
        });
      } else {
        wx.showToast({
          title: '已经是第一页',
          icon: 'none',
          duration: 1000
        });
      }
    },

    // 下一页
    onNextPage() {
      if (this.data.currentPage < this.data.totalPages) {
        const newPage = this.data.currentPage + 1;
        this.setData({
          currentPage: newPage
        });
        this.scrollToPage(newPage);
        wx.showToast({
          title: `第${newPage}页`,
          icon: 'none',
          duration: 1000
        });
      } else {
        wx.showToast({
          title: '已经是最后一页',
          icon: 'none',
          duration: 1000
        });
      }
    },

    // 手机扫一扫分享
    onScanShare() {
      wx.showToast({
        title: '正在生成二维码...',
        icon: 'loading',
        duration: 1500
      });

      // 模拟生成二维码
      setTimeout(() => {
        this.setData({
          qrcodeUrl: 'https://img.freepik.com/free-photo/qr-code-example_23-2148656037.jpg',
          showShareModal: true
        });
      }, 1500);
    },

    // 保存二维码
    onSaveQRCode() {
      wx.showToast({
        title: '正在生成二维码...',
        icon: 'loading',
        duration: 1500
      });

      // 模拟生成二维码
      setTimeout(() => {
        this.setData({
          qrcodeUrl: 'https://img.freepik.com/free-photo/qr-code-example_23-2148656037.jpg',
          showSaveQRModal: true
        });
      }, 1500);
    },

    // 关闭分享模态框
    onCloseShareModal() {
      this.setData({
        showShareModal: false
      });
    },

    // 关闭保存二维码模态框
    onCloseSaveQRModal() {
      this.setData({
        showSaveQRModal: false
      });
    },

    // 阻止事件冒泡
    preventBubble() {
      // 什么都不做，只是阻止冒泡
    },

    // 烟花动画
    onFireworks(e) {
      const screenInfo = wx.getWindowInfo();
      this.screenWidth = screenInfo.screenWidth;
      this.screenHeight = screenInfo.screenHeight;

      const colors = ['#ff4757', '#ffa502', '#ff6348', '#ffcc00', '#ff7f50'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const targetX = 100 + Math.random() * (this.screenWidth - 200);
      const targetY = 100 + Math.random() * (this.screenHeight * 0.25);

      const newFirework = {
        id: Date.now(),
        x: this.screenWidth / 2,
        y: this.screenHeight - 100,
        targetX: targetX,
        targetY: targetY,
        color: color,
        phase: 'rising'
      };

      const fireworks = [...this.data.fireworks, newFirework];
      this.setData({
        showFireworks: true,
        fireworks: fireworks
      });

      if (!this.fireworkInterval) {
        this.fireworkInterval = setInterval(() => {
          this.updateRisingFirework();
        }, 30);

        this.particleInterval = setInterval(() => {
          this.updateParticles();
        }, 30);
      }
    },

    updateRisingFirework() {
      const fireworks = this.data.fireworks.map(f => ({...f}));

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        if (f.phase === 'rising') {
          const dx = f.targetX - f.x;
          const dy = f.targetY - f.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            f.phase = 'exploded';
            this.createExplosion(f.targetX, f.targetY, f.color);
            fireworks.splice(i, 1);
          } else {
            f.x += (dx / dist) * 12;
            f.y += (dy / dist) * 12;
          }
        }
      }

      this.setData({ fireworks });
    },

    createExplosion(x, y, color) {
      const particles = [];
      const particleCount = 80;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i;
        const speed = 2 + Math.random() * 6;

        particles.push({
          id: Date.now() + i,
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          size: 3 + Math.random() * 3,
          alpha: 1,
          gravity: 0.06,
          friction: 0.97
        });
      }

      const existingParticles = [...this.data.particles, ...particles];
      this.setData({ particles: existingParticles });
    },

    updateParticles() {
      const particles = [...this.data.particles];

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.alpha -= 0.012;
        p.size *= 0.98;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
        }
      }

      this.setData({ particles });

      if (particles.length === 0 && this.data.fireworks.length === 0) {
        this.clearIntervals();
        this.setData({ showFireworks: false });
      }
    },

    clearIntervals() {
      if (this.fireworkInterval) {
        clearInterval(this.fireworkInterval);
        this.fireworkInterval = null;
      }
      if (this.particleInterval) {
        clearInterval(this.particleInterval);
        this.particleInterval = null;
      }
    },

    // 关闭烟花
    onCloseFireworks() {
      this.clearIntervals();
      this.setData({ showFireworks: false, fireworks: [], particles: [] });
    },

    // 显示留言弹窗
    onShowComment() {
      this.setData({ showCommentModal: true });
    },

    // 关闭留言弹窗
    onCloseComment() {
      this.setData({ showCommentModal: false });
    },

    // 留言姓名输入
    onCommentNameInput(e) {
      this.setData({ commentName: e.detail.value });
    },

    // 获取微信用户昵称和头像
    onGetUserProfile() {
      wx.getUserProfile({
        desc: '用于获取您的昵称和头像',
        success: (res) => {
          this.setData({
            commentName: res.userInfo.nickName,
            userAvatar: res.userInfo.avatarUrl
          });
          wx.showToast({ title: '已获取信息', icon: 'success' });
        },
        fail: () => {
          wx.showToast({ title: '获取失败，请手动输入', icon: 'none' });
        }
      });
    },

    // 留言内容输入
    onCommentTextInput(e) {
      this.setData({ commentText: e.detail.value });
    },

    // 显示礼物弹窗
    onShowGift() {
      this.setData({ showGiftModal: true, selectedGiftIndex: -1, customAmount: '' });
    },

    // 关闭礼物弹窗
    onCloseGift() {
      this.setData({ showGiftModal: false });
    },

    // 选择礼物
    onSelectGift(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        selectedGiftIndex: index,
        customAmount: ''
      });
    },

    // 自定义金额输入
    onCustomAmountInput(e) {
      this.setData({
        customAmount: e.detail.value,
        selectedGiftIndex: -1
      });
    },

    // 播放婚礼预告视频
    onVideoTap() {
      if (this.data.videoUrl) {
        wx.navigateTo({
          url: '/pages/video/video?url=' + encodeURIComponent(this.data.videoUrl)
        });
      } else {
        wx.showToast({
          title: '视频地址未设置',
          icon: 'none'
        });
      }
    },

    // 跳转到地图页面
    goToMap() {
      wx.navigateTo({
        url: '/pages/map/map'
      });
    },

    // 跳转到视频页面
    goToVideo() {
      wx.navigateTo({
        url: '/pages/video/video'
      });
    },

    // 跳转到礼物页面
    goToGift() {
      wx.navigateTo({
        url: '/pages/gift/gift'
      });
    },

    // 跳转到留言页面
    goToComments() {
      wx.navigateTo({
        url: '/pages/comments/comments'
      });
    },

    // 提交礼物
    onSubmitGift() {
      const { selectedGiftIndex, customAmount, gifts, giftRecords, userAvatar, commentName } = this.data;

      let giftName = '';
      let amount = 0;

      if (selectedGiftIndex >= 0) {
        giftName = gifts[selectedGiftIndex].name;
        amount = gifts[selectedGiftIndex].price;
      } else if (customAmount) {
        giftName = '毛爷爷';
        amount = parseInt(customAmount);
      }

      if (!amount || amount <= 0) {
        wx.showToast({ title: '请选择或输入金额', icon: 'none' });
        return;
      }

      const senderName = commentName || '匿名用户';
      const senderAvatar = userAvatar || '';

      const newRecord = {
        id: Date.now(),
        name: senderName,
        avatar: senderAvatar,
        giftName: giftName,
        count: 1,
        amount: amount
      };

      this.setData({
        giftRecords: [newRecord, ...giftRecords],
        showGiftModal: false,
        scrollToViewId: 'giftArea'
      });

      getApp().globalData.giftRecords = [newRecord, ...giftRecords];

      wx.showToast({ title: '礼物已送出', icon: 'success' });

      setTimeout(() => {
        this.setData({ scrollToViewId: '' });
      }, 800);
    },

    // 提交留言
    onSubmitComment() {
      const { commentName, commentText, comments } = this.data;

      if (!commentName.trim()) {
        wx.showToast({ title: '请输入姓名', icon: 'none' });
        return;
      }

      if (!commentText.trim()) {
        wx.showToast({ title: '请输入祝福内容', icon: 'none' });
        return;
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const newComment = {
        id: Date.now(),
        name: commentName.trim(),
        text: commentText.trim(),
        time: dateStr,
        avatar: this.data.userAvatar
      };

      this.setData({
        comments: [newComment, ...comments],
        commentName: '',
        commentText: '',
        userAvatar: '',
        showCommentModal: false,
        scrollToViewId: ''
      });

      getApp().globalData.comments = [newComment, ...comments];

      wx.showToast({ title: '祝福已送达', icon: 'success' });

      setTimeout(() => {
        this.setData({ scrollToViewId: 'pageComments' });
      }, 300);
    }
  },
})
