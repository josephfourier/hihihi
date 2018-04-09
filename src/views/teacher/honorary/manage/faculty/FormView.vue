<!--设置详情数据查看 -->
<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称: {{ data.honoraryName }}</td>
        <td>申请人: {{ user.fullName }}</td>
        <td>申请院系:
          {{ innerFac.facultyName }}
        </td>
      </tr>
    </table>
    <p class="process-title">申请原因</p>
    <span v-if="data.dataStatus && data.dataStatus !== '0'">{{ innerApplyReason }}</span>
    <div class="textarea-wrapper" v-else>
      <zjy-input type="textarea" v-model="innerApplyReason" @change="$emit('update:applyReason', innerApplyReason)"></zjy-input>
      <div class="form-tip-box">
        <transition name="el-zoom-in-top">
          <span class="tip reason" v-if="hasError && !innerApplyReason">请填写申请原因</span>
        </transition>
      </div>
    </div>

  </div>
</template>

<script>
import ZjyInput from '@/components/input'
import commonAPI from '@/api/common'
import { mapGetters } from 'vuex'
export default {
  name: 'view-apply',
  data () {
    return {
      innerApplyReason: '',
      innerFac: '',
      // facs: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },

  props: {
    data: Object,
    applyReason: String,
    hasError: Boolean
  },

  components: {
    ZjyInput
  },

  created () {
    // commonAPI.queryMyFacultyListNotApplied(this.data.honorarysettingUid).then(response => {
    commonAPI.queryMyFacultyList(this.data.honorarysettingUid).then(response => {
      console.log(response.data)
      this.innerFac = response.data.find(i => i.facultyId === this.data.facultyId)
      // this.facs = response.data
    }).catch(error => {
    })
  },

  watch: {
    applyReason: {
      immediate: true,
      handler (val) {
        this.innerApplyReason = val
      }
    }
  }
}
</script>
