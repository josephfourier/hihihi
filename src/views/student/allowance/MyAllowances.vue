<template>
  <div class="zjy-app">
    <zjy-table
      :data="list"
      :loading="loading"
      :columns="columns"
      @view="view"
    >
    </zjy-table>

    <el-dialog title="审批进度" :visible.sync="visible" width="800px">
      <process-view
        :data="data"
        v-model="value"
        v-if="visible"
        :visible.sync="visible"
      >
        <template slot-scope="props" slot="header">
          <view-apply
            :data="props.formData"
            :hasError="hasError"
            :applyReason.sync="applyReason"
          ></view-apply>
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
import api from './api'
import commonAPI from '@/api/common'

import ProcessView from '@/components/process/ProcessView'
import ViewApply from './ViewApply'
import ZjyFooter from './Footer'
import ZjyTable from '@/components/table'

import properties from './properties'

export default {
  data () {
    return {
      data: {},
      value: {},
      list: [],

      loading: false,
      visible: false,
      columns: properties.columnsMY,
      applyReason: '',
      hasError: false
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    update (data) {
      if (!this.applyReason) {
        this.hasError = true
      } else {
        Object.assign(data, {
          applyReason: this.applyReason
        })
        api.update(data).then(response => {
          if (response.code === 1) {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.update.success'))
            }, 200)
            this.refresh().visible = false
          } else {
            MSG.warning(response.message)
          }
        }).catch(error => {

        })
      }
    },
    _delete (data) {
      api.delete(data.allowanceUid).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.refresh().visible = false
        } else {
          MSG.warning(response.message)
        }
      }).catch(error => {

      })
    },

    view (row) {
      this.applyReason = row.applyReason
      commonAPI.queryApprovalProcess(row.studentId, row.allowanceUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    refresh () {
      api.queryMyApplyList().then(response => {
        if (response.code !== 1) {
          MSG.warning('获取数据失败')
        } else {
          this.list = response.data
        }
      })
      return this
    }

  },
  components: {
    ProcessView,
    ViewApply,
    ZjyFooter,

    ZjyTable
  },

  props: {
    active: Boolean
  },
  watch: {
    active (val) {
      if (val) this.refresh()
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

</style>
