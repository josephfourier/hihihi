<template>
  <div class="process" v-loading="loading">
    <table class="process-table">
      <tr>
        <td>学号：{{ data.studentCode }}</td>
        <td>学生姓名：{{ data.studentName }}</td>
        <td>入学年份：{{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.facultyName }}</td>
        <td>电话：{{ data.phone }}</td>
        <td>假期名称：{{ data.holidayName }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">留校原因</p>
      <div class="process-item__content">
        {{ data.stayReason }}
      </div>
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
  name: 'stay-holiday',
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
      if (response.code !== 1 || !response.data) {
        MSG.warning('获取信息失败')
        // 修复如果学生申请后直接删除，教师打开时错误bug
        this.$store.dispatch('setSchedules')
        this.$emit('update:visible', false)
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
            MSG.success('审批成功')
          }, 200)
          this.$store.dispatch('setSchedules')
        } else {
          MSG.warning('审批失败')
        }
      }).catch(error => {
      }).finally(() => {
        this.$emit('update:visible', false)
      })
    }
  }
}
</script>
