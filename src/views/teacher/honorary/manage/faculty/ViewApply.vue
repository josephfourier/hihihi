<!--设置详情数据查看 -->
<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>申请人：{{ user.fullName }}</td>
        <td style="text-align: right;">申请院系：
          <el-select v-model="innerFac" @change="$emit('update:fac', innerFac)">
          <el-option
            v-for="item in facs"
            :key="item.facultyId"
            :label="item.facultyName"
            :value="item.facultyId"
          >
          </el-option>

        </el-select></td>
      </tr>
    </table>
    <!--<p class="process-title">申请原因</p>-->
    <!--<div class="textarea-wrapper">-->
      <!--<zjy-input type="textarea" v-model="innerApplyReason" @change="$emit('update:applyReason', innerApplyReason)" :disabled="data.dataStatus && data.dataStatus !== '0'"></zjy-input>-->
      <!--<div class="form-tip-box">-->
        <!--<transition name="el-zoom-in-top">-->
          <!--<span class="tip reason" v-if="hasError && !innerApplyReason">请填写申请原因</span>-->
        <!--</transition>-->
      <!--</div>-->
    <!--</div>-->
    <div class="process-item" style="margin-bottom: 0;">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">
        <zjy-input type="textarea" v-model="innerApplyReason" @change="$emit('update:applyReason', innerApplyReason)" :maxlength="1024"></zjy-input>
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
import commonAPI from '@/api/common'
import { mapGetters } from 'vuex'
export default {
  name: 'view-apply',
  data () {
    return {
      innerApplyReason: '',
      innerFac: '',
      facs: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },

  props: {
    data: Object,
    fac: [Number, String],
    applyReason: String,
    hasError: Boolean
  },

  components: {
    ZjyInput
  },

  created () {
    commonAPI.queryMyFacultyListNotApplied(this.data.honorarysettingUid).then(response => {
      this.facs = response.data
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
