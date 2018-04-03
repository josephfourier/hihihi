<template>
  <panel>
    <panel-item class="item" label="保险名称：" labelWidth="70px"><p class="text" :title="data.insuranceName">{{
      data.insuranceName }}</p></panel-item>
    <panel-item class="item" label="保险公司：" labelWidth="70px"><p class="text" :title="data.insuranceCompany">{{
      data.insuranceCompany }}</p></panel-item>
    <panel-item class="item" label="险种类别：" labelWidth="70px"><p class="text" :title="data.insuranceCategory">{{
      data.insuranceCategory }}</p></panel-item>
    <panel-item class="item" label="保险费用：" labelWidth="70px"><p class="text" :title="data.insuranceCost">{{
      data.insuranceCost }}</p></panel-item>
    <panel-item class="item" label="保险期限：" labelWidth="70px"><p class="text" :title="data.insuranceLimit">{{
      data.insuranceLimit }}</p></panel-item>
    <div class="details">
      <p class="title">详细条款</p>
      <div class="content">
        {{ data.detailedTerms }}
      </div>
    </div>
  </panel>
</template>

<script>
import Panel from '@/components/panel/panel'
import PanelItem from '@/components/panel-item/panel-item'

export default {
  name: 'ZjyForm',
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
    .text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    width: 180px;
    margin-right: 20px;
    margin-bottom: 15px;
    &:first-child {
      width: 300px
    }
    &:nth-of-type(3) {
      width: 150px;
    }
    &:nth-of-type(4) {
      width: 300px;
    }
    &.block {
      width: 100%;
      .zjy-panel-item__label {
        display: block;
      }
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

  .content {
    overflow-y: auto;
    max-height: 200px;
  }
</style>
