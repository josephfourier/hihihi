<template>
  <div class="process">
    <div v-if="data.dataStatus === '5'" class="status">
      <img src="./ic_money.png" alt="待付款">
      <span class="status-text">{{ data.dataStatusName }}</span>
    </div>
    <div v-if="data.dataStatus === '4'" class="status">
      <img src="./ic_wait.png" alt="待确认">
      <span class="status-text">{{ data.dataStatusName }}</span>
    </div>
    <table class="process-table">
      <tr>
        <td>学号：{{ data.studentCode }}</td>
        <td>学生姓名：{{ data.studentName }}</td>
        <td>入学年份：{{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.facultyName }}</td>
        <td>专业：{{ data.specialtyName }}</td>
        <td>班级：{{ data.className }}</td>
      </tr>
      <tr>
        <td>申请日期：{{ data.applyDate | dateFormat }}</td>
        <td>保险名称：{{ data.insuranceName }}</td>
        <td>保险金额：{{ data.insuranceCost }}</td>
      </tr>
      <tr>
        <td>险种类别：{{ data.insuranceCategory }}</td>
        <td>保险期限：{{ data.insuranceLimit }}</td>
        <td>保险状态：{{ data.dataStatusName }}</td>
      </tr>
    </table>
    <div class="process-item detail">
      <p class="process-item__title">详细条款</p>
      <div class="process-item__content">{{ data.detailedTerms }}</div>
    </div>
     <div class="process-item detail">
      <p class="process-item__title">保险责任</p>
      <div class="process-item__content">{{ data.insuranceLiability }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZjyFrom',
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
    .process-item__content {
      font-size: 12px;
    }
  }
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
