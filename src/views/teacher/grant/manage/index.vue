<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <el-tab-pane label="助学金名单" name="list">
        <list class="zjy-tab__item" v-if="active.list"></list>
      </el-tab-pane>
      <el-tab-pane label="助学金文件" name="file">
        <file class="zjy-tab__item" v-if="active.file"></file>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import List from './List'
import File from './File'

export default {
  data () {
    return {
      current: 'list',
      active: {
        'list': true,
        'file': false
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
    List,
    File
  }
}
</script>
<style lang='scss' scoped>

</style>
