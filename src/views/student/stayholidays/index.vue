<!-- 学生假期留校管理 -->
<template>
  <div class="zjy-app">

    <zjy-table-operator>
      <operator-item @click="create" clz="create">新增</operator-item>
    </zjy-table-operator>

      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
      >
      </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <student-process
        v-if="visible"
        :data="data"
        v-model="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props">
          <zjy-form :data="props.formData" :reason.sync="reason" :type.sync="type" :hasError="hasError"></zjy-form>
        </template>
      </student-process>
    </el-dialog>

  </div>
</template>

<script>
import stayholidaysAPI from '@/api/student/stayholidays'
import {dateFormat as _dateFormat, getPermissionId, _refresh} from '@/utils'

import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyTable from '@/components/table'
import ZjyPagination from '@/components/pagination'
import StudentProcess from '@/components/process/StudentProcess'
import ZjyForm from './form'

import commonAPI from '@/api/common'
import axios from 'axios'

export default {
  data () {
    return {
      value: {}, // 流程数据
      data: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: {
        offset: 0,
        limit: 10
      },

      title: '',
      loading: false,
      visible: false,

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
            }
          ]
        }
      ],
      reason: '',
      type: '',
      hasError: false
    }
  },

  methods: {
    create () {
      // 获取流程、假期类型、学生信息数据(并发)
      axios.all([
        commonAPI.queryInitial(getPermissionId(this.$route)),
        commonAPI.queryHolidayTypeList(),
        commonAPI.queryStudent()
      ]).then(axios.spread((r1, r2, r3) => {
        if (r1.code !== 1 || r2.code !== 1 || r3.code !== 1) {
          this.$alert('获取数据失败')
        } else {
          this.value = r1.data   // 流程数据传入组件即可
          Object.assign(this.data, {
            student: r3.data,
            holidayType: r2.data
          })
          this.title = '留校申请'
          this.visible = true
        }
      }))
    },

    dateFormat (cellValue) {
      return _dateFormat(cellValue)
    },

    statusFormate (cellValue) {
      return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
    },

    handleSubmit (data, steps) {
      if (!this.type || !this.reason) {
        this.hasError = true
      } else {
        const arg = this.makeFormData(data, steps)
        stayholidaysAPI.create(arg).then(response => {
          console.log(response)
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            this.visible = false
            this.refresh()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    view (row) {

    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    makeFormData (data, steps) {
      return {
        'studentId': data.student.studentId,
        'holidayId': this.type,
        'holidayName': this.data.holidayType.find(i => i.valueKey == this.type).valueName,
        'stayReason': this.reason,
        'schoolCode': data.student.schoolCode,
        'swmsApprovalList': steps
      }
    },

    refresh () {
      _refresh.call(this)
    }
  },

  components: {
    ZjyPagination,
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    StudentProcess,
    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -9527 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stayholidaysAPI.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      }
    },
    visible (val) {
      if (!val) {
        this.type = ''
        this.reason = ''
        this.hasError = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
