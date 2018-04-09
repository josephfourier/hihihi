<template>
  <div class="zjy-process">
    <div class="status">
      <img src="./ic_sx.png" alt="状态" v-if="data.punishStatus === '1'">
      <img src="./ic_cx.png" alt="状态" v-else>
      <span class="status-text">{{ data.punishStatusName }}</span>
    </div>
    <table class="process-table">
      <tr>
        <td>学号: {{ data.studentCode }}</td>
        <td>学生姓名: {{ data.studentName }}</td>
        <td>入学年份: {{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>院系: {{ data.facultyName }}</td>
        <td>违纪类型: {{ data.punishName }}</td>
        <td>处分日期: {{ data.punishDate | dateFormat }}</td>
      </tr>
    </table>
    <p class="process-title">处分说明</p>
    <span>{{ data.punishDescription }}</span>
  </div>
</template>

<script>

export default {
  name: 'form-view',
  props: {
    data: Object
  }
}
</script>

<style scoped>
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
