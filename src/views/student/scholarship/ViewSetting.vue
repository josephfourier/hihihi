<!--设置详情数据查看 -->
<template>
  <div class="zjy-process">
    <table class="process-table">
      <tr>
        <td>奖学金名称: {{ data.scholarshipName }}</td>
        <td>发放方式: {{ data.grantWay }}</td>
        <td>奖学金级别: {{ data.scholarshipLevel }}</td>
      </tr>
      <tr>
        <td>金额: {{ data.money }}</td>
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
