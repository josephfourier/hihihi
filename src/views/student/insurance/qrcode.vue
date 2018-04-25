<!--  -->
<template>
  <div>
    <img :src="url" alt="二维码">
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
</style>