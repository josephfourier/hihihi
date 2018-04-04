<template>
  <panel>
    <panel-item class="item" label="学号" labelWidth="70px">{{ data.studentNo }}</panel-item>
    <panel-item class="item" label="学生姓名" labelWidth="70px">{{ data.studentName }}</panel-item>
    <panel-item class="item" label="入学年份" labelWidth="70px">{{ data.enterYear }}</panel-item>
    <panel-item class="item" label="院系" labelWidth="70px">{{ data.facultyName }}</panel-item>
    <panel-item class="item" label="专业" labelWidth="70px">{{ data.specialtyName }}</panel-item>
    <panel-item class="item" label="班级" labelWidth="70px">{{ data.className }}</panel-item>
    <panel-item class="item" label="申请日期" labelWidth="70px">{{ data.applyDate | dateFormat }}</panel-item>
    <panel-item class="item" label="保险名称：" labelWidth="70px">{{ data.insuranceName }}</panel-item>
    <panel-item class="item" label="保险金额：" labelWidth="70px">{{ data.insuranceCost }}</panel-item>
    <panel-item class="item" label="险种类别：" labelWidth="70px">{{ data.insuranceCategory }}</panel-item>
    <panel-item class="item" label="保险期限：" labelWidth="70px">{{ data.insuranceLimit }}</panel-item>
    <div class="details">
      <p class="title">保险责任</p>
      <div class="content">
        {{ data.insuranceLiability }}
      </div>
    </div>
  </panel>
</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'
export default {
  name: 'ZjyForm',
  props: {
    data: Object
  },
  components: {
    PanelItem,
    Panel
  }
}
</script>

<style scoped>

</style>
