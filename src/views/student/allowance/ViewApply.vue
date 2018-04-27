<!--设置详情数据查看 -->
<template>
    <div class="zjy-process">
      <table class="process-table">
        <tr>
          <td>荣誉称号名称: {{ data.honoraryName }}</td>
          <td>人数限制: {{ data.numberLimit }}</td>
        </tr>
        <tr>
          <td>开始时间: {{ data.startDate | dateFormat }}</td>
          <td>结束时间: {{ data.endDate | dateFormat }}</td>
        </tr>
        <tr v-if="data.dataStatusName">
          <td>审批状态: {{ data.dataStatusName }}</td>
        </tr>
      </table>
      <p class="process-title">申请原因</p>
      <div class="textarea-wrapper">
        <zjy-input 
          type="textarea" 
          v-model="innerApplyReason" 
          @change="$emit('update:applyReason', innerApplyReason)" 
          :disabled="data.dataStatus && data.dataStatus !== '0'"
          :maxlength="1024"
        ></zjy-input>
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
import ZjyButton from '@/components/button'

export default {
  name: 'view-apply',
  data () {
    return {
      innerApplyReason: ''
    }
  },

  props: {
    data: Object,
    applyReason: String,
    hasError: Boolean
  },

  components: {
    ZjyInput,
    ZjyButton
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

<style scoped lang="scss">

</style>
