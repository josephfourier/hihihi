<template>
  <div class="zjy-wrapper">
    <zjy-header :class="[{'isCollapse': isCollapse}]"></zjy-header>
    <zjy-sidebar class="zjy-sidebar"></zjy-sidebar>
    <div :class="['main-container', {'isCollapse': isCollapse}]">
      <zjy-breadcrumb></zjy-breadcrumb>
      <zjy-main class="zjy-main" v-if="active"></zjy-main>
    </div>
  </div>
</template>

<script>
import { ZjySidebar, ZjyMain, ZjyHeader, ZjyBreadcrumb } from './'
export default {
  data () {
    return {
      active: true,
      isCollapse: false
    }
  },
  methods: {
    reload () {
      this.active = false
      this.$nextTick(() => (this.active = true))
    },
    collapse () {
      this.$store.dispatch('setCollapsed', !this.isCollapse)
      this.$nextTick(() => this.isCollapse = !this.isCollapse)
    }
  },

  provide () {
    return {
      reload: this.reload,
      // 开发环境下点击可刷新
      // force: process.env.NODE_ENV === 'development',
      force: true,
      collapse: this.collapse,
      isCollapse: this.isCollapse
    }
  },

  components: {
    ZjySidebar,
    ZjyBreadcrumb,
    ZjyMain,
    ZjyHeader
  }
}

</script>
<style lang="scss" scoped>
.main-container,
.zjy-sidebar {
  transition: all .2s
}
.main-container.isCollapse,
.zjy-header.isCollapse {
  margin-left: 54px;
}
</style>
