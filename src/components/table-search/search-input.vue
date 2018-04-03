<template>
<div class="zjy-table-search__item">
  <label class="search-label" v-if="label || $slots.label" v-bind:style="labelStyle">
    <slot name="label"> {{ label }}</slot>
  </label>
  <el-input v-model="inner" class="search-input" v-bind="inputStyle"></el-input>
</div>
</template>

<script>
export default {
  name: 'search-input',
  data () {
    return {
      inner: this.value
    }
  },

  computed: {
    labelStyle () {
      let ret = {}
      if (this.labelWidth) {
        ret.width = this.labelWidth
      }
      return ret
    },

    inputStyle () {
      let ret = {}
      if (this.labelWidth) {
        ret.marginLeft = this.labelWidth
      }
      return ret
    }
  },

  props: {
    value: '',
    label: String,
    labelWidth: String,
    placeholder: String
  },

  watch: {
    inner (val) {
      this.$emit('update:value', val)
    }
  }
}
</script>

<style scoped>

</style>
