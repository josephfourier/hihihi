<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="岗位名称" prop="worksettingUid" class="inline">

        <el-select v-model="formData.worksettingUid" @change="handleChange">
          <el-option
            v-for="item in settingList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="薪资:" class="inline pull-right">
        <el-input v-model="setting.salary" disabled></el-input>
      </el-form-item>

     <el-form-item label="学号:" prop="studentCode" class="inline is-required">
        <el-input v-model="formData.studentCode"></el-input>
        <a href="javascript:;" class="search-button" @click="query"></a>
      </el-form-item>

      <el-form-item label="院系" prop="facultyName" class="inline pull-right">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="申请时间" prop="applyDate" class="inline">
       <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="formData.applyDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="专业" prop="specialtyCode" class="inline pull-right">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="政治面貌" prop="specialtyCode" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="申请原因" prop="applyReason">
        <el-input type="textarea" v-model="formData.applyReason" :maxlength="1024"></el-input>
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
      if (!this.formData.worksettingUid) {
        this.doQuery = false
        return callback(new Error('请先选择岗位名称'))
      }
      if (!value) {
        this.doQuery = false
        return callback(new Error('请输入学号'))
      } else {
        if (!this.doQuery) return
        api.queryStudent(this.formData.worksettingUid, value).then(response => {
          if (response.code !== 1) {
            callback(new Error(response.data))
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
      settingList: [],
      setting: '',
      student: {},
      formData: {},
      rules: {
        studentCode: [
          { validator: checkStudent, trigger: 'change' },
          // { required: true, message: '请输入学生学号', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        worksettingUid: [
          { required: true, message: '请选择岗位名称', trigger: 'change' }
        ],

        applyDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择申请日期', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '请填写申请原因', trigger: 'change' }
        ]
      },
      optionsYears: [
        {
          label: '2017级',
          value: 2017
        },
        {
          label: '2018级',
          value: 2018
        }
      ]
    }
  },

  created () {
    api.querySettingList().then(response => {
      if (response.code !== 1) {
        MSG.success('获取岗位失败')
      } else {
        this.settingList = response.data.map(i => {
          return {
            label: i.postName,
            value: i.worksettingUid,
            salary: i.salary
          }
        })
      }
    })
  },

  methods: {
    handleChange (val) {
      this.setting = this.settingList.find(i => i.value === val)
    },

    query () {
      this.doQuery = true
      this.$refs.formData.validateField('studentCode')
    },

    submitForm (formName) {
      if (!this.formData.worksettingUid) {
        this.doQuery = false
        this.$refs.formData.validateField('worksettingUid')
        return
      }

      this.doQuery = true

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', {
            worksettingUid: this.formData.worksettingUid,
            applyDate: this.formData.applyDate,
            studentId: this.student.studentId,
            applyReason: this.formData.applyReason
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
  }
}
</script>

<style scoped>
  .el-input,.el-select {
    width: 215px;
  }
</style>
