<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>奖学金名称: {{ data.scholarshipName }}</td>
          <td>发放方式: {{ data.grantWay }}</td>
          <td>奖学金级别: {{ data.scholarshipLevel }}</td>
          <td>金额: {{ data.money }}</td>
        </tr>
        <tr>
          <td>申请人: {{ data.studentName }}</td>
          <td>申请时间: {{ data.applyDate | dateFormat }}</td>
          <td>入学年份: {{ data.enterYear }}</td>
          <td>院系: {{ data.facultyName }}</td>
        </tr>
        <tr>
          <td>政治面貌: {{ data.politics | politicsFormat }}</td>
          <td>专业: {{ data.specialtyName }}</td>
        </tr>
      </table>
      <p class="process-title">申请原因</p>
      <p class="content">{{ data.applyReson }}</p>
      <p class="process-title">审批进度</p>
    </div>
    <transition name="el-zoom-in-top">

      <zjy-process
        v-if="innerVisible"
        :data="data"
        v-model="value"
        :visible.sync="innerVisible"
        @submit="handleSubmit"
      >
      </zjy-process>
    </transition>
    >
  </div>
</template>

<script>
import ZjyProcess from '@/components/process'
import api from '../api'
import axios from 'axios'
import {selfMerge} from '@/utils'

export default {
  data () {
    return {
      data: {},
      value: {},
      innerVisible: false,
      loading: true
    }
  },
  props: {
    uid: String,
    visible: Boolean
  },
  components: {
    ZjyProcess
  },
  created () {
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfScholarship(this.uid)]).then(axios.spread((r1, r2) => {
      Object.assign(this.value, {
        swmsApprovals: r1.data
      })
      selfMerge(r2.data, this.data)
      this.innerVisible = true
      this.loading = false
    }))
  },

  methods: {
    handleSubmit (data, steps) {
      api.submitScholarship(data.scholarshipUid, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('保存成功')
          }, 500)
          this.$store.dispatch('setSchedules')
        } else {
          MSG.success('保存失败')
        }
      }).catch(error => {
      }).finally(() => {
        this.$emit('update:visible', false)
      })
    }
  }
}
</script>

<style scoped>

</style>
