<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>学号: {{ data.studentCode }}</td>
        <td>学生姓名: {{ data.studentName }}</td>
        <td>入学年份: {{ data.enterYear }}</td>
      </tr>
      <tr>
        <td>院系: {{ data.facultyName }}</td>
        <td>电话: {{ data.phone }}</td>
        <td>假期名称: {{ data.holidayName }}</td>
      </tr>
    </table>
    <p class="process-title">留校原因</p>
    <div class="textarea-wrapper">
      <zjy-input type="textarea" v-model="data.stayReason" disabled></zjy-input>
    </div>
  </div>
</template>

<script>
import ZjyInput from '@/components/input'

export default {
  name: 'form-view',
  props: {
    data: Object
  },
  components: {
    ZjyInput
  }
}
</script>

<style scoped>

</style>
