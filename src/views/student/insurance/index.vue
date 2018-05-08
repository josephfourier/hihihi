<!-- 投保理赔管理 学生  -->
<template>
    <div class="zjy-tabs">
      <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
        <el-tab-pane label="我的保险" name="my">
          <my-insurances class="zjy-tab__item" v-if="active.my"></my-insurances>
        </el-tab-pane>
        <el-tab-pane label="全部保险" name="all">
          <all-insurances class="zjy-tab__item" v-if="active.all"></all-insurances>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import MyInsurances from './MyInsurances'
import AllInsurances from './AllInsurances'

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
    AllInsurances,
    MyInsurances
  }
}
</script>
