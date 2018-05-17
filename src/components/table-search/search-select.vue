<template>
  <div class="zjy-table-search__item">
    <label class="search-label" v-if="label || $slots.label" v-bind:style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </label>
    <!--<el-select-->
      <!--v-model="inner"-->
      <!--:placeholder="placeholder"-->
      <!--@focus="handleFocus"-->
      <!--:loading="loading"-->
      <!--:loading-text="loadingText"-->
    <!--&gt;-->
      <!--<el-option-->
        <!--key="-1"-->
        <!--:label="initText ? initText : '不限'"-->
        <!--value=""-->
      <!--&gt;-->
      <!--</el-option>-->
      <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value"-->
      <!--&gt;-->
      <!--</el-option>-->
    <!--</el-select>-->
    <el-select
      v-model="inner"
      :placeholder="placeholder"
      @focus="handleFocus"
      :loading="loading"
      :loading-text="loadingText"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
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
    value: [String, Number],
    label: String,
    labelWidth: String,
    placeholder: String,
    options: Array,
    loading: Boolean,
    initText: String,
    loadingText: {
      type: String,
      default () {
        return  this.$t('zjy.select.loading')
      }
    }
  },

  methods: {
    handleFocus () {
      this.$emit('focus')
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
