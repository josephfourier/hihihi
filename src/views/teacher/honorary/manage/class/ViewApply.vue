<!--设置详情数据查看 -->
<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>申请人：{{ user.fullName }}</td>
        <td style="text-align: right;">申请班级：
          <el-select v-model="innerClz" @change="$emit('update:clz', innerClz)">
          <el-option
            v-for="item in clzs"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          >
          </el-option>

        </el-select></td>
      </tr>
    </table>

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
      innerClz: '',
      clzs: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },

  props: {
    data: Object,
    clz: [Number, String],
    applyReason: String,
    hasError: Boolean
  },

  components: {
    ZjyInput
  },

  created () {
    commonAPI.queryMyClassListNotApplied(this.data.honorarysettingUid).then(response => {
      this.clzs = response.data
    }).catch(error => {
      console.log(error)
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
