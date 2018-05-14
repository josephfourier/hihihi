<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>荣誉称号类别：{{ data.honoraryCategory | honoraryTypeFormat}}</td>
        <td>申请人：{{ data.teacherName }}</td>
      </tr>
      <tr>
        <td>申请时间：{{ data.applyDate | dateFormat }}</td>
        <td>年级：{{ data.year }}</td>
        <td>院系：{{ data.facultyName }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">
        {{ data.applyReson }}
      </div>
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