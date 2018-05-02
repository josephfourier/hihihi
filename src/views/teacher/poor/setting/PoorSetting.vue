<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="申请学年" prop="applyYear" class="inline">
        <el-select v-model="formData.applyYear" :disabled="isEdit">
          <el-option
            v-for="item in optionsYears"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >{{ item.label }}
          </el-option>
        </el-select>
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
      if (this.isEdit) callback()

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
      optionsYears: [
        {
          label: '2017年',
          value: 2017
        },
        {
          label: '2018年',
          value: 2018
        },
        {
          label: '2019年',
          value: 2019
        }
      ],
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
          { required: true, message: '请输入申请说明', trigger: 'change' }
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

  computed: {
    isEdit () {
      return this.type === +this.$t('zjy.operator.EDIT')
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
      }
    }
  }
}
</script>

<style scoped>

</style>
