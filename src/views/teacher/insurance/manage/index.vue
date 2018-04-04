<!--  -->
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
      <operator-item @click="visible2 = true" clz="create">批量投保</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="handleView">
      </zjy-table>
    </div>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
        :pageSize="2"
      >
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="保单审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="setting"
          v-model="value"
          @close="visible = false"
          @submit="handleSubmit"
        >
          <template slot-scope="props">
            <zjy-form :data="props.formData"></zjy-form>
          </template>
        </zjy-process>
      </el-dialog>

      <el-dialog title="批量投保" :visible.sync="visible2" width="800px">
        <batch-insurance
          v-if="visible2"
          @closed="visible2 = false"
        >
        </batch-insurance>
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

import insuranceManageAPI from '@/api/teacher/insurance/manage'
import commonAPI from '@/api/common'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import BatchInsurance from './BatchInsurance'
import {dateFormat as _dateFormat, _refresh} from '@/utils'

export default {
  data () {
    return {
      list: [],
      query: {
        offset: 0,
        limit: 2,
        dataStatus: '',
        applyYear: '',
        studentCode: ''
      },
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      loading: false,
      currentPage: 1,
      total: 0,

      visible: false,
      visible2: false,

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
        }, {
          label: '待确认',
          value: 4
        }, {
          label: '待付款',
          value: 5
        }
      ],
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
          label: '险种名称',
          prop: 'insuranceName'
        }, {
          label: '保险费用',
          prop: 'insuranceCost'
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
              cmd: 'view',
              formatter: this.operFormat
            }
          ]
        }
      ]
    }
  },

  methods: {
    // 对操作也进行格式化处理（审批与查看）
    operFormat (row, cellValue) {
      return '查看'
    },

    dateFormat (cellValue) {
      return _dateFormat(cellValue)
    },

    statusFormat (cellValue) {
      return ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款'][+cellValue]
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },

    handleView (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.insuranceUid).then(response => {
        this.setting = row
        this.value = response.data
        this.visible = true
        console.log(this.setting)
        console.log(response)
      })
    },

    refresh () {
      _refresh.call(this)
    },

    handleSubmit (data, steps) {
      insuranceManageAPI.submit(data.insuranceUid, data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          this.$alert('保存成功')
          this.visible = false
          this.refresh()
        } else {
          this.$alert('保存失败')
        }
      }).catch(error => {
      })
    }
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    ZjyTable,
    ZjyPagination,
    ZjyProcess,
    ZjyTableOperator,
    OperatorItem,
    BatchInsurance,
    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        insuranceManageAPI.queryForList(this.query).then(response => {
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

<style lang='scss' scoped>
</style>
