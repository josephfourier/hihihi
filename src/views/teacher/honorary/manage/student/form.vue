<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>申请人：{{ data.studentName }}</td>
        <td>入学年份：{{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>政治面貌：{{ data.politics | politicsFormat}}</td>
        <td>院系：{{ data.facultyName }}</td>
        <td>专业：{{ data.specialtyName }}</td>
      </tr>
      <tr>
        <td>人数限制：{{ data.numberLimit }}</td>
        <td>开始时间：{{ data.startDate | dateFormat }}</td>
        <td>结束时间：{{ data.endDate | dateFormat }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">{{ data.applyReson }}</div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'zjy-from',
  props: {
    data: Object
  }
}
</script>
