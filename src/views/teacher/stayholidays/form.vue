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
