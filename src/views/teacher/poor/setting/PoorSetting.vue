<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="申请学年" prop="applyYear" class="inline">
        <el-date-picker
          v-model="formData.applyYear"
          type="year"
          format="yyyy"
          :editable="false"
          value-format="yyyy"
          :clearable="false"
          placeholder="请选择"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="申请时间" required>
        <el-form-item prop="startDate" class="inline">
         <el-date-picker type="date" :editable="false"  placeholder="选择起始日期" value-format="timestamp" v-model="formData.startDate" style="width: 100%;"  :picker-options="startOption"></el-date-picker>
        </el-form-item>
        <span>至</span>
        <el-form-item prop="endDate" class="inline">
         <el-date-picker type="date" :editable="false" placeholder="选择结束日期" value-format="timestamp"  v-model="formData.endDate" style="width: 100%;" :picker-options="endOption"></el-date-picker>
        </el-form-item>
      </el-form-item>

      <el-form-item label="申请说明" prop="applyDescription">
        <el-input v-model="formData.applyDescription" type="textarea" :maxlength="1024"></el-input>
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
import api from './api'

export default {

  data () {
    const checkYear = (rule, value, callback) => {
      if (!this.formData.applyYear) return
      if (this.type === +this.$t('zjy.operator.EDIT') && this.ingore === this.formData.applyYear) {
        callback()
      }
      api.checkYear(this.formData.applyYear).then(response => {
        if (response.data) {
          callback(new Error('该学年已经添加,请重新选择'))
        } else {
          callback()
        }
      }).catch(error => {
        console.log(error)
      })
    }
    return {
      formData: {},
      ingore: '',
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
      rules: {
        applyYear: [
          { required: true, message: '请选择申请学年', trigger: 'blur' },
          { validator: checkYear, trigger: 'change' }
        ],
        applyDescription: [
          { required: true, whitespace: true, message: '请输入申请说明', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择起始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
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
    type: Number,
    visible: Boolean
  },
  components: {
    ZjyButton
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.formData = {...val}
        if (this.type === +this.$t('zjy.operator.EDIT')) {
          this.ingore = this.formData.applyYear
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
