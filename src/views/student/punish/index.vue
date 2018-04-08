<!-- 学生假期留校管理 -->
<template>
  <div class="zjy-app">

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

    <el-dialog title="违纪处分" :visible.sync="visible" width="800px">
      <process-view
        v-if="visible"
        :data="data"
        v-model="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props" slot="header">
          <zjy-form
            :data="props.formData"
            :reason.sync="reason"
            :type.sync="type"
            :hasError="hasError"
          ></zjy-form>
        </template>
      </process-view>
    </el-dialog>

  </div>
</template>

<script>
import api from './api'
import {dateFormat as _dateFormat, _refresh} from '@/utils'

import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyTable from '@/components/table'
import ZjyPagination from '@/components/pagination'
import ProcessView from '@/components/process/ProcessView'
import ZjyFormView from './FormView'

import commonAPI from '@/api/common'
import properties from './properties'

export default {
  data () {
    return {
      value: {}, // 流程数据
      data: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      loading: false,
      visible: false,

      columns: properties.columns,
    }
  },

  methods: {

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stayholidayUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible2 = true
      })
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
    ProcessView,
    ZjyFormView
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      }
    },
  }
}
</script>
<style lang='scss' scoped>

</style>
