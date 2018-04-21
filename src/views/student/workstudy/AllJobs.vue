<template>
  <div class="zjy-app">
    <zjy-table :data="list" :loading="loading" :columns="columns" @view="view" @create="create">
    </zjy-table>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <student-process v-if="visible && type === +$t('zjy.operator.CREATE')" :data="data" v-model="value" :visible.sync="visible" @submit="handleSubmit">
        <template slot-scope="props" slot="header">
          <view-apply :data="props.formData" :applyReason.sync="applyReason" :hasError="hasError"></view-apply>
        </template>
      </student-process>
      <view-setting v-if="type === +$t('zjy.operator.VIEW')" :visible.sync="visible" :data="data"></view-setting>
    </el-dialog>
  </div>
</template>

<script>
import commonAPI from '@/api/common'
import api from './api'
import { getPermissionId } from '@/utils'
import ZjyButton from '@/components/button'

import StudentProcess from '@/components/process/StudentProcess'
import ViewApply from './ViewApply'
import ViewSetting from './ViewSetting'
import axios from 'axios'
import properties from './properties'
import ZjyTable from '@/components/table'

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      data: {},    // 设置详情
      value: {},   // 对应审批
      list: [],
      loading: false,
      visible: false,
      type: '', // 查看或申请操作

      columns: properties.columnsALL,
      // 申请原因
      applyReason: '',
      hasError: false
    }
  },

  methods: {
    makeFormData(data, steps) {
      // 优化
      // studentId不应该前台传入，最好后台解析出
      Object.assign(data, {
        applyDate: new Date().getTime(),
        studentId: this.user.userDetailId,
        applyReson: this.applyReason,
        swmsApprovalList: steps
      })
      return data
    },

    handleSubmit(data, steps) {
      if (!this.applyReason) {
        this.hasError = true
      } else {
        api.create(this.makeFormData(data, steps)).then(response => {
          if (response.code === 1) {
            setTimeout(_ => {
               MSG.success('申请成功')
            }, 200)
            this.refresh().visible = false
          } else {
            this.$alert(response.message)
          }
        }).catch(error => {

        })
      }
    },

    view(row) {
      this.type = +this.$t('zjy.operator.VIEW')
      this.data = row
      this.visible = true
    },

    create(row) {
      this.type = +this.$t('zjy.operator.CREATE')

      commonAPI.queryInitial(getPermissionId(this.$route)).then(response => {
        if (response.code !== 1) {
          MSG.warning('获取审批流程数据失败')
        } else {
          this.value = response.data
          this.data = row
          this.visible = true
        }
      })
    },

    refresh() {
      api.queryForList().then(response => {
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
    ZjyButton,

    StudentProcess,
    ViewApply,
    ViewSetting,

    ZjyTable
  },

  props: {
    active: Boolean
  },

  computed: {
    ...mapGetters(['user']),
    title() {
      return this.type === +this.$t('zjy.operator.CREATE') ? '岗位申请' : '岗位详情'
    }
  },

  created () {
    this.refresh()
  },

  watch: {
    active(val) {
      if (val) this.refresh()
    },

    visible(val) {
      if (!val) {
        this.applyReason = ''
        this.hasError = false
        this.type = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
