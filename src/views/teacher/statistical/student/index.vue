<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
     <search-date label="入学年份" :value.sync="enterYear"></search-date>
      <search-select label="专业" :options="specialtyList" :value.sync="specialtyCode" :loading="isLoading" @focus="handleFocus"></search-select>
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
import SearchDate from '@/components/table-search/search-date'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import ZjyPagination from '@/components/pagination'

import { _refresh, export2excel } from '@/utils'

import properties from './properties'
import api from './api'
export default {
  data () {
    return {
      query: properties.query,
      studentCode: '',
      specialtyCode: '',
      enterYear: new Date().getFullYear().toString(),
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      columns: properties.columns,
      visible: false,

      selectedRows: [],
      specialtyList: [],
      queryExport: properties.queryExport,
      exportData: []
    }
  },

  computed: {
    isLoading () {
      return this.specialtyList.length === 0
    }
  },

  methods: {
    handleFocus () {
      if (this.specialtyList.length === 0) {
        api.querySpecialtyList().then(response => {
          if (response.code !== 1) {
            MSG.warning('获取专业失败')
          } else {
            this.specialtyList = response.data.map(i => {
              return {
                label: i.specialtyName,
                value: i.specialtyCode
              }
            })
          }
        })
      }
    },

    searchFilter () {
      this.currentPage = 1
      this.query.specialtyCode = this.specialtyCode
      this.query.enterYear = this.enterYear
      this.query.studentCode = this.studentCode.trim()
      this.refresh()
    },

    // 多选导出
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
        this.queryExport.specialtyCode = this.specialtyCode
        this.queryExport.enterYear = this.enterYear
        this.queryExport.studentCode = this.studentCode.trim()
        api.queryForList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.data.rows)
          }
        })
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh () {
      return _refresh.call(this)
    },
    handleRefresh () {
      this.refresh()
    }
  },
  destroyed () {
    this.query.specialtyCode = ''
    this.query.enterYear = new Date().getFullYear().toString()
    this.query.studentCode = ''
    this.query.offset = 0
  },
  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    SearchDate,

    ZjyTable,
    ZjyTableOperator,
    OperatorItem,
    ZjyPagination
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          if (response.code === 1) {
            this.list = response.data.rows
            this.total = response.data.total
          } else {
            this.$alert(response.message)
          }
        }).catch(error => {
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>

</style>
