<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称: {{ data.honoraryName }}</td>
        <td>荣誉称号类别: {{ data.honoraryCategory }}</td>
        <td>申请人: {{ data.studentName }}</td>
        <td>申请时间: {{ data.applyDate | dateFormat }}</td>
      </tr>
      <tr>
        <td>入学年份: {{ data.enterYear }}</td>
        <td>院系: {{ data.facultyName }}</td>
        <td>政治面貌: {{ data.politics }}</td>
        <td>专业: {{ data.specialtyName }}</td>
      </tr>
      <tr>

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
