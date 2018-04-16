<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td><span>学号:</span> {{ data.studentNo }}</td>
          <td>学生姓名: {{ data.studentName }}</td>
          <td>入学年份: {{ data.enterYear }}</td>
          <td>院系: {{ data.facultyName }}</td>
        </tr>
        <tr>
          <td>专业: {{ data.specialtyName }}</td>
          <td>班级: {{ data.className }}</td>
          <td>申请日期: {{ data.applyDate | dateFormat }}</td>
          <td>保险名称: {{ data.insuranceName }}</td>
        </tr>
        <tr>
          <td>保险金额: {{ data.insuranceCost }}</td>
          <td>险种类别: {{ data.insuranceCategory }}</td>
          <td>保险期限: {{ data.insuranceLimit }}</td>
        </tr>
      </table>
      <p class="process-title">保险责任</p>
      <p class="content">{{ data.insuranceLiability }}</p>
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
  </div>
</template>

<script>
import ZjyProcess from '@/components/process'
import api from '../api'
import axios from 'axios'
import {selfMerge} from '@/utils'

export default {
  name: 'MyInsurance',
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
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfInsurance(this.uid)]).then(axios.spread((r1, r2) => {
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
      api.submitInsurance(data.insuranceUid, data.inssettingUid, steps).then(response => {
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
