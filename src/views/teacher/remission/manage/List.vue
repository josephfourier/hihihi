<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="申请年份" :options="yearList" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>
    <zjy-table-operator>
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table :data="list" :loading="loading" :columns="columns" @selection-change="handleSelectionChange">
      </zjy-table>
    </div>

     <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="pageChanged">
      </zjy-pagination>
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

import { _refresh, export2excel } from '@/utils'

import api from './api'
import properties from './properties'
export default {
  data () {
    return {
      applyYear: '',
      studentCode: '',
      query: properties.query,
      currentPage: 1,
      total: 0,
      loading: false,
      yearList: properties.yearList,

      list: [],
      columns: properties.columns,

      selectedRows: [],
      queryExport: properties.queryExport,
      exportData: []
    }
  },

  methods: {
    clearSearch () {
      this.query.applyYear = ''
      this.query.studentCode = ''
    },
    searchFilter () {
      this.currentPage = 1
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode.trim()
      this.refresh()
    },
    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    handleSelectionChange (rows) { this.selectedRows = rows },
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
        export2excel(header, filter, data, excelName).finally(_ => {
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
        this.queryExport.applyYear = this.applyYear
        this.queryExport.studentCode = this.studentCode.trim()
        api.queryList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },
    refresh (auto) {
      return _refresh.call(this, auto)
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
    ZjyPagination
  },
  created () {
    // 重新渲染时先清除搜索条件
    this.clearSearch()
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryList(this.query).then(response => {
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
