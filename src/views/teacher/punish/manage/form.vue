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
        <td>违纪类型: {{ data.punishName }}</td>
        <td>处分日期: {{ data.punishDate | dateFormat }}</td>
        <td>违纪状态: {{ data.punishStatusName }}</td>
      </tr>
    </table>
    <p class="process-title">处分说明</p>
    <p class="content">{{ data.punishDescription }}</p>
    <div class="zjy-footer" v-if="data.punishStatus === '2'">
      <zjy-button type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
    </div>

    <div class="zjy-footer" v-else>
      <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
      <zjy-button type="primary" @click="$emit('submit', data)">撤消</zjy-button>
    </div>
  </div>
</template>
<script>
import ZjyButton from '@/components/button'
export default {
  name: 'zjy-from',
  props: {
    data: Object
  },
  components: {
    ZjyButton
  }
}
</script>
