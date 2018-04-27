<template>
 <div class="process">
   <table class="process-table">
     <tr>
       <td>学号：<span>{{ data.studentNo }}</span></td>
       <td>学生姓名：<span>{{ data.studentName }}</span></td>
       <td>年级：<span>{{ data.facultyName }}</span></td>
       <td>院系：<span>{{ data.facultyName }}</span></td>
     </tr>
     <tr>
       <td>专业：<span>{{ data.specialtyName }}</span></td>
       <td>班级：<span>{{ data.className }}</span></td>
       <td>申请日期：<span>{{ data.applyDate | dateFormat }}</span></td>
     </tr>
   </table>
   <div class="process-item">
     <p class="process-item__title">申请原因</p>
     <div class="process-item__content">{{ data.applyReason }}</div>
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
