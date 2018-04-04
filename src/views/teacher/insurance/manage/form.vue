<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td><span>学号:</span> {{ data.studentNo }}</td>
        <td>学生姓名: {{ data.studentName }}</td>
        <td>入学年份: {{ data.enterYear }}</td>
        <td>院系: {{ data.facultyName }}</td>
      </tr>
      <tr>
        <td>专业: {{ data.specialtyName }}</td>
        <td>班级: {{ data.className }}</td>
        <td>申请日期: {{ data.applyDate | dateFormat }}</td>
        <td>保险名称: {{ data.insuranceName }}</td>
      </tr>
      <tr>
        <td>保险金额: {{ data.insuranceCost }}</td>
        <td>险种类别: {{ data.insuranceCategory }}</td>
        <td>保险期限: {{ data.insuranceLimit }}</td>
      </tr>
    </table>
    <p class="process-title">保险责任</p>
    <p class="content">{{ data.insuranceLiability }}</p>
    <p class="process-title">审批进度</p>
  </div>
</template>
<!--{{ data.applyReason }}-->
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

<style scoped lang="scss">

  .zjy-process {
    .process-table {
      width: 100%;
      td {
        padding-bottom: 10px;
        color: #323232;
        span{
          color: #666666;
        }
      }
    }
    .process-title {
      font-weight: bold;
      margin-top: 5px;
      &:last-child {
        margin-bottom: 10px;
      }
    }
    .content {
      word-break: break-all;
      margin-bottom: 15px;
    }
  }

</style>
