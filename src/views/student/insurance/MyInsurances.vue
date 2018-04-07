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

export default {
  data () {
    return {
      data: {},
      value: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: {
        offset: 0,
        limit: 10
      },

      loading: false,
      visible: false,
      columns: [
        {
          index: true
        }, {
          label: '险种名称',
          prop: 'insuranceName',
          width: 200
        }, {
          label: '保险公司',
          prop: 'insuranceCompany'
        }, {
          label: '险种类别',
          prop: 'insuranceCategory'
        }, {
          label: '保险费用',
          prop: 'insuranceCost'
        }, {
          label: '保险期限',
          prop: 'insuranceLimit'
        }, {
          label: '状态',
          prop: 'dataStatus',
          formatter: this.statusFormat
        },
        {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '查看',
              cmd: 'view'
            }
          ]
        }
      ]
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
