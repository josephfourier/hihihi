import Pager from './pager.vue'
import ZjyInput from '@/components/input'

export default {
  name: 'ZjyPagination',

  props: {
    // 每页显示条数
    pageSize: {
      type: Number,
      default: 10
    },

    small: Boolean,

    total: Number,

    // 当前页
    currentPage: {
      type: Number,
      default: 1
    },

    layout: {
      default: 'first, prev, pager, next, last, jumper, total'
    },

    popperClass: String,
    firstText: String,
    prevText: String,
    nextText: String,
    lastText: String,
    jumperText: String,
    gotoText: String,
    background: Boolean
  },

  data () {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0
    }
  },

  render (h) {
    let template = <div class={['el-pagination', {
      'is-background': this.background,
      'el-pagination--small': this.small
    }]}> </div>

    const layout = this.layout || ''
    if (!layout) return
    const TEMPLATE_MAP = {
      first: <first></first>,
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager currentPage={this.internalCurrentPage} pageCount={this.internalPageCount} on-change={this.handleCurrentChange}></pager>,
      next: <next></next>,
      last: <last></last>,
      slot: <my-slot></my-slot>,
      total: <total></total>
    }

    const components = layout.split(',').map((item) => item.trim())
    components.forEach(compo => {
      template.children.push(TEMPLATE_MAP[compo])
    })

    return template
  },

  components: {
    MySlot: {
      render (h) {
        return this.$parent.$slots.default
          ? this.$parent.$slots.default[0]
          : ''
      }
    },

    First: {
      render (h) {
        return (
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }]}
            on-click={this.$parent.first}>
            {
              this.$parent.firstText
                ? <span>{this.$parent.firstText}</span>
                : <span>首页</span>
            }
          </button>
        )
      }
    },

    Prev: {
      render (h) {
        return (
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }]}
            on-click={this.$parent.prev}>
            {
              this.$parent.prevText
                ? <span>{this.$parent.prevText}</span>
                : <span>上一页</span>
            }
          </button>
        )
      }
    },

    Next: {
      render (h) {
        return (
          <button
            type="button"
            class={[
              'btn-next',
              { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            ]}
            on-click={this.$parent.next}>
            {
              this.$parent.nextText
                ? <span>{this.$parent.nextText}</span>
                : <span>下一页</span>
            }
          </button>
        )
      }
    },

    Last: {
      render (h) {
        return (
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }]}
            on-click={this.$parent.last}>
            {
              this.$parent.lastText
                ? <span>{this.$parent.lastText}</span>
                : <span>末页</span>
            }
          </button>
        )
      }
    },

    Jumper: {
      data () {
        return {
          oldValue: null
        }
      },

      components: {ZjyInput},

      methods: {
        handleFocus (event) {
          this.oldValue = event.target.value
        },
        handleBlur ({ target }) {
          this.resetValueIfNeed(target.value)
          this.reassignMaxValue(target.value)
        },
        handleKeyup ({ target }) {
          this.$refs.input.$el.querySelector('input').value = target.value.replace(/[^\d]/g, '')
        },
        handleGo ({ target }) {
          const value = this.$refs.input.$el.querySelector('input').value
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value)
          this.oldValue = null
          this.resetValueIfNeed(value)
          // this.resetValueIfNeed(target.value)
          // this.reassignMaxValue(target.value)
        },
        handleChange ({value}) {
          // this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value)
          // this.oldValue = null
          // this.resetValueIfNeed(value)
        },
        resetValueIfNeed (value) {
          const num = parseInt(value, 10)
          if (!isNaN(num)) {
            if (num < 1) {
              this.$refs.input.$el.querySelector('input').value = 1
            } else {
              this.reassignMaxValue(value)
            }
          }
        },
        reassignMaxValue (value) {
          if (+value > this.$parent.internalPageCount) {
            this.$refs.input.$el.querySelector('input').value = this.$parent.internalPageCount
          }
        }
      },

      render (h) {
        return (
          <span class="el-pagination__jump">
            <span class="jumper-text"> {this.$parent.jumperText || '跳转到'} </span>
            {<zjy-input
              class="is-in-pagination"
              ref="input"
              onKeyup={this.handleKeyup}
              value={ this.$parent.internalCurrentPage }
            ></zjy-input>}
            <a class="goto" href="javascript:;" onClick={this.handleGo} >{this.$parent.gotoText || 'GO'}</a>
          </span>
        )
      }
    },

    Total: {
      render (h) {
        return (
          typeof this.$parent.total === 'number'
            ? <span class="el-pagination__total">{this.$parent.totalText || '共'}{this.$parent.total}条记录</span>
            : ''
        )
      }
    },

    Pager
  },

  methods: {
    handleCurrentChange (val) {
      this.internalCurrentPage = this.getValidCurrentPage(val)
    },

    first () {
      this.internalCurrentPage = 1
    },

    prev () {
      const newVal = this.internalCurrentPage - 1
      if (newVal < 0) return
      this.internalCurrentPage = this.getValidCurrentPage(newVal)
    },

    next () {
      const newVal = this.internalCurrentPage + 1
      this.internalCurrentPage = this.getValidCurrentPage(newVal)
    },

    last () {
      const newVal = this.internalPageCount
      this.internalCurrentPage = this.getValidCurrentPage(newVal)
    },

    getValidCurrentPage (value) {
      value = parseInt(value, 10)

      const havePageCount = typeof this.internalPageCount === 'number'

      let resetValue
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1
      } else {
        if (value < 1) {
          resetValue = 1
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1
      } else if (resetValue === 0) {
        resetValue = 1
      }

      return resetValue === undefined ? value : resetValue
    }
  },

  computed: {
    internalPageCount () {
      if (typeof this.total === 'number') {
        return Math.ceil(this.total / this.internalPageSize)
      } else if (typeof this.pageCount === 'number') {
        return this.pageCount
      }
      return null
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        // this.internalCurrentPage = val
        // 每次更新时使用-1
        if (val > 0) { this.internalCurrentPage = val }
      }
    },

    pageSize: {
      immediate: true,
      handler (val) {
        this.internalPageSize = val
      }
    },

    internalCurrentPage (newVal, oldVal) {
      newVal = parseInt(newVal, 10)

      /* istanbul ignore if */
      if (isNaN(newVal)) {
        newVal = oldVal || 1
      } else {
        newVal = this.getValidCurrentPage(newVal)
      }

      if (newVal !== undefined) {
        this.$nextTick(() => {
          this.internalCurrentPage = newVal
          if (oldVal !== newVal) {
            this.$emit('update:currentPage', newVal)
            this.$emit('current-change', this.internalCurrentPage)
          }
        })
      } else {
        this.$emit('update:currentPage', newVal)
        this.$emit('current-change', this.internalCurrentPage)
      }
    },

    internalPageCount (newVal) {
      /* istanbul ignore if */
      const oldPage = this.internalCurrentPage
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal
      }
    }
  }
}

// Boolean可以不用初始化无值时undefined,bool运算时相当于false
