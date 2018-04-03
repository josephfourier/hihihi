<!--  -->
<template>
  <div class="zjy-wrapper">
    <zjy-header></zjy-header>
    <zjy-sidebar class="zjy-sidebar"></zjy-sidebar>
    <div class="main-container">
      <zjy-breadcrumb></zjy-breadcrumb>
      <zjy-main class="zjy-main"></zjy-main>
    </div>
  </div>
</template>

<script>
import { ZjySidebar, ZjyMain, ZjyHeader, ZjyBreadcrumb } from './'
export default {
  data () {
    return {
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
</style>
