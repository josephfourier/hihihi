<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td><span>学号:</span> {{ data.studentNo }}</td>
          <td>学生姓名: {{ data.studentName }}</td>
          <td>班级: {{ data.className }}</td>
          <td>院系: {{ data.facultyName }}</td>
        </tr>
        <tr>
          <td>家庭总人口: {{ data.totalPopulation }}</td>
          <td>家庭年收入: {{ data.annualIncome }}</td>
          <td>人均月收入: {{ data.pcmIncome }}</td>
          <td>家庭困难类型: {{ data.poorType | poorTypeFormat }}</td>
        </tr>
      </table>
      <p class="process-title">家庭困难情况</p>
      <p class="content">{{ data.poorDescription }}</p>
      <p class="process-title">曾受资助情况</p>
      <p class="content">{{ data.receivedFunding }}</p>
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
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfPoor(this.uid)]).then(axios.spread((r1, r2) => {
      Object.assign(this.value, {
        swmsApprovals: r1.data
      })
      selfMerge(r2.data, this.data)
      this.innerVisible = true
      this.loading = false
    }))
  },

  methods: {
    makeFormData (data, steps) {
      return {
        poorUid: data.poorUid,
        studentId: data.studentId,
        swmsApprovalList: steps
      }
    },
    handleSubmit (data, steps) {
      api.submitPoor(this.makeFormData(data, steps)).then(response => {
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
