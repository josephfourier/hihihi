<!--
1、若有多个子菜单，点击父菜单则默认显示第一个子菜单
 -->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <transition-group name="breadcrumb" v-if="breadcrumbList.length !== 0">

        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.name" v-if="item.redirect !== 'no'">
          <router-link :to="item.path">
            {{ item.name }}
          </router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbList: []
    }
  },
  watch: {
    $route (val) {
      this.updateBreadcrumb()
    }
  },
  methods: {
    updateBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      this.breadcrumbList = matched
    }
  },
  created () {
    this.updateBreadcrumb()
  }
}
</script>
<style lang='scss' scoped>
  .breadcrumb {
    .el-breadcrumb {
      background-color: #eef1f5;
      padding: 15px 0 15px 20px;
    }
  }
</style>
