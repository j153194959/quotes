<template>
  <div class="Edit">
    <header>
      <a @click="carryOut" href="javascript:void(0)">完成</a>
      <!-- <router-link :to="{name: 'optional'}" replace>完成</router-link> -->
      <h1>自选</h1>
      <div @click="clickSearch"><img src="../../assets/ico_search.svg" alt=""></div>
    </header>
    <main>
      <ul class="clearfix">
        <li>全部股票</li>
        <li>置顶</li>
        <li>拖动</li>
      </ul>
      <div ref=container class="container">
        <ol :style="{top: value.index * itemH + 'px'}" v-for="(value, index) in items" :key="index" class="clearfix">
          <li @click="current(index)" :class="{current: value.statu}"></li> <!--  class="current" 为选中状态 -->
          <li>
            <div>{{value.name}}</div>
            <div>{{GLOBAL.strFilter(value.code)}}</div>
          </li>
          <li @click="top(value.index)"><img src="../../assets/ico_up2.svg" alt=""></li>
          <li><img @touchstart.self="pressing($event, index)" @touchend="end" src="../../assets/ico_move.svg" alt=""></li>
        </ol>
        <!-- <ol class="clearfix">
          <li class="current"></li>
          <li>
            <div>莱克电气</div>
            <div>603355</div>
          </li>
          <li><img src="../../assets/ico_up2.svg" alt=""></li>
          <li><img src="../../assets/ico_move.svg" alt=""></li>
        </ol> -->
      </div>
    </main>
    <footer>
      <a @click="clickAll" class="current" href="javascript:void(0)">全部</a>
      <a @click="clickDelete" href="javascript:void(0)">删除</a>
    </footer>
    <!-- 加载 -->
    <Loading v-if="mask.isLoading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  name: 'Edit',
  data () {
    return {
      getItem: '', // 从本地存储中获取的数据
      userCode: [], // 本地存储转化为数组
      itemH: 0, // 单个的高度
      offsetTop: 0, // 容器到顶部的距离
      index: 0, // 当前移动的位置
      item: 0, // 当前移动项
      aa: 0, // 索引值
      items: [
        // {
        //   code: '', // 股票代码
        //   name: '', // 股票名称
        //   statu: false, // 当前是否选中 1为选中
        //   index: 0 // 当前顺序
        // }
      ], // 列表
      items2: [], // 备用数组
      mask: { // 弹窗控制
        isLoading: false // 加载中
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
     * 获取股票行情
     */
    getQuote: function (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) arr.splice(i, 1)
      }
      var str = arr[0]
      var that = this
      that.mask.isLoading = true
      window.StockAPI.send('quote', {
        code: str,
        stockFields: [0, 1, 2, 3, 4, 7, 12],
        onSuccess: function (resp) {
          // 成功响应处理
          console.log(resp.quoteItems)
          const Data = resp.quoteItems
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            var o = {}
            o.code = el.code
            o.name = el.name
            o.statu = false
            o.index = that.aa
            that.aa++
            that.items2.push(o)
          }
          if (arr[1]) {
            arr.shift()
            that.getQuote(arr)
            return
          }
          for (let i = 0; i < that.userCode.length; i++) {
            for (let j = 0; j < that.items2.length; j++) {
              if (that.userCode[i] === that.items2[j].code) {
                that.items2[j].index = i
                that.items.push(that.items2[j])
                break
              }
            }
          }
          that.mask.isLoading = false
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
     * 点击 搜索
     */
    clickSearch: function () {
      this.$router.push({name: 'search'})
    },
    /**
     * 点击 选中
     */
    current: function (index) {
      this.$set(this.items[index], 'statu', !this.items[index].statu)
    },
    /**
     * 点击 全部
     */
    clickAll: function () {
      for (let i = 0; i < this.items.length; i++) {
        this.$set(this.items[i], 'statu', true)
      }
    },
    /**
     * 置顶
     */
    top: function (index) {
      const a = this.items[index]
      this.items.splice(index, 1)
      for (let i = 0; i < this.items.length; i++) {
        this.$set(this.items[i], 'index', i + 1)
      }
      a.index = 0
      this.items.unshift(a)
    },
    /**
     * 手指按下
     */
    pressing: function (e, index) {
      e.preventDefault()
      // 取消动画
      this.cancelAnimate(e.target.parentNode.parentNode)
      var touch = {
        top: 0, // top值
        clientY: 0, // 移动点的clientY值
        moveY: 0, // 移动的距离
        index: 0, // 当前排序
        difference: 0 // 差值
      }
      touch.top = parseFloat(e.target.parentNode.parentNode.style.top)
      // 差值 = 可视Y值 - top值 - container到顶部的距离
      touch.clientY = e.touches[0].clientY
      touch.difference = touch.clientY - touch.top - this.offsetTop
      touch.index = parseInt(touch.top / this.itemH)
      this.index = touch.index
      this.item = index
      e.target.ontouchmove = (e) => {
        // top值 = 可视Y值 - container到顶部的距离 - 差值
        touch.top = e.touches[0].clientY - this.offsetTop - touch.difference
        if (touch.top <= 0) touch.top = 0
        if (touch.top >= this.itemH * (this.items.length - 1)) touch.top = this.itemH * (this.items.length - 1)
        e.target.parentNode.parentNode.style.top = touch.top + 'px'
        var i = Math.round(touch.top / this.itemH)
        if (i >= this.items.length) i = this.items.length
        if (e.touches[0].clientY - touch.clientY > 0) { // 向下方区域滑动
          // console.log(this.index, i)
          if (this.index === i) {
          } else if (this.index > i) {
            this.$set(this.items[i + 1], 'index', i + 1)
            this.index = i
          } else {
            this.$set(this.items[i], 'index', i - 1)
            this.index = i
          }
        } else { // 向上方区域滑动
          if (this.index === i) {
          } else if (this.index > i) {
            this.$set(this.items[i], 'index', i + 1)
            this.index = i
          } else {
            this.$set(this.items[i - 1], 'index', i - 1)
            this.index = i
          }
        }
      }
    },
    /**
     * 手指松开
     */
    end: function (e) {
      // 回复动画效果
      this.restoreAnimate(e.target.parentNode.parentNode)
      this.$set(this.items[this.item], 'index', this.index)
      // console.log(this.items)
      // this.sorting()
      this.items.sort(function (a, b) {
        return a.index - b.index
      })
      var ols = this.$refs.container.children
      // this.cancelAnimate(ols[this.item])
      // this.cancelAnimate(ols[this.index])
      ols[this.item].style.top = this.item * this.itemH + 'px'
      ols[this.index].style.top = this.index * this.itemH + 'px'
      // this.restoreAnimate(ols[this.item])
      // this.restoreAnimate(ols[this.index])
      // ols[this.item].style['transition'] = 'top .5s'
      // ols[this.item].style['-ms-transition'] = 'top .5s'
      // ols[this.item].style['-moz-transition'] = 'top .5s'
      // ols[this.item].style['-webkit-transition'] = 'top .5s'
      // ols[this.item].style['-o-transition'] = 'top .5s'
    },
    /**
     * 取消动画
     */
    cancelAnimate: function (dom) {
      dom.style['transition'] = 'top 0s'
      dom.style['-ms-transition'] = 'top 0s'
      dom.style['-moz-transition'] = 'top 0s'
      dom.style['-webkit-transition'] = 'top 0s'
      dom.style['-o-transition'] = 'top 0s'
    },
    /**
     * 恢复动画
     */
    restoreAnimate: function (dom) {
      dom.style['transition'] = 'top .5s'
      dom.style['-ms-transition'] = 'top .5s'
      dom.style['-moz-transition'] = 'top .5s'
      dom.style['-webkit-transition'] = 'top .5s'
      dom.style['-o-transition'] = 'top .5s'
    },
    /**
     * 点击 删除
     */
    clickDelete: function () {
      console.log('1')
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].statu) {
          this.items.splice(i, 1)
          i--
        }
      }
      for (let i = 0; i < this.items.length; i++) {
        this.$set(this.items[i], 'index', i)
      }
    },
    /**
     * 点击 完成
     */
    carryOut: function () {
      // window.localStorage.setItem('quotes-code', code)
      var str = ''
      for (let i = 0; i < this.items.length; i++) {
        if (i < this.items.length - 1) {
          str += this.items[i].code + ','
        } else {
          str += this.items[i].code
        }
      }
      window.localStorage.setItem('quotes-code', str)
      this.$router.replace({name: 'optional'})
    },
    /**
     * 页面开始
     */
    start: function () {
      if (this.getItem) {
        // var Arr = []
        var str = ''
        var bj = ''
        var hk = ''
        for (let i = 0; i < this.userCode.length; i++) {
          if (this.userCode[i].indexOf('.bj') !== -1) {
            bj += this.userCode[i] + ','
          } else if (this.userCode[i].indexOf('.hk') !== -1) {
            hk += this.userCode[i] + ','
          } else {
            str += this.userCode[i] + ','
          }
        }
        str = str.slice(0, -1)
        bj = bj.slice(0, -1)
        hk = hk.slice(0, -1)
        this.getQuote([str, bj, hk])
      }
      // 获取容器到顶部的距离
      this.offsetTop = this.$refs.container.offsetTop
    }
  },
  beforeMount: function () {
    const getItem = window.localStorage.getItem('quotes-code')
    this.getItem = getItem
    var userCode = getItem ? getItem.split(',') : []
    this.userCode = userCode
    // 通过rem得到单个数据的高度
    this.itemH = parseFloat(document.documentElement.style.fontSize) * 1.095
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
.Edit{
  header{
    line-height: .85rem;
    background: #2E6BB1;
    position: relative;
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
      position: absolute;
      right: .36rem;
      bottom: .226rem;
      width: .4rem;
      height: .4rem;
    }
  }
  main{
    height: 100%;
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    > ul{
      background-color: #F0F0F0;
      height: .66rem;
      line-height: .66rem;
      font-family: PingFangSC-Regular;
      font-size: .28rem;
      color: #6F6F6F;
      letter-spacing: .0074rem;
      border-bottom: 1px solid #E1E1E1;
      li{
        float: left;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        &:nth-child(1){
          width: 3.91rem;
          padding-left: .92rem;
        }
        &:nth-child(2){
          width: .58rem;
        }
        &:nth-child(3){
          width: 3.01rem;
          padding-right: .26rem;
          text-align: right;
        }
      }
    }
    .container{
      position: absolute;
      width: 100%;
      left: 0;
      top: 1.52rem;
      bottom: .87rem;
      overflow-y: scroll;
      > ol{
        height: 1.095rem;
        position: absolute;
        left: 0;
        top: 0;
        transition: top .5s;
        -ms-transition: top .5s;
        -moz-transition: top .5s;
        -webkit-transition: top .5s;
        -o-transition: top .5s;
        li{
          float: left;
          &:nth-child(1){
            width: .4rem;
            height: .4rem;
            padding: .2rem .24rem;
            background-image: url("../../assets/btn_circle_n.svg");
            background-origin: content-box;
            background-size: .4rem .4rem;
            background-repeat: no-repeat;
          }
          &.current{
            background-image: url("../../assets/btn_circle_s.svg");
          }
          &:nth-child(2){
            margin: .15rem 0 0 .04rem;
            width: 3.14rem;
            div{
              font-family: PingFangSC-Regular;
              font-size: .34rem;
              color: #2D2D2D;
              letter-spacing: 0;
              &:last-child{
                font-size: .22rem;
                color: #656B6E;
                margin-top: -.05rem;
              }
            }
          }
          &:nth-child(3){
            padding: .22rem;
            width: .28rem;
            height: .36rem;
            margin: 0 -.22rem;
          }
          &:nth-child(4){
            margin-left: 2.3rem;
            img{
              padding: .33rem .11rem;
              width: .44rem;
              height: .15rem;
              /* box-sizing: border-box; */
            }
          }
        }
      }
    }
  }
  footer{
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
