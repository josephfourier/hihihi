<template>
  <div class="process">
     <table class="process-table">
      <tr>
        <td>荣誉称号名称：{{ data.honoraryName }}</td>
        <td>荣誉称号类别：{{ data.honoraryCategory | honoraryTypeFormat}}</td>
        <td>人数限制：{{ data.numberLimit }}</td>
      </tr>
       <tr>
        <td>申请状态：{{ data.applyStatusName}}</td>
        <td>申请时间：{{ data.startDate | dateFormat }}</td>
        <td>结束时间：{{ data.endDate | dateFormat }}</td>
      </tr>
    </table>
    <div class="zjy-footer" slot="footer">
      <zjy-button type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
    </div>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'

export default {
  name: 'view-setting',
  props: {
    data: Object,
    visible: Boolean
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped lang="scss">

</style>
