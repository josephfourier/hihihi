<template>
  <div class="zjy-footer" v-if="data.dataStatus === '0'">
    <zjy-button type="plain" @click="$emit('delete', data, steps)" v-if="hasPermission('swms:clahonorary-tea:delete')">删除申请</zjy-button>
    <zjy-button type="primary" @click="$emit('update', data, steps)" v-if="hasPermission('swms:clahonorary-tea:update')">修改</zjy-button>
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
