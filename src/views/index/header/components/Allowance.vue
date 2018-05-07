<template>
    <div class="process" v-loading="loading">
      <table class="process-table">
      <tr>
        <td>困难补助名称：{{ data.allowanceName }}</td>
        <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
        <td>名额限制：{{ data.numberLimit }}</td>
      </tr>
      <tr>
        <td>金额：{{ data.money }}</td>
        <td>发放对象：{{ data.grantObject }}</td>
        <td>申请时间：{{ data.startDate | dateFormat }} </td>
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
  name: 'my-allowance',
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
    api.queryObjectOfAllowance(this.uid).then(response => {
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
    makeFormData (data, steps) {
      return {
        allowanceUid: data.allowanceUid,
        studentId: data.studentId,
        swmsApprovalList: steps
      }
    },
    handleSubmit (data, steps) {
      api.submitAllowance(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('审批成功')
          }, 200)
          this.$store.dispatch('setSchedules')
          // this.$store.dispatch('removeFromTodoList', data.allowanceUid)
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