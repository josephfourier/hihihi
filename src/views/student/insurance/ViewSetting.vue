<!--设置详情数据查看 -->
<template>
    <div class="zjy-process">
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
      <div class="zjy-footer" slot="footer">
        <zjy-button type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
      </div>
    </div>
</template>

<script>
import ZjyButton from '@/components/button'

export default {
  name: 'view-setting',
  props: {
    data: Object
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped lang="scss">
  .zjy-process {
    .process-table {
      width: 100%;
      td {
        padding-bottom: 10px;
      }
    }
    .detail {
      padding: 20px;
      background-color: #f5f5f5;
      .title {
        color: #333333;
        font-weight: bold;
      }
      margin-bottom: 15px;
    }
  }
</style>
