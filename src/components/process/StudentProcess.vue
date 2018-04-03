<template>
  <div>
    <slot :formData="data"></slot>
    <p v-if="!hasStep && isApply">还未配置流程</p>
    <div class="zjy-steps" v-if="hasStep && isApply">
      <p>审批流程</p>
      <zjy-steps :active="step">

        <zjy-step title="发起人" :description="'(' + user.fullName + ')'">
        </zjy-step>
        <zjy-step v-for="(item, index) in steps" :key="item.approvalStep" :title="item.postName" :custom="item">
          <div slot="description">
            <div v-if="item.approvalType == 2 || item.approvalStatus">
              ({{ item.teacherName }})
            </div>
            <div v-else>
              <p v-if="index === step - 1 && approver">
                ({{ nextApproverName }})
              </p>

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
                ({{ item.approvalStatus | statusFormat }})
              </p>
            </div>
          </div>
          <!-- 学生端只初始化第一步的审批人 index === 0 -->
          <el-select
            class="zjy-select"
            v-model="approver"
            placeholder="请选择审批人"
            slot="custom"
            slot-scope="props"
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
        </zjy-step>
      </zjy-steps>
    </div>
    <div class="zjy-footer" v-if="!hasFooter">
      <template v-if="isApply && hasStep">
        <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
        <zjy-button type="primary" @click="create">确认</zjy-button>
      </template>
      <zjy-button v-if="isView" type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
    </div>
    <slot name="footer" :data="data"></slot>
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
      nextApproverId: ''
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
    isView () {
      return this.type === 1
    },
    isApply () {
      return this.type === 2
    }
  },

  methods: {
    handleChange (val) {
      this.nextApproverId = val
      if (this.hasNextApprover) {
        this.nextApproverName = this.approverList.find(x => x.teacherId === val).teacherName
      }
    },

    create () {
      if (this.hasNextApprover && !this.approver) {
        this.$alert('请填写审批人')
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
    type: {
      type: Number,
      default: 2
    },
    data: Object,
    value: Object,
    visible: Boolean
  },
  // type不是必须的这里只是针对保险设置（查看保险信息)0 查看 1编辑 2申请
  components: {
    ZjyButton,
    ZjyStep,
    ZjySteps
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (this.$empty(val)) return

        this.approverList = val[+Object.keys(val).find(x => Number(x) == x)] || {}
        this.steps = val.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)
        this.hasNextApprover = !this.$empty(this.approverList)
      }
    }
  }
}
</script>

<style scoped>

</style>
