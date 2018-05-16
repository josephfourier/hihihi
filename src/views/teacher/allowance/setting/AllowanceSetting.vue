<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="120px">
      <el-form-item label="困难补助名称" prop="allowanceName" class="block">
        <el-input v-model="formData.allowanceName" :maxlength="128"></el-input>
      </el-form-item>

      <el-form-item label="名额限制" prop="numberLimit" class="inline">
        <el-input v-model="formData.numberLimit" :maxlength="6"></el-input>
      </el-form-item>

      <el-form-item label="金额" prop="money" class="inline pull-right">
        <el-input v-model="formData.money" :maxlength="6"></el-input>
      </el-form-item>

       <el-form-item label="发放方式" prop="grantWay" class="inline">
        <el-select v-model="formData.grantWay">
          <el-option
            v-for="item in grantWayOptions"
            :key="item.valueId"
            :label="item.valueName"
            :value="item.valueKey"
          >{{ item.valueName }}
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="发放对象" prop="grantObject" class="inline pull-right">
        <el-input v-model="formData.grantObject" :maxlength="256"></el-input>
      </el-form-item>

      <el-form-item label="申请时间" required>
          <el-form-item prop="startDate" class="inline">
           <el-date-picker type="date" :editable="false" placeholder="选择起始日期" value-format="timestamp" v-model="formData.startDate" style="width: 100%;"  :picker-options="startOption"></el-date-picker>
          </el-form-item>
          <span>至</span>
          <el-form-item prop="endDate" class="inline">
           <el-date-picker type="date" :editable="false" placeholder="选择结束日期" value-format="timestamp"  v-model="formData.endDate" style="width: 100%;" :picker-options="endOption"></el-date-picker>
          </el-form-item>
      </el-form-item>
      <el-form-item label="开放申请" prop="isOpen">
        <el-radio-group v-model="formData.isOpen">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
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
import ZjyButton from '@/components/button'
import { mapGetters } from 'vuex'
import validator from '@/utils/validator'

export default {
  name: 'allowance-setting',
  data () {
    const limited = (rule, value, callback) => {
      if (!validator.isInteger(+value) || +value < 0) {
        return callback(new Error('请输入合法数字,如15'))
      }
      callback()
    }
    return {
      formData: {},
      startOption: {
        disabledDate: (time) => {
          const endDate = this.formData.endDate
          if (endDate) { return time > endDate }
          return false
        }
      },
      endOption: {
        disabledDate: (time) => {
          const startDate = this.formData.startDate
          if (startDate) { return time < startDate }
          return false
        }
      },
      rules: {
        allowanceName: [
          { required: true, message: '请输入困难补助名称', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        grantWay: [
          { required: true, message: '请选择发放方式', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { validator: limited, trigger: 'change' }
        ],

        numberLimit: [
          { required: true, message: '请输入名额限制', trigger: 'change' },
          { validator: limited, trigger: 'change' }
        ],

        grantObject: [
          { required: true, message: '请输入发放对象', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择起始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开放申请', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    submitForm (formName) {
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
    ...mapGetters({
      grantWayOptions: 'grantWay'
    })
  },

  created () {
    this.$store.dispatch('setGrantWay')
  },

  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    ZjyButton
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.formData = {...val}
      }
    }
  }
}
</script>

<style scoped>

</style>
