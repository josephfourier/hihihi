<!--  -->
<template>
  <button
    class="zjy-button"
    @click="handleClick"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
        type ? 'zjy-button--' + type : '',
        buttonSize ? 'btn-' + buttonSize : '',
        {
            'is-disabled': disabled
        }
    ]"
  >
  <span v-if="$slots.default" @click="handleInnerClick"><slot></slot></span>
  </button>
</template>

<script>
export default {
  data () {
    return {}
  },

  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    disabled: Boolean,
    autofocus: Boolean,
    nativeType: {
      type: String,
      default: 'button'
    },
    buttonSize: {
      type: String,
      default: 'lg'
    }
  },

  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    },

    handleInnerClick (evt) {
      if (this.disabled) evt.stopPropagation()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
