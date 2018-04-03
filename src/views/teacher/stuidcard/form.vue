<template>
  <panel>
    <panel-item class="item" label="学号" labelWidth="70px">{{ data.studentNo }}</panel-item>
    <panel-item class="item" label="学生姓名" labelWidth="70px">{{ data.studentName }}</panel-item>
    <panel-item class="item" label="年级" labelWidth="70px">{{ data.facultyName }}</panel-item>
    <panel-item class="item" label="院系" labelWidth="70px">{{ data.facultyName }}</panel-item>
    <panel-item class="item" label="专业" labelWidth="70px">{{ data.specialtyName }}</panel-item>
    <panel-item class="item" label="班级" labelWidth="70px">{{ data.className }}</panel-item>
    <panel-item class="item" label="申请日期" labelWidth="70px">{{ data.applyDate | dateFormat }}</panel-item>
    <panel-item class="item" label="申请原因" labelWidth="70px">{{ data.applyReason }}</panel-item>
  </panel>
</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'

export default {
  name: 'ZjyFrom',
  props: {
    data: Object
  },
  components: {
    Panel,
    PanelItem
  }
}
</script>

<style scoped>

</style>
