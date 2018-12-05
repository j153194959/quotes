<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'slide-left',
      initOk: false, // 是否初始化完成
      windowOnload: false, // window加载完成
      isWechart: false, // 是否在微信端
      shareData: { // 分享
        title: '兴业证券极速行情', // 标题
        desc: ' ', // 描述
        intoUrl: 'https://static.xyzq.cn/activity/quotes/index.html#/', // 地址 (入) 必须是对的地址
        outUrl: 'https://static.xyzq.cn/activity/quotes/index.html#/', // 地址（出）
        imgUrl: 'https://static.xyzq.cn/activity/quotes/static/images/share_icon.jpg' // 图标地址
      }
    }
  },
  watch: {
    '$route' (to, from) { // 切换路由时，前进后退使用不同动画
      const toDepth = this.getLength(to.path)
      const fromDepth = this.getLength(from.path)
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    },
    'windowOnload' () {
      if (this.isWechart) this.setWeixinShare()
    }
  },
  methods: {
    /**
     * 初始化接口
     */
    initialization: function () {
      var that = this
      // BCAOPts6qUBAblY4B6XaVqyniEo5w9lUR8KyO7OTZlA= 1KRdlRBGUF69xb6DjeK66KfLwFvVLtqzbCKFYqhjgr8= dc3W8DRvryXYPTMxIra83cZMFzmmMAI9MPaDA9MTz8c=
      window.StockAPI.register('dc3W8DRvryXYPTMxIra83cZMFzmmMAI9MPaDA9MTz8c=', {
        onSuccess: function (resp) {
          console.log(resp)
          setTimeout(() => {
            that.initOk = true
          }, 0)
        },
        onError: function (err) {
          console.log('register error:' + err)
        }
      })
    },
    /**
     * 剔除空项获取路由长度
     */
    getLength: function (str) {
      var arr = str.split('/')
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        if (el === '') {
          arr.splice(i, 1)
          i--
        }
      }
      return arr.length
    },
    /**
     * 设置微信分享
     */
    setWeixinShare: function () {
      // alert(29)
      var that = this
      // console.log(that)
      var appid = ''
      var timestamp = ''
      var noncestr = ''
      var signature = ''
      // var currentDomain = window.location.href.split(/\?|#/)
      // var result = ''
      // if (currentDomain[2]) {
      //   result = currentDomain[0] + '#' + currentDomain[2]
      // } else {
      //   result = currentDomain[0] + '#' + currentDomain[1]
      // }
      // alert(window.location.href)
      // alert(this.userInfo.openId)
      // history.replaceState('', document.title, result)

      this.$ajax({
        url: 'https://wechat.xyzq.cn/wechatbiz/accountApi?act=getJsapiInfo',
        params: {'url': window.location.href}, // 微信直接分享地址会变
        responseType: 'json'
      }).then((res) => {
        var data = res.data
        // alert(JSON.stringify(data))
        if (data.code === 0) {
          appid = 'wx513461a9e5de5010'
          timestamp = data.timestamp
          noncestr = data.noncestr
          signature = data.signature
          console.log('appid: %s', appid)
          console.log('timestamp: %s', timestamp)
          console.log('noncestr: %s', noncestr)
          console.log('signature: %s', signature)

          window.wx.config({
            debug: false,
            appId: appid,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              'onMenuShareTimeline',
              'onMenuShareAppMessage'/* ,
              'hideMenuItems' */
            ]
          })
        }
      })

      window.wx.ready(function () {
        // 发送给朋友
        window.wx.onMenuShareAppMessage({
          title: that.shareData.title, // 分享标题
          desc: that.shareData.desc, // 分享描述
          link: that.shareData.outUrl, // 分享链接
          imgUrl: that.shareData.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 分享到朋友圈
        window.wx.onMenuShareTimeline({
          title: that.shareData.title,
          desc: that.shareData.desc, // 分享描述
          link: that.shareData.outUrl,
          imgUrl: that.shareData.imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        })
        // 批量隐藏功能按钮接口
        // window.wx.hideMenuItems({
        //   menuList: ['menuItem:copyUrl'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        //   success: function () {
        //     // 用户确认分享后执行的回调函数
        //     alert('成功')
        //   },
        //   fail: function (err) {
        //     // 用户取消分享后执行的回调函数
        //     alert(JSON.stringify(err))
        //   }
        // })

        window.wx.error(function (res) {
          // alert('wx.error'+res.errMsg)
        })
      })
    }
  },
  beforeMount: function () {
    this.initialization()
    if (this.GLOBAL.isWeixin()) this.isWechart = true
    window.onload = () => {
      this.windowOnload = true
    }
  },
  mounted: function () {
    // alert('测试03')
  }
}
</script>

<style lang="less">
html, body{
  height: 100%;
  ::-webkit-scrollbar {/*隐藏滚轮*/
    display: none;
  }
  #app {
    /* 过渡动画 */
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
      opacity: 0
    }
    .child-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: all .5s cubic-bezier(.55,0,.1,1);
      /* overflow-y: scroll; */
      padding-bottom: .86rem;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
    }
    .slide-left-enter, .slide-right-leave-active {
      opacity: 0;
      -webkit-transform: translate(30px, 0);
      transform: translate(30px, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
      opacity: 0;
      -webkit-transform: translate(-30px, 0);
      transform: translate(-30px, 0);
    }
    .red {
      color: #fd2e26 !important;
    }
    .green {
      color: #14b900 !important;
    }
    .black {
      color: #2d2d2d !important;
    }
  }
}
</style>
