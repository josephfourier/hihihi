<!-- 假期留校管理 -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="保单状态" :options="optionsStauts" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYear" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="batchRemove" clz="delete">批量删除</operator-item>
      <operator-item @click="_import" clz="_import">导入</operator-item>
      <operator-item @click="_export" clz="_export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @delete="_delete">
      </zjy-table>
    </div>

    <div class="zjy-pagination">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
        :pageSize="2"
      >
      </zjy-pagination>
    </div>
    <div class="zjy-dialog">
      <el-dialog title="假期留校审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="data"
          v-model="value"
          @close="visible = false"
          @submit="handleSubmit"
        >
          <template slot-scope="props">
            <!--<zjy-form :data="props.formData"></zjy-form>-->
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

import {dateFormat as _dateFormat, _refresh} from '@/utils'

import stayholidaysAPI from '@/api/teacher/stayholidays'
import commonAPI from '@/api/common'

export default {
  name: 'index',
  data () {
    return {
      //  搜索
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      query: {
        offset: 0,
        limit: 2,
        dataStatus: '',
        applyYear: '',
        studentCode: ''
      },
      //  --------------- 搜索 END ---------------

      // dialog
      visible: false,
      // --------------- dialog END ---------------

      // 分页
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      // --------------- 分页 END ---------------

      //  初始化select
      optionsYear: [
        {
          label: '2017年',
          value: 2017
        },
        {
          label: '2018年',
          value: 2018
        }
      ],

      optionsStauts: [
        {
          label: '待审批',
          value: 0
        }, {
          label: '已通过',
          value: 1
        }, {
          label: '已拒绝',
          value: 2

        }, {
          label: '审批中',
          value: 3
        }
      ],
      //  --------------- 初始化select END ---------------

      //  表格数据
      columns: [
        {
          index: true,
          indexWidth: 50
        }, {
          label: '学号',
          prop: 'studentNo',
          width: 100
        }, {
          label: '学生姓名',
          prop: 'studentName'
        }, {
          label: '院系',
          prop: 'facultyName'
        }, {
          label: '申请日期',
          prop: 'applyDate',
          formatter: this.dateFormat
        }, {
          label: '申请年份',
          prop: 'applyYear'
        }, {
          label: '假期名称',
          prop: 'holidayName'
        }, {
          label: '电话',
          prop: 'phone'

        }, {
          label: '状态',
          prop: 'dataStatus',
          formatter: this.statusFormat
        }, {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '查看',
              render: true,
              cmd: 'view'
            },
            {
              label: '删除',
              render: true,
              cmd: 'delete'
            }
          ]
        }
      ]
      //  --------------- 表格数据 END ---------------
    }
  },
  methods: {
    // 搜索
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },

    pageChanged (pageNumber) { this.currentPage = pageNumber },

    // --------------- 搜索 END ---------------

    refresh () { _refresh.call(this) },

    // --------------- table操作 ---------------
    batchRemove () {

    },

    view (row) {
      console.log(row)
      commonAPI.queryApprovalProcess(row.studentId, row.stayholidayUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    _import (row) {

    },
    _export (row) {

    },

    _delete (row) {
      stayholidaysAPI.delete(row.stayholidayUid).then(response => {
        if (response.code === 1) {
          this.$alert('删除成功')
          this.refresh()
        }
      })
    },

    // --------------- table操作 END ---------------

    dateFormat (cellValue) { return _dateFormat(cellValue) },
    statusFormat (cellValue) { return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue] },

    //  审批操作
    handleSubmit () {

    }

  //  --------------- 审批操作 END ---------------
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
    ZjyProcess
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1) return

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
