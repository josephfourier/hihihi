<!-- 教师新增学生荣誉称号 -->
<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="荣誉称号类别" class="inline">
        <el-select v-model="type" disabled>
          <el-option label="个人" value="3">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="荣誉称号名称" prop="honorarysettingUid" class="inline pull-right">
        <el-select v-model="formData.honorarysettingUid">
          <el-option
            v-for="item in nameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请人学号:" prop="studentCode" class="inline">
        <el-input v-model="formData.studentCode"></el-input>
        <a href="javascript:;" class="search-button" @click="query"></a>
      </el-form-item>

      <el-form-item label="申请时间" prop="applyDate" class="inline pull-right">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.applyDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="入学年份" prop="enterYear" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="factoryCode" class="inline pull-right">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="specialtyCode" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="政治面貌" prop="specialtyCode" class="inline pull-right">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="申请原因" prop="applyReson">
        <el-input type="textarea" v-model="formData.applyReson"></el-input>
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
    const checkStudent = (rule, value, callback) => {
      if (!this.formData.honorarysettingUid) {
        this.doQuery = false
        return callback(new Error('请先选择荣誉称号名称'))
      }
      if (!value) {
        this.doQuery = false
        return callback(new Error('请输入学生学号'))
      } else {
        if (!this.doQuery) return
        // 查询是否已经申请过该类别的奖学金
        api.queryStudent(value, this.formData.honorarysettingUid).then(response => {
          if (response.code !== 1) {
            callback(new Error(response.message))
          } else {
            this.student = response.data
            callback()
          }
          this.doQuery = false
        }).catch(error => {
          console.log(error)
        })
      }
    }

    return {
      doQuery: false,

      nameList: [],
      student: {},
      type: '个人',
      formData: {},
      rules: {
        studentCode: [
          { required: true, message: '请输入学生学号', trigger: 'blur' },
          { validator: checkStudent, trigger: 'change' }
        ],
        honorarysettingUid: [
          { required: true, message: '请选择荣誉称号名称', trigger: 'change' }
        ],

        applyDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择申请日期', trigger: 'blur' }
        ],
        applyReson: [
          { required: true, message: '请填写申请原因', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    api.queryNameByTyep(3).then(response => {
      this.nameList = response.data.map(i => {
        return {
          label: i.honoraryName,
          value: i.honorarysettingUid
        }
      })
    })
  },

  methods: {

    query () {
      this.doQuery = true
      this.$refs.formData.validateField('studentCode')
    },

    submitForm (formName) {
      if (!this.formData.honorarysettingUid) {
        this.doQuery = false
        this.$refs.formData.validateField('honorarysettingUid')
        return
      }

      this.doQuery = true

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData.honorarysettingUid, {
            studentId: this.student.studentId,
            applyReson: this.formData.applyReson
          })
        } else {
          return false
        }
      })
    }
  },
  computed: {
  },
  props: {
    visible: Boolean
  },
  components: {
    ZjyButton
  },
  watch: {

  }
}
</script>

<style scoped>

</style>
