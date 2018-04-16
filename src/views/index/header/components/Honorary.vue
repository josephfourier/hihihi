<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>荣誉称号名称: {{ data.honoraryName }}</td>
          <td>荣誉称号类别: {{ data.honoraryCategory }}</td>
          <td>申请人: {{ data.studentName }}</td>
          <td>申请时间: {{ data.applyDate | dateFormat }}</td>
        </tr>
        <tr>
          <td>入学年份: {{ data.enterYear }}</td>
          <td>院系: {{ data.facultyName }}</td>
          <td>政治面貌: {{ data.politics }}</td>
          <td>专业: {{ data.specialtyName }}</td>
        </tr>
        <tr>

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
  </div>
</template>

<script>
import ZjyProcess from '@/components/process'
import api from '../api'
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
    api.queryObjectOfStudentHonorary(this.uid).then(response => {
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
        'stuhonoraryUid': data.stuhonoraryUid,
        'swmsApprovalList': steps
      }
    },
    handleSubmit (data, steps) {
      api.submitStudentHonorary(this.makeFormData(data, steps)).then(response => {
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
