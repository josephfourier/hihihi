<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="保险名称" prop="insuranceName" class="block">
        <el-input v-model="formData.insuranceName" maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="保险公司" prop="insuranceCompany" class="inline">
        <el-input v-model="formData.insuranceCompany" maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="险种类别" prop="insuranceCategory" class="inline pull-right">
        <el-input v-model="formData.insuranceCategory" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="保险期限" prop="insuranceLimit" class="inline">
        <el-input v-model="formData.insuranceLimit" maxlength="5"></el-input>
      </el-form-item>
      <el-form-item label="保险费用" prop="insuranceCost" class="inline pull-right">
        <el-input v-model="formData.insuranceCost" maxlength="6"></el-input>
      </el-form-item>
      <el-form-item label="详细条款" prop="detailedTerms">
        <el-input type="textarea" v-model="formData.detailedTerms" :maxlength="5000"></el-input>
      </el-form-item>
      <el-form-item label="保险责任" prop="insuranceLiability">
        <el-input type="textarea" v-model="formData.insuranceLiability" :maxlength="5000"></el-input>
      </el-form-item>
      <el-form-item label="开放申请" prop="isOpen">
        <el-radio-group v-model="formData.isOpen">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="在线支付" prop="isPay">
        <el-radio-group v-model="formData.isPay">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="zjy-footer">
        <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
        <zjy-button type="primary" @click="submitForm('formData')">提交</zjy-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
import ZjyInput from '@/components/input'
import validator from '@/utils/validator'

export default {
  data () {
    const isInsuranceLimit = (rule, value, callback) => {
      if (!validator.isNumber(+value) || !/^\d{1,3}\.?\d?$/.test(value)) {
        return callback(new Error('请输入合法数字,如1.5'))
      } else if (+value > 999) {
        return callback(new Error('最大不能超过999'))
      }
      callback()
    }
    const isInsuranceCost = (rule, value, callback) => {
      if (!validator.isInteger(+value)) {
        return callback(new Error('请输入合法数字,如15'))
      }
      callback()
    }
    return {
      formData: {},
      rules: {
        insuranceName: [
          { required: true, message: '请输入保险名称', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        insuranceCompany: [
          { required: true, message: '请输入保险公司名称', trigger: 'change' }
        ],
        insuranceCategory: [
          { required: true, message: '请输入险种类别', trigger: 'change' }
        ],
        insuranceLimit: [
          { required: true, message: '请输入保险期限', trigger: 'change' },
          { validator: isInsuranceLimit, trigger: 'change' }
        ],
        insuranceCost: [
          { required: true, message: '请输入保险费用', trigger: 'change' },
          { validator: isInsuranceCost, trigger: 'change' }
        ],
        detailedTerms: [
          { required: true, message: '请输入详细条款', trigger: 'change' }
        ],
        insuranceLiability: [
          { required: true, message: '请输入保险责任', trigger: 'change' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开放申请', trigger: 'change' }
        ],
        isPay: [
          { required: true, message: '请选择是否开启在线支付', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          return false
        }
      })
    }
  },
  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    ZjyButton,
    ZjyInput
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.formData = {...val}
      }
    }
  }
}
</script>