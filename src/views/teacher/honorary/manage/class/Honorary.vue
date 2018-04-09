<!-- 教师新增班级荣誉称号 -->
<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">

      <el-form-item label="荣誉称号类别" class="inline">
        <el-select v-model="type" disabled>
          <el-option label="班级" value="2">
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

      <el-form-item label="申请集体" prop="classId" class="inline">
        <el-select v-model="formData.classId">
          <el-option
            v-for="item in classList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" prop="applyDate" class="inline pull-right">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.applyDate" style="width: 100%"></el-date-picker>
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
import commonAPI from '@/api/common'

export default {
  data () {
    return {

      nameList: [],
      classList: [],
      type: '班级',
      formData: {},
      rules: {

        honorarysettingUid: [
          { required: true, message: '请选择荣誉称号名称', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择申请集体', trigger: 'change' }
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
    api.queryNameByTyep(2).then(response => {
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
      commonAPI.queryMyClassListNotApplied(val).then(response => {
        this.classList = response.data
        if (response.code !== 1) {
          this.$alert('获取班级失败')
        } else {
          this.classList = response.data.map(i => {
            return {
              label: i.className,
              value: i.classId
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
          this.$emit('submit', this.formData.honorarysettingUid, this.formData.classId, {
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
