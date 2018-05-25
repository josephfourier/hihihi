<template>
  <div class="process">
    <table class="process-table">
      <tr>
        <td>困难补助名称：{{ data.allowanceName }}</td>
        <td>发放方式：{{ data.grantWay | scholarshipGrantWayFormat }}</td>
        <td>名额限制：{{ data.numberLimit }}</td>
      </tr>
      <tr>
        <td>金额：{{ data.money }}元</td>
        <td>发放对象：{{ data.grantObject }}</td>
        <!-- <td>申请时间：{{ data.startDate | dateFormat }} </td> -->
        <td>申请时间：{{ data.startDate | dateFormat }} 至 {{ data.endDate | dateFormat }}</td>
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
