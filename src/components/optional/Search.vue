<template>
  <div class="Search">
    <header>
      <!-- <router-link :to="{name: 'optional'}" replace><img src="../../assets/nav_back.svg" alt=""></router-link> -->
      <a href="javascript:void(0)" @click="back"><img src="../../assets/nav_back.svg" alt=""></a>
      <h1>个股搜索</h1>
      <div @click="toFocus">
        <i><img src="../../assets/ico_search.svg" alt=""></i>
        <input ref="outofocus" type="text" v-model="txt" @keyup="search" autofocus placeholder="输入股票代码/全拼/首字母">
        <em @click="txt = ''"><img src="../../assets/nav_close.svg" alt=""></em>
      </div>
    </header>
    <main>
      <ul>
        <li @click="toIndex(value.code)" v-for="(value, index) in result" :key="index" class="clearfix">
          <div>{{value.name}}</div>
          <div>{{GLOBAL.strFilter(value.code)}}</div>
          <div @click.stop="add(value.code, value.statu, index)" :class="{not: !value.statu}">{{value.statu ? '已添加' : ''}}</div> <!-- class="not" 为未添加 -->
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      txt: '',
      // sendingObj: null, // 是否正在加载数据（节流）
      time: null, // 定时器（节流）
      result: [
        // {
        //   code: '000123.sh', // 股票代码
        //   name: '180动态', // 名称
        //   statu: 0 // 1为已添加 0为未添加
        // }
      ] // 搜索结果
    }
  },
  watch: {
    '$parent.windowOnload' () {
      // 在小程序里抛出分享链接
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    }
  },
  methods: {
    /**
     * 输入框搜索
     */
    search: function () {
      var that = this
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        window.StockAPI.send(
          'search',
          Object.assign({}, {keyword: that.txt}, {
            onSuccess: function (resp) {
              const result = resp.searchResults
              console.log(result)
              const getItem = window.localStorage.getItem('quotes-code')
              var userCode = getItem ? getItem.split(',') : []
              // console.log(userCode)
              that.result = [] // 初始化
              for (let i = 0; i < result.length; i++) {
                const el = result[i]
                if (el.subtype === '1300') continue // 过滤债券
                var o = {}
                o.code = el.code
                o.name = el.name
                o.statu = 0
                // 找出是否已经添加过
                for (let i = 0; i < userCode.length; i++) {
                  if (userCode[i] === o.code) {
                    o.statu = 1
                    break
                  }
                }
                that.result.push(o)
              }
            },
            onError: function (resp) {
              that.sendingObj = null
              console.log(resp)
            }
          })
        )
      }, 500)
    },
    /**
     * 点击添加
     */
    add: function (code, statu, index) {
      if (statu === 1) return
      var str = ''
      const getItem = window.localStorage.getItem('quotes-code')
      if (getItem) {
        str = getItem
      }
      if (str) {
        window.localStorage.setItem('quotes-code', str + ',' + code)
      } else {
        window.localStorage.setItem('quotes-code', code)
      }
      this.$set(this.result[index], 'statu', 1)
      // window.localStorage.setItem('quotes-code')
    },
    /**
     * 点击搜索列表
     */
    toIndex: function (code) {
      this.$router.push({name: 'index', params: {id: code}, query: { isFromSearch: 1 }})
    },
    /**
     * 点击 返回
     */
    back: function () {
      this.$router.go(-1)
    },
    toFocus: function () {
      this.$refs.outofocus.focus()
    }
  },
  // 组件离开销毁的时候
  destroyed: function () {
    // 清除定时器
    clearTimeout(this.timer)
  },
  mounted: function () {
    setTimeout(() => {
      this.$refs.outofocus.focus()
    }, 10)
    if (this.$parent.windowOnload) {
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Search{
  header{
    line-height: .85rem;
    background: #2E6BB1;
    padding-bottom: .22rem;
    a{
      position: absolute;
      z-index: 1;
      font-family: PingFangSC-Regular;
      left: 0;
      top: 0;
      padding: .23rem .3rem;
      width: .21rem;
      height: .38rem;
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
      em{
        width: .33rem;
        height: .34rem;
        padding: .16rem;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    @media screen and (max-width: 320px) {
      div{
        height: .85rem;
        i{
          top: .28rem;
        }
        em{
          padding: .26rem
        }
      }
    }
  }
  main{
    max-height: 10rem;
    overflow: scroll;
    ul{
      li{
        margin-top: .47rem;
        &:first-child{
          margin-top: .11rem;
        }
        div{
          float: left;
          height: .48rem;
          line-height: .48rem;
          font-family: PingFangSC-Regular;
          letter-spacing: 0;
          &:nth-child(1){
            font-size: .34rem;
            color: #2D2D2D;
            padding: 0 .32rem 0 .3rem;
          }
          &:nth-child(2){
            font-size: .24rem;
            color: #656B6E;
          }
          &:nth-child(3){
            float: right;
            margin-right: .35rem;
            font-size: .3rem;
            color: #2E6BB1;
            letter-spacing: 0.79px;
          }
          &.not{
            background-image: url("../../assets/ico_add2.svg");
            background-size: .46rem .46rem;
            background-repeat: no-repeat;
            background-position: center;
            width: .48rem;
            height: .48rem;
          }
        }
      }
    }
  }
}
</style>
