<!--  -->
<template>
  <div class="zjy-header">

    <div class="wrapper">
      <div class="school">
        <span>{{ user.schoolName }}</span>
        <span class="spacer"></span>
        <span>学工系统</span>
      </div>

      <el-dropdown class="user-info">
        <span class="el-dropdown-link">
          <i class="zjy-icon zjy-icon-user"></i>
          <span>{{ user.fullName }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><a @click="back">返回个人中心</a></el-dropdown-item>
          <el-dropdown-item><a @click="logout">退出系统</a></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {}
  },

  methods: {
    back () {
      window.location.href = process.env.SSO_URL
    },

    logout () {
      MSG.success('开发中...')
      // this.$store.dispatch('logout').then(() => {
      //   window.location.href = process.env.LOGOUT_URL
      // })
    }
  },

  computed: {
    ...mapGetters(['user'])
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  position: absolute;
  line-height: 60px;
  top: 0;
  right: 0;
  left: 0;
  box-shadow: 0px 0px 8px 0px #d7d9de;
  .school {
    padding-left: 20px;
    & > span {
      color: #666666;
    }
  }

  .user-info {
    position: absolute;
    top: 0;
    right: 15px;
    height: 60px;
    margin-right: 35px;
    line-height: 60px;
    cursor: pointer;

    .zjy-icon-user {
      width: 20px;
      height: 20px;
      background: url('./zjy-icon-user.png') no-repeat 0 0;
    }
  }

  .badge-wrap {
    float: right;
    margin-right: 50px;
  }
}
.el-dropdown-menu.el-popper {
  top: 40px !important;
  min-width: 125px;
}
</style>
