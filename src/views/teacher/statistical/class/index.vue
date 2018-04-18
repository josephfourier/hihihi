<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="年级" :options="years" :value.sync="year"></search-select>
      <search-select 
        label="院系" 
        :options="facultyList" 
        :value.sync="facultyCode"
        :loading="isLoading"
        @focus="handleFocus"
      ></search-select>
      <search-select label="专业" :options="specialtyList" :value.sync="specialtyCode"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @selection-change="handleSelectionChange"
      >
      </zjy-table>
    </div>

    <div class="zjy-pagination">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
      >
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

import { _refresh, export2excel} from '@/utils'

import properties from './properties'
import api from './api'
export default {
  data () {
    return {
      query: properties.query,
      studentCode: '',
      specialtyCode: '',
      facultyCode: '',
      year: '',
      //  --------------- 搜索 END ---------------
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      //  初始化select
      years: properties.optionsYears,
      //  --------------- 初始化select END ---------------
      columns: properties.columns,
      // dialog
      visible: false,

      selectedRows: [], // 多选行
      facultyList: [],
      specialtyList: []
    }
  },

  computed: {
    isLoading() {
      return this.facultyList.length === 0
    }
  },

  methods: {
    handleFocus() {
      if (this.facultyList.length === 0) {
        api.queryFacultyList().then(response => {
      if (response.code !== 1) {
        this.$alert('获取院系失败')
      } else {
        this.facultyList  = response.data.map(i => {
          return {
            label: i.facultyName,
            value: i.facultyCode
          }
        })
      }
    })
      }
    },
    searchFilter () {
      this.currentPage = 1
      this.query.specialtyCode = this.specialtyCode
      this.query.facultyCode = this.facultyCode
      this.query.year = this.year
      this.query.studentCode = this.studentCode
      this.refresh()
    },

    // 多选导出
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    _export () {

    },
    edit (row) {
    },
    view (row) {
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    // --------------- 搜索 END ---------------

    refresh () {
      return _refresh.call(this)
    },
    handleRefresh () {
      this.refresh()
    }
  },

  mounted () {
   
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
      api.querySpecialtyByFaculty(val).then(response => {
        if (response.code !== 1) {
          this.$alert('获取专业失败')
        } else {
          this.specialtyList  = response.data.map(i => {
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
<style lang='scss' scoped>
</style>
