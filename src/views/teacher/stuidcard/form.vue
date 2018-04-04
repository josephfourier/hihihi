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
   <!--<panel>-->
     <!--<panel-item label="学号:" labelWidth="50px">{{ data.studentNo }}</panel-item>-->
     <!--<panel-item label="学生姓名:" labelWidth="70px">{{ data.studentName }}</panel-item>-->
     <!--<panel-item label="年级:" labelWidth="50px">{{ data.facultyName }}</panel-item>-->
     <!--<panel-item label="院系:" labelWidth="50px">{{ data.facultyName }}</panel-item>-->
     <!--<panel-item label="专业:" labelWidth="50px">{{ data.specialtyName }}</panel-item>-->
     <!--<panel-item label="班级:" labelWidth="50px">{{ data.className }}</panel-item>-->
     <!--<panel-item label="申请日期:" labelWidth="70px">{{ data.applyDate | dateFormat }}</panel-item>-->
   <!--</panel>-->
   <p class="process-title">申请原因</p>
   <p class="content">{{ data.applyReason }}</p>
   <p class="process-title">审批进度</p>
 </div>
</template>
<!--{{ data.applyReason }}-->
<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'

export default {
  name: 'ZjyFrom',
  props: {
    data: Object
  },
  components: {
    Panel,
    PanelItem
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
    .process-title {
      font-weight: bold;
      margin-top: 5px;
      &:last-child {
        margin-bottom: 10px;
      }
    }
    .content {
      word-break: break-all;
      margin-bottom: 15px;
    }
  }

</style>
