<!-- 教师审批流程组件 -->
<template>
  <div class="zjy-process">
    <slot :formData="data" name="header"></slot>
    <slot name="warning" v-if="$slots.warning && !hasStep"></slot>
    <template>
      <p v-if="!hasStep && !$slots.warning" class="warning">{{ empty || $t('zjy.process.none') }}</p>
      <div class="zjy-steps" v-if="hasStep">
        <zjy-steps :active="step" align-center :space="space">
          <!-- 新添加teacherName 有可能是来自教师的申请 -->
          <zjy-step :title="$t('zjy.process.start')" :description="'(' + (data.studentName ? data.studentName : data.teacherName) + ')'">
          </zjy-step>
          <zjy-step v-for="(item,index) in steps" :key="item.approvalStep" :title="item.postName" :custom="item">
            <div slot="description">
              <div v-if="item.approvalType == 2 || item.approvalStatus">
                ({{ item.teacherName }})
              </div>
              <div v-else>
                <p v-if="index === step - 1 && approver">
                  <!--({{ nextApproverName }})-->
                  <!--选中后再显示会有跳动先去掉-->
                </p>

              </div>
              <div v-if="index <= step - 1 && item.approvalStatus">
                <p :class="[
                { statusYes: item.approvalStatus == 1 },
                { statusNo: item.approvalStatus == 2 },
                { statusWait: item.approvalStatus == 0 },
                  'status'
                ]">
                  {{ item.approvalStatus | statusFormat }}
                </p>
              </div>
            </div>

            <div class="validate"
                 slot="custom"
                 slot-scope="props">
                <el-select
                  class="zjy-select"
                  popper-class="zjy-process-select"
                  v-model="approver"
                  :placeholder="$t('zjy.process.selectPlaceholder')"
                  @change="handleChange"
                  v-if="props.data.approvalType == 1
                  && index === step - 1
                  && !props.data.approvalStatus
                  && isApprovered
                  && !reason"
                >
                  <el-option v-for="item in approverList" :key="item.teacherId" :label="item.teacherName"
                             :value="item.teacherId">
                  </el-option>
                </el-select>
                <div class="tip-box">
                  <transition name="el-zoom-in-top">
                    <span class="tip" v-if="hasError && index === step - 1">{{ error }}</span>
                  </transition>
                </div>
            </div>
          </zjy-step>
        </zjy-steps>
      </div>
    </template>

    <!--<div class="zjy-footer" v-if="!isFinished && hasStep && isMyStep">-->
    <div class="zjy-footer" v-if="!isFinished && hasStep">
      <template v-if="!isApprovered">
        <zjy-button type="plain" @click="no">拒绝</zjy-button>
        <zjy-button type="primary" @click="yes">同意</zjy-button>
      </template>
      <zjy-button type="primary" v-else @click="submit">提交</zjy-button>
    </div>

    <el-dialog class="inner" width="30%" title="请输入拒绝原因" :visible.sync="innerVisible" append-to-body>
      <zjy-input type="textarea" v-model="reason"></zjy-input>
    
      <transition name="el-zoom-in-top">
        <div class="tip-box">
          <transition name="el-zoom-in-top">
            <span class="tip" v-if="hasNoReason ">请输入拒绝原因</span>
          </transition>
        </div>
      </transition>
    
      <div class="zjy-footer">
        <zjy-button type="plain" @click="innerNo">取消</zjy-button>
        <zjy-button type="primary" @click="innerYes">确定</zjy-button>
      </div>
    </el-dialog>
    <p v-if="reason && isFinished" class="refused">拒绝原因: {{ reason }}</p>
  </div>

</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'
import ZjyButton from '@/components/button'
import {ZjyStep, ZjySteps} from '@/components/steps'
import ZjyInput from '@/components/input'

import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      step: 1,
      steps: [], // 审批流程步骤
      approver: '', // select 审批人
      isMyStep: false,
      isFinished: false,
      isApprovered: false, // 是否已经作出审批
      approverList: [], // 下一步需要初始化的审批教师列表
      hasNextApprover: false, // 是否需要初始化第一步的教师列表
      nextApproverName: '',
      nextApproverId: '',
      reason: '', // 拒绝原因
      hasNoReason: false,
      STATUS: {
        yes: '1',
        no: '2'
      },

      innerVisible: false,
      error: ''
    }
  },

  props: {
    data: Object,
    value: Object,
    space: Number,
    empty: String,
    visible: Boolean // 弹窗时
  },

  computed: {
    ...mapGetters(['user']),
    hasStep () {
      return this.steps.length > 0
    },
    hasFooter () {
      return this.$slots.footer
    },
    hasError () {
      return !!this.error
    }
  },

  components: {
    Panel,
    PanelItem,
    ZjyButton,
    ZjySteps,
    ZjyStep,
    ZjyInput
  },

  methods: {
    handleChange (val) {
      this.nextApproverId = val
      if (this.hasNextApprover) {
        this.nextApproverName = this.approverList.find(x => x.teacherId === val).teacherName
      }
      this.error = ''
    },

    yes () {
      this.steps[this.step - 1].approvalStatus = this.STATUS.yes
      this.isApprovered = true
    },

    no () {
      this.innerVisible = true
    },

    innerYes () {
      if (!this.reason) {
        this.hasNoReason = true
        return
      }
      this.steps[this.step - 1].approvalStatus = this.STATUS.no
      this.isApprovered = true
      this.innerVisible = false
    },

    innerNo () {
      this.innerVisible = false
      this.reason = ''
    },

    submit () {
      if (this.hasNextApprover && !this.approver && !this.reason) {
        this.error = this.$t('zjy.process.selectPlaceholder')
        return
      }

      const _ = this.steps.find(x => x.approvalStep == this.step)
      if (_ && _.approvalType == 1) {
        _.teacherId = this.nextApproverId
        _.teacherName = this.nextApproverName
      }

      if (this.reason) {
        this.steps[this.step - 2].approvalOpinion = this.reason
      }

      this.$emit('submit', this.data, this.steps)
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (this.$empty(val)) return

        this.steps = val.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)

        try {
          this.step = this.steps.find(x => x.approvalStatus == 0).approvalStep

          this.isMyStep = this.user.userDetailId === this.steps[this.step - 1].teacherId
        } catch (e) {
          const _ = this.steps.find(x => x.approvalStatus == 2)
          if (_) {
            this.step = _.approvalStep
            this.reason = _.approvalOpinion
          } else {
            this.step = this.steps.length + 1
          }
          this.isFinished = true
        }

        this.approverList = val[+Object.keys(val).find(x => Number(x) == x)] || {}

        this.hasNextApprover = !this.$empty(this.approverList)
      }
    },

    isApprovered (val) {
      if (val) this.step++
      else this.step--
    },
    reason (val) {
      if (val) this.hasNoReason = false
    }

  }
}
</script>
<style lang='scss' scoped>
  .warning {
    color: #ED7734;
    text-align: center;
    font-weight: bold;
  }
  .tip-box {
    height: 20px;
    position: relative;
  }
  .zjy-process {
    .zjy-steps {
      width: 700px;
    }
  }
  .tip {
    font-size: 12px;
    position: relative;
    top: -5px;
  }
</style>
