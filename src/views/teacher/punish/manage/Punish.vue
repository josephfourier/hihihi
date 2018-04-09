<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
      <el-form-item label="学号" prop="studentCode" class="inline">
        <el-input v-model="formData.studentCode"></el-input>
        <a href="javascript:;" class="search-button" @click="query"></a>
      </el-form-item>

      <el-form-item label="学生姓名:" prop="studentName" class="inline pull-right">
        <el-input v-model="formData.studentName" disabled></el-input>
      </el-form-item>
      <el-form-item label="班级:" prop="className" class="inline">
        <el-input v-model="formData.className" disabled></el-input>
      </el-form-item>
      <el-form-item label="院系:" prop="facultyName" class="inline pull-right">
        <el-input v-model="formData.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="违纪类型" prop="punishSettingUid" class="inline">

        <el-select v-model="formData.punishSettingUid">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="处分日期" prop="punishDate" class="pull-right">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.punishDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="处分说明" prop="punishDescription">
        <el-input type="textarea" v-model="formData.punishDescription"></el-input>
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
  name: 'scholarship-setting',
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
      options: [],
      formData: {},
      rules: {
        studentCode: [
          // { required: true, message: '请输入学生学号', trigger: 'blur' },
          { validator: checkStudent, trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        punishSettingUid: [
          { required: true, message: '请选择违纪类型', trigger: 'change' }
        ],

        punishDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择处分日期', trigger: 'blur' }
        ],
        punishDescription: [
          { required: true, message: '请选择处分说明', trigger: 'blur' }
        ]
      }
    }
  },

  // 带分页先取1000
  created () {
    api.queryPunishSettingList({
      offset: 0,
      limit: 1000
    }).then(response => {
      console.log(response)
      this.options = response.rows.map(i => {
        return {
          label: i.punishName,
          value: i.punishsettingUid
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
      this.doQuery = true
      // this.$refs.formData.validateField('studentCode')
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
    visible: Boolean
  },
  components: {
    ZjyButton
  }
}
</script>
