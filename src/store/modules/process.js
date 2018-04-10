const state = {
  step: 1,                // 申请操作与查看操作分开，因此申请操作中的step总是1
  steps: [],              // 审批流程步骤
  approver: '',           // select v-model
  approverList: [],       // 下一步需要初始化的审批教师列表
  hasNextApprover: false, // 是否需要初始化第一步的教师列表
  nextApproverName: '',
  nextApproverId: '',
  error: ''
}

export default {
  state
}
