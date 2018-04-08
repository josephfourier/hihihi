<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="奖学金名称" prop="scholarshipsettingUid" class="inline">

        <el-select v-model="formData.scholarshipsettingUid" @change="handleChange">
          <el-option
            v-for="item in settingList"
            :key="item.scholarshipName"
            :label="item.scholarshipName"
            :value="item.scholarshipsettingUid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发放方式" class="inline pull-right">
        <el-input v-model="setting.grantWay" disabled></el-input>
      </el-form-item>

      <el-form-item label="奖学金级别:" class="inline">
        <el-input v-model="setting.scholarshipLevel" disabled></el-input>
      </el-form-item>
      <el-form-item label="金额:" class="inline pull-right">
        <el-input v-model="setting.money" disabled></el-input>
      </el-form-item>
      <el-form-item label="学号:" prop="facultyName" class="inline">
        <el-input v-model="formData.facultyName"></el-input>
        <a href="javascript:;" class="search-button" @click="query">搜索</a>
      </el-form-item>

      <el-form-item label="申请时间" prop="punishDate" class="inline pull-right">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.punishDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="入学年份" prop="enterYear" class="inline">
        <el-input v-model="formData.facultyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="factoryCode" class="inline pull-right">
        <el-input v-model="formData.facultyName" disabled></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="specialtyCode" class="inline">
        <el-input v-model="formData.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="政治面貌" prop="specialtyCode" class="inline pull-right">
        <el-input v-model="formData.facultyName" disabled></el-input>
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
    var checkStudent = (rule, value, callback) => {
      if (!value) {
        this.doQuery = false
        return callback(new Error('请输入学号'))
      } else {
        if (!this.doQuery) return
        api.queryStudent(value).then(response => {
          if (response.code !== 1) {
            callback(new Error('输入学号有误'))
          } else {
            this.formData = response.data
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
      // 选中的设置
      setting: '',
      student: {},
      formData: {},
      rules: {
        studentCode: [
          // { required: true, message: '请输入学生学号', trigger: 'blur' },
          { validator: checkStudent, trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        scholarshipsettingUid: [
          { required: true, message: '请选择奖学金名称', trigger: 'change' }
        ],

        punishDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择处分日期', trigger: 'blur' }
        ],
        applyReson: [
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
      ],
      facultyList: [],
      specialtyList: [],
      politicsList: []
    }
  },

  // 带分页先取1000
  created () {
    api.querySettingList().then(response => {
      if (response.code !== 1) {
        this.$alert('获取奖学金设置失败')
      } else {
        this.settingList = response.data.rows
        console.log(this.settingList)
      }
    })
  },

  methods: {
    handleChange (val) {
      this.setting = this.settingList.find(i => i.scholarshipsettingUid === val)
    },

    query () {
      this.doQuery = true
      this.$refs.formData.validateField('studentCode')
    },
    submitForm (formName) {
      this.doQuery = true
      this.$refs.formData.validateField('studentCode')
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
  .el-input,.el-select {
    width: 215px;
  }
  .search-button {
    position: absolute;
    right: -30px;
    top: 0;
  }
</style>
