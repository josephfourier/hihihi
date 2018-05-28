<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>学号：{{ data.studentCode }}</td>
        <td>学生姓名：{{ data.studentName }}</td>
        <td>入学年份：{{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.facultyName }}</td>
        <td>电话：{{ data.phone }}</td>
        <td v-if="data.dataStatus && data.dataStatus !== '0'">假期名称：{{ data.holidayName }}</td>
        <td v-else>假期类型：
          <el-select v-model="innerType" @change="$emit('update:type', innerType)">
            <el-option
              v-for="item in data.holidayType"
              :key="item.valueId"
              :label="item.valueName"
              :value="item.valueKey"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
    </table>
    <div class="process-item" v-if="data.dataStatus && data.dataStatus !== '0'">
      <p class="process-item__title">留校原因</p>
      <div class="process-item__content">
        {{ data.stayReason }}
      </div>
    </div>
    <div class="process-item" v-else style="margin-bottom: 0;">
      <p class="process-item__title">留校原因</p>
      <div class="process-item__content">
        <zjy-input type="textarea" v-model.trim="innerReason" @change="$emit('update:reason', innerReason)"
                   :maxlength="1024"></zjy-input>
        <div class="tip-box">
          <transition name="el-zoom-in-top">
            <span class="tip reason" v-if="hasError && !innerReason"
                  style="position: relative;top: -6px;">请填写申请原因</span>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZjyInput from '@/components/input'

export default {
  name: 'form-view',
  data () {
    return {
      innerReason: '',
      innerType: ''
    }
  },
  props: {
    data: Object,
    reason: String,
    type: String,
    hasError: Boolean
  },
  components: {
    ZjyInput
  },
  watch: {
    reason: {
      immediate: true,
      handler (val) {
        this.innerReason = val
      }
    },
    type: {
      immediate: true,
      handler (val) {
        this.innerType = val
      }
    }
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
