<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="类型名称" prop="punishName">
        <el-input v-model="formData.punishName"></el-input>
      </el-form-item>

      <el-form-item label="类型说明" prop="punishtDescription">
        <el-input v-model="formData.punishtDescription" type="textarea"></el-input>
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

export default {

  data () {
    return {
      formData: {},
      rules: {
        punishName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        punishtDescription: [
          { required: true, message: '请输入类型描述', trigger: 'blur' }
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

  props: {
    data: Object,
    type: Number,
    visible: Boolean
  },
  components: {
    ZjyButton
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.formData = {...val}
      }
    }
  }
}
</script>

<style scoped>

</style>
