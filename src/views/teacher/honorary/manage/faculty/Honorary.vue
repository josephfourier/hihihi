<!-- 教师新增班级荣誉称号 -->
<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="荣誉称号类别" class="inline">
        <el-select v-model="type" disabled>
          <el-option label="院系" value="1">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="荣誉称号名称" prop="honorarysettingUid" class="inline pull-right">
        <el-select v-model="formData.honorarysettingUid" @change="handleChange">
          <el-option
            v-for="item in nameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请集体" prop="facultyId" class="inline">
        <el-select v-model="formData.facultyId">
          <el-option
            v-for="item in facList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" prop="applyDate" class="inline pull-right">
       <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="formData.applyDate" style="width: 100%"></el-date-picker>
      </el-form-item>

      <el-form-item label="申请原因" prop="applyReson">
        <el-input type="textarea" v-model="formData.applyReson" :maxlength="1024"></el-input>
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
import commonAPI from '@/api/common'

export default {
  data () {
    return {

      nameList: [],
      facList: [],
      type: '院系',
      formData: {},
      rules: {

        honorarysettingUid: [
          { required: true, message: '请选择荣誉称号名称', trigger: 'change' }
        ],
        facultyId: [
          { required: true, message: '请选择申请集体', trigger: 'change' }
        ],

        applyDate: [
          // { validator: validateStartDate, trigger: 'blur' },
          { required: true, message: '请选择申请日期', trigger: 'change' }
        ],
        applyReson: [
          { required: true, whitespace: true, message: '请填写申请原因', trigger: 'change' }
        ]
      }
    }
  },

  created () {
    api.queryNameByTyep(1).then(response => {
      this.nameList = response.data.map(i => {
        return {
          label: i.honoraryName,
          value: i.honorarysettingUid
        }
      })
    })
  },

  methods: {

    handleChange (val) {
      commonAPI.queryMyFacultyListNotApplied(val).then(response => {
        this.facList = response.data
        if (response.code !== 1) {
          this.$alert('获取班级失败')
        } else {
          this.facList = response.data.map(i => {
            return {
              label: i.facultyName,
              value: i.facultyId
            }
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData.honorarysettingUid, this.formData.facultyId, {
            applyDate: this.formData.applyDate,
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
