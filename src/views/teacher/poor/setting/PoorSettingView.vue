<template>
  <div class="zjy-form">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="申请学年" prop="applyYear" class="inline">
        <el-select v-model="formData.applyYear" disabled>
          <el-option
            v-for="item in optionsYears"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >{{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" required>
        <el-form-item prop="startDate" class="inline">
         <el-date-picker type="date" :editable="false" disabled placeholder="选择起始日期" value-format="timestamp" v-model="formData.startDate" style="width: 100%;"  :picker-options="startOption"></el-date-picker>
        </el-form-item>
        <span>至</span>
        <el-form-item prop="endDate" class="inline">
         <el-date-picker type="date" :editable="false" disabled placeholder="选择结束日期" value-format="timestamp"  v-model="formData.endDate" style="width: 100%;" :picker-options="endOption"></el-date-picker>
        </el-form-item>
      </el-form-item>

      <el-form-item label="申请说明" prop="applyDescription">
        <el-input v-model="formData.applyDescription" type="textarea" disabled></el-input>
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
      optionsYears: [
        {
          label: '2017年',
          value: 2017
        },
        {
          label: '2018年',
          value: 2018
        },
        {
          label: '2019年',
          value: 2019
        }
      ],
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
