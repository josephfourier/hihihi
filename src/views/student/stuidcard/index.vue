<!-- 学生证补办 学生 -->
<template>
  <div class="stuidcard" v-loading="fullscreenLoading">
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
        <zjy-input type="textarea" v-model="reissued.applyReason" :disabled="!isCompleted && step !== 1"></zjy-input>
      </div>
    </div>
    <div v-if="steps.length !== 0">
      <div class="zjy-steps">
        <p>申请流程配置</p>
        <zjy-steps :active="step" :space="130">
          <zjy-step title="发起人" :description="'(' + student.studentName + ')'" v-if="steps.length !== 0">
          </zjy-step>
          <zjy-step v-for="(item,index) in steps" :key="item.approvalStep" :title="item.postName" :custom="item">
            <div slot="description">
              <div v-if="item.approvalType == 2 || item.approvalStatus">
                ({{ item.teacherName }})
              </div>
              <div v-else>
                <!-- 当前流程动态绑定 -->
                <p v-if="index === step - 1 && value">
                  ({{ nextTeacherName }})
                </p>
                <!-- 其它只绑定一次,也可以不绑定(还未选择教师) -->
                <!-- <span v-else v-once>({{ value }})</span> -->
              </div>
              <!--  -->
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
            <!-- 只初始化当前流程的教师列表 (index === step - 1) -->
            <!-- 对于学生只初始化第一步 (index = 0) -->
            <!-- 若存在流程状态属性则不初始化 (approvalStatus)-->
            <el-select class="zjy-select" v-model="value" placeholder="请选择审批人" slot="custom" slot-scope="props" ref="sl"
                       @change="handleChange"
                       v-if="props.data.approvalType == 1 && index === 0 && !props.data.approvalStatus">
              <el-option v-for="item in approverList" :key="item.teacherId" :label="item.teacherName"
                         :value="item.teacherId">
              </el-option>
            </el-select>
          </zjy-step>
        </zjy-steps>
      </div>

      <div class="zjy-btn-group">
        <zjy-button v-if="!isCompleted" :type="reissued.stuidcardUid ? 'plain' : 'primary'"
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
import axios from 'axios'
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
      isCompleted: false,
      isReapplyed: false,
      empty: '流程加载中...',
      fullscreenLoading: false
    }
  },

  methods: {
    submit () {
      if (!this.reissued.applyReason) {
        this.$alert('请填写申请原因')
        return
      }
      if (!this.value && this.approverList) {
        this.$alert('请填写审批人')
        return
      }

      this.fullscreenLoading = true

      const _ = this.steps.find(x => x.approvalStep == this.step)
      if (_ && _.approvalType == 1) {
        _.teacherId = this.nextTeacherId
        _.teacherName = this.nextTeacherName
      }

      cardAPI
        .create(this.reissued, this.steps)
        .then(response => {
          const msg = response.code === 1 ? '保存成功' : response.message
          this.fullscreenLoading = false
          this.$alert(msg)

          this.refresh()
        })
        .catch(error => {
          console.log(error)
          this.fullscreenLoading = true
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
      cardAPI
        .queryInitial(getPermissionId(this.$route))
        .then(response => {
          this.steps = response.data.swmsApprovals.sort(
            (x, y) => x.approvalStep - y.approvalStep
          )
          this.step = 1
          this.approverList =
              response.data[
                Object.keys(response.data).filter(x => Number(x) == x)
              ]
        })
        .catch(error => {
          console.log(error)
        })
    },

    clear () {
      this.reissued = {}
      this.step = 1
      this.value = ''
      this.isCompleted = false
    },

    refresh () {
      cardAPI
        .queryReissued()
        .then(response => {
          this.reissued = response.data.swmsStuidcard
          cardAPI
            .queryApprovalProcess(
              this.student.studentId,
              this.reissued.stuidcardUid
            )
            .then(response => {
              this.steps = response.data.swmsApprovals.sort(
                (x, y) => x.approvalStep - y.approvalStep
              )
              // 获取流程进度,取审批状态为0(未审批)的步骤序号
              try {
                this.step = this.steps.find(
                  x => x.approvalStatus == 0
                ).approvalStep
              } catch (e) {
                const _ = this.steps.find(x => x.approvalStatus == 2)
                if (_) {
                  this.step = _.approvalStep
                } else {
                  this.step = this.steps.length + 1
                }
                this.isCompleted = true
              }
              this.isCompleted =
                  this.steps.every(
                    x => x.approvalStatus && x.approvalStatus == 1
                  ) ||
                  this.steps.some(x => x.approvalStatus && x.approvalStatus == 2)
            })
            .catch(error => {
            })
        })
        .catch(error => {
          console.log(error)
        })
    },

    handleChange (val) {
      this.nextTeacherId = val
      if (!this.$empty(this.approverList)) {
        this.nextTeacherName = this.approverList.find(
          x => x.teacherId === val
        ).teacherName
      }
    }
  },

  computed: {},

  components: {
    ZjyInput,
    ZjyButton,
    ZjyStep,
    ZjySteps
  },

  created () {
    this.fullscreenLoading = true
    cardAPI.queryReissued().then(response => {
      this.fullscreenLoading = false
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
            this.empty = '还未配置流程'
            return
          }

          this.steps = response.data.swmsApprovals.sort((x, y) => x.approvalStep - y.approvalStep)

          this.step = 1

          // 如果第一步是职务则初始化教师信息
          this.approverList =
                  response.data[Object.keys(response.data).filter(x => Number(x) == x)]
          this.isCompleted = false
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
            this.step = this.steps.find(
              x => x.approvalStatus == 0
            ).approvalStep
          } catch (e) {
            const _ = this.steps.find(x => x.approvalStatus == 2)
            if (_) {
              this.step = _.approvalStep
            } else { this.step = this.steps.length + 1 }
            this.isCompleted = true
          }
          this.isCompleted = this.steps.every(x => x.approvalStatus && x.approvalStatus == 1) || this.steps.some(x => x.approvalStatus && x.approvalStatus == 2)
        }).catch(error => {
        })
      }
    }).catch(error => {
      console.log(error)
      this.fullscreenLoading = false
    })
  },

  watch: {}
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
        span {
          margin-bottom: 10px;
        }
        .zjy-textarea {
          margin-left: 10px;
          height: 110px;
        }
      }
    }
    .zjy-input {
      width: 180px;
      font-size: 12px;
    }
  }

  .zjy-steps {
    width: 1129px;
    overflow: auto;
    margin-top: 20px;
    padding-bottom: 10px;
    p {
      margin-left: 10px;
      margin-bottom: 10px;
    }
  }

  .zjy-btn-group {
    padding: 50px 0;
    text-align: center;
  }

  .el-select.zjy-select {
    .el-input__inner,
    .el-input__inner:focus {
      border-color: #ed7734 !important;
      color: #ed7734;
      // width: 140px;
    }
  }

  .el-select .el-input .el-select__caret {
    color: #ed7734;
  }

  .el-select-dropdown.el-popper {
    .el-select-dropdown__item {
      font-size: 12px;
      height: 24px;
      line-height: 24px;

      &.selected {
        color: #37c6d4;
      }
    }

    .el-select-dropdown__item span {
      line-height: 24px !important;
    }
  }

  .el-step__title {
    font-size: 16px;
    line-height: 24px;
    margin: 5px 0 0 0;
  }

</style>
