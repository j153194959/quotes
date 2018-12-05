<template>
  <div class="Popular-More">
    <header>
      <router-link :to="{name: 'search'}" class="search_icon"></router-link>
      <h1>{{attribution}}</h1>
      <a class="back" href="javascript:void(0)" @click="back"><img src="../../assets/nav_back.svg" alt=""></a>
      <ul class="thead clearfix">
        <li>行业名称</li>
        <li @click="clickChangeRate">涨跌幅 <i :class="{down: !ascending}"><img src="../../assets/ico_up.svg" alt=""></i></li>
        <li>领涨股</li>
      </ul>
    </header>
    <main>
      <ol>
        <li class="clearfix" v-for="item in hotList" :key="item.ID" @click="toIndex(item.ID, item.name)">
          <div>{{item.name}}</div>
          <div class="red average" :class="getAverageColor(item.averageChangeRate)">{{getAverageChangeRate(item.averageChangeRate)}}%</div>
          <div>{{item.stockName}}</div>
        </li>
      </ol>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Popular-More',
  data () {
    return {
      code: '', // 热门板块str
      attribution: '', // 热门板块
      ascending: false, // 是否正排序
      hotList: [] // 热门板块数据
    }
  },
  filters: {
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
    }
    /**
     * 获取颜色
     * now 当前值
     * comparing 对比值
     */
    // getColor: function (now, comparing) {
    //   if (now === '--' || parseFloat(now) === 0 || parseFloat(now) === parseFloat(comparing)) {
    //     return 'black'
    //   }
    //   if (parseFloat(now) > parseFloat(comparing)) {
    //     return 'red'
    //   } else {
    //     return 'green'
    //   }
    // }
  },
  mounted: function () {
    this.code = this.$route.query.code
    this.attribution = this.$route.query.attribution
    this.getData()
  },
  methods: {
    /**
     * 点击返回按钮
     */
    back () {
      this.$router.go(-1)
    },
    /**
     * 得到数据
     */
    getData: function () {
      console.info(this.$route.query.code, this.$route.query.attribution)
      var that = this
      window.StockAPI.send('bankuaisorting', {
        code: that.code,
        pageIndex: 0,
        pageSize: 999,
        field: 'jzf',
        ascending: !that.ascending,
        onSuccess: function (resp) {
          // 成功响应处理
          console.log(resp)
          that.hotList = resp.sectionItems
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
        }
      })
    },
    /**
     * 得到均涨幅
     */
    getAverageChangeRate: function (getAverageChangeRate) {
      if (parseFloat(getAverageChangeRate) >= 0) {
        return '+' + getAverageChangeRate
      } else {
        return getAverageChangeRate
      }
    },
    /**
     * 得到涨幅颜色
     */
    getAverageColor: function (averageChangeRate) {
      if (averageChangeRate >= 0) {
        return ''
      } else {
        return 'green'
      }
    },
    /**
     * 点击列表跳转
     */
    toIndex: function (id, attribution) {
      this.$router.push({name: 'list-more', query: { attribution: attribution, code: id }})
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Popular-More{
  padding-bottom: 0 !important;
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
      background-color: #F6F6F6;
      height: .68rem;
      line-height: .68rem;
      font-family: PingFangSC-Regular;
      font-size: .28rem;
      color: #777;
      letter-spacing: .0074rem;
      text-align: center;
      li{
        float: left;
        width: 2.25rem;
        &:nth-child(1){
          text-align: left;
          padding-left: .39rem;
          box-sizing: border-box;
          -moz-box-sizing: border-box; /* Firefox */
          -webkit-box-sizing: border-box; /* Safari */
          width: 3rem;
        }
        &:nth-child(2){
          color: #326DAF;
        }
      }
      li:nth-of-type(2){
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
  main{
    position: relative;
    padding-top: 1.53rem;
    height: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
    overflow-y: scroll;
    ol > li{
      div{
        float: left;
        height: .89rem;
        line-height: .89rem;
        font-family: PingFangSC-Regular;
        font-size: .32rem;
        color: #2D2D2D;
        letter-spacing: 0;
        text-align: center;
        width: 2.25rem;
        .average.green{
          color: #14b900 !important;
        }
        &:nth-child(1){
          text-align: left;
          padding-left: .39rem;
          box-sizing: border-box;
          -moz-box-sizing: border-box; /* Firefox */
          -webkit-box-sizing: border-box; /* Safari */
          width: 3rem;
        }
        &:nth-child(2){
          font-family: PingFangSC-Medium;
          font-size: .36rem;
        }
      }
    }
  }
}
</style>
