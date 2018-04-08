<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px" v-loading="loading">
      <el-form-item label="投保年级" prop="enterYear" class="inline">
        <el-select v-model="formData.enterYear">
          <el-option
            v-for="item in optionsYears"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投保院系" prop="factoryCode" class="inline pull-right">
        <el-select v-model="formData.factoryCode">
          <el-option
            v-for="item in facultyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投保专业" prop="specialtyCode" class="inline">
        <el-select v-model="formData.specialtyCode">

          <el-option
            v-for="item in specialtyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="险种名称" prop="inssettingUid" class="inline pull-right">
        <el-select v-model="formData.inssettingUid">
          <el-option
            v-for="item in insuranceSettingList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="强制投保" prop="forceInsure">
        <el-radio-group v-model="formData.forceInsure">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
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
import commonAPI from '@/api/common'
import insuranceSettingAPI from '@/api/teacher/insurance/setting'
import insuranceManageAPI from '@/api/teacher/insurance/manage'

import axios from 'axios'

import ZjyButton from '@/components/button'

export default {
  data () {
    return {
      formData: {
        enterYear: '',
        factoryCode: '',
        specialtyCode: '',
        inssettingUid: '',
        forceInsure: ''
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
      insuranceSettingList: [],
      rules: {
        enterYear: [
          {required: true, message: '请选择投保年级', trigger: 'blur'}

        ],
        factoryCode: [
          {required: true, message: '请选择投保院系', trigger: 'blur'}
        ],
        specialtyCode: [
          {required: true, message: '请选择投保专业', trigger: 'blur'}
        ],
        inssettingUid: [
          {required: true, message: '请选择险种名称', trigger: 'blur'}
        ],
        forceInsure: [
          {required: true, message: '请选择投保方式', trigger: 'blur'}
        ]
      },

      loading: false
    }
  },

  props: {
    visible: Boolean
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          insuranceManageAPI.batch(this.formData).then(response => {
            console.log(response)
            if (response.code !== 1) {
              this.$alert(response.message)
            } else {
              this.$alert('投保成功')
              this.$emit('closed')
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    }
  },
  computed: {
    factoryCode () {
      return this.formData.factoryCode
    }
  },
  components: {
    ZjyButton
  },

  created () {
    this.loading = true
    axios.all([commonAPI.queryFacultyList(), insuranceSettingAPI.queryForList()])
      .then(axios.spread((r1, r2) => {
        console.log(r1)
        console.log(r2)
        if (r1.code !== 1 || r2.code !== 1) {
          this.$alert('获取数据失败')
        } else {
          this.facultyList = r1.data.map(x => {
            return {
              label: x.facultyName,
              value: x.facultyCode
            }
          })

          this.insuranceSettingList = r2.rows.map(x => {
            return {
              label: x.insuranceName,
              value: x.inssettingUid
            }
          })
        }
        this.loading = false
      })).catch(error => {
        console.log(error)
      })
  },

  watch: {
    factoryCode (val) {
      if (val) {
        this.formData.specialtyCode = ''
        commonAPI.querySpecialtyByFaculty(val).then(response => {
          if (response.code !== 1) {
            this.specialtyList = []
          } else {
            this.specialtyList = response.data.map(x => {
              return {
                label: x.specialtyName,
                value: x.specialtyNo
              }
            })
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  .inline {
    .el-input {
      width: 250px;
    }
  }
</style>
