<template>
<div>
  <zjy-process
    v-if="innerVisible"
    :data="data"
    v-model="value"
    :visible.sync="innerVisible"
    @submit="handleSubmit"
  >
  </zjy-process>
</div>
</template>

<script>
import ZjyProcess from '@/components/process'
import api from '../api'
import axios from 'axios'
import { selfMerge } from '@/utils'

export default {
  name: 'MyInsurance',
  data () {
    return {
      data: {},
      value: {},
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
    axios.all([api.queryApprovalProcess(this.uid), api.queryObjectOfInsurance(this.uid)]).then(axios.spread((r1, r2) => {
      Object.assign(this.value, {
        swmsApprovals: r1.data
      })
      selfMerge(r2.data, this.data)
      this.innerVisible = true
    }))
  },

  methods: {
    handleSubmit (data, steps) {
      api.submitInsurance(data.insuranceUid, data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          MSG.success('保存成功')
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
