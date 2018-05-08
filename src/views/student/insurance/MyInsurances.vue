<template>
  <div class="zjy-app">
    <zjy-table :data="list" :loading="loading" :columns="columns" @view="view">
    </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <!--修复正在获取二维码时关闭窗口-->
    <el-dialog title="审批进度" :visible.sync="visible" width="800px" @close="loading2=false;abort=true;">
      <process-view v-loading="loading2" element-loading-text="正在获取支付二维码" :data="data" v-model="value" v-if="visible" :visible.sync="visible">
        <template slot-scope="props" slot="header">
          <view-apply :data="props.formData" :visible.sync="visible" @submit="handleSubmit"></view-apply>
        </template>

        <!-- 因审批进度中可能会出现付款因此需要自定义操作 -->
        <template slot-scope="props" slot="footer">
          <zjy-footer :data="props.data" :steps="props.steps" @submit="pay" :visible.sync="visible"></zjy-footer>
        </template>
      </process-view>
    </el-dialog>

    <el-dialog title="扫码付款" :visible.sync="visible2" width="680px" @close="refresh">
      <qrcode :url="url" v-if="visible2"></qrcode>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'
import commonAPI from '@/api/common'

import ZjyPagination from '@/components/pagination'
import ProcessView from '@/components/process/ProcessView'
import ZjyFooter from './Footer'
import ZjyTable from '@/components/table'
import { _refresh } from '@/utils'
import ViewApply from './ViewApply'
import qrcode from './qrcode'
import properties from './properties'
export default {
  data () {
    return {
      data: {},
      value: {},
      list: [],
      currentPage: 1,
      total: 0,
      url: '',
      query: properties.query,

      loading: false,
      loading2: false,
      visible: false,
      visible2: false,
      abort: true,
      columns: properties.columnsMY
    }
  },

  methods: {
    pay (data) {
      this.loading2 = true
      this.abort = false
      api.pay(data.insuranceUid).then(response => {
        if (response.code !== 1 && !this.abort) {
          MSG.warning('获取支付二维码失败')
        } else {
          if (!this.abort) {
            this.visible = false
            this.visible2 = true
            this.url = response.data
          }
        }
      }).finally(_ => {
        this.loading2 = false
      })
    },

    handleSubmit (data) {
      api.assert(data).then(response => {
        if (response.code !== 1) {
          MSG.warning('提交失败')
        } else {
          this.refresh()
          this.visible = false
          setTimeout(_ => {
            MSG.success('提交成功')
          }, 200)
        }
      })
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

    ZjyTable,
    qrcode
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
          this.loading = false
        })
      }
    }
  }
}
</script>