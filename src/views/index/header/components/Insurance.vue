<template>
    <div class="process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>学号：{{ data.studentNo }}</td>
          <td>学生姓名：{{ data.studentName }}</td>
          <td>入学年份：{{ data.enterYear }}</td>
        </tr>
        <tr>
          <td>院系：{{ data.facultyName }}</td>
          <td>专业：{{ data.specialtyName }}</td>
          <td>班级：{{ data.className }}</td>
        </tr>
        <tr>
          <td>申请日期：{{ data.applyDate | dateFormat }}</td>
          <td>保险名称：{{ data.insuranceName }}</td>
          <td>保险金额：{{ data.insuranceCost }}</td>
        </tr>
        <tr>
          <td>险种类别：{{ data.insuranceCategory }}</td>
          <td>保险期限：{{ data.insuranceLimit }}</td>
          <td>保险状态：{{ data.dataStatusName }}</td>
        </tr>
      </table>
      <div class="process-item detail">
        <p class="process-item__title">详细条款</p>
        <div class="process-item__content">{{ data.detailedTerms }}</div>
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
    api.queryObjectOfInsurance(this.uid).then(response => {
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
      api.submitInsurance(data.insuranceUid, data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('保存成功')
          }, 200)
          // this.$store.dispatch('setSchedules')
          this.$store.dispatch('removeFromTodoList', data.inssettingUid)
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

<style scoped lang="scss">
  .detail {
    padding: 20px;
    background-color: #f5f5f5;
    margin-bottom: 15px;
  .process-item__content {
    font-size: 12px;
  }
  }
  .status {
    margin-bottom: 10px;
  }
  .status-text {
    color: #ef7727;
    font-size: 16px;
    vertical-align: top;
    position: relative;
    top: 6px;
    left: 2px;
  }
</style>
