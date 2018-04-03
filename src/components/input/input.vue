<!--  -->
<template>
  <div :class="[
    type === 'textarea' ? 'zjy-textarea' : 'zjy-input',
    inputSize ? 'zjy-input--' + inputSize : '',
    {
      'is-disabled': disabled,
      'zjy-input--prefix': $slots.prefix || prefixIcon,
      'zjy-input--suffix': $slots.suffix || suffixIcon
    }
    ]" @mouseenter="hovering=true" @mouseleave="hovering=false">
    <template v-if="type !== 'textarea'">
      <input
      v-if="type !== 'textarea'"
      class="zjy-input__inner"
      v-bind="$props"
      :autoComplete="autoComplete"
      :value="currentValue"
      ref="input" @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keyup="handleKeyup">
    </template>
    <textarea
      v-else
      class="zjy-textarea__inner"
      v-bind="$props"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'ZjyInput',
  componentName: 'ZjyInput',
  data () {
    return {
      currentValue: this.value,
      prefixOffset: null,
      suffixOffset: null,
      hovering: false,
      focused: false
    }
  },
  props: {
    value: [String, Number],
    placeholder: String,
    size: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    inputSize () {
      return this.size
    }
  },

  watch: {
    value (val, oldValue) {
      this.setCurrentValue(val)
    }
  },
  methods: {
    focus () {
      (this.$refs.input || this.$refs.textarea).focus()
    },
    handleKeyup () {
      this.$emit('keyup', event)
    },
    getMigratingConfig () {
      return {
        props: {
          icon: 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          click: 'click is removed.'
        }
      }
    },
    handleBlur (event) {
      this.focused = false
      this.$emit('blur', event)
    },
    inputSelect () {
      (this.$refs.input || this.$refs.textarea).select()
    },

    handleFocus (event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleInput (event) {
      const value = event.target.value
      this.$emit('input', value)
      this.setCurrentValue(value)
    },
    handleChange (event) {
      this.$emit('change', event.target.value)
    },
    setCurrentValue (value) {
      if (value === this.currentValue) return

      this.currentValue = value
    },
    calcIconOffset (place) {
      const pendantMap = {
        suf: 'append',
        pre: 'prepend'
      }
    },
    clear () {
      this.$emit('input', '')
      this.$emit('change', '')
      this.setCurrentValue('')
      this.focus()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
