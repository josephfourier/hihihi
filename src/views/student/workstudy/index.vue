<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的岗位信息" name="my">
        <my-jobs class="zjy-tab__item" v-if="active.my"></my-jobs>
      </el-tab-pane>
      <el-tab-pane label="全部岗位信息" name="all">
        <all-jobs class="zjy-tab__item" v-if="active.all"></all-jobs>
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
       active: {
        'my': true,
        'all': false,
      }
    }
  },
  methods: {
    tabClick (tab, event) {
       for (let key in this.active) {
        this.active[key] = false
      }
      this.active[tab.name] = true
    }
  },
  components: {
    MyJobs,
    AllJobs
  }
}
</script>
