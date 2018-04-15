<template>
  <div class="zjy-table-search__item">
    <label class="search-label" v-if="label || $slots.label" v-bind:style="labelStyle">
      <slot name="label"> {{ label }}</slot>
    </label>
    <el-select v-model="inner" :placeholder="placeholder">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'search-select',
  data () {
    return {
      inner: this.value
    }
  },

  props: {
    value: String,
    label: String,
    labelWidth: String,
    placeholder: String,
    options: Array
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

  watch: {
    inner (val) {
      this.$emit('update:value', val)
    },
    value: {
      immediate: true,
      handler (val) {
        this.inner = val
      }
    }
  }
}
</script>

<style scoped>

</style>
<!--
 <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

-->
