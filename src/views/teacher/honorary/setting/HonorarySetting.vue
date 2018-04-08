<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
      <el-form-item label="荣誉称号名称" prop="honoraryName">
        <el-input v-model="formData.honoraryName"></el-input>
      </el-form-item>

      <el-form-item label="荣誉称号类别" prop="honoraryCategory" class="inline">
        <el-select v-model="formData.honoraryCategory">
          <el-option
            v-for="item in optionsHonoraryCategory"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >{{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名额限制" prop="numberLimit" class="inline pull-right">
        <el-input v-model="formData.numberLimit"></el-input>
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

      <el-form-item label="荣誉称号简介" prop="honoraryIntroduction">
        <el-input type="textarea" v-model="formData.honoraryIntroduction"></el-input>
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

export default {
  name: 'honorary-setting',
  data () {
    return {
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
      optionsHonoraryCategory: [
        {
          label: '院级',
          value: '1'
        },
        {
          label: '班级',
          value: '2'
        },
        {
          label: '个人',
          value: '3'
        }
      ],
      rules: {
        honoraryName: [
          { required: true, message: '请输入荣誉称号名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        honoraryCategory: [
          { required: true, message: '请选择荣誉称号类别', trigger: 'change' }
        ],

        numberLimit: [
          { required: true, message: '请输入名额限制', trigger: 'blur' }
        ],

        honoraryIntroduction: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择起始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
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

  props: {
    formData: Object,
    visible: Boolean
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped>

</style>
