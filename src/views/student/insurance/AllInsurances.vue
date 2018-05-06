<template>
  <div class="zjy-app">
    <zjy-table :data="list" :loading="loading" :columns="columns" @view="view" @create="create">
    </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <student-process v-if="type === +$t('zjy.operator.CREATE')" :data="data" v-model="value" :visible.sync="visible" @submit="handleSubmit">
        <template slot-scope="props" slot="header">
          <view-apply :data="props.formData"></view-apply>
        </template>
      </student-process>

      <view-setting v-else :data="data" :visible.sync="visible">
      </view-setting>
    </el-dialog>
  </div>
</template>

<script>
import insuranceAPI from '@/api/student/insurance/all'
import commonAPI from '@/api/common'
import ZjyPagination from '@/components/pagination'
import { getPermissionId, _refresh } from '@/utils'

import StudentProcess from '@/components/process/StudentProcess'
import ViewSetting from './ViewSetting'

import ZjyTable from '@/components/table'
import ZjyButton from '@/components/button'
import ViewApply from './ViewApply'

import properties from './properties'
export default {
  data () {
    return {
      data: {}, // 保单设置详情
      value: {},   // 保单对应审批
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,
      title: '',
      loading: false,
      visible: false,
      type: 1, // 查看或申请操作
      columns: properties.columnsALL
    }
  },

  methods: {
    handleSubmit (data, steps) {
      insuranceAPI.create(data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('申请成功')
          }, 200)
          this.refresh().visible = false
        } else {
          this.$MSG.warning(response.message)
        }
      }).catch(error => {

      })
    },

    view (row) {
      this.title = '保单详情'
      this.type = +this.$t('zjy.operator.VIEW')
      this.data = row
      this.visible = true
    },

    create (row) {
      this.title = '保单申请'
      this.type = +this.$t('zjy.operator.CREATE')

      commonAPI.queryInitial(getPermissionId(this.$route)).then(response => {
        this.value = response.data
        this.data = row
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
    ViewApply,
    ZjyPagination,
    ZjyButton,
    StudentProcess,
    ViewSetting,

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
        insuranceAPI.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
        }).catch(error => {
        }).finally(_ => {
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
