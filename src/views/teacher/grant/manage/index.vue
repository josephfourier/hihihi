<template>
  <div class="zjy-tabs">
    <el-tabs type="border-card" v-model="current" @tab-click="tabClick">
      <template v-if="hasPermission('swms:notice-tea:read')">
        <el-tab-pane label="助学金名单" name="list">
          <list class="zjy-tab__item" v-if="active.list"></list>
        </el-tab-pane>
        <el-tab-pane label="助学金文件" name="file">
          <file class="zjy-tab__item" v-if="active.file"></file>
        </el-tab-pane>
      </template>

      <el-tab-pane
        label="无权限"
        name="default"
        v-else
       >
        <span style="font-size:12px;color:#666;padding:15px;">无查看权限</span>
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
      current: '',
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
  },
   mounted() {
    if (this.hasPermission('swms:notice-tea:read')) {
      this.current = 'list'
      this.active.list = true
    }  else {
      this.current = 'default'
    }
   }
}
</script>