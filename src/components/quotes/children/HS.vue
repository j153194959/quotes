<template>
  <div class="HS">
    <!-- 指数 -->
    <ul class="index-list">
      <li v-for="item in data" :key="item.name" @click="toIndex(item.code)">
        <h2>{{item.name|changeStr}}</h2>
        <div>
          <img src="../../../assets/icon_cart2_top.png" alt="" v-if="parseFloat(item.lastPrice) >= parseFloat(item.preClosePrice)">
          <img src="../../../assets/icon_cart2_down.png" alt="" v-else>
          <span class="index-num" :class="[getColor(item.lastPrice, item.preClosePrice)]">{{item.lastPrice}}</span>
        </div>
        <div>
          <span>{{getChange(item.lastPrice, item.preClosePrice, item.change)}}</span>
          <span>{{getChangeRate(item.lastPrice, item.preClosePrice, item.changeRate)}}</span>
        </div>
      </li>
      <!-- <li>
        <h2>深证指数</h2>
        <div>
          <img src="../../../assets/icon_cart.png" alt="">
          <span class="index-num">3049.80</span>
        </div>
        <div>
          <span>+23.93</span>
          <span>+0.79%</span>
        </div>
      </li>
      <li>
        <h2>创业指数</h2>
        <div>
          <img src="../../../assets/icon_cart.png" alt="">
          <span class="index-num">3049.80</span>
        </div>
        <div>
          <span>+23.93</span>
          <span>+0.79%</span>
        </div>
      </li> -->
    </ul>
    <list :transfer="gains"></list>
    <list :transfer="decline"></list>
    <list :transfer="turnover"></list>
    <list :transfer="deal"></list>
  </div>
</template>

<script>
import List from './Common-list'

export default {
  name: 'HS',
  data () {
    return {
      gains: {
        name: '涨幅榜',
        code: 'SHSZ1001',
        field: '12',
        last: 'changeRate',
        attribution: '沪深A股',
        isShow: true,
        statu: 0
      },
      decline: {
        name: '跌幅榜',
        code: 'SHSZ1001',
        field: '12',
        ascending: true,
        last: 'changeRate',
        attribution: '沪深A股',
        isShow: false,
        statu: 1
      },
      turnover: {
        name: '换手率',
        code: 'SHSZ1001',
        field: '15',
        last: 'turnoverRate',
        attribution: '沪深A股',
        isShow: false,
        statu: 2
      },
      deal: {
        name: '成交额',
        code: 'SHSZ1001',
        field: '20',
        last: 'amount',
        attribution: '沪深A股',
        isShow: false,
        statu: 3
      },
      szzs: '000001.sh', // 上证指数
      szcz: '399001.sz', // 深证成指
      cybz: '399006.sz', // 创业板指
      data: [],
      timer: null // 定时更新定时器
      // name: '--', // 股票名称
      // isStop: false, // 是否停牌
      // lastPrice: '--', // 最新价
      // change: '--', // 涨跌
      // changeRate: '--', // 涨跌比率
      // status: '--', // 股票状态
      // preClosePrice: '--', // 昨收价
      // aa: '--' // 最新价
    }
  },
  components: {
    List
  },
  filters: {
    /**
     * 处理00或者空数据为--
     */
    changeStr: function (lastPrice) {
      if (lastPrice && (lastPrice === '0.000' || lastPrice === '0.00')) {
        return '--'
      } else {
        return lastPrice
      }
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    /**
     * 得到数据
     */
    getData: function () {
      var that = this
      var codeStr = this.szzs + ',' + this.szcz + ',' + this.cybz
      window.StockAPI.send('quote', {
        code: codeStr,
        stockFields: [0, 1, 2, 7, 12, 19],
        onSuccess: function (resp) {
          // 成功响应处理
          // console.log(resp)
          that.data = resp.quoteItems
          // console.info(that.data)
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
        }
      })
    },
    /**
     * 根据价格改变颜色
     */
    getColor: function (now, comparing) {
      // console.info(now, comparing)
      if (now === '--' || parseFloat(now) === 0 || parseFloat(now) === parseFloat(comparing)) {
        return 'black'
      }
      if (parseFloat(now) >= parseFloat(comparing)) {
        return 'red'
      } else {
        return 'green'
      }
    },
    getChange: function (lastPrice, preClosePrice, change) {
      return this.GLOBAL.getClass(lastPrice, preClosePrice) + change
    },
    getChangeRate: function (lastPrice, preClosePrice, changeRate) {
      return this.GLOBAL.getClass(lastPrice, preClosePrice) + parseFloat(changeRate).toFixed(2) + '%'
    },
    /**
     * 点击列表跳转
     */
    toIndex: function (code) {
      this.$router.push({name: 'index', params: {id: code}, query: { isFromSearch: 1 }})
    },
    /**
     * 每隔10秒更新一次数据
     */
    updated: function () {
      this.timer = setInterval(() => {
        this.getData()
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.HS{
}
</style>
