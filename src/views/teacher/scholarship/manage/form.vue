<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>奖学金名称：{{ data.scholarshipName }}</td>
        <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
        <td>奖学金级别：{{ data.scholarshipLevel }}</td>
      </tr>
      <tr>
        <td>金额：{{ data.money }}</td>
        <td>申请人：{{ data.studentName }}</td>
        <td>申请时间：{{ data.applyDate | dateFormat }}</td>
      </tr>
      <tr>
        <td>入学年份：{{ data.enterYear }}</td>
        <td>院系：{{ data.facultyName }}</td>
        <td>政治面貌：{{ data.politics | politicsFormat }}</td>
      </tr>
      <tr>
        <td>专业：{{ data.specialtyName }}</td>
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
