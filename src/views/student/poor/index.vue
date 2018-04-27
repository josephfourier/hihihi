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
        :student="student"
        :data="formData"
        :value="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
      </zjy-form>
    </el-dialog>

    <el-dialog title="困难生申请进度" :visible.sync="visible3" width="800px">
      <form-view
        v-if="visible3"
        :student="student"
        :data="formData"
        :value="value"
        :visible.sync="visible3"
        @submit="handleUpdate"
        @delete="handleDelete"
      >
      </form-view>
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
import FormView from './FormView'
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
      visible3: false,
      currentRow: {},

      columns: properties.columns,
      student: {},
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
          this.student = r2.data
          this.formData = row
          this.visible = true
        })).catch(error => {
          console.log(error)
        })
    },

    makeFormData (data, steps) {
      let d = {...data}
      d.poorType = d.poorType.join(',')
      return {
        ...d,
        swmsApprovalList: steps
      }
    },
    handleDelete (data) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      api.delete(data.poorUid).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success('删除成功')
        }
      }).finally(() => {
        this.refresh(auto).visible3 = false
      })
    },
    handleUpdate (data) {
      // 修复关闭前checkbox提示问题
      let d = {...data}
      d.poorType = d.poorType.join(',')
      api.update(d).then(response => {
        this.visible3 = false
        if (response.code !== 1) {
          MSG.warning('修改失败')
        } else {
          MSG.success('修改成功')
        }
      }).catch().finally(this.refresh())
    },
    handleSubmit (data, steps) {
      api.create(this.makeFormData(data, steps)).then(response => {
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
        axios.all([commonAPI.queryApprovalProcess(row.swmsPoor.studentId, row.swmsPoor.poorUid), api.queryForObject(row.swmsPoor.poorUid)]).then(axios.spread((r1, r2) => {
          this.value = r1.data
          this.student = r2.data.ucenterStudent
          this.formData = r2.data
          this.formData.poorType = this.formData.poorType.split(',')
          this.visible3 = true
        }))
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
    ZjyForm,
    FormView
    // ZjyFormView
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
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
