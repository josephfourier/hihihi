<template>
  <div>
    <div class="zjy-form">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
        <el-form-item label="类型名称" prop="punishName">
          <el-input v-model="formData.punishName"></el-input>
        </el-form-item>

        <el-form-item label="类型说明" prop="punishtDescription">
          <el-input v-model="formData.punishtDescription" type="textarea"></el-input>
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

export default {

  data () {
    return {
      formData: {},
      innerVisible: true,
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

  props: {
    value: Object,
    visible: Boolean
  },

  methods: {
    handleSubmit () {
      this.$refs.formData.validate(valid => {
        if (valid) { this.$emit('submit', this.formData) } else {
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
    }
  }
}
</script>

<style scoped>

</style>
