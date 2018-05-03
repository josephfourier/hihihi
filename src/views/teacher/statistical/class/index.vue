<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="年级" :options="years" :value.sync="year"></search-select>
      <search-select label="院系" :options="myFacultyList" :value.sync="facultyCode" :loading="isLoading" @focus="handleFocus"></search-select>
      <search-select label="专业" :options="mySpecialtyList" :value.sync="specialtyCode" @focus="handleInit"></search-select>
      <!--<search-input label="学号" :value.sync="studentCode"></search-input>-->
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

    <div class="zjy-pagination">
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

import { _refresh, export2excel, dateFormat as _dateFormat } from '@/utils'

import properties from './properties'
import api from './api'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      query: properties.query,
      specialtyCode: '',
      facultyCode: '',
      year: '',
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      years: properties.optionsYears,
      columns: properties.columns,
      visible: false,

      mySpecialtyList: [],

      queryExport: properties.queryExport,
      selectedRows: [],
      exportData: []
    }
  },

  computed: {
    ...mapGetters(['facultyList', 'specialtyList']),
    myFacultyList () {
      return this.facultyList.map(i => {
        return {
          label: i.facultyName,
          value: i.facultyCode
        }
      })
    },
    isLoading () {
      return this.myFacultyList.length === 0
    }
  },

  methods: {
    handleFocus () {
      if (this.myFacultyList.length === 0) {
        this.$store.dispatch('setFacultyList')
      }
    },
    handleInit () {
      if (!this.facultyCode) {
        this.$store.dispatch('setSpecialtyList').then(_ => {
          this.mySpecialtyList = this.specialtyList.map(i => {
            return {
              label: i.specialtyName,
              value: i.specialtyCode
            }
          })
        })
      }
    },
    searchFilter () {
      this.currentPage = 1
      this.query.specialtyCode = this.specialtyCode
      this.query.facultyCode = this.facultyCode
      this.query.year = this.year
      this.refresh()
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
            if (j === 'stufileDate') {
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
        this.queryExport.specialtyCode = this.specialtyCode
        this.queryExport.facultyCode = this.facultyCode
        this.queryExport.year = this.year
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
    this.query.year = ''
    this.query.studentCode = ''
    this.query.facultyCode = ''
    this.query.offset = 0
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
    },

    facultyCode (val) {
      if (!val) return

      api.querySpecialtyByFaculty(val).then(response => {
        if (response.code !== 1) {
          MSG.warning('获取专业失败')
        } else {
          this.mySpecialtyList = response.data.map(i => {
            return {
              label: i.specialtyName,
              value: i.specialtyCode
            }
          })
        }
      })
    }

  }
}

</script>
