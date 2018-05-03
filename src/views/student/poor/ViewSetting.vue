<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>申请学年：{{ data.applyYear }}</td>
        <td>申请时间：{{ data.startDate | dateFormat }}</td>
        <td>结束时间：{{ data.endDate | dateFormat}}</td>
      </tr>
    </table>
    <div class="process-item">
      <p class="process-item__title">申请说明</p>
      <div class="process-item__content">
        {{ data.applyDescription }}
      </div>
    </div>
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
td {
  width: 33%;
}
</style>
