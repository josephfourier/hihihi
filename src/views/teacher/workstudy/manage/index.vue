<template>
<div class="zjy-app">
  <zjy-table-search>
    <search-select label="审批状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
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
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import commonAPI from '@/api/common'
import api from './api'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import WorkStudy from './WorkStudy'

import { _refresh } from '@/utils'
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
      applyYear: '',
      studentCode: '',
      selectedRows: [],
      loading: false,
      visible: false,
      visible2: false,
      optionsYears: properties.optionsYear,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns
    }
  },
  methods: {
    refresh (auto) {
      return _refresh.call(this, auto)
    },
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },
    // ---------------- 搜索 ----------------

    create () {
      this.visible2 = true
    },
    // 教师新增学生岗位申请
    handleCreate (arg) {
      api.create(arg).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success('新增成功')
          this.refresh().visible2 = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    batchRemove () {
      let workstudyUids = []
      this.selectedRows.forEach(x => workstudyUids.push(x.workstudyUid))

      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1

      api.batchRemove(workstudyUids).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success('删除成功')
          this.refresh(auto)
        }
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
      })
    },

    _export () {},
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },
    //  ---------------- 表格头操作 ----------------

    handleView (row) {
      // 缺少
      commonAPI.queryApprovalProcess(row.studentId, row.workstudyUid).then(response => {
        this.setting = row
        this.value = response.data
        this.visible = true
      })
    },
    handleDelete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      api.delete(row.workstudyUid).then(response => {
        if (response.code === 1) {
          MSG.success('删除成功')
          this.refresh(auto)
        } else {
          this.$alert(response.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //  ---------------- 表格行操作 ----------------

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    handleSubmit (data, steps) {
      api.submit(data, steps).then(response => {
        if (response.code === 1) {
          this.refresh().visible = false
          setTimeout(() => {
            MSG.success('保存成功')
          }, 200)
          this.$store.dispatch('setSchedules')
        } else {
          MSG.success('保存失败')
        }
      }).catch(error => {
        console.log(error)
      })
    }
    //   ---------------- 审批操作 ----------------
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
