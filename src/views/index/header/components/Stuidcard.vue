<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>学号: {{ data.studentNo }}</td>
          <td>学生姓名: {{ data.studentName }}</td>
          <td>年级: {{ data.facultyName }}</td>
          <td>院系: {{ data.facultyName }}</td>
        </tr>
        <tr>
          <td>专业: {{ data.specialtyName }}</td>
          <td>班级: {{ data.className }}</td>
          <td>申请日期: {{ data.applyDate | dateFormat }}</td>
        </tr>
      </table>
      <p class="process-title">申请原因</p>
      <p class="content">{{ data.applyReason }}</p>
      <p class="process-title">审批进度</p>
    </div>
    <!--<el-collapse-transition>-->
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
    <!--</el-collapse-transition>-->
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
      loading: true,
      innerVisible: false
    }
  },
  props: {
    uid: String,
    visible: Boolean
  },
  components: {
    ZjyProcess
  },
  mounted () {
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfStuidcard(this.uid)]).then(axios.spread((r1, r2) => {
      Object.assign(this.value, {
        swmsApprovals: r1.data
      })
      selfMerge(r2.data, this.data)
      this.$emit('update:visible', true)
      this.innerVisible = true
      this.loading = false
    }))
  },

  methods: {
    handleSubmit (data, steps) {
      api.submitStuidcard(data, steps).then(response => {
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
