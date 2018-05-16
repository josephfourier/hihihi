<!-- 学生申请但未审批时可以修改 -->
<template>
  <div class="poor-apply">
    <div class="zjy-form">
      <el-form :model="data" :rules="rules" ref="formData" label-width="110px">
        <el-form-item >
          <ul class="list">
            <li>姓名：{{student.studentName}}</li>
            <li>学号：{{student.studentCode}}</li>
            <li>院系：{{student.facultyName}}</li>
            <li>班级：{{student.className}}</li>
          </ul>
        </el-form-item>
        <el-form-item label="家庭总人口数" prop="totalPopulation" class="inline">
          <el-input v-model="data.totalPopulation" :maxlength="6"></el-input> 人
        </el-form-item>

        <el-form-item label="家庭年收入" prop="annualIncome" class="inline">
          <el-input v-model="data.annualIncome" type="input" :maxlength="6"></el-input> 元
        </el-form-item>
        <el-form-item label="人均月收入" prop="pcmIncome" class="inline">
          <el-input v-model="data.pcmIncome" type="input" :maxlength="6"></el-input> 元
        </el-form-item>
        <el-form-item label="家庭困难类型" prop="poorType" class="checkbox">
          <el-checkbox-group v-model="data.poorType">
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
          <el-input v-model="data.poorDescription" type="textarea" :maxlength="1024"></el-input>
        </el-form-item>
        <el-form-item label="曾受资助情况" prop="receivedFunding">
          <el-input v-model="data.receivedFunding" type="textarea" :maxlength="1024"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <process-view
      v-model="value"
      :visible.sync="innerVisible"
    >
      <template slot-scope="props" slot="footer">
        <zjy-footer
          :data="data"
          :steps="props.steps"
          @update="update"
          @delete="_delete"
        ></zjy-footer>
      </template>
    </process-view>
  </div>
</template>

<script>
import ProcessView from '@/components/process/ProcessView'
import commonAPI from '@/api/common'
import ZjyFooter from './Footer'
import validator from '@/utils/validator'
export default {

  data () {
    const limited = (rule, value, callback) => {
      if (!validator.isInteger(+value) || +value < 0) {
        return callback(new Error('请输入合法数字,如15'))
      }
      callback()
    }
    return {
      poorList: [],
      innerVisible: true,
      rules: {
        totalPopulation: [
          { required: true, message: '请输入家庭总人口数', trigger: 'change' },
          { validator: limited, trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        annualIncome: [
          { required: true, message: '请输入家庭年收入', trigger: 'change' },
          { validator: limited, trigger: 'change' }
        ],
        pcmIncome: [
          { required: true, message: '请输入人均月收入', trigger: 'change' },
          { validator: limited, trigger: 'change' }
        ],
        poorType: [
          { type: 'array', required: true, message: '请至少选择一种家庭困难类型', trigger: 'change' }
        ],
        poorDescription: [
          { required: true, message: '请输入家庭困难情况', trigger: 'change' }
        ],
        receivedFunding: [
          { required: true, message: '请输入曾受资助情况', trigger: 'change' }
        ]
      }
    }
  },

  props: {
    student: Object,
    data: Object, // 填写的数据回显
    value: Object, // 流程数据
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

    _delete () {
      this.$emit('delete', this.data)
    },
    update (list) {
      this.$refs.formData.validate(valid => {
        if (valid) { this.$emit('submit', this.data) } else {
          return false
        }
      })
    }
  },
  components: {
    ProcessView,
    ZjyFooter
  },
  watch: {
    visible (val) {
      if (!val) this.innerVisible = true
    },

    innerVisible (val) {
      if (!val) {
        this.$emit('update:visible', false)
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
