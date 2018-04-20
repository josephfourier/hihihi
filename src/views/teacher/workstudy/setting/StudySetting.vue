<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
      <el-form-item label="岗位名称" prop="postName" class="block">
        <el-input v-model="formData.postName"></el-input>
      </el-form-item>

       <el-form-item label="要求专业" prop="specialtyId" class="inline">
        <el-select v-model="formData.specialtyId">
          <el-option
            v-for="item in specialtyList"
            :key="item.specialtyId"
            :label="item.specialtyName"
            :value="item.specialtyId"
          >{{ item.specialtyName }}
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="名额限制" prop="numberLimit" class="inline pull-right">
        <el-input v-model="formData.numberLimit"></el-input>
      </el-form-item>

       <el-form-item label="薪资待遇" prop="salary" class="inline block">
        <el-input v-model="formData.salary"></el-input>
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
import { mapGetters } from 'vuex'

export default {
  name: 'study-setting',
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
      rules: {
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        specialtyId: [
          { required: true, message: '请选择专业要求', trigger: 'change' }
        ],
     
        numberLimit: [
          { required: true, message: '请输入名额限制', trigger: 'blur' }
        ],

        salary: [
          { required: true, message: '请输入薪资待遇', trigger: 'blur' }
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

  computed: {
    ...mapGetters(['specialtyList'])
  },

  created() {
    this.$store.dispatch('setSpecialtyList')
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
