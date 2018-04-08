<!-- 学生端流程进度查看，不包含任何操作 -->
<template>
  <div>
    <slot :formData="data" name="header"></slot>
    <div class="zjy-steps" v-if="hasStep">
      <p class="step-title">{{$t('zjy.process.schedule')}}</p>
      <zjy-steps :active="step" align-center>
        <zjy-step title="发起人" :description="'(' + user.fullName + ')'">
        </zjy-step>
        <zjy-step
          v-for="(item,index) in steps"
          :key="item.approvalStep"
          :title="item.postName"
          :custom="item"
        >
          <div slot="description">
            <div v-if="item.approvalType == 2 || item.approvalStatus">
              ({{ item.teacherName }})
            </div>

            <div v-if="index <= step - 1 && item.approvalStatus">
              <p :class="[
                { statusYes: item.approvalStatus == 1 },
                { statusNo: item.approvalStatus == 2 },
                { statusWait: item.approvalStatus == 0 },
                  'status'
                ]"
              >
                ({{ item.approvalStatus | statusFormat }})
              </p>
            </div>
          </div>
        </zjy-step>
      </zjy-steps>
    </div>

    <p v-if="reason && isFinished" class="refused">拒绝原因: {{ reason }}</p>
    <!--<div class="zjy-footer" v-if="!hasFooter && isFinished && !reason">-->
      <!--<zjy-button type="plain" @click="$emit('update:visible', false)">取 消</zjy-button>-->
      <!--<zjy-button type="primary" @click="pay">立即支付</zjy-button>-->
    <!--</div>-->
    <!-- 根据数据状态可以定制显示操作按钮 -->
      <slot :data="data" :steps="steps" name="footer"></slot>
  </div>

</template>

<script>
import {ZjyStep, ZjySteps} from '@/components/steps'
import ZjyButton from '@/components/button'

import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      step: 1,
      steps: [], // 审批流程步骤
      isFinished: false,
      reason: '', // 拒绝原因
    }
  },

  props: {
    data: Object,
    value: Object,
    visible: Boolean
  },

  computed: {
    ...mapGetters(['user']),
    hasFooter () { return this.$slots.footer },
    hasStep () { return this.steps.length > 0 }
  },

  components: {
    ZjySteps,
    ZjyStep,
    ZjyButton
  },

  methods: {
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (this.$empty(val)) return

        this.steps = val.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)

        try {
          this.step = this.steps.find(x => x.approvalStatus === '0').approvalStep
        } catch (e) {
          const _ = this.steps.find(x => x.approvalStatus === '2')
          if (_) {
            this.step = _.approvalStep
            this.reason = _.approvalOpinion
          } else {
            this.step = this.steps.length + 1
          }
          this.isFinished = true
        }
      }
    }
  }
}
</script>
