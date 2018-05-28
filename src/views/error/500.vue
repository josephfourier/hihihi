<!--  -->
<template>
   <div class="err-container">
    <div class="wrap">
      <!-- <div class="button-group">
        <ZjyButton class="err" @click.native="index">返回首页</ZjyButton>
        <ZjyButton class="err" @click.native="back">后退一步</ZjyButton>
      </div> -->

      <div class="img-group">
        <img src="./bg_500.png" alt="服务器出错了" style="width:100%">
        <div class="button-group">
           <div class="tip">
          <p>网页出现错误</p>
          <p>别慌，我们的程序员正在恢复中</p>
        </div>
          <ZjyButton class="err" @click.native="index">返回首页</ZjyButton>
          <ZjyButton class="err" @click.native="back">刷新试试</ZjyButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'

export default {
  data () {
    return {
    }
  },
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
<style lang="scss" scoped>
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
    /*margin: 0 auto;*/
    /*width: 587px;*/
    /*height: 320px;*/
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    /*> img {*/
      /*!*width: 100%;*!*/
      /*!*height: 200px;*!*/
    /*}*/

    .button-group {
      text-align: center;
          position: absolute;
    top: 50%;
    left: 22%;
    }
    .tip {
      text-align: left;
      font-size: 24px;
      color: #ffffff;
      padding: 30px 0;
      p {
        line-height: 40px;
        text-indent: 10px;
      }
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
