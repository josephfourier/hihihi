<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="院系" :options="myFacultyList" :value.sync="facultyCode" :loading="isLoading" @focus="handleFocus"></search-select>
      <search-select label="专业" :options="mySpecialtyList" :value.sync="specialtyCode" @focus="handleInit" :loading="isLoading2"></search-select>
      <search-select label="申请状态" :options="optionsStatus" :value.sync="dataStatus"></search-select>
      <search-select label="申请年份" :options="optionsYears" :value.sync="applyYear"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <!--<operator-item @click="visible2 = true" clz="create">批量通过</operator-item>-->
      <operator-item @click="visible2 = true" clz="import">导入</operator-item>
      <operator-item @click="visible2 = true" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table :data="list" :loading="loading" :columns="columns" @view="handleView">
      </zjy-table>
    </div>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="pageChanged">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="困难生申请审批" :visible.sync="visible" width="800px">
        <zjy-process v-if="visible" :data="setting" v-model="value" @close="visible = false" @submit="handleSubmit">
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
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import api from './api'
import commonAPI from '@/api/common'

import ZjyProcess from '@/components/process'
import ZjyForm from './form'
import { _refresh } from '@/utils'
import properties from './properties'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      list: [],
      setting: '',
      query: properties.query,

      facultyCode: '',
      specialtyCode: '',
      applyYear: '',
      dataStatus: '',

      loading: false,
      isLoading2: false,
      currentPage: 1,
      total: 0,

      visible: false,

      // facultyList: [],
      mySpecialtyList: [],
      optionsYears: properties.optionsYears,
      optionsStatus: properties.optionsStatus,
      columns: properties.columns
    }
  },

  computed: {
    ...mapGetters(['facultyList', 'specialtyList']),
    myFacultyList () {
      return this.facultyList.map(i => {
        return {
          label: i.facultyName,
          value: i.facultyCode
        }
      })
    },
    // mySpecialtyList () {
    //   if (!this.factoryCode) {
    //     return this.specialtyList.map(i => {
    //       return {
    //         label: i.specialtyName,
    //         value: i.specialtyCode
    //       }
    //     })
    //   } else {
    //   }
    // },
    isLoading () {
      return this.myFacultyList.length === 0
    }
  },

  methods: {
    handleInit () {
      if (!this.facultyCode) {
        this.$store.dispatch('setSpecialtyList').then(_ => {
          this.mySpecialtyList = this.specialtyList.map(i => {
            return {
              label: i.specialtyName,
              value: i.specialtyCode
            }
          })
        })
      }
    },
    handleFocus () {
      if (this.myFacultyList.length === 0) {
        this.$store.dispatch('setFacultyList')
      }
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    searchFilter () {
      this.query.facultyCode = this.facultyCode
      this.query.applyYear = this.applyYear
      this.query.dataStatus = this.dataStatus
      this.currentPage = 1
      this.refresh()
    },

    handleView (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.poorUid).then(response => {
        this.setting = row
        this.value = response.data
        this.visible = true
      })
    },

    refresh () {
      return _refresh.call(this)
    },

    makeFormData (data, steps) {
      return {
        poorUid: data.poorUid,
        studentId: data.studentId,
        swmsApprovalList: steps
      }
    },

    handleSubmit (data, steps) {
      api.submit(this.makeFormData(data, steps)).then(response => {
        if (response.code === 1) {
          setTimeout(_ => { MSG.success('保存成功') }, 200)
          this.visible = false
          this.refresh()
        } else {
          MSG.success('保存失败')
        }
      }).catch(error => {
      })
    }
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
    },

    facultyCode (val) {
      if (!val) return
      commonAPI.querySpecialtyByFaculty(val).then(response => {
        if (response.code !== 1) {
          this.$alert('获取专业失败')
        } else {
          this.mySpecialtyList = response.data.map(i => {
            return {
              label: i.specialtyName,
              value: i.specialtyCode
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
