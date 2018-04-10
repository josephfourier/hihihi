<!-- 假期留校管理 -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="审批状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYear" :value.sync="applyYear"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <!--<operator-item @click="batchRemove" clz="delete">批量删除</operator-item>-->
      <!--<operator-item @click="_import" clz="import">导入</operator-item>-->
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @delete="_delete">
      </zjy-table>
    </div>

    <div class="zjy-pagination">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
        :pageSize="2"
      >
      </zjy-pagination>
    </div>
    <div class="zjy-dialog">
      <el-dialog title="假期留校审批" :visible.sync="visible" width="800px">
        <zjy-process
          v-if="visible"
          :data="data"
          v-model="value"
          @submit="handleSubmit"
        >
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

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPagination from '@/components/pagination'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'

import { _refresh } from '@/utils'

import stayholidaysAPI from '@/api/teacher/stayholidays'
import commonAPI from '@/api/common'
import properties from './properties'
export default {
  name: 'index',
  data () {
    return {
      dataStatus: '',
      applyYear: '',
      studentCode: '',
      query: properties.query,

      visible: false,

      list: [],
      currentPage: 1,
      total: 0,
      loading: false,

      optionsYear: properties.optionsYear,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns
    }
  },

  methods: {
    // 搜索
    searchFilter () {
      this.query.dataStatus = this.dataStatus
      this.query.applyYear = this.applyYear
      this.query.studentCode = this.studentCode
      this.currentPage = 1
      this.refresh()
    },

    pageChanged (pageNumber) { this.currentPage = pageNumber },

    // --------------- 搜索 END ---------------

    refresh (auto) { _refresh.call(this, auto) },

    // --------------- table操作 ---------------
    batchRemove () {

    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stayholidayUid).then(response => {
        this.data = row
        this.value = response.data
        this.visible = true
      })
    },

    _import (row) {

    },
    _export (row) {

    },

    _delete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      stayholidaysAPI.delete(row.stayholidayUid).then(response => {
        if (response.code === 1) {
          this.refresh(auto)
          MSG.success('删除成功')
        } else {
          this.$alert(response.message)
        }
      })
    },

    makeFormData (data, steps) {
      return {
        'applyDate': data.applyDate,
        'applyYear': data.applyYear,
        'dataStatus': data.dataStatus,
        'holidayId': data.holidayId,
        'holidayName': data.holidayName,
        'stayReason': data.stayReason,
        'stayholidayUid': data.stayholidayUid,
        'studentId': data.studentId,
        'swmsApprovalList': steps
      }
    },
    //  审批操作
    handleSubmit (data, steps) {
      stayholidaysAPI.update(this.makeFormData(data, steps)).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          this.refresh(false)
          this.visible = false
        }
      }).catch(error => {
        console.log(error)
      })
    }

  //  --------------- 审批操作 END ---------------
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,

    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    ZjyPagination,
    ZjyProcess,

    ZjyForm
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stayholidaysAPI.queryForList(this.query).then(response => {
          if (response.code !== 1) {
            alert(response.message)
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
    }
  }
}
</script>

<style scoped>

</style>
