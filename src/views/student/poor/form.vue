<template>
  <div class="poor-apply">
    <!--{{ data }}-->

    <div class="zjy-form">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
        <el-form-item >
          <ul class="list">
            <li>姓名:{{formData.studentName}}</li>
            <li>学号:{{formData.studentNo}}</li>
            <li>院系:{{formData.facultyName}}</li>
            <li>班级:{{formData.className}}</li>
          </ul>
        </el-form-item>
        <el-form-item label="家庭总人口数" prop="totalPopulation" class="inline">
          <el-input v-model="formData.totalPopulation"></el-input> 人
        </el-form-item>

        <el-form-item label="家庭年收入" prop="annualIncome" class="inline">
          <el-input v-model="formData.annualIncome" type="input"></el-input> 元
        </el-form-item>
        <el-form-item label="人均月收入" prop="pcmIncome" class="inline">
          <el-input v-model="formData.pcmIncome" type="input"></el-input> 元
        </el-form-item>
        <el-form-item label="家庭困难类型" prop="poorType" class="checkbox">
          <el-checkbox-group v-model="formData.poorType">
            <el-checkbox
              v-for="item in poorList"
              :key="item.value"
              :label="item.value"
              name="poorType"
            >
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="家庭困难情况" prop="poorDescription">
          <el-input v-model="formData.poorDescription" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="曾受资助情况" prop="receivedFunding">
          <el-input v-model="formData.receivedFunding" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <student-process
      v-model="value"
      :visible.sync="innerVisible"
      :yesBtnText="'申请'"
      @submit="handleSubmit"
    >
    </student-process>
  </div>
</template>

<script>
import StudentProcess from '@/components/process/StudentProcess'
import commonAPI from '@/api/common'
import { selfMerge } from '@/utils'

export default {

  data () {
    return {
      formData: {
        poorType: []
      },
      poorList: [],
      innerVisible: true,
      rules: {
        totalPopulation: [
          { required: true, message: '请输入家庭总人口数', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        annualIncome: [
          { required: true, message: '请输入家庭年收入', trigger: 'blur' }
        ],
        pcmIncome: [
          { required: true, message: '请输入人均月收入', trigger: 'blur' }
        ],
        poorType: [
          { type: 'array', required: true, message: '请至少选择一种家庭困难类型', trigger: 'change' }
        ],
        poorDescription: [
          { required: true, message: '请输入人均月收入', trigger: 'blur' }
        ],
        receivedFunding: [
          { required: true, message: '请输入人均月收入', trigger: 'blur' }
        ]
      }
    }
  },

  props: {
    data: Object,
    value: Object,
    visible: Boolean
  },

  created () {
    commonAPI.queryPoorTypeList().then(response => {
      if (response.code !== 1) {
        this.$alert('获取贫困类型失败')
      } else {
        this.poorList = response.data.map(i => {
          return {
            label: i.valueName,
            value: i.valueKey
          }
        })
      }
    }).catch(error => {

    })
  },

  methods: {
    handleSubmit (_, list) {
      this.$refs.formData.validate(valid => {
        Object.assign(this.formData, {
          studentId: this.data.studentId,
          poorsettingUid: this.data.poorsettingUid
        })
        if (valid) { this.$emit('submit', this.formData, list) } else {
          return false
        }
      })
    }
  },
  components: {
    StudentProcess
  },
  watch: {
    visible (val) {
      if (!val) this.innerVisible = true
    },

    innerVisible (val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    },

    data: {
      immediate: true,
      handler (val) {
        selfMerge(val, this.formData)
        this.formData.poorType = this.formData.poorType.split(',')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.list {
  overflow: hidden;
  margin-left: -110px;
  li {
    float: left;
    margin-right: 50px;
  }
}
</style>
