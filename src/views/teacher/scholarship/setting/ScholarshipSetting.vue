<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
      <el-form-item label="奖学金名称" prop="scholarshipName" class="block">
        <el-input v-model="formData.scholarshipName"></el-input>
      </el-form-item>
      <el-form-item label="奖学金级别" prop="scholarshipLevel" class="inline">
        <el-input v-model="formData.scholarshipLevel"></el-input>
      </el-form-item>
      <el-form-item label="名额限制" prop="numberLimit" class="inline pull-right">
        <el-input v-model="formData.numberLimit"></el-input>
      </el-form-item>
      <el-form-item label="发放方式" prop="grantWay" class="inline">

        <el-select v-model="formData.grantWay">
          <el-option
            v-for="item in optionsWays"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="发放对象" prop="grantObject" class="inline pull-right">
        <el-input v-model="formData.grantObject"></el-input>
      </el-form-item>
      <el-form-item label="资金来源" prop="fundsSource" class="inline">
        <el-input type="input" v-model="formData.fundsSource"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="money" class="inline pull-right">
        <el-input type="input" v-model="formData.money"></el-input>
      </el-form-item>
      <el-form-item label="申请时间" required>
          <el-form-item prop="startDate" class="inline">
            <el-date-picker type="date" placeholder="选择起始日期" value-format="timestamp" v-model="formData.startDate" style="width: 100%;"  :picker-options="startOption"></el-date-picker>
          </el-form-item>
          <span>至</span>
          <el-form-item prop="endDate" class="inline">
            <el-date-picker type="date" placeholder="选择结束日期" value-format="timestamp"  v-model="formData.endDate" style="width: 100%;" :picker-options="endOption"></el-date-picker>
          </el-form-item>
      </el-form-item>
      <el-form-item label="申请说明" prop="description">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="开放申请" prop="isOpen">
        <el-radio-group v-model="formData.isOpen">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
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
import commonAPI from '@/api/common'

export default {
  name: 'scholarship-setting',
  data () {
    var isNumber = (rule, value, callback) => {
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      callback()
    }
    // 两种方式 1 以禁用方式 2 以触发验证方式 使用方式1
    var validateStartDate = (rule, value, callback) => {
      if (!value || value === '') callback(new Error('请选择申请起始时间'))
      else {
        if (this.formData.endDate !== '') {
          this.$refs.formData.validateField('endDate')
        }
      }
      callback()
    }
    var validateEndDate = (rule, value, callback) => {
      if (!value || value === '') callback(new Error('请选择申请结束时间'))
      else {
        if (value < this.formData.startDate) {
          return callback(new Error('结束时间不能小于起始时间'))
        }
      }
      callback()
    }
    return {
      formData: {},
      startOption: {
        disabledDate: (time) => {
          const endDate = this.formData.endDate
          if (endDate) { return time > endDate }
          return false
        }
      },
      endOption: {
        disabledDate: (time) => {
          const startDate = this.formData.startDate
          if (startDate) { return time < startDate }
          return false
        }
      },
      optionsWays: [],
      rules: {
        scholarshipName: [
          { required: true, message: '请输入奖学金名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        grantWay: [
          { required: true, message: '请选择发放方式', trigger: 'change' }
        ],
        insuranceCategory: [
          { required: true, message: '请输入险种类别', trigger: 'blur' }
        ],
        numberLimit: [
          { required: true, message: '请输入名额限制', trigger: 'blur' }
        ],
        grantObject: [
          { required: true, message: '请输入发放对象', trigger: 'blur' }
        ],
        fundsSource: [
          { required: true, message: '请输入资金来源', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        startDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择起始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
          // { validator: validateEndDate, trigger: 'blur' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开放', trigger: 'change' }

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

  created () {
    commonAPI.queryGrantWay().then(response => {
      this.optionsWays = response.data.map(i => {
        return {
          label: i.valueName,
          value: i.valueKey
        }
      })
    }).catch(error => {
      console.warn('get way error -> ' + error)
    })
  },

  props: {
    data: Object,
    type: Number,
    visible: Boolean
  },
  components: {
    ZjyButton
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.formData = {...val}
      }
    }
  }
}
</script>

<style scoped>

</style>
