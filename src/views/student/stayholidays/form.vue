<template>
  <panel>
    <panel-item class="item" label="学号：" labelWidth="70px"><p class="text" :title="data.insuranceName">{{
      data.student.studentCode }}</p></panel-item>
    <panel-item class="item" label="学生姓名：" labelWidth="70px"><p class="text" :title="data.insuranceCompany">{{
      data.student.studentName}}</p></panel-item>
    <panel-item class="item" label="入学年份：" labelWidth="70px"><p class="text" :title="data.insuranceCategory">{{
      data.student.enterYear }}</p></panel-item>
    <panel-item class="item" label="院系：" labelWidth="70px"><p class="text" :title="data.insuranceLimit">{{
      data.student.facultyName }}</p></panel-item>
    <panel-item class="item" label="电话：" labelWidth="70px" labelAlign="right"><p class="text" :title="data.insuranceLimit">{{
      data.student.phone }}</p></panel-item>
    <panel-item label="假期类型: " labelWidth="70px">
      <el-select v-model="innerType" @change="$emit('update:type', innerType)">
        <el-option
          v-for="item in data.holidayType"
          :key="item.valueId"
          :label="item.valueName"
          :value="item.valueKey"
        >
        </el-option>

      </el-select>
    </panel-item>
    <div class="tip-box">
      <transition name="el-zoom-in-top">
        <span class="tip type" v-if="hasError && !innerType">请选择假期类型</span>
      </transition>
    </div>
    <p class="process-title">留校原因</p>
    <div class="textarea-wrapper">
      <zjy-input type="textarea" v-model="innerReason" @change="$emit('update:reason', innerReason)"></zjy-input>
      <div class="form-tip-box">
        <transition name="el-zoom-in-top">
          <span class="tip reason" v-if="hasError && !innerReason">请填写申请原因</span>
        </transition>
      </div>
    </div>
  </panel>
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
  .el-select {
    top: -5px;
  }
  .item {
    .text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    width: 180px;
    margin-right: 20px;
    margin-bottom: 15px;

    &:nth-of-type(3) {
      width: 150px;
    }
  }

  .tip {

    &.type {
      position: absolute;
      right: 158px;
      top: -8px;
    }
  }
</style>
