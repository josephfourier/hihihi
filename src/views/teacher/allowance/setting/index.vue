<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="visible=true">新增</operator-item>
      <operator-item @click="batchRemove" clz="delete">批量删除</operator-item>
    </zjy-table-operator>

    <zjy-table v-loading="loading" :data="list" :columns="columns" @edit="edit" @delete="_delete" @selection-change="handleSelectionChange"></zjy-table>

    <div class="zjy-dialog">
      <el-dialog :title="title" :visible.sync="visible" width="800px">
        <allowance-setting v-if="visible" :data="formData" :visible.sync="visible" @submit="handleSubmit">
        </allowance-setting>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import { _refresh } from '@/utils'

import api from './api'
import properties from './properties'

import AllowanceSetting from './AllowanceSetting'

export default {
  name: 'index',
  data() {
    return {
      list: [],
      loading: false,
      visible: false,

      formData: {},

      selectedRows: [],
      columns: properties.columns
    }
  },

  methods: {
    currentChange(pageNumber) {
      this.currentPage = pageNumber
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },

    refresh(auto) {
      return _refresh.call(this, auto)
    },

    batchRemove() {
      if (this.selectedRows.length === 0) {
        MSG.warning('至少选择一条记录')
        return
      }

      let ids = ''
      this.selectedRows.forEach(x => {
        ids += x.allsettingUid + '-'
      })
      this.loading = true
      api.delete(ids.replace(/^-|-$/g, '')).then(response => {
        MSG.success('删除成功')
        this.refresh()
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
      })
    },

    edit(row) {
      this.formData = row
      this.visible = true
    },

    _delete(row) {
      api.delete(row.allsettingUid).then(response => {
        if (response.code === 1) {
          this.refresh()
          MSG.success('删除成功')
        } else {
          this.$alert(response.message)
        }
      })
    },

    handleSubmit(formData) {
      if (this.type === +this.$t('zjy.operator.EDIT')) {
        api.update(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            MSG.success('修改成功')
            this.refresh().visible = false
          }
        })
      } else {
        api.create(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            MSG.success('新建成功')
            this.refresh().visible = false
          }
        })
      }
    }
  },

  computed: {
    title() {
      return !this.formData.allsettingUid ? '新增困难补助类型' : '修改难补助类型'
    },
    type() {
      return !this.formData.allsettingUid ? +this.$t('zjy.operator.CREATE') : +this.$t('zjy.operator.EDIT')
    }
  },

  components: {
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    AllowanceSetting
  },

  created() {
    this.loading = true
    api.queryForList().then(response => {
      if (response.code !== 1) {
        MSG.warning('获取设置失败')
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
    visible(val) {
      if (!val) this.formData = {}
    }
  }
}
</script>

<style scoped>

</style>
