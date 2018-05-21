<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="申请学年" prop="applyYear" class="inline">
        <el-date-picker
          v-model="formData.applyYear"
          type="year"
          format="yyyy"
          :editable="false"
          :readonly="true"
          value-format="yyyy"
          :clearable="false"
          placeholder="请选择"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="申请时间" required>
        <el-form-item prop="startDate" class="inline">
         <el-date-picker type="date" :readonly="true" placeholder="选择起始日期" value-format="timestamp" v-model="formData.startDate" style="width: 100%;"  :picker-options="startOption"></el-date-picker>
        </el-form-item>
        <span>至</span>
        <el-form-item prop="endDate" class="inline">
         <el-date-picker type="date" :readonly="true" placeholder="选择结束日期" value-format="timestamp"  v-model="formData.endDate" style="width: 100%;" :picker-options="endOption"></el-date-picker>
        </el-form-item>
      </el-form-item>

      <el-form-item label="申请说明" prop="applyDescription">
        <el-input v-model="formData.applyDescription" type="textarea" readonly></el-input>
      </el-form-item>

      <div class="zjy-footer">
        <zjy-button type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'

export default {

  data () {
    return {
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
      }
    }
  },
  props: {
    formData: Object,
    visible: Boolean
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped>

</style>
