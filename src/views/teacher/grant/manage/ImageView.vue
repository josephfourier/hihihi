<template>
  <div class="wrapper">
    <div class="img-container">
    <img :src="src" alt="无法查看">
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  components: {},
  props: {
    src: String
  }
}

</script>
<style lang='scss' scoped>
.img-container {
  // width: 680px;
  // padding: 20px;
  // background-color:#eee;
  width: 720px;
  &>img {
    width:100%;
  }
}
</style>
