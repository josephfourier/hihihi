<!-- 学生证补办 学生 -->
<template>
  <div class="stuidcard" v-loading="loading">
    <div class="zjy-form">
      <div class="form-item">
        <span>学号:</span>
        <zjy-input disabled :value="student.studentCode"></zjy-input>
      </div>
      <div class="form-item">
        <span>学生姓名:</span>
        <zjy-input disabled :value="student.studentName"></zjy-input>
      </div>
      <div class="form-item">
        <span>年级:</span>
        <zjy-input disabled :value="student.className"></zjy-input>
      </div>
      <div class="form-item">
        <span>院系:</span>
        <zjy-input disabled :value="student.facultyName"></zjy-input>
      </div>
      <div class="form-item">
        <span>专业:</span>
        <zjy-input disabled :value="student.specialtyName"></zjy-input>
      </div>
      <div class="form-item">
        <span>班级:</span>
        <zjy-input disabled :value="student.className"></zjy-input>
      </div>
      <div class="form-item" v-if="reissued.applyDate">
        <span>申请日期:</span>
        <zjy-input disabled :value="reissued.applyDate | dateFormat"></zjy-input>
      </div>
      <div class="form-item block">
        <span>申请原因:</span>
        <zjy-input type="textarea" v-model="reissued.applyReason" :disabled="!isFinished && step !== 1"></zjy-input>
      </div>
      <div class="tip-box">
        <transition name="el-zoom-in-top">
          <span class="tip" v-if="hasError && !this.reissued.applyReason">{{ error }}</span>
        </transition>
      </div>
    </div>
    <div v-if="steps.length !== 0">
      <div class="zjy-steps">
        <p class="step-title">申请流程配置</p>
        <zjy-steps :active="step" align-center>
          <zjy-step title="发起人" :description="'(' + student.studentName + ')'" v-if="steps.length !== 0">
          </zjy-step>
          <zjy-step v-for="(item,index) in steps" :key="item.approvalStep" :title="item.postName" :custom="item">
            <div slot="description">
              <div v-if="item.approvalType == 2 || item.approvalStatus">
                ({{ item.teacherName }})
              </div>
              <!--<div v-else>-->
                <!--<p v-if="index === step - 1 && value">-->
                  <!--({{ nextTeacherName }})-->
                <!--</p>-->
              <!--</div>-->
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

            <div
              class="validate"
              slot="custom"
              slot-scope="props"
            >
              <el-select
                class="zjy-select"
                v-model="value"
                placeholder="请选择审批人"
                @change="handleChange"
                v-if="props.data.approvalType == 1
                && index === 0
                && !props.data.approvalStatus"
              >
                <el-option v-for="item in approverList" :key="item.teacherId" :label="item.teacherName"
                           :value="item.teacherId">
                </el-option>
              </el-select>
              <div class="tip-box">
                <transition name="el-zoom-in-top">
                  <span class="tip" v-if="hasError2 && index === 0">{{ error2 }}</span>
                </transition>
              </div>
            </div>
          </zjy-step>
        </zjy-steps>
      </div>

      <div class="zjy-btn-group">
        <zjy-button v-if="!isFinished" :type="reissued.stuidcardUid ? 'plain' : 'primary'"
                    :disabled="!!reissued.stuidcardUid" @click="submit">
          <template v-if="reissued.stuidcardUid">申请审核中</template>
          <template v-else>申请</template>
        </zjy-button>

        <zjy-button v-else type="primary" @click="reSubmit">重新申请</zjy-button>
      </div>
    </div>
    <div v-else>
      {{ empty }}
    </div>
  </div>
</template>

<script>
import cardAPI from '@/api/student/stuidcard'
import ZjyInput from '@/components/input'
import ZjyButton from '@/components/button'
import {ZjyStep, ZjySteps} from '@/components/steps'

import {getPermissionId} from '@/utils'

export default {
  data () {
    return {
      reissued: {}, // 补办信息
      student: {}, // 学生信息
      step: 1, // 进行中的流程步骤
      approverList: {}, // 审批人员
      steps: [], // 流程模板数据
      value: '',
      nextTeacherName: '',
      nextTeacherId: '',
      isFinished: false,
      isReapplyed: false,
      empty: this.$t('zjy.process.loading'),
      loading: false,
      error: '',
      error2: ''
    }
  },

  methods: {
    submit () {
      if (!this.reissued.applyReason) {
        this.error = '请填写申请原因'
        return
      }
      if (!this.value && this.approverList) {
        this.error2 = this.$t('zjy.process.selectPlaceholder')
        return
      }

      this.loading = true

      const _ = this.steps.find(x => x.approvalStep == this.step)
      if (_ && _.approvalType == 1) {
        _.teacherId = this.nextTeacherId
        _.teacherName = this.nextTeacherName
      }

      cardAPI.create(this.reissued, this.steps).then(response => {
        const msg = response.code === 1 ? '保存成功' : response.message
        this.loading = false
        MSG.success(msg)
        this.refresh()
      }).catch(error => {
        console.log(error)
        this.loading = true
      })
    },

    reSubmit () {
      this.isReapplyed = true
      this.clear()
      this.reissued = {
        studentId: this.student.studentId || '',
        applyReason: ''
      }
      // 查询初始流程信息
      cardAPI.queryInitial(getPermissionId(this.$route)).then(response => {
        this.steps = response.data.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)
        this.step = 1
        this.approverList = response.data[Object.keys(response.data).filter(x => Number(x) == x)]
      }).catch(error => {
        console.log(error)
      })
    },

    clear () {
      this.reissued = {}
      this.step = 1
      this.value = ''
      this.isFinished = false
    },

    refresh () {
      cardAPI.queryReissued().then(response => {
        this.reissued = response.data.swmsStuidcard
        cardAPI.queryApprovalProcess(this.student.studentId, this.reissued.stuidcardUid).then(response => {
          this.steps = response.data.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)
          try {
            this.step = this.steps.find(x => x.approvalStatus == 0).approvalStep
          } catch (e) {
            const _ = this.steps.find(x => x.approvalStatus == 2)
            if (_) {
              this.step = _.approvalStep
            } else {
              this.step = this.steps.length + 1
            }
            this.isFinished = true
          }
          this.isFinished = this.steps.every(x => x.approvalStatus && x.approvalStatus == 1) || this.steps.some(x => x.approvalStatus && x.approvalStatus == 2)
        }).catch(error => {
        })
      }).catch(error => {
        console.log(error)
      })
    },

    handleChange (val) {
      this.nextTeacherId = val
      if (!this.$empty(this.approverList)) {
        this.nextTeacherName = this.approverList.find(x => x.teacherId === val).teacherName
      }
      this.error2 = ''
    }
  },

  computed: {
    hasError () {
      return !!this.error
    },
    hasError2 () {
      return !!this.error2
    }
  },

  components: {
    ZjyInput,
    ZjyButton,
    ZjyStep,
    ZjySteps
  },

  created () {
    this.loading = true
    cardAPI.queryReissued().then(response => {
      this.loading = false
      this.student = response.data.ucenterStudent
      // 未曾申请过补办
      if (!response.data.swmsStuidcard) {
        this.reissued = {
          studentId: this.student.studentId || '',
          applyReason: ''
        }
        // 查询初始流程信息
        cardAPI.queryInitial(getPermissionId(this.$route)).then(response => {
          if (!response.data.swmsApprovals) {
            this.empty = this.$t('zjy.process.none')
            return
          }

          this.steps = response.data.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)

          this.step = 1

          // 如果第一步是职务则初始化教师信息
          this.approverList = response.data[Object.keys(response.data).filter(x => Number(x) == x)]
          this.isFinished = false
        }).catch(error => {
          console.log(error)
        })
      } else {
        // 否则查询流程进度
        this.reissued = response.data.swmsStuidcard
        cardAPI.queryApprovalProcess(this.student.studentId, this.reissued.stuidcardUid).then(response => {
          this.steps = response.data.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)
          // 获取流程进度,取审批状态为0(未审批)的步骤序号
          try {
            this.step = this.steps.find(x => x.approvalStatus == 0).approvalStep
          } catch (e) {
            const _ = this.steps.find(x => x.approvalStatus == 2)
            if (_) {
              this.step = _.approvalStep
            } else { this.step = this.steps.length + 1 }
            this.isFinished = true
          }
          this.isFinished = this.steps.every(x => x.approvalStatus && x.approvalStatus == 1) || this.steps.some(x => x.approvalStatus && x.approvalStatus == 2)
        }).catch(error => {
        })
      }
    }).catch(error => {
      console.log(error)
      this.loading = false
    })
  }
}
</script>
<style lang='scss' scoped>
  .stuidcard {
    font-size: 12px;
    color: #333333;
    padding: 20px;
  }

  .zjy-form {
    .form-item {
      margin-right: 30px;
      margin-bottom: 10px;
      > span {
        width: 60px;
        display: inline-block;
        text-align: right;
      }
      &.block {
        display: block;
        margin-bottom: 0;
        span {
          margin-bottom: 10px;
          margin-top: 10px;
          text-align: left;
          color: #333333;
          font-weight: bold;
        }
        .zjy-textarea {
          height: 100px;
        }
      }
    }
    .zjy-input {
      width: 180px;
      font-size: 12px;
    }
  }

  .zjy-btn-group {
    padding: 50px 0;
    text-align: center;
  }

</style>
