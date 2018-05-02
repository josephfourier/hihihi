<template>
 <div class="process">
   <table class="process-table">
     <tr>
       <td>学号：{{ data.studentCode }}</td>
       <td>学生姓名：{{ data.studentName }}</td>
       <td>入学年份：{{ data.enterYear }}</td>
     </tr>
     <tr>
       <td>院系：{{ data.facultyName }}</td>
       <td>电话：{{ data.phone }}</td>
       <td>假期名称：{{ data.holidayName }}</td>
     </tr>
   </table>
   <div class="process-item">
     <p class="process-item__title">留校原因</p>
     <div class="process-item__content">
       {{ data.stayReason }}
     </div>
   </div>
 </div>
</template>
<script>

export default {
  name: 'zjy-form',
  props: {
    data: Object
  }
}
</script>
