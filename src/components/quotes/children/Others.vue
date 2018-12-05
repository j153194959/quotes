<template>
  <div class="More">
    <!-- 个股 -->
    <div>
      <h3>{{stocks.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in stocks.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 沪深指数 -->
    <div>
      <h3>{{HS.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in HS.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 股转系统 -->
    <div>
      <h3>{{shareTransfer.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in shareTransfer.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 期货行情 -->
    <div>
      <h3>{{futuresMarket.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in futuresMarket.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 香港市场 -->
    <div>
      <h3>{{HKMarket.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in HKMarket.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 期权 -->
    <div>
      <h3>{{options.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in options.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 基金 -->
    <div>
      <h3>{{fund.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in fund.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 债券 -->
    <div>
      <h3>{{bonds.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in bonds.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
    <!-- 国际市场 -->
    <div>
      <h3>{{internationalMarket.title}}</h3>
      <ul class="clearfix">
        <li @click="toListMore(value.attribution, value.code)" v-for="(value, index) in internationalMarket.list" :key="index">{{value.msg}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'More',
  data () {
    return {
      stocks: { // 个股
        title: '个股',
        list: [
          {
            msg: '上证A股',
            attribution: '上证A股', // 传给List-More的title值
            code: 'SH1001', // 股票代码
            field: '12', // 排序字段
            ascending: false // 是否正排序
          },
          {
            msg: '上证B股',
            attribution: '上证B股',
            code: 'SH1002'
          },
          {
            msg: '深证A股',
            attribution: '深证A股',
            code: 'SZ1001'
          },
          {
            msg: '深证B股',
            attribution: '深证B股',
            code: 'SZ1002'
          },
          {
            msg: '中小板',
            attribution: '中小板',
            code: 'SZ1003'
          },
          {
            msg: '创业板',
            attribution: '创业板',
            code: 'SZ1004'
          },
          {
            msg: '风险警示',
            attribution: '风险警示',
            code: 'Risk'
          },
          {
            msg: '退市整理',
            attribution: '退市整理',
            code: 'Delist'
          },
          {
            msg: ''
          }
        ]
      },
      HS: { // 沪深指数
        title: '沪深指数',
        list: [
          {
            msg: '大盘指数',
            attribution: '大盘指数',
            code: 'SHSZ1400'
          },
          {
            msg: '上证指数',
            attribution: '上证指数',
            code: 'SH1400'
          },
          {
            msg: '深证指数',
            attribution: '深证指数',
            code: 'SZ1400'
          }
        ]
      },
      shareTransfer: { // 股转系统
        title: '股转系统',
        list: [
          {
            msg: '挂牌公司',
            attribution: '挂牌公司',
            code: 'BJ1012'
          },
          {
            msg: '基础层',
            attribution: '基础层',
            code: 'BJ1006'
          },
          {
            msg: '创新层',
            attribution: '创新层',
            code: 'BJ1005'
          },
          {
            msg: '集合竞价',
            attribution: '集合竞价',
            code: 'BJ1007'
          },
          {
            msg: '做市转让',
            attribution: '做市转让',
            code: 'BJ1008'
          },
          {
            msg: '两网及退市',
            attribution: '两网及退市',
            code: 'BJ1001'
          },
          {
            msg: '优先股',
            attribution: '优先股',
            code: 'BJ1002'
          },
          {
            msg: ''
          },
          {
            msg: ''
          }
        ]
      },
      futuresMarket: { // 期货行情
        title: '期货行情',
        list: [
          {
            msg: '股指期货',
            attribution: '股指期货',
            code: 'if'
          },
          {
            msg: '国债期货',
            attribution: '国债期货',
            code: 'tf'
          },
          {
            msg: ''
          }
        ]
      },
      HKMarket: { // 香港市场
        title: '香港市场',
        list: [
          {
            msg: '港股主板',
            attribution: '港股主板',
            code: 'HK1000'
          },
          {
            msg: '港股创业板',
            attribution: '港股创业板',
            code: 'HK1004'
          },
          {
            msg: 'AH股',
            attribution: 'AH股',
            code: 'HKAH'
          },
          {
            msg: '港股通(沪)',
            attribution: '港股通(沪)',
            code: 'HKUA2301'
          },
          {
            msg: '港股通(深)',
            attribution: '港股通(深)',
            code: 'SZHK'
          },
          {
            msg: '香港基金',
            attribution: '香港基金',
            code: 'HK1100'
          },
          {
            msg: '香港债券',
            attribution: '香港债券',
            code: 'HK1300'
          },
          {
            msg: ''
          },
          {
            msg: ''
          }
        ]
      },
      options: { // 期权
        title: '期权',
        list: [
          {
            msg: '上证期权',
            attribution: '上证期权',
            code: 'SH3002'
          },
          {
            msg: ''
          },
          {
            msg: ''
          }
        ]
      },
      fund: { // 基金
        title: '基金',
        list: [
          {
            msg: '上证基金',
            attribution: '上证基金',
            code: 'SH1100'
          },
          {
            msg: '深证基金',
            attribution: '深证基金',
            code: 'SZ1100'
          },
          {
            msg: 'LOF',
            attribution: 'LOF',
            code: 'SH1110'
          },
          {
            msg: 'ETF',
            attribution: 'ETF',
            code: 'SH1120'
          },
          {
            msg: '分级基金',
            attribution: '分级基金',
            code: 'SH1130'
          },
          {
            msg: '分级A',
            attribution: '分级A',
            code: 'SH1131'
          },
          {
            msg: '分级B',
            attribution: '分级B',
            code: 'SH1132'
          },
          {
            msg: ''
          },
          {
            msg: ''
          }
        ]
      },
      bonds: { // 债券
        title: '债券',
        list: [
          {
            msg: '上证债券',
            attribution: '上证债券',
            code: 'SH1300'
          },
          {
            msg: '深证债券',
            attribution: '深证债券',
            code: 'SZ1300'
          },
          {
            msg: ''
          }
        ]
      },
      internationalMarket: { // 国际市场
        title: '国际市场',
        list: [
          {
            msg: '全球指数',
            attribution: '全球指数',
            code: 'GB1400'
          },
          {
            msg: '外汇',
            attribution: '外汇',
            code: 'GB1001'
          },
          {
            msg: ''
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 点击 列表
     */
    toListMore: function (attribution, code) {
      if (code) { // 如果列表内有文字
        // 跳转至更多列表页，且给上相应的参数
        this.$router.push({
          name: 'list-more',
          query: {
            attribution: attribution,
            code: code
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.More{
  > div{
    h3{
      height: .62rem;
      line-height: .62rem;
      background-color: #F6F6F6;
      padding-left: .36rem;
      font-family: PingFangSC-Regular;
      font-size: .28rem;
      color: #2D2D2D;
      letter-spacing: .0074rem;
    }
    > ul{
      li{
        float: left;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        width: 33.33%;
        border-right: .02rem solid #E1E1E1;
        border-bottom: .02rem solid #E1E1E1;
        height: 1.34rem;
        line-height: 1.32rem;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: .3rem;
        color: #2D2D2D;
        &:nth-child(3n+0){
          border-right: none;
        }
        &:nth-last-child(1), &:nth-last-child(2), &:nth-last-child(3){
          border-bottom: none;
          line-height: 1.34rem;
        }
      }
    }
    &:last-of-type ul{
      border-bottom: .02rem solid #E1E1E1;
    }
  }
}
</style>
