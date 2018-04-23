<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="visible=true">新增</operator-item>
    </zjy-table-operator>

    <zjy-table
      v-loading="loading"
      :data="list"
      :columns="columns"
      @edit="edit"
      @view="view"
    ></zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="currentChange"
      >
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog
        :title="title"
        :visible.sync="visible"
        width="800px"
      >
        <poor-setting
          v-if="visible"
          :data="formData"
          :visible.sync="visible"
          :type="type"
          @submit="handleSubmit"
        >
        </poor-setting>
      </el-dialog>
    </div>

    <div class="zjy-dialog">
      <el-dialog
        title="困难生设置查看"
        :visible.sync="visible2"
        width="800px"
      >
        <poor-setting-view
          v-if="visible2"
          :formData="formData"
          :visible.sync="visible2"
          @submit="handleSubmit"
        >
        </poor-setting-view>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import api from './api'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import ZjyPagination from '@/components/pagination'

import {_refresh} from '@/utils'

import properties from './properties'
import PoorSetting from './PoorSetting'
import PoorSettingView from './PoorSettingView'

export default {
  name: 'index',
  data () {
    return {
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      loading: false,
      visible: false,
      visible2: false,

      formData: {},

      columns: properties.columns
    }
  },

  methods: {
    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh (auto) {
      return _refresh.call(this, auto)
    },

    edit (row) {
      this.formData = row
      this.visible = true
    },

    view (row) {
      this.formData = row
      this.visible2 = true
    },

    handleSubmit (formData) {
      if (this.type === +this.$t('zjy.operator.EDIT')) {
        api.update(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            MSG.success('修改成功')
            this.refresh().visible = false
          }
        })
      } else {
        api.create(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            MSG.success('新建成功')
            this.refresh().visible = false
          }
        })
      }
    }
  },

  computed: {
    title () {
      return !this.formData.poorsettingUid ? '新增困难生设置' : '修改困难生设置'
    },
    type () {
      return !this.formData.poorsettingUid ? +this.$t('zjy.operator.CREATE') : +this.$t('zjy.operator.EDIT')
    }
  },

  components: {
    ZjyPagination,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    PoorSetting,
    PoorSettingView
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.query.offset = this.query.limit * (val - 1)
        api.queryForList.call(this, this.query).then(response => {
          this.list = response.rows
          this.total = response.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    visible (val) {
      if (!val) this.formData = {}
    }
  }
}
</script>

<style scoped>

</style>
