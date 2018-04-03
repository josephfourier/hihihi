<!-- 教师端学生证管理 -->
<template>
  <div class="zjy-app">

    <zjy-table-search>
      <search-select label="入学年份" :options="years" :value.sync="enterYear"></search-select>
      <search-select label="申请状态" :options="status" :value.sync="dataStatus"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="batchRemove">批量删除</operator-item>
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

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="学生证补办审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="data"
          v-model="value"
          @close="visible = false"
          @submit="handleSubmit"
        >
          <template slot-scope="props">
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
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyTable from '@/components/table'

import cardAPI from '@/api/teacher/stuidcard'
import commonAPI from '@/api/common'
import ZjyPagination from '@/components/pagination'

import { _refresh } from '@/utils'
import ZjyProcess from '@/components/process'
import ZjyForm from './form'

export default {
  data () {
    return {
      list: [],
      total: '',
      currentPage: 1,
      visible: false,
      value: '',
      data: '',
      query: {
        offset: 0,
        limit: 10,
        dataStatus: '', // 0:待审批, 1:已通过, 2:已拒绝, 3:审批中
        enterYear: '',
        studentCode: ''
      },
      enterYear: '',
      dataStatus: '',
      studentCode: '',

      loading: false,
      selectedRows: [],

      years: [
        {
          label: 2017,
          value: 2017
        },
        {
          label: 2018,
          value: 2018
        }
      ],

      status: [
        {
          label: '待审批',
          value: 0
        },

        {
          label: '已通过',
          value: 1
        },
        {
          label: '已拒绝',
          value: 2
        },
        {
          label: '审批中',
          value: 3
        }
      ],
      columns: [
        {
          index: true,
          select: true
        }, {
          label: '学号',
          prop: 'studentNo'
        }, {
          label: '姓名',
          prop: 'studentName'
        }, {
          label: '院系',
          prop: 'facultyName'
        }, {
          label: '入学年份',
          prop: 'enterYear'
        }, {
          label: '申请次数',
          prop: 'appNum'
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
    }
  },

  methods: {
    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stuidcardUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    searchFilter () {
      this.currentPage = 1
      this.query.dataStatus = this.dataStatus
      this.query.enterYear = this.enterYear
      this.query.studentCode = this.studentCode
      this.refresh()
    },

    handleSubmit (data, steps) {
      cardAPI.approved(this.data, steps).then(response => {
        if (response.code === 1) {
          this.$alert('保存成功')
          this.refresh()
          this.visible = false
        } else {
          this.$alert('保存失败')
        }
      }).catch(error => {})
    },

    batchRemove () {
      if (this.selectedRows.length === 0) return

      let ids = ''
      this.selectedRows.forEach(x => {
        ids += '-' + x.studentId + '-'
      })
      this.loading = true
      cardAPI.batchRemove(ids.replace(/^-|-$/g, '')).then(response => {
        this.loading = false
        this.refresh()
      }).catch(error => {
        console.log(error)
      })
    },

    _delete (row) {
      this.loading = true
      cardAPI.batchRemove(row.studentId).then(response => {
        this.loading = false
        this.refresh()
      }).catch(error => {
        console.log(error)
      })
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    statusFormat (cellValue) {
      return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
    },

    refresh () {
      _refresh.call(this)
    }
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    ZjyPagination,
    SearchSelect,
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    ZjyProcess,

    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1) return

        this.query.offset = this.query.limit * (val - 1)
        cardAPI.queryForList(this.query).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            this.list = response.rows
            this.total = response.total
            this.loading = false
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
