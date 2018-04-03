<!-- 投保理赔管理 学生  -->
<template>
  <div class="wrapper">
    <div class="zjy-tabs">
      <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
        <el-tab-pane label="我的保险" name="my">
          <my-insurances class="zjy-tab__item" :active="!active"></my-insurances>
        </el-tab-pane>
        <el-tab-pane label="全部保险" name="all">
          <all-insurances class="zjy-tab__item" :active="active"></all-insurances>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyInsurances from './MyInsurances'
import AllInsurances from './AllInsurances'

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
    AllInsurances,
    MyInsurances
  }
}
</script>
<style lang='scss' scoped>

</style>
