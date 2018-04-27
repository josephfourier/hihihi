<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>保险名称：{{ data.insuranceName }}</td>
        <td>保险公司：{{ data.insuranceCompany }}</td>
        <td>险种类别：{{ data.insuranceCategory }}</td>
      </tr>
      <tr>
        <td>保险费用：{{ data.insuranceCost }}</td>
        <td>保险期限：{{ data.insuranceLimit }}</td>
      </tr>
    </table>
    <div class="process-item detail">
      <p class="process-item__title">详细条款</p>
      <div class="process-item__content">{{ data.detailedTerms }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'view-setting',
  props: {
    data: Object
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding: 20px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
}
</style>
