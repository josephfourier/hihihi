<template>
  <div class="zjy-table">
    <el-table
      :data="data"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="select"
        type="selection"
        :width="columns[0].selectWidth ? columns[0].selectWidth : 35"
        :header-align="columns[0].shalign ? columns[0].shalign : 'center'"
      >
      </el-table-column>
      <el-table-column
        type="index"
        :label="columns[0].indexLabel ? columns[0].indexLabel : '序号'"
        :index="columns[0].indexStart ? columns[0].indexStart : 1"
        :width="columns[0].indexWidth ? columns[0].indexWidth : 45"
        :header-align="columns[0].ihalign ? columns[0].ihalign : 'center'"
        :align="columns[0].ihalign ? columns[0].ihalign : 'center'"
        v-if="index"
      >
      </el-table-column>

      <el-table-column
        v-for="item in __props"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        :align="item.align ? item.align: 'center'"
      >
        <template slot-scope="scope">
          <template v-if="item.operators">
            <div
              class="table-operator-group"
              :style="{width: item.operators.length > 2 ? '160px' : '', textAlign: item.operators.length === 1 ? 'center' : ''}"
            >
              <operator-content
                v-for="child in item.operators"
                :key="child.label"
                :data="scope.row"
                :label="child.label"
                :render="child.render"
                :cmd="child.cmd"
                :classFormatter="child.classFormatter"
                :formatter="child.formatter"
                @operator="$emit(child.cmd, scope.row)"
              >
              </operator-content>
            </div>
          </template>
          <template v-else>
            <dom-render v-if="item.domRender" :option="scope.row" :func="item.domRender"></dom-render>
            <template v-else>
              <span v-if="item.formatter">
                {{ item.formatter(scope.row[item.prop]) }}
              </span>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </template>
        </template>
      </el-table-column>
      <span slot="empty">{{ empty }}</span>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ZjyTable',
  data () {
    return {
      empty: this.$t('zjy.table.loadingText')
    }
  },
  props: {
    data: Array,
    columns: Array,
    loading: Boolean
  },
  computed: {
    index () {
      try {
        return this.columns[0].index
      } catch (e) {
        return false
      }
    },
    select () {
      try {
        return this.columns[0].select
      } catch (e) {
        return false
      }
    },

    __props () {
      if (this.index || this.select) {
        return this.columns.slice(1)
      } else {
        return this.columns
      }
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.$emit('selection-change', val)
    }
  },

  watch: {
    data: {
      deep: true,
      handler (val) {
        if (val) {
          this.empty = val.length === 0 ? this.$t('zjy.table.emptyText') : this.$t('zjy.table.loadingText')
        }
      }
    }
  },

  components: {
    DomRender: {
      props: {
        option: Object,
        func: Function
      },
      render (h) {
        return this.func(h, this.option)
      }
    },
    OperatorContent: {
      props: {
        data: Object,
        label: String,
        render: Function,
        cmd: String,
        classFormatter: Function,
        formatter: Function
      },

      methods: {
        handleClick () {
          this.$emit('operator', this.data)
        }
      },

      computed: {
        _label () {
          if (this.formatter) {
            return this.formatter(this.data, this.label)
          } else return this.label
        },
        innerRender () {
          if (this.render) {
            return this.render(this.data)
          } else {
            return true
          }
        }
      },

      render (h) {
        const data = {
          // class: ['zjy-btn-' + this.cmd, this.clz],
          class: this.classFormatter ? this.classFormatter(this.data) : 'zjy-btn-' + this.cmd,
          on: {
            click: this.handleClick
          }
        }
        return this.innerRender
          ? (<a {...data}>
            <i class="zjy-icon"></i>
            <span>{this._label}</span>
          </a>) : ''
      }
    }
  }
}
</script>
