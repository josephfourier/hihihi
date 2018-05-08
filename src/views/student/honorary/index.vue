<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的荣誉称号" name="my">
        <my-honoraries class="zjy-tab__item" v-if="active.my"></my-honoraries>
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
    AllHonoraries,
    MyHonoraries
  }
}
</script>
<style lang='scss' scoped>

</style>
