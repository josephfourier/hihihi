<!-- 假期留校管理 -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="申请状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYears" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="create" clz="create">新增</operator-item>
      <operator-item @click="batchRemove" clz="delete">批量删除</operator-item>
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @delete="_delete"
        @selection-change="handleSelectionChange">
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

    <div class="zjy-dialog">
      <el-dialog title="个人荣誉称号审批" :visible.sync="visible" width="800px">
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

      <el-dialog title="个人荣誉称号" :visible.sync="visible2" width="800px">
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

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPagination from '@/components/pagination'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import properties from './proerties'
import {_refresh} from '@/utils'

import stuAPI from '@/api/teacher/honorary/stu'
import api from './api'
import commonAPI from '@/api/common'
import Honorary from './Honorary'

export default {
  name: 'index',
  data () {
    return {
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      query: properties.query,

      visible: false,
      visible2: false,

      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      selectedRows: [],

      optionsYears: properties.optionsYears,

      optionsStatus: properties.optionsStatus,

      columns: properties.columns
    }
  },

  methods: {
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },

    pageChanged (pageNumber) { this.currentPage = pageNumber },

    refresh (auto) { return _refresh.call(this, auto) },

    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    batchRemove () {

      let stuhonoraryUids = []
      this.selectedRows.forEach(x => stuhonoraryUid.push(x.stuhonoraryUid))

      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.list.length !== 1

      api.batchRemove(stuhonoraryUids).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success('删除成功')
          this.refresh(auto)
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },

    create () {
      this.visible2 = true
    },
    handleCreate (id, arg) {
      api.create(id, arg).then(response => {
        if (response.code === 1) {
          MSG.success('新增成功')
          this.refresh().visible2 = false
        } else {
          this.$alert(response.message)
        }
      })
    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stuhonoraryUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    _export (row) {

    },

    _delete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      stuAPI.delete(row.stuhonoraryUid).then(response => {
        if (response.code === 1) {
          MSG.success('删除成功')
          this.refresh(auto)
        } else {
          this.$alert(response.message)
        }
      })
    },

    makeFormData (data, steps) {
      return {
        'stuhonoraryUid': data.stuhonoraryUid,
        'swmsApprovalList': steps
      }
    },

    handleSubmit (data, steps) {
      stuAPI.submit(this.makeFormData(data, steps)).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          this.refresh().visible = false
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

    ZjyForm,
    Honorary
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stuAPI.queryForList(this.query).then(response => {
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
