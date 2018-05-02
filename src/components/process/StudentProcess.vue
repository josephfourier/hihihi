<template>
  <div class="zjy-process">
    <slot :formData="data" name="header"></slot>
    <slot name="warning" v-if="$slots.warning"></slot>
    <p v-if="!hasStep && !$slots.warning" class="warning">{{ empty || $t('zjy.process.none') }}</p>
    <div class="zjy-steps" v-if="hasStep">
      <p class="step-title">{{$t('zjy.process.title')}}</p>
      <zjy-steps :active="step" align-center>

        <zjy-step :title="$t('zjy.process.start')" :description="'(' + user.fullName + ')'">
        </zjy-step>
        <zjy-step v-for="(item, index) in steps" :key="item.approvalStep" :title="item.postName" :custom="item">
          <div slot="description">
            <div v-if="item.approvalType == 2 || item.approvalStatus">
              ({{ item.teacherName }})
            </div>
            <div v-else>
              <!--<p v-if="index === step - 1 && approver">-->
                <!--({{ nextApproverName }})-->
              <!--</p>-->

            </div>
            <!-- 审批状态 -->
            <div v-if="index <= step - 1 && item.approvalStatus">
              <p :class="[
                { statusYes: item.approvalStatus == 1 },
                { statusNo: item.approvalStatus == 2 },
                { statusWait: item.approvalStatus == 0 },
                  'status'
                ]"
              >
                {{ item.approvalStatus | statusFormat }}
              </p>
            </div>
          </div>
          <!-- 学生端只初始化第一步的审批人 index === 0 -->
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
              && index === 0
              && !props.data.approvalStatus"
            >
              <el-option
                v-for="item in approverList"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              >
              </el-option>
            </el-select>
            <div class="tip-box">
              <transition name="el-zoom-in-top">
                <span class="tip" v-if="hasError && index === 0">{{ error }}</span>
              </transition>
            </div>
          </div>
        </zjy-step>
      </zjy-steps>
    </div>
    <div class="zjy-footer" v-if="!hasFooter && hasStep && !footerRender">
      <template v-if="hasStep">
        <zjy-button type="plain" @click="$emit('update:visible', false)">{{noBtnText || $t('zjy.messagebox.cancel')}}</zjy-button>
        <zjy-button type="primary" @click="create">{{yesBtnText || $t('zjy.messagebox.confirm')}}</zjy-button>
      </template>
    </div>
    <slot name="footer" :data="data"></slot>

    <my-render v-if="footerRender" :renderFunc="footerRender" @create="create"></my-render>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ZjyButton from '@/components/button'
import {ZjyStep, ZjySteps} from '@/components/steps'

export default {
  name: 'student-process',
  data () {
    return {
      step: 1,                // 申请操作与查看操作分开，因此申请操作中的step总是1
      steps: [],              // 审批流程步骤
      approver: '',           // select v-model
      approverList: [],       // 下一步需要初始化的审批教师列表
      hasNextApprover: false, // 是否需要初始化第一步的教师列表
      nextApproverName: '',
      nextApproverId: '',

      error: ''
    }
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

  methods: {
    handleChange (val) {
      this.nextApproverId = val
      if (this.hasNextApprover) {
        this.nextApproverName = this.approverList.find(x => x.teacherId === val).teacherName
      }
      this.error = ''
    },

    create () {
      if (this.hasNextApprover && !this.approver) {
        this.error = this.$t('zjy.process.selectPlaceholder')
        return
      }

      if (this.hasNextApprover) {
        const _ = this.steps.find(x => x.approvalStep == this.step)
        if (_ && _.approvalType == 1) {
          _.teacherId = this.nextApproverId
          _.teacherName = this.nextApproverName
        }
      }
      this.$emit('submit', this.data, this.steps)
    }
  },

  props: {
    data: Object,
    value: Object,
    // 流程为空时提示
    empty: String,
    visible: Boolean,
    yesBtnText: String,
    noBtnText: String,

    footerRender: Function
  },
  components: {
    ZjyButton,
    ZjyStep,
    ZjySteps,

    MyRender: {
      props: {
        renderFunc: Function
      },
      methods: {
        create () {
          this.$emit('create')
        }
      },
      render (h) {
        let data = {
          on: {
            click: this.create
          }
        }
        return (
          this.renderFunc(h, data)
        )
      },
      components: {
        ZjyButton
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (this.$empty(val)) return

        this.approverList = val[+Object.keys(val).find(x => Number(x) == x)] || {}
        this.steps = val.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)
        // this.hasNextApprover = !this.$empty(this.approverList)
        this.hasNextApprover = !this.$empty(this.approverList) || this.value.swmsApprovals.find(x => x.approvalStep === this.step).approvalType === '1'
      }
    }
  }
}
</script>

<style scoped>
  .warning {
    color: #ED7734;
    text-align: center;
    font-weight: bold;
  }
  .tip-box {
    height: 20px;
    position: relative;
  }
</style>
