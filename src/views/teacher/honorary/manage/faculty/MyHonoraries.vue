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

    <el-dialog title="审批进度" :visible.sync="visible" width="800px">
      <process-view
        :data="data"
        v-model="value"
        v-if="visible"
        :visible.sync="visible"
      >
        <template slot-scope="props" slot="header">
          <form-view
            :data="props.formData"
            :hasError="hasError"
            :applyReason.sync="applyReason"
          ></form-view>
        </template>
        <template slot-scope="props" slot="footer">
          <zjy-footer
            :data="props.data"
            :steps="props.steps"
            :visible.sync="visible"
            @update="update"
            @delete="_delete"
          ></zjy-footer>
        </template>
      </process-view>
    </el-dialog>
  </div>
</template>

<script>
import facAPI from '@/api/teacher/honorary/fac'
import commonAPI from '@/api/common'

import ZjyPagination from '@/components/pagination'
import ProcessView from '@/components/process/ProcessView'
import FormView from './FormView'
import ZjyFooter from './Footer'
import ZjyTable from '@/components/table'
import { _refresh } from '@/utils'

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
      columns: properties.columnsMY,
      applyReason: '',
      hasError: false
    }
  },

  methods: {
    makeFormData (data, steps) {
      return {
        'applyReson': this.applyReason,
        'swmsApprovalList': steps
      }
    },
    update (data, steps) {
      if (!this.applyReason) {
        this.hasError = true
      } else {
        facAPI.update(data.fachonoraryUid, this.makeFormData(data, steps)).then(response => {
          if (response.code === 1) {
            MSG.success('修改成功')
            this.refresh().visible = false
          } else {
            this.$alert(response.message)
          }
        }).catch(error => {

        })
      }
    },
    _delete (data) {
      facAPI.delete(data.fachonoraryUid).then(response => {
        if (response.code === 1) {
          MSG.success('删除成功')
          this.refresh().visible = false
        } else {
          this.$alert(response.message)
        }
      }).catch(error => {

      })
    },

    view (row) {
      this.applyReason = row.applyReson

      commonAPI.queryNextApproval(row.facultyId, row.fachonoraryUid, 1).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh (auto) {
      return _refresh.call(this, auto)
    }
  },
  components: {
    ZjyPagination,
    ProcessView,
    FormView,
    ZjyFooter,

    ZjyTable
  },

  created () {
    // var that = this
    // bus.$on('applied', function () {
    //   that.refresh()
    // })
  },

  props: {
  },
  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        facAPI.queryMyApplyList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }).catch(error => { this.loading = false })
      }
    },

    visible (val) {
      if (!val) {
        this.applyReason = ''
        this.hasError = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.zjy-table {
  table {
    width: 100% !important;
  }
}
</style>
