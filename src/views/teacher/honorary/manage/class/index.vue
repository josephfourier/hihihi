<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="荣誉称号管理" name="manage">
        <honoraries-manage class="zjy-tab__item"></honoraries-manage>
      </el-tab-pane>
      <el-tab-pane label="班级荣誉称号" name="clz">
        <my-honoraries class="zjy-tab__item"></my-honoraries>
      </el-tab-pane>
      <el-tab-pane label="全部荣誉称号" name="all">
        <all-honoraries class="zjy-tab__item"></all-honoraries>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import AllHonoraries from './AllHonoraries'
import MyHonoraries from './MyHonoraries'
import HonorariesManage from './HonorariesManage'
var bus = new Vue()

export default {
  data () {
    return {
      current: 'manage'
    }
  },
  methods: {
    tabClick (tab, event) {
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
