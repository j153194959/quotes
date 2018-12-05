<template>
  <div class="Loading">
    <div><img src="../../../static/images/loading.gif" alt=""></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      msg: 'demo-vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Loading{
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 11;
  display:-webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  > div{
    width: .861111rem; /* 124 */
    height: .861111rem; /* 124 */
  }
}
</style>
