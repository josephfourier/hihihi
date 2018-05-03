<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="审批状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYear" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="batchRemove" clz="delete" v-if="hasPermission('swms:stayholidays:delete')">批量删除</operator-item>
      <!--<operator-item @click="_import" clz="import" v-if="hasPermission('swms:stayholidays-tea:create')">导入</operator-item>-->
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @delete="_delete"
        @selection-change="handleSelectionChange"
      >
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
      <el-dialog title="假期留校审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="data"
          v-model="value"
          @submit="handleSubmit"
        >
          <template slot-scope="props" slot="header">
            <zjy-form :data="props.formData"></zjy-form>
          </template>
        </zjy-process>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPagination from '@/components/pagination'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'

import { _refresh, export2excel, dateFormat as _dateFormat, _statusFormat } from '@/utils'

import stayholidaysAPI from './api'
import commonAPI from '@/api/common'
import properties from './properties'
export default {
  name: 'index',
  data () {
    return {
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      query: properties.query,

      visible: false,

      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      selectedRows: [],
      optionsYear: properties.optionsYear,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns,

      queryExport: properties.queryExport,
      exportData: []
    }
  },

  methods: {
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode.trim()
      this.currentPage = 1
      this.refresh()
    },

    pageChanged (pageNumber) { this.currentPage = pageNumber },

    refresh (auto) { _refresh.call(this, auto) },

    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    batchRemove () {
      if (this.selectedRows.length === 0) {
        MSG.warning(this.$t('zjy.message.delete.none'))
      } else {
        let uids = []
        this.selectedRows.forEach(x => uids.push(x.stayholidayUid))
        this.loading = true
        const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1

        this.loading = true
        stayholidaysAPI.batchRemove(uids).then(response => {
          if (response.code !== 1) {
            MSG.warning(response.message)
          } else {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.delete.success'))
            }, 200)
            this.refresh(auto)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stayholidayUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    _import (row) {

    },

    _export () {
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
        this.loading = true
        export2excel(header, filter, data, excelName, (filter, data) => {
          return data.map(v => filter.map(j => {
            if (j === 'applyDate') {
              return _dateFormat(v[j])
            } else if (j === 'dataStatus') {
              return _statusFormat(v[j])
            } else return v[j]
          }))
        }).finally(_ => {
          this.loading = false
          this.exportData = []
        })
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
        stayholidaysAPI.queryForList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },

    _delete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      this.loading = true
      stayholidaysAPI.delete(row.stayholidayUid).then(response => {
        if (response.code === 1) {
          this.refresh(auto)
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
        } else {
          this.$alert(response.message)
        }
      })
    },

    makeFormData (data, steps) {
      return {
        'applyDate': data.applyDate,
        'applyYear': data.applyYear,
        'dataStatus': data.dataStatus,
        'holidayId': data.holidayId,
        'holidayName': data.holidayName,
        'stayReason': data.stayReason,
        'stayholidayUid': data.stayholidayUid,
        'studentId': data.studentId,
        'swmsApprovalList': steps
      }
    },
    //  审批操作
    handleSubmit (data, steps) {
      stayholidaysAPI.update(this.makeFormData(data, steps)).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          this.refresh(false)
          this.visible = false
          this.$store.dispatch('removeFromTodoList', data.stayholidayUid)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,

    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    ZjyPagination,
    ZjyProcess,

    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stayholidaysAPI.queryForList(this.query).then(response => {
          if (response.code !== 1) {
            alert(response.message)
          } else {
            this.list = response.rows
            this.total = response.total
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
