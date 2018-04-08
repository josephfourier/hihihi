<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的荣誉称号" name="my">
        <my-honoraries class="zjy-tab__item" :active="!active"></my-honoraries>
      </el-tab-pane>
      <el-tab-pane label="全部荣誉称号" name="all">
        <all-honoraries class="zjy-tab__item" :active="active"></all-honoraries>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllHonoraries from './AllHonoraries'
import MyHonoraries from './MyHonoraries'

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
    AllHonoraries,
    MyHonoraries
  }
}
</script>
<style lang='scss' scoped>

</style>
