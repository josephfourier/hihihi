<template>
  <div class="process" v-loading="loading">
    <table class="process-table">
      <tr>
        <td>学号：<span>{{ data.studentNo }}</span></td>
        <td>学生姓名：<span>{{ data.studentName }}</span></td>
        <td>年级：<span>{{ data.facultyName }}</span></td>
        <td>院系：<span>{{ data.facultyName }}</span></td>
      </tr>
      <tr>
        <td>专业：<span>{{ data.specialtyName }}</span></td>
        <td>班级：<span>{{ data.className }}</span></td>
        <td>申请日期：<span>{{ data.applyDate | dateFormat }}</span></td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">{{ data.applyReason }}</div>
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
import {selfMerge} from '@/utils'

export default {
  name: 'student-card',
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
  created () {
    api.queryObjectOfStuidcard(this.uid).then(response => {
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
    handleSubmit (data, steps) {
      api.submitStuidcard(data, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('审批成功')
          }, 200)
          // this.$store.dispatch('setSchedules')
          // 提交成功后不再发送请求
          this.$store.dispatch('removeFromTodoList', data.stuidcardUid)
        } else {
          MSG.success('审批失败')
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
