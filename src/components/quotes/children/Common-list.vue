<template>
  <div class="Common-list">
    <!-- 模版 -->
    <ul class="rank-list">
      <li>
        <div @click="shrink(3)" class="rank-list-title">
          <div>
            <img :class="{down: transfer.isShow}" src="../../../assets/icon_arrow.png" alt="">
            <span>{{transfer.name}}</span>
          </div>
          <span @click.stop="clickMore" class="more"></span>
        </div>
        <ul v-if="transfer.isShow" class="rank-list-item">
          <li @click="toIndex(value.code)" v-for="(value, index) in data" :key="index">
            <div>
              <p>{{value.name}}</p>
              <span>{{value.code | code}}</span>
            </div>
            <div class="rank-list-item-num">
              <span>{{value.lastPrice}}</span>
              <span v-if="transfer.statu === 0" class="red">+{{value.last}}%</span>
              <span v-if="transfer.statu === 1" class="green">-{{value.last}}%</span>
              <span v-if="transfer.statu === 2" class="black">{{value.last}}%</span>
              <span v-if="transfer.statu === 3" class="black">{{value.last | getNum}}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Common-list',
  data () {
    return {
      // transfer: {
      //   name: '涨幅榜', // 名称
      //   code: 'SHSZ1001', // 股票代码
      //   field: '12', // 排序字段
      //   ascending: false, // 是否正排序
      //   last: 'changeRate', // 最后一个的键值
      //   attribution: 'attribution', // 传给List-More的title值
      //   isShow: false, // 是否展示列表
      //   statu: 0 // 当前状态 0-涨幅榜-红色 1-跌幅榜-绿色 2-换手率-黑色 3-成交额-黑色
      // },
      data: [
        // {
        //   name: '--', // 股票名称
        //   code: '--', // 股票代码
        //   lastPrice: '--', // 最新价
        //   last: '--', // 最后一项
        // }
      ]
    }
  },
  props: ['transfer'],
  filters: {
    /**
     * 处理code
     */
    code: function (code) {
      return code.split('.')[0]
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
    }
  },
  methods: {
    /**
     * 点击 收缩
     */
    shrink: function (index) {
      this.transfer.isShow = !this.transfer.isShow
    },
    /**
     * 点击 更多
     */
    clickMore: function () {
      // console.log(this.transfer.attribution)
      this.$router.push({
        name: 'list-more',
        query: {
          attribution: this.transfer.attribution,
          code: this.transfer.code,
          field: this.transfer.field,
          ascending: this.transfer.ascending
        }})
    },
    /**
     * 获取数据
     */
    getData: function () {
      this.data = []
      var that = this
      // console.log(that.transfer)
      window.StockAPI.send('catesorting', {
        code: that.transfer.code,
        pageIndex: 0,
        pageSize: 10,
        field: that.transfer.field,
        ascending: that.transfer.ascending,
        onSuccess: function (resp) {
          // 成功响应处理
          const Data = resp.quoteItems
          // console.log(Data)
          that.data = []
          for (let i = 0; i < Data.length; i++) {
            const el = Data[i]
            let o = {}
            o.name = el.name
            o.code = el.code
            o.lastPrice = el.lastPrice
            o.last = el[that.transfer.last]
            that.data.push(o)
          }
          // console.log(that.data)
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
    }
  },
  mounted: function () {
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Common-list{
  ul.rank-list{
    li{
      div.rank-list-title{
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
        div:nth-of-type(1){
          display: box;              /* OLD - Android 4.4- */
          display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
          display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
          display: -ms-flexbox;      /* TWEENER - IE 10 */
          display: -webkit-flex;     /* NEW - Chrome */
          display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
          -webkit-box-pack: center;
          /* 12版 */
          -webkit-justify-content: center;
          -moz-justify-content: center;
          -ms-justify-content: center;
          -o-justify-content: center;
          justify-content: center;
          /* 09版 */
          -webkit-box-align: center;
          /* 12版 */
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-align-items: center;
          -o-align-items: center;
          align-items: center;
          img{
            width: .14rem;
            height: .26rem;
            &.down{
              transform: rotate(90deg)
            }
          }
          span{
            margin-left: .15rem;
          }
        }
      }
      .more{
        width: .27rem;
        height: .62rem;
        background: url(../../../assets/ico_point.png) no-repeat center center;
        background-size: .27rem .06rem;
        padding: 0 .4rem;
        margin-right: -.3rem;
      }
      .rank-list-item{
        li{
          padding: 0 .3rem;
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
          height: 1.04rem;
          div:first-child{
            -webkit-box-flex: 1;      /* OLD - iOS 6-, Safari 3.1-6 */
            -moz-box-flex: 1;         /* OLD - Firefox 19- */
            // width: 20%;               /* For old syntax, otherwise collapses. */
            -webkit-flex: 1;          /* Chrome */
            -ms-flex: 1;              /* IE 10 */
            flex: 1;                  /* NEW, Spec - Opera 12.1, Firefox 20+ */
            p{
              font-family: PingFangSC-Regular;
              font-size: .34rem;
              color: #2D2D2D;
            }
            span{
              font-family: PingFangSC-Regular;
              font-size: .22rem;
              color: #656B6E;
            }
          }
          .rank-list-item-num{
            -webkit-box-flex: 1;      /* OLD - iOS 6-, Safari 3.1-6 */
            -moz-box-flex: 1;         /* OLD - Firefox 19- */
            // width: 20%;               /* For old syntax, otherwise collapses. */
            -webkit-flex: 1;          /* Chrome */
            -ms-flex: 1;              /* IE 10 */
            flex: 1;                  /* NEW, Spec - Opera 12.1, Firefox 20+ */
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
            span:nth-of-type(1){
              font-family: PingFangSC-Medium;
              font-size: .44rem;
              color: #2D2D2D;
            }
            span:nth-of-type(2){
              font-family: PingFangSC-Medium;
              font-size: .36rem;
              color: #FD2E26;
            }
          }
        }
      }
    }
  }

}
</style>
