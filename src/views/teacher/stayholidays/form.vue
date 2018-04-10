<template>
 <div class="zjy-process">
   <table class="process-table">
     <tr>
       <td>学号: {{ data.studentNo }}</td>
       <td>学生姓名: {{ data.studentName }}</td>
       <td>入学年份: {{ data.enterYear }}</td>
       <td>院系: {{ data.facultyName }}</td>
     </tr>
     <tr>
       <td>电话: {{ data.phone }}</td>
       <td>假期名称: {{ data.holidayName }}</td>
     </tr>
   </table>
   <p class="process-title">留校原因</p>
   <p class="content">{{ data.stayReason }}</p>
   <p class="process-title">审批进度</p>
 </div>
</template>
<!--{{ data.applyReason }}-->
<script>

export default {
  name: 'zjy-form',
  props: {
    data: Object
  }
}
</script>
