<template>
  <div class="Index">
    <header>
      <a href="javascript:void(0)" @click="back"><img src="../../assets/nav_back.svg" alt=""></a>
      <h1 :class="{len: GLOBAL.strlen(data.name) > 10}">
        <div>{{data.name}}</div>
        <p>{{GLOBAL.strFilter(code)}}</p>
        <i v-if="!isFromSearch" @click="switching(0)"><img :src=getSrc(0,status) alt=""></i>
        <i v-if="!isFromSearch" @click="switching(1)"><img :src=getSrc(1,status) alt=""></i>
      </h1>
    </header>
    <main>
      <div class="data">
        <!-- 股票 -->
        <div v-if="!isIndex">
          <div class="top clearfix">
            <div :class="[getColor(data.lastPrice, data.preClosePrice), data.lastPrice.length > 7 ? 'small' : '']">{{data.isStop ? '停牌' : changeStr(data.lastPrice)}}</div>
            <div>
              <div>最高</div>
              <p :class="[getColor(data.highPrice, data.preClosePrice)]">{{changeStr(data.highPrice)}}</p>
            </div>
            <div>
              <div>最低</div>
              <p :class="[getColor(data.lowPrice, data.preClosePrice)]">{{changeStr(data.lowPrice)}}</p>
            </div>
            <div>
              <div>量比</div>
              <p class="black">{{changeStr(data.volumeRatio) === '--' ? '--' : parseFloat(changeStr(data.volumeRatio)).toFixed(2)}}</p>
            </div>
          </div>
          <div class="center clearfix">
            <div :class="[getColor(data.lastPrice, data.preClosePrice)]">{{changeStr(data.change, data.lastPrice, true)}}</div>
            <div :class="[getColor(data.lastPrice, data.preClosePrice)]">{{changeStr(data.changeRate, data.lastPrice, true)}}</div>
            <div>成交量</div>
            <div>换手率</div>
            <div>总市值</div>
          </div>
          <div class="bottom clearfix">
            <div>{{data.status}} {{data.datetime}}</div>
            <div class="black">{{changeStr(data.volume, data.lastPrice)}}</div>
            <div class="black">{{data.turnoverRate}}</div>
            <div class="black">{{data.totalValue}}</div>
          </div>
        </div>
        <!-- 指数 -->
        <div v-if="isIndex">
          <div class="top clearfix">
            <div :class="[getColor(data.lastPrice, data.preClosePrice), data.lastPrice.length > 7 ? 'small' : '']">{{data.isStop ? '停牌' : changeStr(data.lastPrice)}}</div>
            <div>
              <div>上涨</div>
              <p class="red">{{changeStr(data.advanceCount, data.lastPrice)}}</p>
            </div>
            <div>
              <div>平盘</div>
              <p class="black">{{changeStr(data.equalCount, data.lastPrice)}}</p>
            </div>
            <div>
              <div>下跌</div>
              <p class="green">{{changeStr(data.declineCount, data.lastPrice)}}</p>
            </div>
          </div>
          <div class="center clearfix">
            <div :class="[getColor(data.lastPrice, data.preClosePrice)]">{{data.change}}</div>
            <div :class="[getColor(data.lastPrice, data.preClosePrice)]">{{data.changeRate}}</div>
            <div>最高</div>
            <div>最低</div>
            <div>成交量</div>
          </div>
          <div class="bottom clearfix">
            <div>{{data.status}} {{data.datetime}}</div>
            <div :class="[getColor(data.highPrice, data.preClosePrice)]">{{changeStr(data.highPrice)}}</div>
            <div :class="[getColor(data.lowPrice, data.preClosePrice)]">{{changeStr(data.lowPrice)}}</div>
            <div class="black">{{changeStr(data.volume)}}</div>
          </div>
        </div>
      </div>
      <div class="diagram">
        <div v-show="pull" class="simple">
          <ul class="clearfix">
            <li>
              <div>涨停价</div>
              <div :class="[changeStr(data.limitUp, data.lastPrice) === '--' ? 'black' : getColor(data.limitUp, data.preClosePrice)]">{{changeStr(data.limitUp, data.lastPrice)}}</div>
              <div>今开</div>
              <div :class="[getColor(data.openPrice, data.preClosePrice)]">{{changeStr(data.openPrice)}}</div>
            </li>
            <li>
              <div>跌停</div>
              <div :class="[changeStr(data.limitDown, data.lastPrice) === '--' ? 'black' : getColor(data.limitDown, data.preClosePrice)]">{{changeStr(data.limitDown, data.lastPrice)}}</div>
              <div>昨收</div>
              <div class="black">{{data.preClosePrice}}</div>
            </li>
            <li>
              <div>成交额</div>
              <div class="black">{{changeStr(data.amount, data.lastPrice)}}</div>
              <div>振幅</div>
              <div class="black">{{changeStr(data.amplitudeRate, data.lastPrice)}}</div>
            </li>
            <li>
              <div>市盈率</div>
              <div class="black">{{data.pe}}</div>
              <div>内盘</div>
              <div :class="[data.sellVolume === '--' ? 'black' : 'green']">{{data.sellVolume}}</div>
            </li>
            <li>
              <div>流通市值</div>
              <div class="black">{{data.flowValue}}</div>
              <div>外盘</div>
              <div :class="[data.buyVolume === '--' ? 'black' : 'red']">{{data.buyVolume}}</div>
            </li>
          </ul>
        </div>
        <div class="pull">
          <i @click="pull = !pull" :class="{up: pull}"></i> <!-- class="up" 为箭头向上 -->
          <div v-if="!isIndex" class="right">
            <!-- 五档 -->
            <div v-show="!smallNav" class="Fifth-gear">
              <div>
                <ol v-for="(value, index) in data.sell5" :key="index" class="clearfix">
                  <li><span>卖</span>{{5 - index}}</li>
                  <li :class="[getColor(value.sellPrice, data.preClosePrice)]">{{changeStr(value.sellPrice)}}</li>
                  <li>{{(value.sellVolum === '--' || value.sellVolum === '0.00') ? '--' : getNum(Math.round(value.sellVolum))}}</li>
                </ol>
              </div>
              <div>
                <ol v-for="(value, index) in data.buy5" :key="index" class="clearfix">
                  <li><span>买</span>{{index + 1}}</li>
                  <li :class="[getColor(value.buyPrice, data.preClosePrice)]">{{changeStr(value.buyPrice)}}</li>
                  <li>{{value.buyVolum === '--' || value.buyVolum === '0.00' ? '--' : getNum(Math.round(value.buyVolum))}}</li>
                </ol>
              </div>
            </div>
            <!-- 明细 -->
            <div v-show="smallNav" class="Details">
              <ol class="clearfix">
                <li>时间</li>
                <li>成交价</li>
                <li>成交量</li>
              </ol>
              <ol v-for="(value, index) in data.tickItems" :key="index" class="clearfix">
                <li>{{value.time.substring(0, 2)}}:{{value.time.substring(2, 4)}}</li>
                <li :class="[getColor(value.price, data.preClosePrice)]">{{value.price}}</li>
                <li :class="[value.type === '--' ? 'black' : (value.type === 'S' ? 'green' : 'red')]">{{value.volume === '--' ? '--' : getNum(Math.round(value.volume))}}</li>
              </ol>
            </div>
            <nav class="clearfix">
              <div @click="smallNav = 0" :class="{current: !smallNav}">五档</div>
              <div @click="smallNav = 1" :class="{current: smallNav}">明细</div>
            </nav>
          </div>
        </div>
      </div>
      <!-- 图表组件 -->
      <IndexCharts :code="code" :isIndex="isIndex" :preClosePrice="data.preClosePrice"></IndexCharts>
      <!-- F10组件 -->
      <IndexNav :code="code"></IndexNav>
    </main>
    <!-- <footer @click="clieckFooter"><span>{{isHave ? '' : '+'}}</span> {{isHave ? '删除' : '添加自选'}}</footer> -->
    <footer>
      <a @click="mask.toDownload = true" href="javascript:void(0)">交易</a>
      <a @click="clieckFooter" :class="{current: !isHave}" href="javascript:void(0)">{{isHave ? '删自选' : '加自选'}}</a>
    </footer>
    <!-- 弹窗 -->
    <div class="pop-ups">
      <!-- 前往下载 -->
      <transition name="fade">
        <div v-if="mask.toDownload" class="supernatant toDownload">
          <div>
            <p>快速交易，请下载优理宝APP</p>
            <nav class="clearfix">
              <a @click="mask.toDownload = false" href="javascrip:void(0)">取消</a>
              <a @click="toDownload" href="javascrip:void(0)">去下载</a>
            </nav>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// import '../../../static/lib/quotes/mitake.chart.min'
// 引入图表组件
import IndexCharts from './Index_Charts'
// 引入F10组件
import IndexNav from './Index_Nav'

// 引入echarts插件
// require('echarts/lib/chart/line')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/candlestick')
// require('echarts/lib/component/grid')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/axisPointer')
// require('echarts/lib/component/polar')
// require('echarts/lib/component/singleAxis')
// require('echarts/lib/component/brush')
// require('echarts/lib/component/dataZoom')
// require('echarts/lib/component/markLine')

export default {
  name: 'Index',
  data () {
    return {
      pull: false, // 上下拉控制
      smallNav: 0, // 五档0 明细1 导航栏控制
      code: '--', // 从path中获取股票代码
      isIndex: false, // 当前股票是否为指数
      isHave: false, // 是否有添加该股票
      getItem: '', // 从本地存储中获取的数据
      userCode: [], // 本地存储转化为数组
      status: 1, // 头部左右切换按钮状态 0-左边置灰 1-都不置灰 2-右边置灰 3-两边都置灰
      isFromSearch: 0, // 是否是从搜索页进来的 0-否 1-是
      isBj: false, // 是否是新三板
      timer: null, // 定时更新定时器
      data: { // 页面数据
        name: '--', // 股票名称
        isStop: false, // 是否停牌
        lastPrice: '--', // 最新价
        change: '--', // 涨跌
        changeRate: '--', // 涨跌比率
        highPrice: '--', // 最高价
        lowPrice: '--', // 最低价
        volumeRatio: '--', // 量比
        status: '--', // 股票状态
        datetime: '--', // 交易时间
        volume: '--', // 总量
        turnoverRate: '--', // 换手率
        totalValue: '--', // 总值
        limitUp: '--', // 涨停价
        limitDown: '--', // 跌停价
        amount: '--', // 成交金额
        pe: '--', // pe(净资产收益率)
        flowValue: '--', // 流通股
        openPrice: '--', // 今开价
        preClosePrice: '--', // 昨收价
        amplitudeRate: '--', // 振幅比率
        sellVolume: '--', // 内盘量
        buyVolume: '--', // 外盘量
        advanceCount: '--', // 上涨家数
        equalCount: '--', // 平盘家数
        declineCount: '--', // 下跌家数
        sell5: [ // 卖5
          // {
          //   sellPrice: '--', // 成交价
          //   sellVolum: '--' // 成交量
          // }
        ],
        buy5: [ // 买5
          // {
          //   buyPrice: '--', // 成交价
          //   buyVolum: '--' // 成交量
          // }
        ],
        tickItems: [ // 最新十笔明细列表
          // {
          //   time: '--', // 交易时间
          //   price: '--', // 交易价格
          //   volume: '--', // 交易量
          //   type: '--' // 内外盘 ‘B’, ‘S’, ‘’
          // }
        ],
        aa: '--' // 最新价
      },
      mask: { // 弹窗控制
        toDownload: false, // 前往下载
        isLoading: false // 加载中
      }
    }
  },
  components: { // 公共组件
    IndexCharts,
    IndexNav
  },
  watch: {
    '$parent.windowOnload' () {
      // 在小程序里抛出分享链接
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href, code: this.GLOBAL.strFilter(this.code)}})
    },
    '$parent.initOk': function (to, from) {
      this.getQuote(this.code)
    }
  },
  methods: {
    /**
     * 点击返回按钮
     */
    back: function () {
      this.$router.go(-1)
      // console.log('1')
    },
    /**
     * 点击底部 加自选
     */
    clieckFooter: function () {
      var str = ''
      if (this.isHave) { // 如果已经添加过
        const index = this.userCode.indexOf(this.code)
        if (index !== -1) this.userCode.splice(index, 1)
        str = this.userCode.join(',')
        window.localStorage.setItem('quotes-code', str)
        this.isHave = false
      } else { // 如果未添加
        if (window.localStorage.getItem('quotes-code')) {
          str = window.localStorage.getItem('quotes-code')
        }
        if (str) {
          window.localStorage.setItem('quotes-code', str + ',' + this.code)
        } else {
          window.localStorage.setItem('quotes-code', this.code)
        }
        this.isHave = true
      }
    },
    /**
     * 获取股票行情
     */
    getQuote: function (str) {
      this.switchStyle()
      var that = this
      var api = 'quotentrd10'
      if (this.isBj) api = 'quotentrd5'
      // that.mask.isLoading = true
      // console.log(api)
      window.StockAPI.send(api, {
        code: str,
        // stockFields: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 1000],
        onSuccess: function (resp) {
          // 成功响应处理
          // const Data = resp.quoteItems[0]
          const Data = resp.quoteItem
          console.log(Data)
          if (Data.subtype === '1400') {
            that.isIndex = true
          } else {
            that.isIndex = false
          }
          that.data.name = Data.name
          if (Data.status[0] === '2') {
            // return
          }
          that.data.lastPrice = Data.lastPrice
          that.data.preClosePrice = Data.preClosePrice
          that.data.change = that.GLOBAL.getClass(Data.lastPrice, Data.preClosePrice) + Data.change
          that.data.changeRate = that.GLOBAL.getClass(Data.lastPrice, Data.preClosePrice) + parseFloat(Data.changeRate).toFixed(2) + '%'
          that.data.highPrice = Data.highPrice
          that.data.lowPrice = Data.lowPrice
          that.data.volumeRatio = Data.volumeRatio
          that.data.datetime = that.getTime(Data.datetime)
          that.data.status = that.getStatu(Data.status)
          that.data.isStop = Data.status[0] === '2'
          that.data.volume = that.getNum(Data.volume) + '手'
          that.data.turnoverRate = Data.turnoverRate ? (Data.turnoverRate + '%') : '--'
          that.data.totalValue = Data.totalValue ? that.getNum(Data.totalValue) : '--'
          that.data.limitUp = Data.limitUp === '0.00' ? '--' : Data.limitUp
          that.data.limitDown = Data.limitDown === '0.00' ? '--' : Data.limitDown
          that.data.amount = that.getNum(Data.amount)
          that.data.pe = Data.pe || '--'
          that.data.flowValue = Data.flowValue ? that.getNum(Data.flowValue) : '--'
          that.data.openPrice = Data.openPrice
          that.data.amplitudeRate = Data.amplitudeRate + '%'
          that.data.sellVolume = that.getNum(Data.sellVolume) || '--'
          that.data.buyVolume = that.getNum(Data.buyVolume) || '--'
          that.data.advanceCount = Data.advanceCount
          that.data.equalCount = Data.equalCount
          that.data.declineCount = Data.declineCount
          if (!that.isIndex) {
            that.data.sell5 = []
            that.data.buy5 = []
            var sellLen = 5
            if (Data.sellPrices.length < sellLen) sellLen = Data.sellPrices.length
            var buyLen = 5
            if (Data.buyPrices.length < buyLen) buyLen = Data.buyPrices.length
            for (let i = 0; i < sellLen; i++) {
              let o1 = {}
              o1.sellPrice = Data.sellPrices[i]
              o1.sellVolum = Data.sellVolumes[i]
              that.data.sell5.push(o1)
            }
            that.data.sell5.reverse()
            that.dealArr(that.data.sell5, 1)
            for (let i = 0; i < buyLen; i++) {
              let o2 = {}
              o2.buyPrice = Data.buyPrices[i]
              o2.buyVolum = Data.buyVolumes[i]
              that.data.buy5.push(o2)
            }
            that.dealArr(that.data.buy5, 0)
            that.data.tickItems = []
            if (Data.tickItems.length) {
              that.data.tickItems = Data.tickItems
            } else {
              for (let i = 0; i < 10; i++) {
                const o = {
                  time: '----', // 交易时间
                  price: '--', // 交易价格
                  volume: '--', // 交易量
                  type: '--' // 内外盘 ‘B’, ‘S’, ‘’
                }
                that.data.tickItems.push(o)
              }
            }
            that.data.tickItems.reverse()
          }
          // that.mask.isLoading = false
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
          // that.mask.isLoading = false
        }
      })
    },
    /**
     * 处理过长数字
     * str 需要处理的字符串
     */
    getNum: function (str) {
      // console.log(str)
      const num = parseFloat(str)
      var result = ''
      if (!num) {
        result = '--'
      } else {
        if (num < 10000) { // 最大9999
          result = num
        } else if (num < 1000000) { // 最大99.99万
          result = (num / 10000).toFixed(2) + '万'
        } else if (num < 10000000) { // 最大999.9万
          result = (num / 10000).toFixed(1) + '万'
        } else if (num < 100000000) { // 最大9999万
          result = (num / 10000).toFixed(0) + '万'
        } else if (num < 10000000000) { // 最大99.99亿
          result = (num / 100000000).toFixed(2) + '亿'
        } else if (num < 100000000000) { // 最大999.9亿
          result = (num / 100000000).toFixed(1) + '亿'
        } else {
          result = Math.round((num / 100000000)) + '亿'
        }
      }
      return result
    },
    /**
     * 处理时间
     */
    getTime: function (str) {
      // var date = new Date(str)
      var M, D, h, m, s
      // console.log(str)
      M = (str + '').substring(4, 6) + '-'
      D = (str + '').substring(6, 8) + ' '
      h = (str + '').substring(8, 10) + ':'
      m = (str + '').substring(10, 12) + ':'
      s = (str + '').substring(12, 14)
      return (M + D + h + m + s)
    },
    /**
     * 处理状态
     */
    getStatu: function (statu) {
      var result = ''
      switch (statu[1]) {
        case '0': result = '未开市'; break
        case '1': result = '集合竞价'; break
        case '2': result = '停牌'; break
        case '3': result = '连续竞价'; break
        case '4': result = '临时停市'; break
        case '5': result = '已收盘'; break
        case '6': result = '午间休市'; break
        case '7': result = '交易中'; break
        default:
          break
      }
      return result
    },
    /**
     * 点击 头部切换
     */
    switching: function (type) {
      // console.log(type)
      const i = this.userCode.indexOf(this.code)
      // console.log(i)
      if (type && i < this.userCode.length - 1) {
        this.code = this.userCode[i + 1]
        this.judgmentClass()
        this.getQuote(this.code)
      } else if (!type && i > 0) {
        this.code = this.userCode[i - 1]
        this.judgmentClass()
        this.getQuote(this.code)
      }
      // 每隔10秒更新一次数据
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.updated()
    },
    /**
     * 头部左右显示状态
     */
    switchStyle: function () {
      const i = this.userCode.indexOf(this.code)
      if (this.userCode.length === 1) {
        this.status = 3
      } else if (i === 0) {
        this.status = 0
      } else if (i === this.userCode.length - 1) {
        this.status = 2
      } else {
        this.status = 1
      }
    },
    /**
     * 处理00或者空数据为--
     */
    changeStr: function (str, lastPrice, isTop) {
      if (lastPrice && (lastPrice === '0.000' || lastPrice === '0.00')) {
        return '--'
      } else if (isTop) {
        return str
      } else if (str === '0.000' || str === '0.00' || str === '0%' || str === '' || str === '0手') {
        return '--'
      }
      return str
    },
    /**
     * 头部 左右图片路径
     */
    getSrc: function (type, statu) {
      const left = ['./static/images/ico_left.svg', './static/images/btn_left_d.png']
      const right = ['./static/images/ico_right.svg', './static/images/btn_right_d.png']
      var result = ''
      if (type) { // 右边
        if (statu === 2 || statu === 3) {
          result = right[1]
        } else {
          result = right[0]
        }
      } else { // 左边
        if (statu === 0 || statu === 3) {
          result = left[1]
        } else {
          result = left[0]
        }
      }
      return result
    },
    /**
     * 获取颜色
     * now 当前值
     * comparing 对比值
     */
    getColor: function (now, comparing) {
      if (now === '--' || parseFloat(now) === 0 || parseFloat(now) === parseFloat(comparing)) {
        return 'black'
      }
      if (parseFloat(now) > parseFloat(comparing)) {
        return 'red'
      } else {
        return 'green'
      }
    },
    /**
     * 处理过短数组 买卖五档
     */
    dealArr: function (arr, type) {
      var o = {}
      if (type) {
        o = {
          sellPrice: '--', // 成交价
          sellVolum: '--' // 成交量
        }
      } else {
        o = {
          buyPrice: '--', // 成交价
          buyVolum: '--' // 成交量
        }
      }
      for (let i = 0; i < 5 - arr.length; i++) {
        arr.push(o)
        i--
      }
    },
    /**
     * 点击 去下载
     */
    toDownload: function () {
      // window.location.href = 'http://wap.xyzq.com.cn' // 下载app的地址
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.location.href = 'xyzqulb:// xyzq.com.cn' // ios app协议
        window.setTimeout(function () {
          window.location.href = 'http://wap.xyzq.com.cn'
        }, 2000)
      }
      if (navigator.userAgent.match(/android/i)) {
        window.location.href = 'xyzqulb:// xyzq.com.cn' // android app协议
        window.setTimeout(function () {
          window.location.href = 'http://wap.xyzq.com.cn' // android 下载地址
        }, 2000)
      }
    },
    /**
     * 判断当前code类别
     */
    judgmentClass: function () {
      if (this.code.split('.')[1] === 'bj') {
        this.isBj = true
      } else {
        this.isBj = false
      }
    },
    /**
     * 每隔10秒更新一次数据
     */
    updated: function () {
      this.timer = setInterval(() => {
        this.getQuote(this.code)
      }, 10000)
    }
  },
  created () {
    // 每隔10秒更新一次数据
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.updated()
  },
  // 组件离开销毁的时候
  destroyed: function () {
    // 清除定时器
    clearInterval(this.timer)
  },
  beforeMount: function () {
    // 通过params获取code
    this.code = this.$route.params.id
    // console.log(this.code.split('.')[1])
    this.judgmentClass()
    if (this.$route.query.isFromSearch) { // 如果从搜索页进来
      this.isFromSearch = 1
    } else {
      this.isFromSearch = 0
    }
    // 从本地存储获取数据
    const getItem = window.localStorage.getItem('quotes-code')
    this.getItem = getItem
    var userCode = getItem ? getItem.split(',') : []
    this.userCode = userCode
    // 找出是否已经添加过
    for (let i = 0; i < this.userCode.length; i++) {
      if (this.userCode[i] === this.code) {
        this.isHave = true
        break
      }
    }
  },
  mounted: function () {
    // 如果初始化完成
    if (this.$parent.initOk) this.getQuote(this.code)
    console.log(this.GLOBAL.strFilter(this.code))
    if (this.$parent.windowOnload) {
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href, code: this.GLOBAL.strFilter(this.code)}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Index {
  header {
    background: #2e6bb1;
    a {
      position: absolute;
      z-index: 1;
      font-family: PingFangSC-Regular;
      left: 0;
      top: 0;
      padding: 0.23rem 0.3rem;
      width: 0.21rem;
      height: 0.38rem;
    }
    h1 {
      font-family: PingFangSC-Regular;
      font-size: 0.3rem;
      color: #fff;
      text-align: center;
      height: 0.85rem;
      line-height: 0.6rem;
      position: relative;
      &.len{
        font-size: .2rem;
        p{
          font-size: .2rem;
        }
      }
      p {
        margin-top: -0.3rem;
        font-size: 0.24rem;
      }
      i {
        position: absolute;
        width: 0.16rem;
        height: 0.2rem;
        padding: 0.2rem;
        top: 50%;
        margin-top: -0.3rem;
        z-index: 1;
        &:first-of-type {
          left: 2.54rem;
        }
        &:last-of-type {
          right: 2.54rem;
        }
      }
    }
  }
  main {
    height: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    padding-bottom: 0.87rem;
    overflow-y: scroll;
    .data {
      padding-top: 0.09rem;
      > div > div {
        > div {
          float: left;
          color: #929397;
          font-family: PingFangSC-Regular;
          font-size: 0.26rem;
          width: 1.51rem;
          &:nth-last-of-type(1) {
            width: 1.26rem;
          }
        }
        &.top {
          height: 0.94rem;
          line-height: 0.45rem;
          > div {
            div{
              line-height: .6rem;
            }
            p{
              line-height: .075rem;
            }
            &:nth-of-type(1) {
              font-family: HelveticaNeue;
              font-size: 0.78rem;
              line-height: 0.94rem;
              width: 3.22rem;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
              /* padding-left: .54rem; */
              text-align: center;
              &.small {
                font-size: .6rem;
              }
            }
          }
        }
        &.center {
          height: 0.34rem;
          line-height: 0.34rem;
          > div {
            &:nth-of-type(1) {
              font-family: HelveticaNeue;
              font-size: 0.28rem;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
              padding-left: 0.25rem;
              width: 1.27rem;
            }
            &:nth-of-type(2) {
              font-family: HelveticaNeue;
              font-size: 0.28rem;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
              text-align: right;
              width: 1.55rem;
              margin-right: 0.39rem;
            }
          }
        }
        &.bottom {
          height: 0.37rem;
          line-height: 0.37rem;
          > div {
            &:nth-of-type(1) {
              font-family: PingFangSC-Regular;
              font-size: 0.2rem;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
              padding-left: 0.23rem;
              width: 3.22rem;
            }
          }
        }
      }
    }
    .diagram {
      /* padding-bottom: 2rem; */
      .pull {
        height: 0.43rem;
        text-align: center;
        position: relative;
        > i {
          display: inline-block;
          background-image: url("../../assets/ico_narrow_down.svg");
          background-size: 0.34rem 0.19rem;
          background-repeat: no-repeat;
          background-position: center;
          width: 0.6rem;
          height: 100%;
          padding: 0 1rem;
          &.up {
            background-image: url("../../assets/ico_narrow_up.svg");
          }
        }
        > .right {
          position: absolute;
          right: 0;
          top: .43rem;
          width: 2.2rem;
          margin-top: 0.96rem;
          z-index: 1;
          .Fifth-gear {
            height: 5.25rem;
            > div{
              &:first-child ol:nth-child(5) {
                border-bottom: 1px solid #e1e1e1;
              }
              ol {
                font-family: HelveticaNeue;
                font-size: 0.24rem;
                color: #2d2d2d;
                line-height: 0.51rem;
                li {
                  float: left;
                  &:nth-child(1) {
                    width: 0.4rem;
                    span {
                      font-family: PingFangSC-Regular;
                    }
                  }
                  &:nth-child(2) {
                    width: 0.83rem;
                    text-align: right;
                    color: #fd2e28;
                  }
                  &:nth-child(3) {
                    width: 0.87rem;
                    text-align: right;
                    padding-right: .05rem;
                  }
                }
              }
            }
          }
          .Details {
            height: 5.25rem;
            ol {
              line-height: 0.48rem;
              &:first-child {
                li {
                  font-family: PingFangSC-Regular;
                  font-size: 0.2rem;
                  color: #707070;
                  &:nth-child(1) {
                    box-sizing: border-box;
                    -moz-box-sizing: border-box; /* Firefox */
                    -webkit-box-sizing: border-box; /* Safari */
                    padding-left: 0.09rem;
                  }
                  &:nth-child(2) {
                    width: 0.71rem;
                  }
                  &:nth-child(3) {
                    width: 0.7rem;
                    text-align: right;
                  }
                }
              }
              li {
                float: left;
                font-family: HelveticaNeue;
                font-size: 0.22rem;
                color: #2d2d2d;
                &:nth-child(1) {
                  width: 0.67rem;
                  color: #9b9b9b;
                  font-family: PingFangSC-Regular;
                }
                &:nth-child(2) {
                  width: 0.71rem;
                }
                &:nth-child(3) {
                  width: 0.79rem;
                  text-align: right;
                  box-sizing: border-box;
                  -moz-box-sizing: border-box; /* Firefox */
                  -webkit-box-sizing: border-box; /* Safari */
                  /* padding-right: 0.125rem; */
                }
              }
            }
          }
          nav {
            div {
              float: left;
              width: 50%;
              font-family: PingFangSC-Regular;
              font-size: 0.22rem;
              color: #a3a3a3;
              letter-spacing: 0.0058rem;
              height: 0.46rem;
              line-height: 0.46rem;
              text-align: center;
              background-color: #ececec;
              &.current {
                color: #2e6bb1;
                background-color: #fff;
              }
            }
          }
        }
      }
      .simple {
        ul {
          margin-top: 0.18rem;
          li {
            float: left;
            line-height: 0.37rem;
            font-family: PingFangSC-Regular;
            font-size: 0.26rem;
            color: #8b8d90;
            div {
              margin-top: 0.06rem;
            }
            &:nth-child(1) {
              width: 1.74rem;
              padding-left: 0.28rem;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
            }
            &:nth-child(2) {
              width: 1.29rem;
            }
            &:nth-child(3) {
              width: 1.59rem;
            }
            &:nth-child(4) {
              width: 1.55rem;
            }
            &:nth-child(5) {
              width: 1.33rem;
            }
          }
        }
      }
    }
  }
  footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e1e1e1;
    background-color: #fff;
    z-index: 1;
    a {
      float: left;
      width: 50%;
      height: 0.86rem;
      line-height: 0.86rem;
      font-family: PingFangSC-Regular;
      font-size: 0.32rem;
      color: #6e6f74;
      text-align: center;
      /* letter-spacing: 0; */
      &.current{
        color: #2E6BB1;
      }
    }
  }
  > .pop-ups {
    .supernatant {
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      top: 0;
      left: 0;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .toDownload {
      > div {
        width: 5.1rem;
        background: #fff;
        border-radius: 0.1rem;
        p {
          height: 1.3rem;
          line-height: 1.3rem;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 0.308rem;
          color: #4a4a4a;
          letter-spacing: 0;
        }
        nav {
          border-top: 1px solid #c2bec2;
          a {
            float: left;
            width: 50%;
            font-family: PingFangSC-Regular;
            font-size: 0.308rem;
            color: #848484;
            letter-spacing: 0;
            height: 0.75rem;
            line-height: 0.75rem;
            text-align: center;
            &:last-child {
              color: #0074e1;
              box-sizing: border-box;
              -moz-box-sizing: border-box; /* Firefox */
              -webkit-box-sizing: border-box; /* Safari */
              border-left: 1px solid #c2bec2;
            }
          }
        }
      }
    }
  }
}
</style>
