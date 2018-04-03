<template>
<div class="zjy-search-panel">
  <p class="zjy-search-panel__header">
    <span>{{ title }}</span>
  </p>
  <div class="zjy-search-panel__body">
    <el-input
      class="zjy-search-panel__filter"
      v-model="query"
      size="small"
      :placeholder="placeholder"
      @mouseenter.native="inputHover=true"
      @mouseleave.native="inputHover=false"
      v-if="filterable"
      :style="{borderBottom: filteredData.length > 0 && type === 'ul' ? 'none' : ''}"
    >
    <i
      slot="prefix"
      :class="['zjy-icon', 'zjy-search-input__icon']"
    >
    </i>
    </el-input>
    <ul v-if="type === 'ul'">
      <li
        :class="[{checked: !!checked.find(x => x[keyProp] === item[keyProp])}, 'zjy-search-panel__item']"
        v-for="(item) in filteredData"
        :key="item.keyProp"
        @click="handleChecked(item)"
      >
        <option-content :option="item"></option-content>
      </li>
    </ul>
    <el-radio-group
      v-if="type === 'radio'"
      v-model="radio"
    >
      <el-radio
        class="zjy-search-panel__item"
        v-for="item in filteredData"
        :key="item[keyProp]"
        :label="item[keyProp]"
        @change="handleChange"
      >
        <option-content :option="item"></option-content>
      </el-radio>
    </el-radio-group>
    <p
        class="zjy-search-panel__empty"
        v-show="hasNoMatch">{{ empty }}
    </p>
    <p class="zjy-search-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</div>
</template>

<script>
export default {
  name: 'search-panel',
  componentName: 'search-panel',

  data () {
    return {
      inputHover: false,
      query: '',
      checked: [],
      radio: ''
    }
  },

  props: {
    title: String,
    placeholder: String,
    filterable: Boolean,
    props: Object,
    filterMethod: Function,
    renderContent: Function,
    clearChecked: Boolean,
    empty: {
      type: String,
      default: 'no result'
    },
    defaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: String,
      default: 'ul'
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    labelProp () { return this.props['label'] || 'label' },

    keyProp () { return this.props['key'] || 'key' },

    filteredData () {
      return this.data.filter(x => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, x)
        } else {
          const label = x[this.labelProp] || x[this.keyProp].toString()
          return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
        }
      })
    },

    hasNoMatch () {
      return this.query.length > 0 && this.filteredData.length === 0
    },

    hasFooter () {
      return !!this.$slots.default
    }
  },

  methods: {
    handleChecked (item) {
      if (this.checked.find(x => x[this.keyProp] === item[this.keyProp])) return false
      else {
        this.checked.splice(0, this.checked.length)
        this.checked.push(item)
        this.$emit('option-checked', item)
      }
    },

    handleChange (key) {
      const item = this.filteredData.find(x => x[this.keyProp] === key)
      this.$emit('option-checked', item)
    }
  },

  components: {
    OptionContent: {
      props: {
        option: Object
      },

      render (h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'search-panel') {
            return vm
          } else if (vm.$parent) {
            return getParent(vm.$parent)
          } else return vm
        }

        const parent = getParent(this)
        return parent.renderContent
          ? parent.renderContent(h, this.option)
          : (<span>{ this.option[parent.labelProp] || this.option[parent.keyprop] }</span>)
      }
    }
  },

  watch: {
    defaultChecked: {
      immediate: true,
      handler (val, oldVal) {
        // if (oldVal && val.length === oldVal.length && val.every(x => oldVal.indexOf(x) > -1)) return
        if (this.type === 'radio') {
          val.forEach(x => { if (x < this.filteredData.length) this.radio = this.filteredData[x][this.keyProp] })
        } else {
          val.forEach(x => {
            if (x < this.filteredData.length) {
              if (this.checked.length === 0) { this.checked.push(this.filteredData[x]) }
            }
          })
        }
      }
    },

    clearChecked (val) {
      if (val) {
        this.checked = []
        this.radio = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
