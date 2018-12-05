<template>
  <div class="Quotes">
    <header>
      <router-link :to="{name: 'search'}" class="search_icon"></router-link>
      <h1>市场行情</h1>
    </header>
    <nav>
      <ul>
        <li @click="clickNav(index)" :class="{active: value.statu}" v-for="(value, index) in nav" :key="index">{{value.msg}}</li>
      </ul>
    </nav>
    <nav>
      <router-link :to="{name: 'optional'}" replace>自选</router-link>
      <router-link :to="{name: 'quotes-hs'}" class="current" replace>行情</router-link>
    </nav>
    <router-view class="child-view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'Quotes',
  data () {
    return {
      nav: [ // 导航栏控制
        {
          statu: 1,
          msg: '沪深'
        },
        {
          statu: 0,
          msg: '板块'
        },
        {
          statu: 0,
          msg: '港股'
        },
        {
          statu: 0,
          msg: '港股通'
        },
        {
          statu: 0,
          msg: '其他'
        }
      ]
    }
  },
  watch: {
    '$parent.windowOnload' () {
      // 在小程序里抛出分享链接
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    },
    '$parent.initOk': function (to, from) {
      this.navBug()
    }
  },
  methods: {
    /**
     * 点击导航栏
     */
    clickNav: function (index) {
      // 定义变量接收所有name
      var names = ['quotes-hs', 'quotes-plate', 'quotes-hk', 'quotes-hk-connect', 'quotes-others']
      // 改变导航栏状态
      for (let i = 0; i < this.nav.length; i++) {
        this.$set(this.nav[i], 'statu', 0)
      }
      this.$set(this.nav[index], 'statu', 1)
      // 切换路由
      this.$router.replace({name: names[index]})
    },
    /**
     * 防止页面刷新导航栏出错
     */
    navBug: function () {
      // 定义变量接收所有path
      var names = ['quotes-hs', 'quotes-plate', 'quotes-hk', 'quotes-hk-connect', 'quotes-others']
      // 获取当前索引值
      var index = names.indexOf(this.$route.name)
      // 改变导航栏状态
      for (let i = 0; i < this.nav.length; i++) {
        this.$set(this.nav[i], 'statu', 0)
      }
      this.$set(this.nav[index], 'statu', 1)
    }
  },
  beforeMount: function () {
    // 如果初始化完成
    if (this.$parent.initOk) this.navBug()
    if (this.$parent.windowOnload) {
      if (this.$parent.isWechart) window.wx.miniProgram.postMessage({data: {link: window.location.href}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.Quotes{
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  > header{
    background: #2E6BB1;
    height: .85rem;
    line-height: .85rem;
    // border-bottom: .01rem solid #2E6BB1;
    position: relative;
    z-index: 3;
    .search_icon{
      position: absolute;
      right: .36rem;
      bottom: .126rem;
      width: .4rem;
      height: .4rem;
      padding: .1rem .3rem .1rem .3rem;
      background: url(../../assets/ico_search.svg) no-repeat center center;
      background-size: .4rem .4rem;
    }
    h1{
      font-family: PingFangSC-Regular;
      font-size: .36rem;
      color: #FFF;
      text-align: center;
    }
  }
  > nav{
    position: relative;
    z-index: 3;
    &:first-of-type{
      ul{
        height: .68rem;
        display: box;              /* OLD - Android 4.4- */
        display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
        display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
        display: -ms-flexbox;      /* TWEENER - IE 10 */
        display: -webkit-flex;     /* NEW - Chrome */
        display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
        -webkit-box-pack: space-around;
        /* 12版 */
        -webkit-justify-content: space-around;
        -moz-justify-content: space-around;
        -ms-justify-content: space-around;
        -o-justify-content: space-around;
        justify-content: space-around;
        /* 09版 */
    	  -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        background: #2E6BB1;
        border-top: .02rem solid #205899;
        // border-bottom: .02rem solid #205899;
        li{
          // flex: 1;
          padding: 0 .36rem;
          height: .68rem;
          text-align: center;
          line-height: 0.68rem;
          font-size: .28rem;
          color: #FFF;
          border-bottom: .02rem solid transparent;
        }
        li.active{
          color:  #76C3FA;
          border-bottom: .02rem solid #76C3FA;
        }
      }
    }
    &:last-of-type{
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
  .child-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transition: all .5s cubic-bezier(.55,0,.1,1);
    overflow-y: scroll;
    padding-bottom: .86rem;
    padding-top: 1.55rem;
    box-sizing: border-box;
    -moz-box-sizing: border-box; /* Firefox */
    -webkit-box-sizing: border-box; /* Safari */
  }
  > div{
    ul.index-list{
      display: box;              /* OLD - Android 4.4- */
      display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
      display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
      display: -ms-flexbox;      /* TWEENER - IE 10 */
      display: -webkit-flex;     /* NEW - Chrome */
      display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
      text-align: center;
      li{
        -webkit-box-flex: 1;      /* OLD - iOS 6-, Safari 3.1-6 */
        -moz-box-flex: 1;         /* OLD - Firefox 19- */
        // width: 20%;               /* For old syntax, otherwise collapses. */
        -webkit-flex: 1;          /* Chrome */
        -ms-flex: 1;              /* IE 10 */
        flex: 1;                  /* NEW, Spec - Opera 12.1, Firefox 20+ */
        height: 1.66rem;
        margin: .1rem 0 .1rem .1rem;
        background: #F6F6F6;
        h2{
          font-size: .32rem;
          color: #2D2D2D;
        }
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
            width: .12rem;
            height: .1rem;
          }
          .index-num{
            font-family: PingFangSC-Medium;
            font-size: .34rem;
            color: #FD2E26;
            margin-left: .1rem;
          }
          .index-num.red{
            color: #FD2E26;
          }
          .index-num.blue{
            color: #14b900;
          }
        }
        div:nth-of-type(2){
          font-family: PingFangSC-Medium;
          font-size: .22rem;
          color: #2D2D2D;
        }
      }
      li:last-child{
        margin: .1rem;
      }
    }
  }
}
</style>
