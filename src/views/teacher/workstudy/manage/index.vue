<template>
<div class="zjy-app">
  <zjy-table-search>
    <search-date label="申请年份" :value.sync="applyYear"></search-date>
    <search-select label="审批状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
    <search-input label="学号" :value.sync="studentCode"></search-input>
    <search-button @query="searchFilter"></search-button>
  </zjy-table-search>

  <div class="zjy-line"></div>

  <zjy-table-operator>
    <operator-item @click="create" clz="create" v-if="hasPermission('swms:workstudy-tea:create')">新增</operator-item>
    <!-- <operator-item @click="batchRemove" clz="delete" v-if="hasPermission('swms:workstudy:delete')">批量删除</operator-item> -->
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
    <el-dialog title="岗位申请审批" :visible.sync="visible" width="800px">
      <zjy-process
        v-if="visible"
        :data="setting"
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

    <el-dialog title="新增岗位申请" :visible.sync="visible2" width="800px">
      <work-study
        v-if="visible2"
        :visible.sync="visible2"
        @submit="handleCreate"
      >
      </work-study>
    </el-dialog>
  </div>

</div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import SearchDate from '@/components/table-search/search-date'

import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import commonAPI from '@/api/common'
import api from './api'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import WorkStudy from './WorkStudy'

import { _refresh, export2excel, dateFormat as _dateFormat, _statusFormat } from '@/utils'
import properties from './properties'
export default {
  name: 'index',
  data () {
    return {
      list: [],
      setting: '',
      query: properties.query,
      currentPage: 1,
      total: 0,
      dataStatus: '',
      applyYear: new Date().getFullYear().toString(),
      studentCode: '',
      selectedRows: [],
      loading: false,
      visible: false,
      visible2: false,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns,

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
      this.query.studentCode = this.studentCode.trim()
      this.currentPage = 1
      this.refresh()
    },

    create () {
      this.visible2 = true
    },
    // 教师新增学生岗位申请
    handleCreate (arg) {
      api.create(arg).then(response => {
        if (response.code !== 1) {
          MSG.warning(response.message)
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
      let workstudyUids = []
      this.selectedRows.forEach(x => workstudyUids.push(x.workstudyUid))

      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1

      api.batchRemove(workstudyUids).then(response => {
        if (response.code !== 1) {
          MSG.warning(response.message)
          this.loading = false
        } else {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)

          this.refresh(auto)
        }
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
      })
    },

    handleSelectionChange (rows) {
      this.selectedRows = rows
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
            } else if (j === 'dataStatus') {
              return _statusFormat(v[j])
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
        this.queryExport.studentCode = this.studentCode.trim()
        api.queryForList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },

    handleView (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.workstudyUid).then(response => {
        this.setting = row
        this.value = response.data
        this.visible = true
      })
    },
    handleDelete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      this.loading = true
      api.delete(row.workstudyUid).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)

          this.refresh(auto)
        } else {
          MSG.warning(response.message)
          this.loading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    handleSubmit (data, steps) {
      api.submit(data, steps).then(response => {
        if (response.code === 1) {
          this.refresh().visible = false
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.approve.success'))
          }, 200)
          this.$store.dispatch('setSchedules')
          // this.$store.dispatch('removeFromTodoList', data.workstudyUid)
        } else {
          MSG.warning(response.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },

  destroyed () {
    this.query.applyYear = new Date().getFullYear().toString()
    this.query.dataStatus = ''
    this.query.studentCode = ''
    this.query.offset = 0
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    SearchDate,

    ZjyTableOperator,
    OperatorItem,

    ZjyTable,
    ZjyPagination,

    ZjyProcess,
    ZjyForm,

    WorkStudy
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          if (response.code !== 1) {
             MSG.warning(response.message)
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
