<!--  -->
<template>
  <div class="home">
    <div class="welcome">
      <img src="./hy_bg.png" alt="">
    </div>
    <div class="star">
      <img src="./star_bg.png" alt="">
    </div>
    <div class="content">
      <img src="./img_bg.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }

}

</script>
<style lang='scss' scoped>
  .home {
    position: fixed;
    background: #2fbada url('./bg.png') repeat-x 0 0;
    bottom: 0;
    top: 60px;
    width: 100%;
  }
  .welcome {
    text-align: center;
    position: relative;
    top: 100px;
    left: -130px;
  }
  .star {
    text-align:center;
    position: relative;
    top: 40px;
    left: -100px;
  }
  .content {
    text-align: center;
    left: -110px;
    position: relative;
    top: -120px;
  }
</style>
