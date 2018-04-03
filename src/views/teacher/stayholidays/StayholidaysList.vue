<!-- 教师端假期留校 -->
<template>
  <div class="zjy-table">
    <div class="zjy-table-search">
      <div class="zjy-table-search__item">
        <span>审核状态</span>
        <el-select v-model="query.dataStatus" placeholder="请选择">
          <el-option
            v-for="item in optionsStauts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="zjy-table-search__item">
        <span>申请年份</span>
        <el-select v-model="query.applyYear" placeholder="请选择">
          <el-option
            v-for="item in optionsYear"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="zjy-table-search__item">
        <span>学号</span>
        <zjy-input v-model="query.studentCode"></zjy-input>
      </div>
      <a href="javascript:;" class="zjy-table-search__button" @click="search"></a>
    </div>
    <div class="zjy-line"></div>
    <div class="zjy-table-oper">
      <div class="zjy-table-oper__item">
        <div class="zjy-table-oper--">
          <a href="javascript:;" @click="batch">批量删除</a>
        </div>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column type="index" label="序号" :index="1" width="50">
      </el-table-column>
      <el-table-column prop="studentNo" label="学号" width="100">
      </el-table-column>
      <el-table-column prop="studentName" label="学生姓名" width="120">
      </el-table-column>
      <el-table-column prop="facultyName" label="院系" width="120">
      </el-table-column>
      <el-table-column prop="applyDate" label="申请日期" :formatter="dateFormat" width="120">
      </el-table-column>
      <el-table-column prop="applyYear" label="申请年份" width="120">
      </el-table-column>
      <el-table-column prop="holidayName" label="假期名称" width="120">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120">
      </el-table-column>

      <el-table-column prop="dataStatus" label="状态" width="80" :formatter="statusFormate">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:" @click="view(scope.row)" class="zjy-btn-view">
            <i class="zjy-icon"></i>
            <span>查看</span>
          </a>
          <a href="javascript:" @click="_delete(scope.row)" class="zjy-btn-delete">
            <i class="zjy-icon"></i>
            <span>删除</span>
          </a>
        </template>
      </el-table-column>

      <span slot="empty">{{ empty }}</span>
    </el-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="currentChange"
      >
      </zjy-pagination>
    </div>

    <el-dialog
      title="留校审批"
      :visible.sync="visible"
      width="800px"
    >
      <stayholiday
        :data="stayholiday"
        v-model="value"
      ></stayholiday>
    </el-dialog>

  </div>
</template>

<script>
import stayholidaysAPI from '@/api/teacher/stayholidays'
import commonAPI from '@/api/common'

import {dateFormat as _dateFormat} from '@/utils'
import ZjyInput from '@/components/input'
import ZjyPagination from '@/components/pagination'

import Stayholiday from './Stayholiday'

export default {
  data () {
    return {
      stayholiday: {},
      value: [],

      currentPage: 1,
      list: [],
      total: 0,
      visible: false,
      query: {
        offset: 0,
        limit: 10,
        dataStatus: '',
        applyYear: '',
        studentCode: ''
      },
      loading: false,
      empty: '暂无数据',

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
      ]
    }
  },

  methods: {
    search () {
      this.refresh()
    },

    _delete (row) {
      console.log(row)
      stayholidaysAPI.delete(row.stayholidayUid).then(response => {
        if (response.code === 1) {
          this.$alert('删除成功')
          this.refresh()
        }
      })
    },

    batch () {

    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    dateFormat (row, column, cellValue) {
      return _dateFormat(cellValue)
    },

    handleSubmit (val) {
      this.visible = false

      if (val === 1) {
        this.refresh()
      }
    },

    statusFormate (row, column, cellValue) {
      return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
    },

    // 保单审批
    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.insuranceUid).then(response => {
        this.stayholiday = row
        this.value = response.data
        this.visible = true
      })
    },

    refresh () {
      const old = this.currentPage
      this.currentPage = -1
      setTimeout(() => (this.currentPage = old), 100)
    }
  },

  components: {
    ZjyInput,
    ZjyPagination,
    Stayholiday
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
    },

    list (val) {
      if (!val) return
      this.empty = val.length === 0 ? '暂无数据' : '数据加载中....'
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
