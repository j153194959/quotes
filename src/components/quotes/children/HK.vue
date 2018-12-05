<template>
  <div class="HK">
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
        code: 'HK1010',
        field: '12',
        last: 'changeRate',
        attribution: '港股',
        isShow: true,
        statu: 0
      },
      decline: {
        name: '跌幅榜',
        code: 'HK1000',
        field: '12',
        ascending: true,
        last: 'changeRate',
        attribution: '港股',
        isShow: false,
        statu: 1
      },
      turnover: {
        name: '换手率',
        code: 'HK1000',
        field: '15',
        last: 'turnoverRate',
        attribution: '港股',
        isShow: false,
        statu: 2
      },
      deal: {
        name: '成交额',
        code: 'HK1000',
        field: '20',
        last: 'amount',
        attribution: '港股',
        isShow: false,
        statu: 3
      },
      hszs: 'HSI.hk', // 恒生指数
      gqzs: 'HSCEI.hk', // 国企指数
      hczs: 'HSCCI.hk', // 红筹指数
      isTopArrow: true, // 根据价格显示相应的箭头图标
      data: [],
      timer: null // 定时更新定时器
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
      var codeStr = this.hszs + ',' + this.gqzs + ',' + this.hczs
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
      if (now === '--' || parseFloat(now) === 0 || parseFloat(now) === parseFloat(comparing)) {
        return ''
      }
      if (parseFloat(now) > parseFloat(comparing)) {
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
.HK{
}
</style>
