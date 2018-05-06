<template>
    <div class="process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>奖学金名称：{{ data.scholarshipName }}</td>
          <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
          <td>奖学金级别：{{ data.scholarshipLevel }}</td>
        </tr>
        <tr>
          <td>金额：{{ data.money }}</td>
          <td>申请人：{{ data.studentName }}</td>
          <td>申请时间：{{ data.applyDate | dateFormat }}</td>
        </tr>
        <tr>
          <td>入学年份：{{ data.enterYear }}</td>
          <td>院系：{{ data.facultyName }}</td>
          <td>政治面貌：{{ data.politics | politicsFormat }}</td>
        </tr>
        <tr>
          <td>专业：{{ data.specialtyName }}</td>
        </tr>
      </table>
      <div class="process-item">
        <p class="process-item__title">申请原因</p>
        <div class="process-item__content">{{ data.applyReson }}</div>
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
    api.queryObjectOfScholarship(this.uid).then(response => {
      if (response.code !== 1 || !response.data) {
        MSG.warning('获取信息失败')
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
    handleSubmit (data, steps) {
      api.submitScholarship(data.scholarshipUid, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('审批成功')
          }, 200)
          this.$store.dispatch('setSchedules')
          // this.$store.dispatch('removeFromTodoList', data.scholarshipUid)
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

<style scoped>

</style>
