<template>
  <div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  // 修复IE不跳转
  mounted () {
    if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
      var that = this
      window.addEventListener('hashchange', function (event) {
        var currentPath = window.location.hash.slice(1)
        that.$router.push({path: currentPath})
      }, true)
    }
  }
}
</script>
