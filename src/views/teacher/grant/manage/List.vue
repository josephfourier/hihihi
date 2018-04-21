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
      <zjy-table :data="list" :loading="loading" :columns="columns">
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

import { _refresh } from '@/utils'

import api from './api'
import properties from './properties'
export default {
  data() {
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
    }
  },

  methods: {
    clearSearch () {
      this.query.applyYear = ''
      this.query.studentCode = ''
    },
    searchFilter() {
      this.currentPage = 1
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.refresh()
    },
    pageChanged(pageNumber) {
      this.currentPage = pageNumber
    },
    handleFocus() {
      if (this.facultyList.length === 0) {
        api.queryFacultyList().then(response => {
          if (response.code !== 1) {
            MSG.warning('获取院系失败')
          } else {
            this.facultyList = response.data.map(i => {
              return {
                label: i.facultyName,
                value: i.facultyCode
              }
            })
          }
        })
      }
    },

    _export () {

    },
    refresh(auto) {
      return _refresh.call(this, auto)
    },
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
      handler(val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryList(this.query).then(response => {
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
<style lang='scss' scoped>
</style>