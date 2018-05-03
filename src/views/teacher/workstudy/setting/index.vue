<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="visible=true" v-if="hasPermission('swms:workstudy-set:create')">新增</operator-item>
      <!--<operator-item @click="batchRemove" clz="delete">批量删除</operator-item>-->
    </zjy-table-operator>

    <zjy-table v-loading="loading" :data="list" :columns="columns" @edit="edit" @delete="_delete" @selection-change="handleSelectionChange"></zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="pageChanged">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog :title="title" :visible.sync="visible" width="800px">
        <study-setting v-if="visible" :data="formData" :visible.sync="visible" @submit="handleSubmit">
        </study-setting>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPagination from '@/components/pagination'

import { _refresh } from '@/utils'

import api from './api'
import properties from './properties'

import StudySetting from './StudySetting'

export default {
  name: 'index',
  data () {
    return {
      query: properties.query,
      list: [],
      currentPage: 1,

      loading: false,
      visible: false,

      formData: {},

      selectedRows: [],
      columns: properties.columns
    }
  },

  methods: {
    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    refresh (auto) {
      return _refresh.call(this, auto)
    },

    batchRemove () {
      if (this.selectedRows.length === 0) {
        MSG.warning('至少选择一条记录')
        return
      }

      let ids = ''
      this.selectedRows.forEach(x => {
        ids += x.worksettingUid + '-'
      })
      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1
      api.delete(ids.replace(/^-|-$/g, '')).then(response => {
        MSG.success('删除成功')
        this.refresh(auto)
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
      })
    },

    edit (row) {
      this.formData = row
      this.visible = true
    },

    _delete (row) {
      this.loading = true
      const auto = this.list.length === 1 && this.currentPage !== 1
      api.delete(row.worksettingUid).then(response => {
        if (response.code === 1) {
          this.refresh(auto)

          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
        } else {
          MSG.warning(response.message)
          this.loading  = false
        }
      })
    },

    handleSubmit (formData) {
      if (this.type === +this.$t('zjy.operator.EDIT')) {
        api.update(formData).then(response => {
          if (response.code !== 1) {
            MSG.warning(response.message)
          } else {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.update.success'))
            }, 200)

            this.refresh().visible = false
          }
        })
      } else {
        api.create(formData).then(response => {
          if (response.code !== 1) {
            MSG.warning(response.message)
          } else {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.create.success'))
            }, 200)

            this.refresh().visible = false
          }
        })
      }
    }
  },

  computed: {
    title () {
      return !this.formData.worksettingUid ? '新增岗位' : '修改岗位'
    },
    type () {
      return !this.formData.worksettingUid ? +this.$t('zjy.operator.CREATE') : +this.$t('zjy.operator.EDIT')
    }
  },

  components: {
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,
    ZjyPagination,

    StudySetting
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true

        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
        }).catch(error => {
        }).finally(_ => {
          this.loading = false
        })
      }
    },
    visible (val) {
      if (!val) this.formData = {}
    }
  }
}
</script>

