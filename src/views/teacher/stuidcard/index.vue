<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="入学年份" :options="years" :value.sync="enterYear"></search-select>
      <search-select label="申请状态" :options="status" :value.sync="dataStatus"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <template v-if="false && hasPermission('swms:stuidcard-tea:delete')">
       <div class="zjy-line"></div>
      <zjy-table-operator>
          <operator-item @click="batchRemove" clz="delete">批量删除</operator-item>
        </zjy-table-operator>
    </template>

    <div class="zjy-table">
      <zjy-table :data="list" :loading="loading" :columns="columns" @view="view" @delete="_delete" @selection-change="handleSelectionChange">
      </zjy-table>
    </div>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="学生证补办审批" :visible.sync="visible" width="800px">
        <zjy-process v-if="visible" :data="data" v-model="value" :visible.sync="visible" @submit="handleSubmit">
          <template slot-scope="props" slot="header">
            <zjy-form :data="props.formData"></zjy-form>
          </template>
        </zjy-process>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyTable from '@/components/table'

import cardAPI from '@/api/teacher/stuidcard'
import commonAPI from '@/api/common'
import ZjyPagination from '@/components/pagination'

import { _refresh } from '@/utils'
import ZjyProcess from '@/components/process'
import ZjyForm from './form'

import properties from './properties'
export default {
  name: 'student-card',
  data () {
    return {
      list: [],
      total: '',
      currentPage: 1,
      visible: false,
      value: '',
      data: '',
      query: properties.query,
      enterYear: '',
      dataStatus: '',
      studentCode: '',

      loading: false,
      selectedRows: [],

      years: properties.years,
      status: properties.status,
      columns: properties.columns
    }
  },

  methods: {
    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stuidcardUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    searchFilter () {
      this.currentPage = 1
      this.query.dataStatus = this.dataStatus
      this.query.enterYear = this.enterYear
      this.query.studentCode = this.studentCode.trim()
      this.refresh()
    },

    handleSubmit (data, steps) {
      cardAPI.approved(this.data, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => { MSG.success(this.$t('zjy.message.approve.success')) }, 200)
          this.refresh()
          this.visible = false
          //  待办状态刷新
          this.$store.dispatch('setSchedules')
          // this.$store.dispatch('removeFromTodoList', data.stuidcardUid)
        } else {
          MSG.warning(this.$t('zjy.message.approve.error'))
        }
      }).catch(error => { })
    },

    batchRemove () {
      if (this.selectedRows.length === 0) {
        MSG.warning(this.$t('zjy.message.delete.none'))
        return
      }

      let ids = ''
      const auto = this.selectedRows.length === this.list.length && this.currentPage !== 1
      this.selectedRows.forEach(x => {
        ids += x.studentId + '-'
      })
      this.loading = true
      cardAPI.batchRemove(ids.replace(/^-|-$/g, '')).then(response => {
        if (response.code !== 1) {
          MSG.warning(this.$t('zjy.message.delete.error'))
          this.loading = false
        } else {
          this.refresh(auto)
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    _delete (row) {
      this.loading = true
      const auto = this.list.length === 1 && this.currentPage !== 1
      cardAPI.batchRemove(row.studentId).then(response => {
        if (response.code !== 1) {
          this.loading = false
          MSG.warning(this.$t('zjy.message.delete.error'))
        } else {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.refresh(auto)
        }
      }).catch(error => {
        console.log(error)
      })
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh (auto) {
      _refresh.call(this, auto)
    }
  },

  destroyed () {
    this.query.enterYear = ''
    this.query.dataStatus = ''
    this.query.studentCode = ''
    this.query.offset = 0
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    ZjyPagination,
    SearchSelect,
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    ZjyProcess,

    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return
        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        cardAPI.queryForList(this.query).then(response => {
          if (response.code !== 1) {
            MSG.warning(response.message)
          } else {
            this.list = response.rows
            this.total = response.total
          }
        }).catch(error => {
          console.log(error)
        }).finally(_ => {
          this.loading = false
        })
      }
    }
  }
}
</script>
