<!-- 教师审批流程组件 -->
<template>
  <div>
    <slot :formData="data"></slot>
    <div v-if="!isFinished || reason">
      <p v-if="!hasStep"> {{ $t('zjy.process.none') }}</p>
      <div class="zjy-steps" v-else>
        <zjy-steps :active="step" align-center>
          <zjy-step :title="$t('zjy.process.start')" :description="'(' + data.studentName + ')'">
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
                  ({{ item.approvalStatus | statusFormat }})
                </p>
              </div>
            </div>

            <el-select
              class="zjy-select"
              v-model="approver"
              :placeholder="$t('zjy.process.selectPlaceholder')"
              slot="custom"
              slot-scope="props"
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
          </zjy-step>
        </zjy-steps>
      </div>
    </div>

    <div class="zjy-footer" v-if="!isFinished">
      <template v-if="!isApprovered">
        <zjy-button type="plain" @click="no">拒绝</zjy-button>
        <zjy-button type="primary" @click="yes">同意</zjy-button>
      </template>
      <zjy-button type="primary" v-else @click="submit">提交</zjy-button>
    </div>

    <div class="zjy-footer" v-if="isFinished && !reason">
      <zjy-button type="primary" @click="$emit('close')">关闭</zjy-button>
    </div>

    <el-dialog class="inner" width="30%" title="请输入拒绝原因" :visible.sync="innerVisible" append-to-body>
      <zjy-input type="textarea" v-model="reason"></zjy-input>
      <div class="zjy-footer">
        <zjy-button type="plain" @click="innerNo">拒 绝</zjy-button>
        <zjy-button type="primary" @click="innerYes">同 意</zjy-button>
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
      STATUS: {
        yes: '1',
        no: '2'
      },

      innerVisible: false
    }
  },

  props: {
    data: Object,
    value: Object
  },

  computed: {
    ...mapGetters(['user']),
    hasStep () {
      return this.steps.length > 0
    },
    hasFooter () {
      return this.$slots.footer
    },
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
        this.$alert('请输入拒绝原因')
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

    // clear () {
    //   this.reason = ''
    //   this.isFinished = false
    //   this.isApprovered = false
    // },

    submit () {
      if (this.hasNextApprover && !this.approver && !this.reason) {
        this.$alert('请选择下一步审批人')
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
      // manageAPI
      //   .submit(this.data.insuranceUid, this.data.inssettingUid, this.steps)
      //   .then(response => {
      //     if (response.code === 1) {
      //       this.$alert('保存成功')
      //     } else {
      //       this.$alert('保存失败')
      //     }
      //     // this.clear()
      //     this.$emit('submit', 1)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
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
    }

  }
}
</script>
<style lang='scss' scoped>

  /*.status {*/
    /*> span,*/
    /*> img {*/
      /*vertical-align: middle;*/
    /*}*/
    /*margin-bottom: 10px;*/
  /*}*/

  /*.details {*/
    /*padding: 20px;*/
    /*background-color: #f5f5f5;*/
    /*.title {*/
      /*color: #333333;*/
      /*font-weight: bold;*/
    /*}*/
    /*margin-bottom: 15px;*/
  /*}*/
</style>
