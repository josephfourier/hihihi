<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="保险名称" prop="insuranceName">
        <el-input v-model="formData.insuranceName"></el-input>
      </el-form-item>
      <el-form-item label="保险公司" prop="insuranceCompany" class="inline">
        <el-input v-model="formData.insuranceCompany"></el-input>
      </el-form-item>
      <el-form-item label="险种类别" prop="insuranceCategory" class="inline pull-right">
        <el-input v-model="formData.insuranceCategory"></el-input>
      </el-form-item>
      <el-form-item label="保险期限" prop="insuranceLimit" class="inline">
        <el-input v-model="formData.insuranceLimit"></el-input>
      </el-form-item>
      <el-form-item label="保险费用" prop="insuranceCost" class="inline pull-right">
        <el-input v-model="formData.insuranceCost"></el-input>
      </el-form-item>
      <el-form-item label="详细条款" prop="detailedTerms">
        <el-input type="textarea" v-model="formData.detailedTerms"></el-input>
      </el-form-item>
      <el-form-item label="保险责任" prop="insuranceLiability">
        <el-input type="textarea" v-model="formData.insuranceLiability"></el-input>
      </el-form-item>
      <el-form-item label="开放申请">
        <el-radio-group v-model="formData.isOpen">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="在线支付">
        <el-radio-group v-model="formData.isPay">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="zjy-footer">
        <zjy-button type="plain" @click="$emit('closed', 1)">取消</zjy-button>
        <zjy-button type="primary" @click="submitForm('formData')">提交</zjy-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import insuranceAPI from '@/api/teacher/insurance/setting'
import ZjyButton from '@/components/button'

export default {
  data () {
    var isNumber = (rule, value, callback) => {
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      callback()
    }
    return {

      rules: {
        insuranceName: [
          { required: true, message: '请输入保险名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        insuranceCompany: [
          { required: true, message: '请输入保险公司名称', trigger: 'blur' }
        ],
        insuranceCategory: [
          { required: true, message: '请输入险种类别', trigger: 'blur' }
        ],
        insuranceLimit: [
          { required: true, message: '请输入保险期限', trigger: 'blur' }
        ],
        insuranceCost: [
          { required: true, message: '请输入保险费用', trigger: 'blur' },
          { validator: isNumber, trigger: 'blur' }
        ],
        detailedTerms: [
          { required: true, message: '请输入详细条款', trigger: 'blur' }
        ],
        insuranceLiability: [
          { required: true, message: '请输入保险责任', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === 1) {
            insuranceAPI.update(this.formData.inssettingUid, this.formData).then(response => {
              if (response.code === 1) {
                MSG.success('修改成功')
                this.$emit('closed', 1)
              }
            })
          } else {
            insuranceAPI.create(this.formData).then(response => {
              if (response.code === 1) {
                MSG.success('新增成功')
                this.$emit('closed', 1)
              }
            })
          }
        } else {
          return false
        }
      })
    }
  },
  props: {
    formData: Object,
    type: Number
  },
  components: {
    ZjyButton
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.inline {
  .el-input {
    width: 250px;
  }
}
</style>
