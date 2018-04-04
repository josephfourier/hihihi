<template>
  <div
    class="zjy-table"
  >
    <el-table
      :data="data"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="select"
        type="selection"
        :width="columns[0].selectWidth ? columns[0].selectWidth : 35">
      </el-table-column>
      <el-table-column
        type="index"
        :label="columns[0].indexLabel ? columns[0].indexLabel : '序号'"
        :index="columns[0].indexStart ? columns[0].indexStart : 1"
        :width="columns[0].indexWidth ? columns[0].indexWidth : 55"
        v-if="index"
      >
      </el-table-column>

      <el-table-column
        v-for="item in __props"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.operators">
            <operator-content
              v-for="child in item.operators"
              :key="child.label"
              :data="scope.row"
              :label="child.label"
              :render="child.render"
              :cmd="child.cmd"
              :formatter="child.formatter"
              @operator="$emit(child.cmd,scope.row)"
            >
            </operator-content>
          </template>
          <template v-else>
          <span v-if="item.formatter">
            {{ item.formatter(scope.row[item.prop]) }}
          </span>
            <span v-else>
            {{ scope.row[item.prop] }}
          </span>
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
    OperatorContent: {
      props: {
        data: Object,
        label: String,
        render: Boolean,
        cmd: String,
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
        }
      },

      render (h) {
        const data = {
          class: ['zjy-btn-' + this.cmd],
          on: {
            click: this.handleClick
          }
        }
        return (<a {...data}>
          <i class="zjy-icon"></i>
          <span>{this._label}</span>
        </a>)
      }
    }
  }
}
</script>

<style scoped>

</style>
