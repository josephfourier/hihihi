<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="保单状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYear" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator v-if="hasPermission('swms:insurance-tea:create')">
      <operator-item @click="visible2 = true" clz="create">批量投保</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="handleView">
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
      <el-dialog title="保单审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="setting"
          v-model="value"
          @close="visible = false"
          @submit="handleSubmit"
        >
          <template slot-scope="props" slot="header">
            <zjy-form :data="props.formData"></zjy-form>
          </template>
        </zjy-process>
      </el-dialog>

      <el-dialog title="批量投保" :visible.sync="visible2" width="800px">
        <batch-insurance
          v-if="visible2"
          :visible.sync="visible2"
        >
        </batch-insurance>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import api from './api'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import BatchInsurance from './BatchInsurance'
import { _refresh } from '@/utils'
import properties from './properties'

export default {
  data () {
    return {
      list: [],
      setting: '',
      query: properties.query,
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      loading: false,
      currentPage: 1,
      total: 0,

      visible: false,
      visible2: false,

      optionsYear: properties.optionsYear,

      optionsStatus: properties.optionsStatus,
      columns: properties.columns
    }
  },

  methods: {
    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },

    handleView (row) {
      api.queryApprovalProcess(row.studentId, row.insuranceUid).then(response => {
        this.setting = row
        this.value = response.data
        this.visible = true
      })
    },

    refresh () {
      _refresh.call(this)
    },

    handleSubmit (data, steps) {
      api.submit(data.insuranceUid, data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          setTimeout(_ => { MSG.success('保存成功') }, 200)
          this.visible = false
          this.refresh()
          // this.$store.dispatch('setSchedules')
          this.$store.dispatch('removeFromTodoList', data.inssettingUid)
        } else {
          MSG.success('保存失败')
        }
      }).catch(error => {
      })
    }
  },

  destroyed () {
    this.query.applyYear = ''
    this.query.dataStatus = ''
    this.query.studentCode = ''
    this.query.offset = 0
  },


  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    ZjyTable,
    ZjyPagination,
    ZjyProcess,
    ZjyTableOperator,
    OperatorItem,
    BatchInsurance,
    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          if (response.code !== 1) {
            alert(response.message)
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
