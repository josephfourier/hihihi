<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>岗位名称: {{ data.postName }}</td>
        <td>人数限制: {{ data.numberLimit }}</td>
        <td>专业要求：{{ data.specialtyName }}</td>
      </tr>
      <tr>
        <td>薪资待遇：{{ data.salary }}</td>
        <td>申请时间: {{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat }}</td>
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
