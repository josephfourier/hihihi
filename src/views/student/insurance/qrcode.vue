<template>
  <div class="wrapper" v-if="url">
    <img src="./img_zf.png" alt="" class="img img1">
    <img :src="url" alt="支付二维码" class="img img2">
    <p class="tip">请扫描二维码支付</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    url: String
  }
}
</script>
<style lang='scss' scoped>
  .wrapper {
    img {
      vertical-align: top;
      border: none;
      &.img2 {
        padding-top: 40px;
        width: 190px;
        height: 190px;
      }
    }
    p {
      position: absolute;
      right: 128px;
      font-size: 14px;
      bottom: 60px;
    }
  }
</style>
