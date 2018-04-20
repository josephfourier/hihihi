<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的困难补助" name="my">
        <my-allowances class="zjy-tab__item" :active="!active"></my-allowances>
      </el-tab-pane>
      <el-tab-pane label="全部困难补助" name="all">
        <all-allowances class="zjy-tab__item" :active="active"></all-allowances>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllAllowances from './AllAllowances'
import MyAllowances from './MyAllowances'

export default {
  data () {
    return {
      current: 'my',
      active: false // 组件通信
    }
  },
  methods: {
    tabClick (tab, event) {
      this.active = !this.active
    }
  },
  components: {
    AllAllowances,
    MyAllowances
  }
}
</script>
<style lang='scss' scoped>

</style>
