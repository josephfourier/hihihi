<template>
  <!-- 针对 保险 如果状态是5 则为待付款才会显示操作 -->
  <div class="zjy-footer" v-if="data.dataStatus === '5' || data.dataStatus === '0' || data.dataStatus === '6'">
      <zjy-button type="plain" @click="$emit('update:visible', false)">取 消</zjy-button>
      <zjy-button type="primary" @click="handleClick" v-if="data.dataStatus === '5' || data.dataStatus === '6'">立即支付</zjy-button>
      <zjy-button type="primary" @click="$emit('delete', data)" v-else>删除申请</zjy-button>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'

export default {
  name: 'zjy-footer',
  props: {
    data: Object,
    steps: Array,
    visible: Boolean
  },
  methods: {
    handleClick () {
      this.$emit('submit', this.data, this.steps)
    }
  },
  components: {
    ZjyButton
  }
}
</script>

<style scoped>

</style>
