<template>
 <div class="zjy-process">
   <table class="process-table">
     <tr>
       <td>学号: {{ data.studentNo }}</td>
       <td>学生姓名: {{ data.studentName }}</td>
       <td>年级: {{ data.facultyName }}</td>
       <td>院系: {{ data.facultyName }}</td>
     </tr>
     <tr>
       <td>专业: {{ data.specialtyName }}</td>
       <td>班级: {{ data.className }}</td>
       <td>申请日期: {{ data.applyDate | dateFormat }}</td>
     </tr>
   </table>
   <p class="process-title">申请原因</p>
   <p class="content">{{ data.applyReason }}</p>
   <p class="process-title">审批进度</p>
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
