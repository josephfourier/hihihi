<template>
  <div>
    <!--<div class="status" v-if="!reason && isFinished">-->
      <!--<img src="./ic_wait.png" alt="确认状态">-->
      <!--<span>待付款</span>-->
    <!--</div>-->
    <panel>
      <panel-item class="item" label="保险期限" labelWidth="70px">{{ data.insuranceLimit }}</panel-item>
      <panel-item class="item" label="保险名称：" labelWidth="70px">{{ data.insuranceName }}</panel-item>
      <panel-item class="item" label="保险金额：" labelWidth="70px">{{ data.insuranceCost }}</panel-item>
      <panel-item class="item" label="险种类别：" labelWidth="70px">{{ data.insuranceCategory }}</panel-item>
      <panel-item class="item" label="保险期限：" labelWidth="70px">{{ data.insuranceLimit }}</panel-item>
      <div class="details">
        <p class="title">保险责任</p>
        <div class="content">
          {{ data.insuranceLiability }}
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'

export default {
  name: 'form-view',
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
  .item {
    margin-right: 50px;
    margin-bottom: 15px;
    &.block {
      width: 100%;
      display: block;
    }
  }

  .status {
    > span,
    > img {
      vertical-align: middle;
    }
    margin-bottom: 10px;
  }

  .details {
    padding: 20px;
    background-color: #f5f5f5;
    .title {
      color: #333333;
      font-weight: bold;
    }
    margin-bottom: 15px;
  }
</style>
