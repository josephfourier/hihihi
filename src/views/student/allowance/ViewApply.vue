<!--设置详情数据查看 -->
<template>
    <div class="process">
      <table class="process-table">
        <tr>
          <td>困难补助名称：{{ data.allowanceName }}</td>
          <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
          <td>名额限制：{{ data.numberLimit }}</td>
        </tr>
        <tr>
          <td>金额：{{ data.money }}元</td>
          <td>发放对象：{{ data.grantObject }}</td>
          <td>申请时间：{{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat }}</td>
        </tr>
      </table>
      <div class="process-item" style="margin-bottom: 0;">
        <p class="process-item__title">申请原因</p>
        <div class="process-item__content">
          <span v-if="data.dataStatus && data.dataStatus !== '0'">{{ innerApplyReason }}</span>
          <zjy-input
            type="textarea"
            v-model="innerApplyReason"
            @change="$emit('update:applyReason', innerApplyReason)"
            v-else
            :maxlength="1024"
          ></zjy-input>

          <div class="tip-box">
            <transition name="el-zoom-in-top">
              <span class="tip reason" v-if="hasError && !innerApplyReason" style="position: relative;top: -3px;">请填写申请原因</span>
            </transition>
          </div>
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
