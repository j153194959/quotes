<template>
  <div class="Plate">
    <div class="hot-list">
      <!-- 热门行业 -->
      <div class="hot">
        <div class="hot-title">
          <span>热门行业</span>
          <span @click.stop="clickMore('Trade', '热门行业')" class="more"></span>
        </div>
        <ul class="hot-item">
          <li @click="toIndex(item.ID, item.name)" v-for="item in tradeData" :key="item.ID" >
            <h3>{{item.name}}</h3>
            <span class="percent" :class="getAverageColor(item.averageChangeRate)">{{getAverageChangeRate(item.averageChangeRate)}}%</span>
            <span class="other">{{item.stockName}}</span>
            <div class="othre-percent">
              <span>{{item.stockChange}}</span>
              <span>{{getStockChangeRate(item.stockChangeRate)}}%</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 热门概念 -->
      <div class="hot">
        <div class="hot-title">
          <span>热门概念</span>
          <span @click.stop="clickMore('Notion', '热门概念')" class="more"></span>
        </div>
        <ul class="hot-item">
          <li @click="toIndex(item.ID, item.name)" v-for="item in conceptData" :key="item.ID">
            <h3>{{item.name}}</h3>
            <span class="percent" :class="getAverageColor(item.averageChangeRate)">{{getAverageChangeRate(item.averageChangeRate)}}%</span>
            <span class="other">{{item.stockName}}</span>
            <div class="othre-percent">
              <span>{{item.stockChange}}</span>
              <span>{{getStockChangeRate(item.stockChangeRate)}}%</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 热门地域 -->
      <div class="hot">
        <div class="hot-title">
          <span>热门地域</span>
          <span @click.stop="clickMore('Area', '热门地域')" class="more"></span>
        </div>
        <ul class="hot-item">
          <li @click="toIndex(item.ID, item.name)" v-for="item in regionData" :key="item.ID">
            <h3>{{item.name}}</h3>
            <span class="percent" :class="getAverageColor(item.averageChangeRate)">{{getAverageChangeRate(item.averageChangeRate)}}%</span>
            <span class="other">{{item.stockName}}</span>
            <div class="othre-percent">
              <span>{{item.stockChange}}</span>
              <span>{{getStockChangeRate(item.stockChangeRate)}}%</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Plate',
  data () {
    return {
      msg: 'demo-vue',
      tradeData: [], // 热门行情数据
      conceptData: [], // 热门概念数据
      regionData: [] // 热门地域数据
    }
  },
  mounted () {
    this.getData('Trade') // 获取热门行情数据
    this.getData('Notion') // 获取热门概念数据
    this.getData('Area') // 获取热门地域数据
  },
  methods: {
    /**
     * 获取数据
     */
    getData: function (code) {
      var that = this
      window.StockAPI.send('bankuaisorting', {
        code: code,
        pageIndex: 0,
        pageSize: 6,
        field: 'jzf',
        ascending: true,
        onSuccess: function (resp) {
          // 成功响应处理
          // console.log(resp)
          if (code === 'Trade') {
            that.tradeData = resp.sectionItems
            // console.info(that.tradeData)
          } else if (code === 'Notion') {
            that.conceptData = resp.sectionItems
            // console.info(that.conceptData)
          } else if (code === 'Area') {
            that.regionData = resp.sectionItems
            // console.info(that.regionData)
          }
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
    toIndex: function (id, attribution) {
      this.$router.push({name: 'list-more', query: { attribution: attribution, code: id }})
    },
    /**
     * 得到均涨幅
     */
    getAverageChangeRate: function (averageChangeRate) {
      if (averageChangeRate >= 0) {
        return '+' + parseFloat(averageChangeRate).toFixed(2)
      } else {
        return parseFloat(averageChangeRate).toFixed(2)
      }
    },
    /**
     * 得到领涨个股涨幅比
     */
    getStockChangeRate: function (stockChangeRate) {
      // console.info(stockChangeRate)
      if (parseFloat(stockChangeRate) > 0) {
        return '+' + stockChangeRate
      } else {
        return stockChangeRate
      }
    },
    /**
     * 得到涨幅颜色
     */
    getAverageColor: function (averageChangeRate) {
      if (averageChangeRate > 0) {
        return ''
      } else if (averageChangeRate === 0.00 || averageChangeRate === 0 || averageChangeRate === '--') {
        return 'black'
      } else {
        return 'green'
      }
    },
    /**
     * 点击更多
     */
    clickMore: function (code, str) {
      this.$router.push({
        name: 'popular-more',
        query: {
          code: code,
          attribution: str
          // pageIndex: 0,
          // pageSize: 6,
          // field: 'jzf',
          // ascending: true
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Plate{
  .hot-list{
    .hot{
      div.hot-title{
        display: box;              /* OLD - Android 4.4- */
        display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
        display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
        display: -ms-flexbox;      /* TWEENER - IE 10 */
        display: -webkit-flex;     /* NEW - Chrome */
        display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
        -webkit-box-pack: space-between;
        /* 12版 */
        -webkit-justify-content: space-between;
        -moz-justify-content: space-between;
        -ms-justify-content: space-between;
        -o-justify-content: space-between;
        justify-content: space-between;
        /* 09版 */
        -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        padding: 0 .3rem;
        height: .62rem;
        background: #F6F6F6;
        font-family: PingFangSC-Regular;
        font-size: .28rem;
        color: #2D2D2D;
        letter-spacing: 0.0074rem;
      }
      .more{
        width: .27rem;
        height: .62rem;
        padding: 0 0 0 .2rem;
        background: url(../../../assets/ico_point.png) no-repeat center center;
        background-size: .27rem .06rem;
      }
      .hot-item{
        display: box;              /* OLD - Android 4.4- */
        display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
        display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
        display: -ms-flexbox;      /* TWEENER - IE 10 */
        display: -webkit-flex;     /* NEW - Chrome */
        display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */

        -webkit-flex-wrap: wrap;
        -moz-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        -o-flex-wrap: wrap;
        flex-wrap: wrap;

        -webkit-box-pack: space-between;
        /* 12版 */
        -webkit-justify-content: space-between;
        -moz-justify-content: space-between;
        -ms-justify-content: space-between;
        -o-justify-content: space-between;
        justify-content: space-between;

        /* 09版 */
        -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;

        width: 100%;
        li{
          height: 2rem;
          width: 33%;
          text-align: center;
          border-bottom: 1px solid #E1E1E1;
          border-right: 1px solid #E1E1E1;
          display: box;              /* OLD - Android 4.4- */
          display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox;      /* TWEENER - IE 10 */
          display: -webkit-flex;     /* NEW - Chrome */
          display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */

          -webkit-flex-direction: column;
          -moz-flex-direction: column;
          -ms-flex-direction: column;
          -o-flex-direction: column;
          flex-direction: column;

          -webkit-box-pack: center;
          /* 12版 */
          -webkit-justify-content: center;
          -moz-justify-content: center;
          -ms-justify-content: center;
          -o-justify-content: center;
          justify-content: center;
          h3{
            font-family: PingFangSC-Regular;
            font-size: .3rem;
            color: #2D2D2D;
          }
          .percent{
            font-family: PingFangSC-Medium;
            font-size: .38rem;
            color: #FD2E26;
          }
          .percent .green{
            color: #14b900;
          }
          .other,.othre-percent{
            font-family: PingFangSC-Medium;
            font-size: .2rem;
            color: #2D2D2D;
          }
          .othre-percent{
            span{
              margin: 0 .05rem;
            }
          }
        }
        li:nth-child(3n){
          border-right: 0 none;
        }
        li:nth-child(4){
          border-bottom: 0 none;
        }
        li:nth-child(5){
          border-bottom: 0 none;
        }
        li:nth-child(6){
          border-bottom: 0 none;
        }
      }
      &:last-child{
        .hot-item{
          li:nth-child(4){
            border-bottom: 1px solid #E1E1E1;
          }
          li:nth-child(5){
            border-bottom: 1px solid #E1E1E1;
          }
          li:nth-child(6){
            border-bottom: 1px solid #E1E1E1;
          }
        }
      }
    }
  }
}
</style>
