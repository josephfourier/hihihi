<!--设置详情数据查看 -->
<template>
    <div class="zjy-process">
      <table class="process-table">
        <tr>
          <td>奖学金名称: {{ data.scholarshipName }}</td>
          <td>发放方式: {{ data.grantWay | scholarshipGrantWayFormat}}</td>
          <td>奖学金级别: {{ data.scholarshipLevel }}</td>
        </tr>
        <tr>
          <td>金额: {{ data.money }}</td>
          <td>人数限制: {{ data.numberLimit }}</td>
          <td>发放对象: {{ data.grantObject }}</td>
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
    ZjyInput
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
