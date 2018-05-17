
<template>
<div class="zjy-table-search__item">
  <label class="search-label" v-if="label || $slots.label" v-bind:style="labelStyle">
    <slot name="label">{{ label }}</slot>
  </label>
   <el-date-picker
      v-model="inner"
      type="year"
      format="yyyy年"
      :editable="false"
      value-format="yyyy"
      :clearable="false"
      placeholder="请选择"
  >
    </el-date-picker>
</div>
</template>

<script>
export default {
  name: 'search-date',
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
