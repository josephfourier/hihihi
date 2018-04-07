<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的奖学金" name="my">
        <my-scholarships class="zjy-tab__item" :active="!active"></my-scholarships>
      </el-tab-pane>
      <el-tab-pane label="全部奖学金" name="all">
        <all-scholarships class="zjy-tab__item" :active="active"></all-scholarships>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllScholarships from './AllScholarships'
import MyScholarships from './MyScholarships'

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
    AllScholarships,
    MyScholarships
  }
}
</script>
<style lang='scss' scoped>

</style>
