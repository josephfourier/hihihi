<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="困难补助名称" prop="allsettingUid" class="inline">

        <el-select v-model="formData.allsettingUid" @change="handleChange">
          <el-option
            v-for="item in settingList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发放方式" class="inline pull-right">
        <el-input :value="setting.grantWay | scholarshipGrantWayFormat" disabled></el-input>
      </el-form-item>

     <el-form-item label="学号:" prop="studentCode" class="inline is-required">
        <el-input v-model="formData.studentCode"></el-input>
        <a href="javascript:;" class="search-button" @click="query"></a>
      </el-form-item>

      <el-form-item label="金额:" class="inline pull-right">
        <el-input v-model="setting.money" disabled></el-input>
      </el-form-item>

    <el-form-item label="入学年份" prop="enterYear" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="申请时间" prop="applyDate" class="inline pull-right">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.applyDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="院系" prop="factoryCode" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="specialtyCode" class="inline pull-right">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="政治面貌" prop="specialtyCode" class="inline">
        <el-input v-model="student.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="申请原因" prop="applyReason">
        <el-input type="textarea" v-model="formData.applyReason"></el-input>
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
      if (!this.formData.allsettingUid) {
        this.doQuery = false
        return callback(new Error('请先选择困难补助名称'))
      }
      if (!value) {
        this.doQuery = false
        return callback(new Error('请输入学号'))
      } else {
        if (!this.doQuery) return
        api.queryStudent(this.formData.allsettingUid, value).then(response => {
          if (response.code !== 1) {
            callback(new Error(response.message))
          } else {
            // 修改
            // 返回无学生实体无法填充其它信息
            // 获取不到studentId无法进行下一步
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
        allsettingUid: [
          { required: true, message: '请选择困难补助', trigger: 'change' }
        ],

        applyDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择申请日期', trigger: 'blur' }
        ],
        applyReason: [
          { required: true, message: '请填写申请原因', trigger: 'blur' }
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
        MSG.success('获取困难补助失败')
      } else {
        this.settingList = response.data.map(i => {
          return {
            label: i.allowanceName,
            value: i.allsettingUid,
            grantWay: i.grantWay,
            money: i.money
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
      if (!this.formData.allsettingUid) {
        this.doQuery = false
        this.$refs.formData.validateField('allsettingUid')
        return
      }

      this.doQuery = true

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', {
            allsettingUid: this.formData.allsettingUid,
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
