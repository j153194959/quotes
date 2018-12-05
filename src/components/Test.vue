<template>
  <div class="Controller">
    <div>爱爱啊</div>
  </div>
</template>

<script>
export default {
  name: 'Controller',
  data () {
    return {
      msg: 'demo-vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Controller{
  div{
    width: calc(100% - 5px);
    background-color: gray;
    height: (100px / 4px);
    font-size: 1 / 4;
  }
}
</style>
