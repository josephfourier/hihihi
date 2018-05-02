<template>
  <div class="process" v-loading="loading">
    <table class="process-table">
      <tr>
        <td>学号：{{ data.studentNo }}</td>
        <td>学生姓名：{{ data.studentName }}</td>
        <td>班级：{{ data.className }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.facultyName }}</td>
        <td>家庭总人口：{{ data.totalPopulation }}</td>
        <td>家庭年收入：{{ data.annualIncome }}</td>
      </tr>
      <tr>
        <td>人均月收入：{{ data.pcmIncome }}</td>
        <td>家庭困难类型：{{ data.poorType | poorTypeFormat }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">家庭困难情况</p>
      <div class="process-item__content">
        {{ data.poorDescription }}
      </div>
    </div>
    <div class="process-item">
      <p class="process-item__title">曾受资助情况</p>
      <div class="process-item__content">
        {{ data.receivedFunding }}
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <zjy-process v-if="innerVisible" :data="data" v-model="value" :visible.sync="innerVisible" @submit="handleSubmit">
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
    api.queryObjectOfPoor(this.uid).then(response => {
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
        poorUid: data.poorUid,
        studentId: data.studentId,
        swmsApprovalList: steps
      }
    },
    handleSubmit (data, steps) {
      api.submitPoor(this.makeFormData(data, steps)).then(response => {
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

<style scoped>

</style>
