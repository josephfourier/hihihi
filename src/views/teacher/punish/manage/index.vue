<template>
<div class="zjy-app">
  <zjy-table-search>
     <search-date label="处分年份" :value.sync="punishYear"></search-date>
    <search-select label="处分状态" :options="optionsStatus" :value.sync="punishStatus"></search-select>
    <search-input label="学号" :value.sync="studentCode"></search-input>
    <search-button @query="searchFilter"></search-button>
  </zjy-table-search>

  <div class="zjy-line"></div>

  <zjy-table-operator>
    <operator-item @click="create" clz="create" v-if="hasPermission('swms:punish-tea:create')">新增</operator-item>
    <!--<operator-item @click="batchRemove" clz="delete" v-if="hasPermission('swms:punish-tea:delete')">批量删除</operator-item>-->
    <operator-item @click="_export" clz="export">导出</operator-item>
  </zjy-table-operator>

  <div class="zjy-table">
    <zjy-table
      :data="list"
      :loading="loading"
      :columns="columns"
      @view="handleView"
      @delete="handleDelete"
      @selection-change="handleSelectionChange">
    </zjy-table>
  </div>

  <div class="zjy-pagination" v-if="list.length !== 0">
    <zjy-pagination
      :currentPage="currentPage"
      :total="total"
      @current-change="pageChanged"
    >
    </zjy-pagination>
  </div>

  <div class="zjy-dialog">

    <el-dialog title="查看处分" :visible.sync="visible" width="800px">
      <zjy-form
        v-if="visible"
        :data="data"
        :visible.sync="visible"
        @submit="rescind"
      >
      </zjy-form>
    </el-dialog>

    <el-dialog title="新增处分" :visible.sync="visible2" width="800px">
      <punish
        v-if="visible2"
        :visible.sync="visible2"
        @submit="handleSubmit"
      >
      </punish>
    </el-dialog>
  </div>

</div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import SearchDate from '@/components/table-search/search-date'
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import api from './api'

import ZjyForm from './form'
import Punish from './Punish'

import { _refresh, export2excel, dateFormat as _dateFormat } from '@/utils'

import properties from './properties'

export default {
  name: 'index',
  data () {
    return {
      list: [],
      data: {},
      query: properties.query,
      currentPage: 1,
      punishStatus: '',
      punishYear: new Date().getFullYear().toString(),
      studentCode: '',

      selectedRows: [],
      loading: false,
      visible: false,
      visible2: false,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns,

      queryExport: properties.queryExport,
      exportData: []
    }
  },
  methods: {
    refresh (auto) {
      return _refresh.call(this, auto)
    },

    searchFilter () {
      this.query.punishStatus = this.punishStatus
      this.query.punishYear = this.punishYear
      this.query.studentCode = this.studentCode.trim()
      this.currentPage = 1
      this.refresh()
    },
    create () {
      this.visible2 = true
    },

    // 撤销处分
    rescind (data) {
      api.update(data.punishUid, data).then(response => {
        if (response.code !== 1) {
          console.warn(response.message)
          MSG.warning('撤销失败')
        } else {
          setTimeout(_ => {
            MSG.success('撤销成功')
          }, 200)
          this.refresh().visible = false
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },

    batchRemove () {
      if (this.selectedRows.length === 0) {
        MSG.warning(this.$t('zjy.message.delete.none'))
        return
      }

      let ids = ''
      this.selectedRows.forEach(x => { ids += x.punishUid + '-' })
      this.loading = true
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1

      api.batchRemove(ids.replace(/^-|-$/g, '')).then(response => {
        if (response.code !== 1) {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.delete.error'))
        } else {
          MSG.success(this.$t('zjy.message.delete.success'))
          this.refresh(auto)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    _export () {
      this.loading = true
      this.getExportData().then(response => {
        this.exportData = response

        const header = properties.header
        const filter = properties.filter
        const excelName = properties.excelName
        const data = this.exportData
        if (data.length === 0) {
          MSG.warning(this.$t('zjy.message.export.none'))
          return
        }
        export2excel(header, filter, data, excelName, (filter, data) => {
          return data.map(v => filter.map(j => {
            if (j === 'punishDate') {
              return _dateFormat(v[j])
            } else return v[j]
          }))
        }).finally(_ => {
          this.exportData = []
        })
      }).finally(_ => {
        this.loading = false
      })
    },
    getExportData () {
      return new Promise((resolve, reject) => {
        if (this.selectedRows.length > 0) {
          resolve(this.selectedRows)
        } else {
          if (this.exportData.length === 0) {
            this.exportSearch().then(response => {
              resolve(response)
            })
          }
        }
      })
    },

    exportSearch () {
      return new Promise((resolve, reject) => {
        this.queryExport.punishStatus = this.punishStatus
        this.queryExport.punishYear = this.punishYear
        this.queryExport.studentCode = this.studentCode.trim()
        api.queryForList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    handleView (row) {
      this.data = row
      this.visible = true
    },

    handleDelete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      this.loading = true
      api.delete(row.punishUid).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.refresh(auto)
        } else {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.delete.error'))
          this.loading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    handleSubmit (data) {
      api.create(data.punishSettingUid, data).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.create.success'))
          }, 200)
          this.refresh().visible2 = false
        } else {
          MSG.warning(this.$t('zjy.message.create.error'))
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },

  destroyed () {
    this.query.punishStatus = ''
    this.query.punishYear = new Date().getFullYear().toString()
    this.query.studentCode = ''
    this.query.offset = 0
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    SearchDate,

    ZjyTableOperator,
    OperatorItem,

    ZjyTable,
    ZjyPagination,

    ZjyForm,
    Punish
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          if (response.code !== 1) {
             MSG.warning(response.message)
          } else {
            this.list = response.rows
            this.total = response.total
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      }
    },

    visible2 (val) {
      if (!val) this.data = {}
    }
  }
}
</script>

<style scoped>
</style>
