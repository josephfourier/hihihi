<template>
  <div class="err-container">
    <div class="wrap"> -->
      <img src="./bg_404.png" alt="页面未找到">
      <p class="tip">很抱歉，您访问的页面不存在</p>
      <div class="button-group">
        <ZjyButton class="err" @click.native="index">返回首页</ZjyButton>
        <ZjyButton class="err" @click.native="back">后退一步</ZjyButton>
      </div>
    </div>
  </div>

</template>
<script>
import ZjyButton from '@/components/button'

export default {
  methods: {
    index () {
      this.$router.push({ path: '/home' })
    },
    back () {
      this.$router.back()
    }
  },
  components: {
    ZjyButton
  }
}
</script>
<style lang="scss">
.err-container {
  min-width: 1200px;
  background-color: #02203a;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 100%;
  .wrap {
    margin: 0 auto;
    width: 587px;
    height: 320px;

    > img {
      width: 100%;
      height: 100%;
    }

    .button-group {
      text-align: center;
      padding: 35px;
    }
    .tip {
      text-align: center;
      font-size: 24px;
      color: #ffffff;
      padding-top: 70px;
    }
  }
  .zjy-button.err {
    background-color: #37c6d4;
    color: #ffffff;
    font-size: 22px;
    border: 1px solid #37c6d4;
    border-radius: 26px;
    height: 52px;
    width: 176px;
  }
}
</style>
