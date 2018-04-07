<!--设置详情数据查看 -->
<template>
    <div class="zjy-process">
      <div v-if="data.dataStatus === '5'" class="status">
        <img src="./ic_wait.png" alt="待付款">
        <span class="status-text">{{ data.dataStatusName }}</span>
      </div>
      <table class="process-table">
        <tr>
          <td>保险名称: {{ data.insuranceName }}</td>
          <td>保险公司: {{ data.insuranceCompany }}</td>
          <td>险种类别: {{ data.insuranceCategory }}</td>
        </tr>
        <tr>
          <td>保险费用: {{ data.insuranceCost }}</td>
          <td>保险期限: {{ data.insuranceLimit }}</td>
        </tr>
      </table>
      <div class="detail">
        <p class="title">详细条款</p>
        {{ data.detailedTerms }}
      </div>
    </div>
</template>

<script>

export default {
  name: 'view-apply',
  props: {
    data: Object
  }
}
</script>

<style scoped lang="scss">
  .status {
    margin-bottom: 10px;
  }
  .status-text {
    color: #ef7727;
    font-size: 16px;
    vertical-align: top;
    position: relative;
    top: 6px;
    left: 2px;
  }
</style>
