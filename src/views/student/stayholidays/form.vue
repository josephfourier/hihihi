<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>学号：{{ data.student.studentCode }}</td>
        <td>学生姓名：{{ data.student.studentName }}</td>
        <td>入学年份：{{ data.student.enterYear }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.student.facultyName }}</td>
        <td>电话：{{ data.student.phone }}</td>
        <td>假期类型：
          <el-select v-model="innerType" @change="$emit('update:type', innerType)">
            <el-option
              v-for="item in data.holidayType"
              :key="item.valueId"
              :label="item.valueName"
              :value="item.valueKey"
            >
            </el-option>
          </el-select>
          <div class="tip-box">
            <transition name="el-zoom-in-top">
              <span class="tip type" v-if="hasError && !innerType">请选择假期类型</span>
            </transition>
          </div>
        </td>
      </tr>
    </table>
    <div class="process-item" style="margin-bottom: 0;margin-top: -18px;">
      <p class="process-item__title">留校原因</p>
      <div class="process-item__content">
        <zjy-input type="textarea" v-model="innerReason" @change="$emit('update:reason', innerReason)" :maxlength="1024"></zjy-input>
        <div class="tip-box">
          <transition name="el-zoom-in-top">
            <span class="tip reason" v-if="hasError && !innerReason" style="position: relative;top: -6px;">请填写申请原因</span>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'
import ZjyInput from '@/components/input'

export default {
  name: 'ZjyForm',
  data () {
    return {
      innerType: '',
      innerReason: ''
    }
  },
  props: {
    data: Object,
    reason: String,
    type: String,
    hasError: Boolean
  },
  methods: {
    handleChange (val) {
      this.$emit('update:type', val)
    }
  },
  components: {
    ZjyInput,
    Panel,
    PanelItem
  }
}
</script>

<style scoped lang="scss">
  td {
    vertical-align: text-bottom;
  }
  .tip {
    &.type {
      position: absolute;
      right: 185px;
    }
  }
</style>
