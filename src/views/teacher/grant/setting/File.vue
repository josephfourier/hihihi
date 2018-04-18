<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item @click="create" clz="create">新增</operator-item>
    </zjy-table-operator>
   
    <div class="zjy-table">
      <zjy-table 
        :data="list" 
        :loading="loading" 
        :columns="columns" 
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete" 
      >
      </zjy-table>
    </div>

    <div class="zjy-dialog zjy-preview">
      <el-dialog title="助学金文件查看" :visible.sync="visible" width="800px">
        <zjy-preview 
          src="http://enroll-zz.zhijiaoyun.net/export/template/enrollStudent"
        >
          <div class="zjy-footer" >
            <zjy-button type="primary" @click="handleClick">关闭</zjy-button>
          </div>
        </zjy-preview>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPreview from '@/components/preview'
import ZjyButton from '@/components/button'
import api from './api'

import { _refresh } from '@/utils'
import properties from './properties'

export default {
  name: 'honoraries-manage',
  data() {
    return {
      list: [],

      loading: false,
      visible: false,
      columns: properties.columnsFile
    }
  },
  methods: {
    refresh(auto) {
      return _refresh.call(this, auto)
    },

    create() {
      this.visible = true
    },

    handleCreate(uid, id, arg) {
      api.create(uid, id, arg).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success('新增成功')
          this.refresh().visible2 = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleClick () {
      this.visible = false
    },
    
    handleEdit (row) {

    },

    handleView(row) {
      this.visible = true
    },

    handleDelete(row) {
      // const auto = this.list.length === 1 && this.currentPage !== 1
      // facAPI.delete(row.fachonoraryUid).then(response => {
      //   if (response.code === 1) {
      //     MSG.success('删除成功')
      //     this.refresh(auto)
      //   } else {
      //     this.$alert(response.message)
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
    },

  },

  components: {
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    ZjyPreview,
    ZjyButton
  },

  created() {
    this.loading = true
    api.queryFileList(1).then(response => {
      if (response.code !== 1) {
        alert(response.message)
      } else {
        this.list = response.data
      }
    }).catch(error => {
      console.log(error)
    }).finally(_ => {
      this.loading = false
    })
  },

  watch: {
  }
}
</script>

<style>
.AppHeaderPanel {
  display: none;
}
.WACFrameWord.cui-exth {
  margin-top: -88px;
}
.cui-toolbar-buttondock.alignright {
  display: none;
}
</style>
