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
        :data="setting"
        v-model="value"
        v-if="visible"
        :visible.sync="visible"
      >
        <template slot-scope="props">
          <form-view :data="props.formData"></form-view>
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
import FormView from './FormView'

import ZjyTable from '@/components/table'
import { _refresh } from '@/utils'

export default {
  data () {
    return {
      setting: {},
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
              render: true,
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

    handleSubmit () {
    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.insuranceUid).then(response => {
        this.setting = row
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
    ZjyPagination,
    ProcessView,
    FormView,

    ZjyTable
  },

  props: {
    active: Boolean
  },
  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1) return

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
