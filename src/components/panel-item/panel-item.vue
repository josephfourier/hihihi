<!--  -->
<template>
  <div class="zjy-panel-item">
    <label class="zjy-panel-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="zjy-panel-item__content" v-bind:style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  props: {
    label: String,
    labelWidth: String,
    labelAlign: String
  },

  computed: {
    labelStyle () {
      let ret = {}
      var labelWidth = this.labelWidth
      if (labelWidth) {
        ret.width = labelWidth
      }

      var labelAlign = this.labelAlign
      if (this.labelAlign) {
        ret.textAlign = labelAlign
      }
      return ret
    },

    contentStyle () {
      let ret = {}
      var labelWidth = this.labelWidth
      if (labelWidth) {
        ret.marginLeft = labelWidth
      }
      return ret
    }
  }

}

</script>
<style lang='scss' scoped>
</style>
