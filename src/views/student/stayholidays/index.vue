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
    <!--<div class="zjy-table">-->
      <!--<div class="zjy-table-oper">-->
        <!--<div class="zjy-table-oper__item">-->
          <!--<div class="zjy-table-oper&#45;&#45;create">-->
            <!--<a href="javascript:;" @click="create">新增</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<el-table :data="list" style="width: 100%" v-loading="loading">-->
        <!--<el-table-column type="selection" width="30">-->
        <!--</el-table-column>-->
        <!--<el-table-column type="index" label="序号" :index="1" width="50">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="studentNo" label="学号" width="100">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="studentName" label="学生姓名" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="facultyName" label="院系" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="applyDate" label="申请日期" :formatter="dateFormat" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="applyYear" label="申请年份" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="holidayName" label="假期名称" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="phone" label="电话" width="120">-->
        <!--</el-table-column>-->

        <!--<el-table-column prop="dataStatus" label="状态" width="80" :formatter="statusFormate">-->
        <!--</el-table-column>-->
        <!--<el-table-column label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<a href="javascript:" @click="view(scope.row)" class="zjy-btn-view">-->
              <!--<i class="zjy-icon"></i>-->
              <!--<span>查看</span>-->
            <!--</a>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <!--<span slot="empty">{{ empty }}</span>-->
      <!--</el-table>-->
    <!--</div>-->

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <student-process
        :data="data"
        v-model="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props">
          <zjy-form :data="props.formData"></zjy-form>
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
      ]
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
            holidayType: r2.data,
            reason: '',
            type: ''
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
      console.log(data)
      console.log(steps)
      if (!this.data.type || !this.data.reason) {
        this.$alert('请填写原因')
      }
    },

    view (row) {

    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
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
        if (val === -1) return

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
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
