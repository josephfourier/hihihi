<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>奖学金名称: {{ data.scholarshipName }}</td>
        <td>发放方式: {{ data.grantWay }}</td>
        <td>奖学金级别: {{ data.scholarshipLevel }}</td>
        <td>金额: {{ data.money }}</td>
      </tr>
      <tr>
        <td>申请人: {{ data.studentName }}</td>
        <td>申请时间: {{ data.applyDate | dateFormat }}</td>
        <td>入学年份: {{ data.enterYear }}</td>
        <td>院系: {{ data.facultyName }}</td>
      </tr>
      <tr>
        <td>政治面貌: {{ data.politics }}</td>
        <td>专业: {{ data.specialtyName }}</td>
      </tr>
    </table>
    <p class="process-title">申请原因</p>
    <p class="content">{{ data.applyReson }}</p>
    <p class="process-title">审批进度</p>
  </div>
</template>
<!--{{ data.applyReason }}-->
<script>

export default {
  name: 'zjy-from',
  props: {
    data: Object
  }
}
</script>

<style scoped lang="scss">

</style>
