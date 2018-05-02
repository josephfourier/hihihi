<template>
    <div class="process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>岗位名称: {{ data.postName }}</td>
          <td>人数限制: {{ data.numberLimit }}</td>
          <td>专业要求：{{ data.specialtyName }}</td>
        </tr>
        <tr>
          <td>薪资待遇：{{ data.salary }}</td>
          <td>开始时间: {{ data.startDate | dateFormat }}</td>
          <td>结束时间: {{ data.endDate | dateFormat }}</td>
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
  name: 'my-workstudy',
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
    api.queryObjectOfWorkstudy(this.uid).then(response => {
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
        workstudyUid: data.workstudyUid,
        studentId: data.studentId,
        swmsApprovalList: steps
      }
    },
    handleSubmit (data, steps) {
      api.submitWorkstudy(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('审批成功')
          }, 200)
          this.$store.dispatch('setSchedules')
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
