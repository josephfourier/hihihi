<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="申请状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYears" :value.sync="applyYear"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="create" clz="create" v-if="hasPermission('swms:fachonorary-tea-manage:create')">新增</operator-item>
      <!-- <operator-item @click="batchRemove" clz="delete" v-if="hasPermission('swms:fachonorary-tea:delete')">批量删除</operator-item> -->
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="handleView"
        @delete="handleDelete"
        @selection-change="handleSelectionChange">
      </zjy-table>
    </div>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
      >
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="院系荣誉称号审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="data"
          v-model="value"
          @close="visible = false"
          @submit="handleSubmit"
        >
          <p slot="warning" class="warning">教师添加无审批流程</p>
          <template slot-scope="props" slot="header">
            <zjy-form :data="props.formData"></zjy-form>
          </template>
        </zjy-process>
      </el-dialog>

      <el-dialog title="新增院系荣誉称号" :visible.sync="visible2" width="800px">
        <honorary
          v-if="visible2"
          :visible.sync="visible2"
          @submit="handleCreate"
        >
        </honorary>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import facAPI from '@/api/teacher/honorary/fac'
import commonAPI from '@/api/common'
import api from './api'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import Honorary from './Honorary'

import { _refresh, export2excel, dateFormat as _dateFormat } from '@/utils'
import properties from './properties'

export default {
  name: 'honoraries-manage',
  data () {
    return {
      list: [],
      data: '',
      query: properties.query,
      currentPage: 1,
      dataStatus: '',
      applyYear: '',
      selectedRows: [],
      loading: false,
      visible: false,
      visible2: false,
      optionsYears: properties.optionsYears,
      optionsStatus: properties.optionsStatus,
      columns: properties.columnsMANAGE,

      queryExport: properties.queryExport,
      exportData: []
    }
  },
  methods: {
    refresh (auto) {
      return _refresh.call(this, auto)
    },
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.currentPage = 1
      this.refresh()
    },

    create () {
      this.visible2 = true
    },

    handleCreate (uid, id, arg) {
      api.create(uid, id, arg).then(response => {
        if (response.code !== 1) {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.create.error'))
        } else {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.create.success'))
          }, 200)
          this.refresh().visible2 = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    batchRemove () {
      if (this.selectedRows.length === 0) {
        MSG.warning(this.$t('zjy.message.delete.none'))
        return
      }

      let fachonoraryUids = []

      this.selectedRows.forEach(x => fachonoraryUids.push(x.fachonoraryUid))
      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1

      facAPI.batchRemove(fachonoraryUids).then(response => {
        if (response.code !== 1) {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.delete.error'))
          this.loading = false
        } else {
          MSG.success(this.$t('zjy.message.delete.success'))
          this.refresh(auto)
        }
      }).catch(error => {
      }).finally(_ => {
      })
    },

    _export () {
      this.loading = true
      this.getExportData().then(response => {
        this.exportData = response

        const header = properties.header
        const filter = properties.filter
        const excelName = properties.excelName
        const data = this.exportData
        if (data.length === 0) {
          MSG.warning(this.$t('zjy.message.export.none'))
          return
        }
        export2excel(header, filter, data, excelName, (filter, data) => {
          return data.map(v => filter.map(j => {
            if (j === 'applyDate') {
              return _dateFormat(v[j])
            } else return v[j]
          }))
        }).finally(_ => {
          this.exportData = []
        })
      }).finally(_ => {
        this.loading = false
      })
    },
    getExportData () {
      return new Promise((resolve, reject) => {
        if (this.selectedRows.length > 0) {
          resolve(this.selectedRows)
        } else {
          if (this.exportData.length === 0) {
            this.exportSearch().then(response => {
              resolve(response)
            })
          }
        }
      })
    },

    exportSearch () {
      return new Promise((resolve, reject) => {
        this.queryExport.dataStatus = this.dataStatus
        this.queryExport.applyYear = this.applyYear
        facAPI.queryAppliedList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    handleView (row) {
      commonAPI.queryNextApproval(row.facultyId, row.fachonoraryUid, 1).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    handleDelete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      this.loading = true
      facAPI.delete(row.fachonoraryUid).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.refresh(auto)
        } else {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.delete.error'))
          this.loading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    makeFormData (data, steps) {
      return {
        'fachonoraryUid': data.fachonoraryUid,
        'swmsApprovalList': steps
      }
    },

    handleSubmit (data, steps) {
      facAPI.submit(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => { MSG.success('保存成功') }, 200)
          this.refresh().visible = false
          // 审批完成后可能需要刷新自己申请的班级荣誉称号列表
          // bus.$emit('applied')
        } else {
          MSG.success('保存失败')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },

  destroyed () {
    this.query.applyYear = ''
    this.query.dataStatus = ''
    this.query.offset = 0
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,

    ZjyTableOperator,
    OperatorItem,

    ZjyTable,
    ZjyPagination,

    ZjyProcess,
    ZjyForm,
    Honorary
    //
    // Scholarship
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        facAPI.queryAppliedList(this.query).then(response => {
          if (response.code !== 1) {
            alert(response.message)
          } else {
            this.list = response.rows
            this.total = response.total
          }
        }).catch(error => {
          console.log(error)
        }).finally(_ => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
