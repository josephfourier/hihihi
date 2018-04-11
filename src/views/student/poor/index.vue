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

    <el-dialog title="困难生申请" :visible.sync="visible" width="800px">
      <zjy-form
        v-if="visible"
        :data="formData"
        :value="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
      </zjy-form>
    </el-dialog>

    <el-dialog title="困难生申请说明" :visible.sync="visible2" width="800px">
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
import axios from 'axios'
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

      loading: false,
      visible: false,
      visible2: false,
      currentRow: {},

      columns: properties.columns,
      formData: {}
    }
  },

  methods: {

    // 学生申请
    create (row) {
      axios.all([commonAPI.queryInitial(getPermissionId(this.$route)), commonAPI.queryStudent()])
        .then(axios.spread((r1, r2) => {
          if (r1.code !== 1 || r2.code !== 1) {
            MSG.warning('获取数据失败')
            return
          }
          this.value = r1.data
          this.formData = r2.data
        })).catch(error => {
          console.log(error)
        })
    },
    makeFormData (data, steps) {
      data.poorType = data.poorType.join(',')
      return {
        ...data,
        swmsApprovalList: steps
      }
    },
    handleSubmit (data, steps) {
      api.create(this.makeFormData(data, steps)).then(response => {
        console.log(response)
        if (response.code !== 1) {
          this.$alert('申请失败')
        } else {
          MSG.success('申请成功')
          this.refresh().visible = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    view (row) {
      this.currentRow = row
      this.data = row
      if (this.isView) { this.visible2 = true } else {
        commonAPI.queryApprovalProcess(row.swmsPoor.studentId, row.swmsPoor.poorUid).then(response => {
          this.formData = row
          this.value = response.data
          this.visible = true
        })
      }
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh () {
      return _refresh.call(this)
    }
  },
  computed: {
    isView () { return !this.currentRow.swmsPoor }
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
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
