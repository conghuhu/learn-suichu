var check_update = new Promise(function(resolve, reject){
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate(function(res){
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function(){
        wx.showModal({
          title: "更新提示",
          content :"新版本已经准备好，是否重启应用？",
          success: function(res){
            if (res.confirm) {
              updateManager.applyUpdate();
            }
            resolve(res);
          }
        });
      });

    } else {
      resolve("no update")
    }
  });
});


App({
  onLaunch: function () {
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'bluewave-7co1p',
      traceUser: true,
    });

    check_update.then(function(res){
      wx.setKeepScreenOn({
        keepScreenOn: true,
      })
    });

    this.getOpenid()

    this.globalData = {
      openid: -1,
      color:"#2c243f",
    }


  },

  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },
})