<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>
          <span>学号:</span> {{ data.studentNo }}</td>
        <td>学生姓名: {{ data.studentName }}</td>
        <td>班级: {{ data.className }}</td>
        <td>院系: {{ data.facultyName }}</td>
      </tr>
      <tr>
        <td>家庭总人口: {{ data.totalPopulation }}</td>
        <td>家庭年收入: {{ data.annualIncome }}</td>
        <td>人均月收入: {{ data.pcmIncome }}</td>
        <td>家庭困难类型: {{ data.poorType | poorTypeFormat }}</td>
      </tr>
    </table>
    <p class="process-title">家庭困难情况</p>
    <p class="content">{{ data.poorDescription }}</p>
    <p class="process-title">曾受资助情况</p>
    <p class="content">{{ data.receivedFunding }}</p>
    <p class="process-title">审批进度</p>
  </div>
</template>
<!--{{ data.applyReason }}-->
<script>

export default {
  name: 'ZjyFrom',
  props: {
    data: Object
  }
}
</script>

<style scoped lang="scss">
.content {
  word-break: break-all;
  margin-bottom: 15px;
}
</style>
