<template>
  <div class="HKConnect">
    <!-- 指数 -->
    <!-- <ul class="index-list2">
      <li>
        <h2>沪市深港股通余额</h2>
        <span>120.44亿</span>
      </li>
      <li>
        <h2>深市深港股通余额</h2>
        <span>120.44亿</span>
      </li>
    </ul> -->
    <list :transfer="AH"></list>
    <list :transfer="HKh"></list>
    <list :transfer="HKs"></list>
  </div>
</template>

<script>
import List from './Common-list'

export default {
  name: 'HS',
  data () {
    return {
      AH: {
        name: 'AH股',
        code: 'HKAH',
        field: '12',
        last: 'changeRate',
        attribution: 'AH股',
        isShow: true,
        statu: 0
      },
      HKh: {
        name: '港股通(沪)',
        code: 'HKUA2301',
        field: '12',
        last: 'changeRate',
        attribution: '港股通(沪)',
        isShow: false,
        statu: 0
      },
      HKs: {
        name: '港股通(深)',
        code: 'SZHK',
        field: '12',
        last: 'changeRate',
        attribution: '港股通(深)',
        isShow: false,
        statu: 0
      }
    }
  },
  components: {
    List
  },
  mounted () {
    this.getData()
  },
  methods: {
    /**
     * 获取数据
     */
    getData: function () {
      window.StockAPI.send('hkmarinfo', {
        onSuccess: function (resp) {
          // 成功响应处理
          console.log('数据=>', resp)
        },
        onError: function (resp) {
          // 失败响应处理
          console.log(resp)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.HKConnect{
  ul.index-list2{
    display: box;              /* OLD - Android 4.4- */
    display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox;      /* TWEENER - IE 10 */
    display: -webkit-flex;     /* NEW - Chrome */
    display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
    text-align: center;
    li{
      flex: 1;
      height: 1.16rem;
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
      /* 09版 */
      -webkit-box-align: center;
      /* 12版 */
      -webkit-align-items: center;
      -moz-align-items: center;
      -ms-align-items: center;
      -o-align-items: center;
      align-items: center;
      h2{
        font-family: MicrosoftYaHei;
        font-size: .28rem;
        color: #91999F;
        letter-spacing: 0.74px;
      }
      span{
        font-family: MicrosoftYaHei;
        font-size: .34rem;
        color: #2D2D2D;
        letter-spacing: 0.009rem;
      }
    }
  }
}
</style>
