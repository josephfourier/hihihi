<template>
  <div class="zjy-table-oper__item">
    <div :class="_clz">
      <a href="javascript:;" @click="$emit('click')">
        <slot v-if="text || $slots.default"> {{ text }}</slot>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'operator-item',
  props: {
    text: String,
    clz: String
  },
  computed: {
    _clz () {
      return this.clz ? 'zjy-table-oper--' + this.clz : 'zjy-table-oper--'
    }
  }
}
</script>

<style scoped>

</style>
