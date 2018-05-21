<template>
  <div class="process">
    <div v-if="data.dataStatus === '5'" class="status">
      <img src="./ic_money.png" alt="待付款">
      <span class="status-text">{{ data.dataStatusName }}</span>
    </div>
    <div v-if="data.dataStatus === '4'" class="status">
      <img src="./ic_wait.png" alt="待确认">
      <span class="status-text">{{ data.dataStatusName }}</span>
    </div>
    <table class="process-table">
      <tr>
        <td>保险名称：{{ data.insuranceName }}</td>
        <td>保险公司：{{ data.insuranceCompany }}</td>
        <td>险种类别：{{ data.insuranceCategory }}</td>
      </tr>
      <tr>
        <td>保险费用：{{ data.insuranceCost }}元</td>
        <td>保险期限：{{ data.insuranceLimit }}</td>
        <td>保险状态：{{ data.dataStatusName || '未申请' }}</td>
      </tr>
    </table>
    <div class="process-item detail">
      <p class="process-item__title">详细条款</p>
      <div class="process-item__content">{{ data.detailedTerms }}</div>
    </div>

    <div class="process-item detail">
      <p class="process-item__title">保险责任</p>
      <div class="process-item__content">{{ data.insuranceLiability }}</div>
    </div>

    <div class="zjy-form" v-if="data.dataStatus === '4'">
      <el-form :model="data" :rules="rules" ref="formData" label-width="80px">
        <el-form-item label="是否开通" prop="isDredge">
          <el-radio-group v-model="data.isDredge">
            <el-radio label="1">开通</el-radio>
            <el-radio label="0">不开通</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="zjy-footer">
          <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
          <zjy-button type="primary" @click="submitForm('formData')">提交</zjy-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
export default {
  name: 'view-apply',
  data () {
    return {
      rules: {

        isDredge: [
          { required: true, message: '请选择是否开通', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    data: Object,
    visible: Boolean
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.data)
        } else {
          return false
        }
      })
    }
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding: 20px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
 .process-item__content {
   font-size: 12px;
 }
}
.status {
  margin-bottom: 10px;
}
.status-text {
  color: #ef7727;
  font-size: 16px;
  vertical-align: top;
  position: relative;
  top: 6px;
  left: 2px;
}
</style>
