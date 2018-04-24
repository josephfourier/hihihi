<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的岗位信息" name="my">
        <my-jobs class="zjy-tab__item" :active="!active"></my-jobs>
      </el-tab-pane>
      <el-tab-pane label="全部岗位信息" name="all">
        <all-jobs class="zjy-tab__item" :active="active"></all-jobs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllJobs from './AllJobs'
import MyJobs from './MyJobs'

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
    MyJobs,
    AllJobs
  }
}
</script>
