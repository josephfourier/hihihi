<!--  -->
<template>
  <div class="zjy-list-panel">
    <ul v-if="status === 1" class="zjy-list-panel__body">
      <li v-for="item in data" :key="item" class="zjy-list-panel__item">
        <span :title="item">{{ item | nullFilter }}</span>
      </li>
    </ul>
    <div v-else class="zjy-list-tip">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  props: {
    data: Array,
    status: Number,
    message: String
  },

  filters: {
    nullFilter: (value) => value === null ? '未知错误' : value
  }
}
</script>
<style lang='scss' scoped>
.zjy-list-panel {
  padding: 5px 0 20px 0;
  .zjy-list-panel__body {
    overflow: hidden;
    .zjy-list-panel__item {
      border: 1px solid #37c6d4;
      margin-right: 9px;
      margin-bottom: 10px;
      width: 170px;
      font-size: 14px;
      color: #666666;
      padding: 7px 0;
      text-align: center;
      float: left;
      text-overflow: ellipsis;
      white-space: normal;
      overflow: hidden;
      cursor: default;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
