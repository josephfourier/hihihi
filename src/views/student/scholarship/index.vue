<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="我的奖学金" name="my">
        <my-scholarships class="zjy-tab__item" v-if="active.my"></my-scholarships>
      </el-tab-pane>
      <el-tab-pane label="全部奖学金" name="all">
        <all-scholarships class="zjy-tab__item" v-if="active.all"></all-scholarships>
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
    AllScholarships,
    MyScholarships
  }
}
</script>
