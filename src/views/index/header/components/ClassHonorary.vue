<template>
  <div class="process" v-loading="loading">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>荣誉称号类别：{{ data.honoraryCategory | honoraryTypeFormat}}</td>
        <td>申请人：{{ data.teacherName }}</td>
      </tr>
      <tr>
        <td>申请时间：{{ data.applyDate | dateFormat }}</td>
        <td>年级：{{ data.year }}</td>
        <td>班级：{{ data.className }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">
        {{ data.applyReson }}
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
    api.queryObjectOfClassHonorary(this.uid).then(response => {
      if (response.code !== 1) {
        this.$alert('获取信息失败')
      } else {
        const cid = response.data.classId
        // const uid = response.data.clahonoraryUid
        selfMerge(response.data, this.data)
        api.queryNextApproval(cid, this.uid, 2).then(response => {
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
        'clahonoraryUid': data.clahonoraryUid,
        'swmsApprovalList': steps
      }
    },
    handleSubmit (data, steps) {
      api.submitClassHonorary(this.makeFormData(data, steps)).then(response => {
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

<style scoped>

</style>
