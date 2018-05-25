<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>困难补助名称：{{ data.allowanceName }}</td>
        <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
        <td>名额限制：{{ data.numberLimit }}</td>
      </tr>
      <tr>
        <td>金额：{{ data.money }}元</td>
        <td>发放对象：{{ data.grantObject }}</td>
        <td>申请时间：{{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请原因</p>
      <div class="process-item__content">{{ data.applyReason }}</div>
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
