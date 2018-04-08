<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称: {{ data.honoraryName }}</td>
        <td>荣誉称号类别: {{ data.honoraryCategory | honoraryTypeFormat}}</td>
        <td>申请人: {{ data.bzrName }}</td>
        <td>申请时间: {{ data.applyDate | dateFormat }}</td>
      </tr>
      <tr>
        <td>年级: {{ data.year }}</td>

        <td>班级: {{ data.className }}</td>
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
