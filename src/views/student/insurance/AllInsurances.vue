<!-- 投保管理教师端 -->
<template>
  <div class="wrapper">
    <zjy-table
      :data="list"
      :loading="loading"
      :columns="columns"
      @view="view"
      @create="create"
    >
    </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="currentChange"
      >
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <student-process
        :data="data"
        v-model="value"
        :type="type"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props">
          <zjy-form :data="props.formData"></zjy-form>
        </template>
      </student-process>
    </el-dialog>
  </div>
</template>

<script>
import insuranceAPI from '@/api/student/insurance/all'
import commonAPI from '@/api/common'
import ZjyPagination from '@/components/pagination'
import {getPermissionId, _refresh} from '@/utils'

import StudentProcess from '@/components/process/StudentProcess'
import ZjyForm from './form'
import axios from 'axios'

import ZjyTable from '@/components/table'

export default {
  data () {
    return {
      data: {}, // 保单设置详情
      value: {},   // 保单对应审批
      list: [],
      currentPage: 1,
      total: 0,
      query: {
        offset: 0,
        limit: 10
      },
      title: '',
      loading: false,
      visible: false,
      type: 1, // 查看或申请操作
      columns: [
        {
          index: true
        }, {
          label: '险种名称',
          prop: 'insuranceName',
          width: 200
        }, {
          label: '保险公司',
          prop: 'insuranceCompany'
        }, {
          label: '险种类别',
          prop: 'insuranceCategory'
        }, {
          label: '保险费用',
          prop: 'insuranceCost'
        }, {
          label: '保险期限',
          prop: 'insuranceLimit'
        }, {
          label: '状态',
          prop: 'applyStatus',
          formatter: this.statusFormat
        },
        {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '查看',
              render: true,
              cmd: 'view'
            },
            {
              label: '申请',
              render: true,
              cmd: 'create'
            }
          ]
        }
      ]
    }
  },

  methods: {
    statusFormat (cellValue) {
      return ['可申请', '申请中'][+cellValue]
    },

    handleSubmit (data, steps) {
      insuranceAPI.create(data.inssettingUid, steps).then(response => {
        if (response.code === 1) {
          this.$alert('申请成功')
          this.visible = false
          this.refresh()
        } else {
          this.$alert(response.message)
        }
      }).catch(error => {

      })
    },

    view (row) {
      this.title = '保单详情'
      this.type = +this.$t('zjy.operator.VIEW')
      insuranceAPI.queryForObject(row.inssettingUid).then(response => {
        this.data = response.data
        this.visible = true
      }).catch(error => {})
    },

    create (row) {
      this.title = '保单申请'
      this.type = +this.$t('zjy.operator.CREATE')

      axios.all([commonAPI.queryInitial(getPermissionId(this.$route)), insuranceAPI.queryForObject(row.inssettingUid)]).then(
        axios.spread((r1, r2) => {
          this.value = r1.data
          this.data = r2.data
          this.visible = true
        })
      )
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh () {
      _refresh.call(this)
    }
  },

  components: {
    ZjyPagination,

    StudentProcess,
    ZjyForm,

    ZjyTable
  },

  props: {
    active: Boolean
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        insuranceAPI.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      }
    },

    active (val) {
      if (val) this.refresh()
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
