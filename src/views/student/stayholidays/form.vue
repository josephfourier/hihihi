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
    <panel-item class="item" label="电话：" labelWidth="70px"><p class="text" :title="data.insuranceLimit">{{
      data.student.phone }}</p></panel-item>
    <el-select v-model="data.type">
      <el-option
        v-for="item in data.holidayType"
        :key="item.valueId"
        :label="item.valueName"
        :value="item.valueKey"
      >
      </el-option>
    </el-select>

    <zjy-input type="textarea" v-model="data.reason"></zjy-input>
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
      type: ''
    }
  },
  props: {
    data: Object
  },
  components: {
    ZjyInput,
    Panel,
    PanelItem
  }
}
</script>

<style scoped lang="scss">
  .item {
    .text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    width: 180px;
    margin-right: 20px;
    margin-bottom: 15px;
    &:first-child {
      width: 300px
    }
    &:nth-of-type(3) {
      width: 150px;
    }
    &:nth-of-type(4) {
      width: 300px;
    }
    &.block {
      width: 100%;
      .zjy-panel-item__label {
        display: block;
      }
    }
  }

  .status {
    > span,
    > img {
      vertical-align: middle;
    }
    margin-bottom: 10px;
  }

  .details {
    padding: 20px;
    background-color: #f5f5f5;
    .title {
      color: #333333;
      font-weight: bold;
    }
    margin-bottom: 15px;
  }

  .content {
    overflow-y: auto;
    max-height: 200px;
  }
</style>
