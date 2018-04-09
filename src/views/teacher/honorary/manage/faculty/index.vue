<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="荣誉称号管理" name="manage">
        <honoraries-manage class="zjy-tab__item" v-if="active.manage"></honoraries-manage>
      </el-tab-pane>
      <el-tab-pane label="院系荣誉称号" name="fac">
        <my-honoraries class="zjy-tab__item" v-if="active.fac"></my-honoraries>
      </el-tab-pane>
      <el-tab-pane label="全部荣誉称号" name="all">
        <all-honoraries class="zjy-tab__item" v-if="active.all"></all-honoraries>
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
      active: {
        'manage': true,
        'fac': false,
        'all': false
      }
    }
  },
  methods: {
    tabClick (tab, event) {
      // 每次打开均刷新
      for (let key in this.active) {
        this.active[key] = false
      }
      this.active[tab.name] = true
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
