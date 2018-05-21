<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="违纪名称" prop="punishName">
        <el-input v-model="formData.punishName" :maxlength="128"></el-input>
      </el-form-item>

      <el-form-item label="违纪说明" prop="punishtDescription">
        <el-input v-model="formData.punishtDescription" type="textarea" :maxlength="1024"></el-input>
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
          { required: true, whitespace: true, message: '请输入违纪名称', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        punishtDescription: [
          { required: true, whitespace: true, message: '请输入违纪说明', trigger: 'change' }
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
      handler (val) {
        this.formData = {...val}
      }
    }
  }
}
</script>

<style scoped>

</style>
