<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="荣誉称号管理" name="manage">
        <honoraries-manage class="zjy-tab__item" v-if="active"></honoraries-manage>
      </el-tab-pane>
      <el-tab-pane label="班级荣誉称号" name="clz">
        <my-honoraries class="zjy-tab__item" v-if="active"></my-honoraries>
      </el-tab-pane>
      <el-tab-pane label="全部荣誉称号" name="all">
        <all-honoraries class="zjy-tab__item" v-if="active"></all-honoraries>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllHonoraries from './AllHonoraries'
import MyHonoraries from './MyHonoraries'
import HonorariesManage from './HonorariesManage'

export default {
  data () {
    return {
      current: 'manage',
      active: false // 组件通信
    }
  },
  methods: {
    tabClick (tab, event) {
      // tab.active = false
      this.active = !this.active
    }
  },
  components: {
    AllHonoraries,
    MyHonoraries,
    HonorariesManage
  }
}
</script>
<style lang='scss' scoped>

</style>
