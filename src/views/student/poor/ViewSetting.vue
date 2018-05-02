<!--设置详情数据查看 -->
<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>申请学年：{{ data.applyYear }}</td>
        <td>申请时间：{{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat}}</td>
        <td>申请说明：{{ data.applyDescription }}</td>
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
