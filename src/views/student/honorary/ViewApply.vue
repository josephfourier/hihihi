<template>
    <div class="process">
      <table class="process-table">
        <tr>
          <td>荣誉称号名称：{{ data.honoraryName }}</td>
          <td>申请人：{{ student.studentName }}</td>
          <td>入学年份：{{ student.enterYear }}</td>
        </tr>
        <tr>
          <td>政治面貌：{{ student.politics | politicsFormat}}</td>
          <td>院系：{{ student.facultyName }}</td>
          <td>专业：{{ student.specialtyName }}</td>
        </tr>
        <tr>
          <td>人数限制：{{ data.numberLimit }}</td>
          <td>申请时间：{{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat }}</td>
        </tr>
      </table>

      <div class="process-item" style="margin-bottom: 0;">
        <p class="process-item__title">申请原因</p>
        <div class="process-item__content">
          <zjy-input type="textarea" v-model="innerApplyReason" @change="$emit('update:applyReason', innerApplyReason)" :maxlength="1024"></zjy-input>
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
import { mapGetters } from 'vuex'

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

  created () {
    this.$store.dispatch('setStudent')
  },

  computed: {
    ...mapGetters(['student'])
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
