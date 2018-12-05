<template>
  <div class="List_More">
    <header>
      <router-link :to="{name: 'search'}" class="search_icon"></router-link>
      <h1>{{attribution}}</h1>
      <a class="back" href="javascript:void(0)" @click="back"><img src="../../assets/nav_back.svg" alt=""></a>
      <div class="thead">
        <h3>名称代码</h3>
        <div class="container">
          <div class="content">
            <h3 ref="thead" class="clearfix">
              <div>最新价</div>
              <div @click="clickChangeRate" class="blue">涨跌幅 <i :class="{down: !ascending}"><img src="../../assets/ico_up.svg" alt=""></i></div>
              <div>涨跌额</div>
              <div>成交量</div>
              <div>成交额</div>
              <div>换手率</div>
              <div>量比</div>
              <div>振幅</div>
              <div>最高</div>
              <div>最低</div>
              <div>开盘</div>
              <div>昨收</div>
              <div>市盈率</div>
            </h3>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div ref="scroll">
        <div>
          <div v-if="pageIndex" class="loading up">
            <i><img src="../../../static/images/loading_small.gif" alt=""></i>
          </div>
          <ol class="name">
            <li @click="toIndex(value.code)" v-for="(value, index) in names" :key="index">
              <div :class="{small: value.name.length > 8}">{{value.name}}</div>
              <p>{{value.code | code}}</p>
            </li>
          </ol>
          <div class="container">
            <div ref="scrollX">
              <ol class="content">
                <li @click="toIndex(value.code)" v-for="(value, index) in content" :key="index" class="clearfix">
                  <div :class="value.lastPrice | getColor(value.preClosePrice)">{{value.lastPrice | lastPrice(value.status)}}</div>
                  <div :class="value.lastPrice | getColor(value.preClosePrice)">{{value.lastPrice | getSymbol(value.preClosePrice)}}{{value.changeRate | changeRate(value.lastPrice, value.status)}}</div>
                  <div :class="value.lastPrice | getColor(value.preClosePrice)">{{value.lastPrice | getSymbol(value.preClosePrice)}}{{value.change | general(value.lastPrice, value.status)}}</div>
                  <div>{{value.volume | getNum}}</div>
                  <div>{{value.amount | getNum}}</div>
                  <div>{{value.turnoverRate | general(value.lastPrice, value.status, true)}}</div>
                  <div>{{value.volumeRatio | general(value.lastPrice, value.status)}}</div>
                  <div>{{value.amplitudeRate | general(value.lastPrice, value.status, true)}}</div>
                  <div :class="value.highPrice | getColor(value.preClosePrice)">{{value.highPrice | general(value.lastPrice, value.status)}}</div>
                  <div :class="value.lowPrice | getColor(value.preClosePrice)">{{value.lowPrice | general(value.lastPrice, value.status)}}</div>
                  <div :class="value.openPrice | getColor(value.preClosePrice)">{{value.openPrice | general(value.lastPrice, value.status)}}</div>
                  <div>{{value.preClosePrice}}</div>
                  <div>{{value.pe | pe(value.lastPrice)}}</div>
                </li>
              </ol>
            </div>
          </div>
          <div v-if="names.length === pageSize" class="loading down">
            <i><img src="../../../static/images/loading_small.gif" alt=""></i>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'List_More',
  data () {
    return {
      attribution: '--', // 头部标题
      code: '--', // 股票代码
      field: '12', // 排序字段
      ascending: false, // 是否正排序
      pageIndex: 0, // 页码
      pageSize: 12, // 页面数据数
      names: [ // 名称代码
        // {
        //   name: '--', // 股票名称
        //   code: '--' // 股票代码
        // }
      ],
      content: [ // 名称代码
        // {
        //   lastPrice: '--', // 最新价
        //   changeRate: '--', // 涨跌幅
        //   change: '', // 涨跌额
        //   volume: '--', // 成交量
        //   amount: '--', // 成交额
        //   turnoverRate: '--', // 换手率
        //   volumeRatio: '--', // 量比
        //   amplitudeRate: '--', // 振幅
        //   highPrice: '--', // 最高
        //   lowPrice: '--', // 最低
        //   openPrice: '--', // 开盘
        //   preClosePrice: '--', // 昨收
        //   pe: '--', // 市盈率
        //   status: '--' // 股票状态
        // }
      ],
      options: {
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -50 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        // pullDownRefresh: false, // 关闭下拉
        // pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0
      }
    }
  },
  watch: {
    '$parent.windowOnload' () {
      // 在小程序里抛出分享链接
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    },
    '$parent.initOk': function (to, from) {
      this.getData(true)
    }
  },
  filters: {
    /**
     * 处理code 股票代码
     */
    code: function (code) {
      return code.split('.')[0]
    },
    /**
     * 处理pe 市盈率
     */
    pe: function (now, comparing) {
      if (comparing === '0.00') {
        return '--'
      } else if (now === 0) return '亏损'
      return now
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
     * 获取符号 + -
     * now 当前值
     * comparing 对比值
     */
    getSymbol: function (now, comparing) {
      if (now === '--' || parseFloat(now) === 0 || parseFloat(now) === parseFloat(comparing)) {
        return ''
      }
      if (parseFloat(now) > parseFloat(comparing)) {
        return '+'
      } else {
        return '-'
      }
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
     * 处理changeRate 涨跌幅
     */
    changeRate: function (now, comparing, status) {
      if (status[0] === '2' || comparing === '0.00') {
        return '--'
      } else if (now === 0) {
        return '0.00%'
      }
      return now + '%'
    },
    /**
     * lastPrice 涨跌幅
     */
    lastPrice: function (now, status) {
      if (status[0] === '2') {
        return '停牌'
      } else if (now === '0.00') {
        return '--'
      }
      return now
    },
    /**
     * 处理一般数据
     */
    general: function (now, comparing, status, rate) {
      if (status[0] === '2' || comparing === '0.00' || now === 0 || now === '') {
        return '--'
      } else if (rate) {
        return now + '%'
      }
      return now
    }
  },
  methods: {
    /**
     * 点击返回按钮
     */
    back: function () {
      this.$router.go(-1)
    },
    /**
     * 获取数据
     * isDown 是否是下拉
     */
    getData: function (isDown) {
      var that = this
      // console.log(that.code)
      // console.log(that.transfer)
      window.StockAPI.send('catesorting', {
        code: that.code,
        pageIndex: that.pageIndex,
        pageSize: that.pageSize,
        field: that.field,
        ascending: that.ascending,
        onSuccess: function (resp) {
          // 成功响应处理
          const Data = resp.quoteItems
          // console.log(Data)
          // 获取名称代码数据
          that.names = []
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            let o = {}
            o.name = el.name
            o.code = el.code
            that.names.push(o)
          }
          // 获取右边详细数据
          that.content = []
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            let o = {}
            o.code = el.code
            o.lastPrice = el.lastPrice
            o.changeRate = el.changeRate
            o.change = el.change
            o.volume = el.volume
            o.amount = el.amount
            o.turnoverRate = el.turnoverRate
            o.volumeRatio = el.volumeRatio
            o.amplitudeRate = el.amplitudeRate
            o.highPrice = el.highPrice
            o.lowPrice = el.lowPrice
            o.openPrice = el.openPrice
            o.preClosePrice = el.preClosePrice
            o.pe = el.pe
            o.status = el.status
            that.content.push(o)
          }
          that.$nextTick(() => {
            that.pullingDownUp()
          })
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
        }
      })
    },
    /**
     * 点击列表跳转
     */
    toIndex: function (code) {
      this.$router.push({name: 'index', params: {id: code}, query: { isFromSearch: 1 }})
    },
    /**
     * 添加上下拉效果
     */
    _initScroll () {
      // 垂直滑动
      (() => {
        this.scroll = new BScroll(this.$refs.scroll, this.options)
        // 下拉
        this.scroll.on('pullingDown', () => {
          if (this.pageIndex) {
            if (this.pageIndex) this.pageIndex --
            // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
            this.getData(true) // 获取数据方法
          }
        })
        // 上拉
        this.scroll.on('pullingUp', () => {
          if (this.names.length === this.pageSize) { // 判断是否继续上拉刷新
            this.pageIndex ++
            this.getData(false)
            // this.setData() // 获取数据方法
          }
        })
      })();
      // 水平滑动
      (() => {
        this.scrollX = new BScroll(this.$refs.scrollX, {scrollX: true, probeType: 3})
        // 水平滑动的时候使顶部表头一起滑动
        this.scrollX.on('scroll', (pos) => {
          this.$refs.thead.style.transform = 'translateX(' + pos.x + 'px)'
        })
      })()
    },
    /**
     * 滑动效果收尾
     */
    pullingDownUp () {
      this.scroll.finishPullDown()
      this.scroll.finishPullUp()
      this.scroll.refresh() // 重新计算元素高度
      this.scroll.scrollTo(0, 0, 500, 'easing')
    },
    /**
     * 点击涨跌幅
     */
    clickChangeRate: function () {
      // 改变顺序
      this.ascending = !this.ascending
      // 重置页码数
      this.pageIndex = 0
      this.getData()
    }
  },
  created: function () {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  mounted: function () {
    // 从query中获取相应的值
    // console.log(this.$route.query)
    this.attribution = this.$route.query.attribution
    this.code = this.$route.query.code
    this.field = this.$route.query.field || '12'
    if (this.$route.query.ascending) this.ascending = true
    // alert(this.attribution)
    // alert(window.location.href)
    // 获取数据
    // 如果初始化完成
    if (this.$parent.initOk) this.getData(true)
    if (this.$parent.windowOnload) {
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    }
    var str = 'https://static.xyzq.cn/activity/pjm-test/quotes/index.html#/list-more?attribution=%E6%B2%AA%E6%B7%B1A%E8%82%A1&code=SHSZ1001&field=12'
    if (str.indexOf('?') >= -1) {
      console.log(str.indexOf('?'))
      var str2 = str.replace('?', '@')
      console.log(str2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.List_More{
  padding-bottom: 0 !important;
  overflow: hidden;
  header{
    // border-bottom: .01rem solid #2E6BB1;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #F6F6F6;
    .search_icon{
      position: absolute;
      right: .36rem;
      top: .226rem;
      width: .4rem;
      height: .4rem;
      background: url(../../assets/ico_search.svg) no-repeat center center;
      background-size: .4rem .4rem;
    }
    h1{
      background: #2E6BB1;
      font-family: PingFangSC-Regular;
      font-size: .36rem;
      color: #FFF;
      text-align: center;
      height: .85rem;
      line-height: .85rem;
    }
    a.back{
      position: absolute;
      z-index: 1;
      font-family: PingFangSC-Regular;
      left: 0;
      top: 0;
      padding: 0.23rem 0.3rem;
      width: 0.21rem;
      height: 0.38rem;
    }
    .thead{
      position: relative;
      > h3{
        position: absolute;
        left: 0;
        width: 3rem;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        height: .68rem;
        line-height: .68rem;
        font-family: PingFangSC-Regular;
        font-size: .28rem;
        color: #777;
        letter-spacing: .0074rem;
        padding-left: .42rem;
      }
      .container{
        width: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        padding-left: 3rem;
        .content{
          width: 30.94rem;
          overflow: hidden;
          h3{
            height: .68rem;
            line-height: .68rem;
            font-size: .28rem;
            color: #777;
            letter-spacing: .0074rem;
            div{
              width: 2.38rem;
              float: left;
              text-align: center;
              font-family: PingFangSC-Regular;
              &.blue{
                color: #326DAF;
              }
              i{
                display: inline-block;
                width: .08rem;
                height: .22rem;
                &.down{
                  transform: rotate(180deg);
                  -ms-transform: rotate(180deg);
                  -moz-transform: rotate(180deg);
                  -webkit-transform: rotate(180deg);
                  -o-transform: rotate(180deg);
                }
              }
            }
          }
        }
      }
    }
  }
  main{
    position: relative;
    padding-top: 1.53rem;
    height: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    > div{
      height: 100%;
      > div{
        min-height: 101%;
        .name{
          position: absolute;
          left: 0;
          width: 3rem;
          box-sizing: border-box;
          -moz-box-sizing: border-box; /* Firefox */
          -webkit-box-sizing: border-box; /* Safari */
          h3{
            height: .68rem;
            line-height: .68rem;
            font-family: PingFangSC-Regular;
            font-size: .28rem;
            color: #777;
            letter-spacing: .0074rem;
            background-color: #F6F6F6;
            padding-left: .42rem;
          }
          li{
            padding-left: .42rem;
            background-color: #fff;
            height: .905rem;
            div{
              padding-top: .155rem;
              font-size: .32rem;
              color: #2D2D2D;
              &.small{
                font-size: .26rem;
              }
            }
            p{
              margin-top: -.05rem;
              font-size: .22rem;
              color: #656B6E;
            }
          }
        }
        > .container{
          padding-left: 3rem;
          > div {
            width: 100%;
            overflow: hidden;
          }
          .content{
            width: 30.94rem;
            h3 div, li div{
              width: 2.38rem;
              float: left;
              text-align: center;
              font-family: PingFangSC-Regular;
            }
            h3{
              height: .68rem;
              line-height: .68rem;
              font-size: .28rem;
              color: #777;
              letter-spacing: .0074rem;
              background-color: #F6F6F6;
              div.blue{
                color: #326DAF;
              }
            }
            li{
              div{
                height: .905rem;
                line-height: 1.06rem;
                font-family: PingFangSC-Medium;
                font-size: .36rem;
                color: #2D2D2D;
                letter-spacing: 0;
              }
            }

          }
        }
        .loading{
          height: 1rem;
          position: absolute;
          width: 100%;
          i{
            position: absolute;
            left: 50%;
            top: 50%;
            width: .32rem;
            height: .32rem;
            margin-top: -.16rem;
            margin-left: -.16rem;
          }
          &.up{
            top: -1rem
          }
          &.down{
            bottom: -1rem
          }
        }
      }
    }
  }
}
</style>
