export default {
  // 判断微信环境
  isWeixin: function () {
    var ua = navigator.userAgent.toLowerCase()
    if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger') {
      return true
    } else {
      return false
    }
  },
  // 判断环境
  browser: {
    versions: (function () {
      var u = window.navigator.userAgent
      // VAR app = navigator.appVersion
      return { // 移动终端浏览器版本信息

        trident: u.indexOf('Trident') > -1, // IE内核

        presto: u.indexOf('Presto') > -1, // opera内核

        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核

        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核

        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端

        ios: !!u.match(/\(i[^]+;( U;)? CPU.+Mac OS X/), // ios终端

        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器

        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器

        iPad: u.indexOf('iPad') > -1, // 是否iPad

        webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部

      }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  },
  // 判断手机是安卓还是ios
  isAndroid: function () {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) return true
    return false
  },
  /**
   * 获取url地址参数
   * @param  {[type]} name [地址参数名]
   * @return {[type]}      [description]
   */
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  /**
   * 获取字符串长度（区分英文汉字）
   */
  strlen: function (str) {
    var len = 0
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i)
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        len++
      } else {
        len += 2
      }
    }
    return len
  },
  /**
   * 手机号码验证
   */
  pattern: function (str) {
    var pattern = /^1(3|4|5|7|8)\d{9}$/
    return pattern.test(str)
  },
  /**
   * 判断url中是否含有某个值
   */
  urlJudgment: function (name) {
    var href = window.location.href
    if (href.indexOf(name) > -1) return true
    return false
  },
  /**
   * 字符串过滤
   */
  strFilter: function (str) {
    const arr = str.split('.')
    return arr[0]
  },
  /**
   * 获取是涨是跌
   */
  getClass: function (now, preClosePrice) {
    return parseFloat(now) - parseFloat(preClosePrice) > 0 ? '+' : (parseFloat(now) - parseFloat(preClosePrice) === 0 ? '' : '-')
  }
}
