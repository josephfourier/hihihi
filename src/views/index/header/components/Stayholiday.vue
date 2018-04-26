<template>
<div>
  <div class="zjy-process" v-loading="loading">
    <table class="process-table">
      <tr>
        <td>学号: {{ data.studentNo }}</td>
        <td>学生姓名: {{ data.studentName }}</td>
        <td>入学年份: {{ data.enterYear }}</td>
        <td>院系: {{ data.facultyName }}</td>
      </tr>
      <tr>
        <td>电话: {{ data.phone }}</td>
        <td>假期名称: {{ data.holidayName }}</td>
      </tr>
    </table>
    <p class="process-title">留校原因</p>
    <p class="content">{{ data.stayReason }}</p>
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
import { selfMerge } from '@/utils'

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
    api.queryObjectOfStayholiday(this.uid).then(response => {
      if (response.code !== 1) {
        this.$alert('获取信息失败')
      } else {
        const sid = response.data.studentId
        selfMerge(response.data, this.data)
        api.queryApprovalProcess(sid, this.uid).then(response => {
          this.value = response.data
          this.innerVisible = true
          this.loading = false
        })
      }
    })
  },

  methods: {
    makeFormData (data, steps) {
      return {
        'applyDate': data.applyDate,
        'applyYear': data.applyYear,
        'dataStatus': data.dataStatus,
        'holidayId': data.holidayId,
        'holidayName': data.holidayName,
        'stayReason': data.stayReason,
        'stayholidayUid': data.stayholidayUid,
        'studentId': data.studentId,
        'swmsApprovalList': steps
      }
    },
    handleSubmit (data, steps) {
      api.submitStayholiday(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('保存成功')
          }, 200)
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
