<template>
  <div class="Optional">
    <header>
      <!-- <a href="javascript:void(0)">编辑</a> -->
      <router-link :to="{name: 'edit'}">编辑</router-link>
      <h1>我的自选</h1>
      <div @click="toSearch">
        <i><img src="../../assets/ico_search.svg" alt=""></i>
        <input type="text" disabled placeholder="输入股票代码/全拼/首字母">
      </div>
    </header>
    <main>
      <div v-if="!data.length" class="optionalNo">
        <div @click="toSearch"></div>
        <p>暂无股票 点击添加</p>
      </div>
      <div v-if="data.length" class="have_header">
        <ul class="clearfix">
          <li>全部股票</li>
          <li @click="changeOrder(0)">最新价 <i v-if="order.new !== 2" :class="{down: !order.new}"><img src="../../assets/ico_up.svg" alt=""></i> <em v-if="order.new === 2"></em></li>
          <li @click="changeOrder(1)">涨跌幅 <i v-if="order.magnitude !== 2" :class="{down: !order.magnitude}"><img src="../../assets/ico_up.svg" alt=""></i> <em v-if="order.magnitude === 2"></em></li>
        </ul>
      </div>
      <div v-if="data.length" class="optionalHave">
        <!-- <ol v-for="(value, index) in data" :key="index" class="clearfix">
          <li @click="toIndex">
            <div>莱克电气</div>
            <p>603355</p>
          </li>
          <li>42.98</li>
          <li><i class="up">+10.01%</i></li>
        </ol> -->
        <div class="container">
          <ol v-for="(value, index) in data" :key="index" @click="toIndex(value.code)" class="clearfix">
            <li>
              <div :class="{small: GLOBAL.strlen(value.name) > 13}">{{value.name}}</div>
              <p>{{GLOBAL.strFilter(value.code)}}</p>
            </li>
            <li>{{value.new}}</li>
            <li><i :class="getClass(value.width, value.statu)">{{getTxt(value.width, value.statu, value.lastPrice)}}</i></li> <!-- up-上升  down-下滑  stop-停牌 -->
          </ol>
        </div>
      </div>
    </main>
    <nav>
      <router-link :to="{name: 'optional'}" class="current" replace>自选</router-link>
      <router-link :to="{name: 'quotes-hs'}" replace>行情</router-link>
    </nav>
    <!-- 加载 -->
    <Loading v-if="mask.isLoading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  name: 'Optional',
  data () {
    return {
      msg: 'demo-vue',
      data: [
        // {
        //   code: '000123.sh', // 股票代码
        //   name: '180动态', // 名称
        //   new: '42.98', // 最新价
        //   width: '+10.01%', // 涨跌幅
        //   isRise: '+', // 是涨是跌 '+' 为涨 '-' 为跌
        //   statu: '01' // 状态
        // }
      ],
      data2: [], // 备用数组
      getItem: '', // 从本地存储中获取的数据
      userCode: [], // 本地存储转化为数组
      mask: { // 弹窗控制
        isLoading: false // 加载中
      },
      order: { // 顺序控制
        new: 2, // 最新价 0-上升 1-下降 2-正常
        magnitude: 2 // 涨跌幅 0-上升 1-下降 2-正常
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  watch: {
    '$parent.windowOnload' () {
      // 在小程序里抛出分享链接
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    },
    '$parent.initOk': function (to, from) {
      this.start()
    }
  },
  methods: {
    /**
     * 点击自选列表
     */
    toIndex: function (code) {
      // console.log(code)
      this.$router.push({name: 'index', params: {id: code}})
    },
    /**
     * 跳转至搜索页面
     */
    toSearch: function () {
      this.$router.push({name: 'search'})
    },
    /**
     * 获取股票行情
     * arr 分为多个种类传参
     */
    getQuote: function (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) arr.splice(i, 1)
      }
      var str = arr[0]
      console.log(str)
      var that = this
      that.mask.isLoading = true
      window.StockAPI.send('quote', {
        code: str,
        stockFields: [0, 1, 2, 3, 4, 7, 12],
        onSuccess: function (resp) {
          // 成功响应处理
          console.log(resp.quoteItems)
          var Data = resp.quoteItems
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            var o = {}
            o.code = el.code
            o.name = el.name
            if (parseFloat(el.lastPrice) === 0) {
              if (parseFloat(el.preClosePrice) === 0) {
                o.new = '--'
              } else {
                o.new = el.preClosePrice
              }
            } else {
              o.new = el.lastPrice
            }
            o.statu = el.status
            o.lastPrice = el.lastPrice
            // that.GLOBAL.getClass(el.lastPrice, el.preClosePrice)
            // o.isRise = (el.lastPrice - el.preClosePrice) >= 0 ? '+' : '-'
            o.width = that.GLOBAL.getClass(el.lastPrice, el.preClosePrice) + parseFloat(el.changeRate).toFixed(2) + '%'
            that.data2.push(o)
          }
          if (arr[1]) {
            arr.shift()
            that.getQuote(arr)
            return
          }
          // that.data.sort((a, b) => {
          //   return b.new - a.new
          // })
          // that.restorage() // 重新存储
          for (let i = 0; i < that.userCode.length; i++) {
            for (let j = 0; j < that.data2.length; j++) {
              if (that.userCode[i] === that.data2[j].code) {
                that.data.push(that.data2[j])
                break
              }
            }
          }
          that.$emit('toF', {
            // optional: that.start,
            len: that.data.length
          })
          that.mask.isLoading = false // 关闭菊花
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
          that.mask.isLoading = false
        }
      })
      // console.log(str)
    },
    /**
     * 返回涨跌幅样式类名
     * width 涨跌幅
     * statu 当前状态
     */
    getClass: function (width, statu) {
      // 如果satau第一个字符为2 显示停牌
      if ((statu[0] !== '0' && statu[0] !== ' ') || statu === '00' || parseFloat(width) === 0) return 'stop'
      return parseFloat(width) > 0 ? 'up' : 'down'
    },
    /**
     * 返回涨跌幅文字展示
     * width 涨跌幅
     * statu 当前状态
     * lastPrice 最新价
     */
    getTxt: function (width, statu, lastPrice) {
      // 如果satau第一个字符为2 显示停牌
      if (statu[0] === '2') {
        return '停牌'
      } else if ((statu[0] !== '0' && statu[0] !== ' ') || statu === '00' || (lastPrice && lastPrice === '0.00') || width === '-0.00%') {
        return '--'
      } else {
        return width
      }
    },
    /**
     * 更改排序方式
     * type 0-最新价 1-涨跌幅
     */
    changeOrder: function (type) {
      if (type) { // 如果点击的是 涨跌幅
        // console.log('涨跌幅')
        if (this.order.new !== 2) this.order.new = 2
        if (this.order.magnitude) {
          this.order.magnitude = 0
          this.data.sort((a, b) => {
            return parseFloat(b.width) - parseFloat(a.width)
          })
        } else {
          this.data.sort((a, b) => {
            return parseFloat(a.width) - parseFloat(b.width)
          })
          this.order.magnitude = 1
        }
        this.restorage() // 重新存储
      } else { // 如果点击的是 最新价
        // console.log('最新价')
        if (this.order.magnitude !== 2) this.order.magnitude = 2
        if (this.order.new) {
          this.order.new = 0
          this.data.sort((a, b) => {
            return b.new - a.new
          })
        } else {
          this.data.sort((a, b) => {
            return a.new - b.new
          })
          this.order.new = 1
        }
        this.restorage() // 重新存储
      }
    },
    /**
     * 重新存储
     */
    restorage: function () {
      var str = ''
      for (let i = 0; i < this.data.length; i++) {
        if (i === this.data.length - 1) {
          str += this.data[i].code
        } else {
          str += this.data[i].code + ','
        }
      }
      window.localStorage.setItem('quotes-code', str)
    },
    /**
     * 处理字符串然后加载数据
     */
    start: function () {
      if (this.getItem) {
        // var Arr = []
        var str = ''
        var bj = ''
        var hk = ''
        var cff = ''
        for (let i = 0; i < this.userCode.length; i++) {
          if (this.userCode[i].indexOf('.bj') !== -1) {
            bj += this.userCode[i] + ','
          } else if (this.userCode[i].indexOf('.hk') !== -1) {
            hk += this.userCode[i] + ','
          } else if (this.userCode[i].indexOf('.cff') !== -1) {
            // cff += this.userCode[i] + ','
          } else {
            str += this.userCode[i] + ','
          }
        }
        str = str.slice(0, -1)
        bj = bj.slice(0, -1)
        hk = hk.slice(0, -1)
        cff = cff.slice(0, -1)
        this.data = []
        this.getQuote([str, bj, hk, cff])
      }
    }
  },
  beforeMount: function () {
    const getItem = window.localStorage.getItem('quotes-code')
    this.getItem = getItem
    if (getItem) var userCode = getItem ? getItem.split(',') : []
    // var userCode = getItem ? getItem.split(',') : []
    this.userCode = userCode
  },
  mounted: function () {
    // 如果初始化完成
    if (this.$parent.initOk) this.start()
    if (this.$parent.windowOnload) {
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Optional{
  header{
    line-height: .85rem;
    background: #2E6BB1;
    padding-bottom: .22rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
    a{
      position: absolute;
      font-family: PingFangSC-Regular;
      font-size: .32rem;
      color: #FFF;
      left: 0;
      top: 0;
      padding: 0 .27rem;
    }
    h1{
      font-family: PingFangSC-Regular;
      font-size: .36rem;
      color: #FFF;
      text-align: center;
      height: .85rem;
    }
    div{
      opacity: 0.8;
      background: #225692;
      width: 7.08rem; /* 708 */
      margin: 0 auto;
      height: .65rem;
      position: relative;
      input{
        display: block;
        width: 100%;
        height: 100%;
        font-family: PingFangSC-Regular;
        font-size: .26rem;
        color: #E7E7E7;
        letter-spacing: .0022rem;
        background: #225692;
        padding-left: .75rem;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
      }
      i{
        width: .3rem;
        height: .3rem;
        position: absolute;
        top: .16rem;
        left: .27rem;
      }
    }
    /* @media screen and (max-width: 320px) {
      div{
        height: .85rem;
        i{
          top: .28rem;
        }
        em{
          padding: .26rem
        }
      }
    } */
  }
  main{
    height: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    overflow-y: scroll;
    padding-top: 2.405rem;
    .optionalNo{
      width: 100%;
      div{
        border: 1px solid #DBDBDB;
        width: 2.08rem;
        height: 2.08rem;
        margin: 3rem auto 0;
        background-image: url("../../assets/ico_add.svg");
        background-size: .74rem .75rem;
        background-position: center;
        background-repeat: no-repeat;
      }
      p{
        font-family: PingFangSC-Regular;
        font-size: .28rem;
        color: #2D2D2D;
        margin-top: .41rem;
        text-align: center;
      }
    }
    .optionalHave{
      height: 100%;
      overflow-y: scroll;
      font-family: PingFangSC-Regular;
      .container {
        /* padding-bottom: .87rem; */
        > ol{
          li{
            float: left;
            height: .665rem;
            box-sizing: border-box;
            -moz-box-sizing: border-box; /* Firefox */
            -webkit-box-sizing: border-box; /* Safari */
            font-size: .28rem;
            letter-spacing: .0074rem;
            height: .92rem;
            &:nth-child(1){
              width: 3rem;
              padding-left: .26rem;
              font-family: PingFangSC-Regular;
              letter-spacing: 0;
              div{
                margin-top: .155rem;
                font-size: .34rem;
                height: .5rem;
                color: #2D2D2D;
                letter-spacing: 0;
                &.small{
                  font-size: .3rem;
                }
              }
              p{
                margin-top: -.05rem;
                font-size: .22rem;
                color: #656B6E;
              }
            }
            &:nth-child(2){
              width: 2rem;
              text-align: right;
              line-height: .92rem;
              font-family: PingFangSC-Medium;
              font-size: .44rem;
              color: #2D2D2D;
              letter-spacing: 0;
            }
            &:nth-child(3){
              width: 2.49rem;
              padding-right: .26rem;
              text-align: right;
              i{
                display: inline-block;
                width: 1.54rem;
                height: 0.64rem;
                line-height: 0.64rem;
                margin: .14rem 0;
                border-radius: .04rem;
                font-family: PingFangSC-Medium;
                font-size: .34rem;
                color: #FFF;
                letter-spacing: 0;
                text-align: center;
              }
              .up{
                background-color: #EB4E40;
              }
              .down{
                background-color: #32A52F;
              }
              .stop{
                background-color: #7D8084;
              }
            }
          }
        }
      }
    }
  }
  .have_header{
    > ul{
      position: absolute;
      top: 1.72rem;
      left: 0;
      width: 100%;
      border-bottom: 1px solid #E1E1E1;
      li{
        float: left;
        height: .665rem;
        line-height: .665rem;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        font-size: .28rem;
        color: #326DAF;
        letter-spacing: .0074rem;
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
        em{
          border-width: .05rem;
          border-color: transparent #326DAF #326DAF transparent;
          border-style: solid;
          display: inline-block;
          width: .1rem;
          height: .09rem;
          box-sizing: border-box;
          -moz-box-sizing: border-box; /* Firefox */
          -webkit-box-sizing: border-box; /* Safari */
        }
        &:nth-child(1){
          width: 3rem;
          padding-left: .26rem;
        }
        &:nth-child(2){
          width: 2rem;
          text-align: right;
        }
        &:nth-child(3){
          width: 2.49rem;
          padding-right: .49rem;
          text-align: right;
        }
      }
    }
  }
  > nav{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    border-top: 1px solid #E1E1E1;
    background-color: #fff;
    a{
      float: left;
      width: 50%;
      height: .86rem;
      line-height: .86rem;
      font-family: PingFangSC-Regular;
      font-size: .32rem;
      color: #6E6F74;
      text-align: center;
      /* letter-spacing: 0; */
    }
    .current{
      color: #326DAF;
    }
  }
}
</style>
