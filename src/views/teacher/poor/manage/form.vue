<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>学号：{{ data.studentCode }}</td>
        <td>学生姓名：{{ data.studentName }}</td>
        <td>班级：{{ data.className }}</td>
      </tr>
      <tr>
        <td>院系：{{ data.facultyName }}</td>
        <td>家庭总人口：{{ data.totalPopulation }}</td>
        <td>家庭年收入：{{ data.annualIncome }}</td>
      </tr>
      <tr>
        <td>人均月收入：{{ data.pcmIncome }}</td>
        <td>家庭困难类型：{{ data.poorType | poorTypeFormat }}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">家庭困难情况</p>
      <div class="process-item__content">
        {{ data.poorDescription }}
      </div>
    </div>
    <div class="process-item">
      <p class="process-item__title">曾受资助情况</p>
      <div class="process-item__content">
        {{ data.receivedFunding }}
      </div>
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
