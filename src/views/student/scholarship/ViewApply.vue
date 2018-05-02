<template>
    <div class="process">
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
      <div class="process-item" style="margin-bottom: 0;">
        <p class="process-item__title">申请原因</p>
        <div class="process-item__content">
          <span v-if="data.dataStatus && data.dataStatus !== '0'">{{ innerApplyReason }}</span>
          <zjy-input v-else type="textarea" v-model="innerApplyReason" @change="$emit('update:applyReason', innerApplyReason)" :maxlength="1024"></zjy-input>
          <div class="tip-box">
            <transition name="el-zoom-in-top">
              <span class="tip reason" v-if="hasError && !innerApplyReason">请填写申请原因</span>
            </transition>
          </div>
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
