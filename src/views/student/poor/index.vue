<!-- 学生假期留校管理 -->
<template>
  <div class="zjy-app">

      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @create="create"
      >
      </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <zjy-form :value="value">
      </zjy-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="visible2" width="800px">
      <view-setting
        :data="data"
        :visible.sync="visible2"
      >
      </view-setting>
    </el-dialog>

  </div>
</template>

<script>
import api from './api'
import { getPermissionId, _refresh } from '@/utils'

import ZjyTable from '@/components/table'
import ZjyPagination from '@/components/pagination'
import ViewSetting from './ViewSetting'
import ZjyForm from './form'
import properties from './properties'
import commonAPI from '@/api/common'

export default {
  data () {
    return {
      value: {}, // 流程数据
      data: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      title: '',
      loading: false,
      visible: false,
      visible2: false,

      columns: properties.columns,

      doValidate: false,
      // 业务数据

    }
  },

  methods: {

    // 学生申请
    create () {
      commonAPI.queryInitial(getPermissionId(this.$route)).then(response => {
        this.value = response.data
        this.title = '困难生申请'
        this.visible = true
      }).catch(error => {
        console.log(error)
      })
    },
    handleSubmit (data, steps) {

      // this.doValidate = false
      // if (!this.type || !this.reason) {
      //   this.hasError = true
      // } else {
      //   const arg = this.makeFormData(data, steps)
      //   api.create(arg).then(response => {
      //     if (response.code !== 1) {
      //       this.$alert(response.message)
      //     } else {
      //       this.visible = false
      //       this.refresh()
      //     }
      //   }).catch(error => {
      //     console.log(error)
      //   })
      // }
    },

    view (row) {
      this.title = '困难生申请说明'
      this.data = row
      this.visible2 = true
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
    ZjyTable,
    ViewSetting,
    ZjyForm
    // ZjyFormView
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          this.list = response.rows
          console.log(this.list)
          this.total = response.total
        }).catch(error => {
          console.log(error)
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
