<template>
  <div class="zjy-footer" v-if="data.dataStatus === '0'">
    <zjy-button type="plain" @click="$emit('delete', data, steps)">删除申请</zjy-button>
    <zjy-button type="primary" @click="$emit('update', data, steps)">修改</zjy-button>
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