<template>
  <div class="wrapper">

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

    <el-dialog title="审批进度" :visible.sync="visible" width="800px">
      <process-view
        :data="data"
        v-model="value"
        v-if="visible"
        :visible.sync="visible"
      >
        <template slot-scope="props" slot="header">
          <view-apply :data="props.formData"></view-apply>
        </template>

        <!-- 因审批进度中可能会出现付款因此需要自定义操作 -->
        <template slot-scope="props" slot="footer">
          <zjy-footer
            :data="props.data"
            :steps="props.steps"
            @submit="pay"
            :visible.sync="visible"
          ></zjy-footer>
        </template>
      </process-view>
    </el-dialog>
  </div>
</template>

<script>
import myInsuranceAPI from '@/api/student/insurance/my'
import commonAPI from '@/api/common'

import ZjyPagination from '@/components/pagination'
import ProcessView from '@/components/process/ProcessView'
import ZjyFooter from './Footer'
import ZjyTable from '@/components/table'
import { _refresh } from '@/utils'
import ViewApply from './ViewApply'
import properties from './properties'
export default {
  data () {
    return {
      data: {},
      value: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      loading: false,
      visible: false,
      columns: properties.columnsMY
    }
  },

  methods: {
    statusFormat (cellValue) {
      return ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款'][+cellValue]
    },

    pay () {
      alert('付款')
    },

    handleSubmit () {
    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.insuranceUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
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
    ViewApply,
    ZjyPagination,
    ProcessView,
    ZjyFooter,

    ZjyTable
  },

  props: {
    active: Boolean
  },
  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        myInsuranceAPI
          .queryForList(this.query)
          .then(response => {
            this.list = response.rows
            this.total = response.total
            this.loading = false
          })
          .catch(error => {
            this.loading = false
          })
      }
    },

    active (val) {
      if (val) this.refresh()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
