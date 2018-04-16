<template>
  <div>
    <div class="zjy-process" v-loading="loading">
      <table class="process-table">
        <tr>
          <td>荣誉称号名称: {{ data.honoraryName }}</td>
          <td>申请人: {{ data.teacherName }}</td>
          <td>申请院系:
            {{ data.facultyName }}
          </td>
        </tr>
      </table>
      <p class="process-title">申请原因</p>
      <span>{{ data.applyReson }}</span>
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
import axios from 'axios'
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
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfFacultyHonorary(this.uid)]).then(axios.spread((r1, r2) => {
      Object.assign(this.value, {
        swmsApprovals: r1.data
      })
      selfMerge(r2.data, this.data)
      this.innerVisible = true
      this.loading = false
    }))
  },

  methods: {
    makeFormData (data, steps) {
      return {
        'fachonoraryUid': data.fachonoraryUid,
        'swmsApprovalList': steps
      }
    },
    handleSubmit (data, steps) {
      api.submitFacultyHonorary(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success('保存成功')
          }, 500)
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
