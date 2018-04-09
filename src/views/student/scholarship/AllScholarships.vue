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
        v-if="visible && type === +$t('zjy.operator.CREATE')"
        :data="data"
        v-model="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props" slot="header">
          <view-apply
            :data="props.formData"
            :applyReason.sync="applyReason"
            :hasError="hasError"
          ></view-apply>
        </template>
      </student-process>
      <view-setting v-if="type === +$t('zjy.operator.VIEW')" :visible.sync="visible" :data="data"></view-setting>
    </el-dialog>
  </div>
</template>

<script>
import allAPI from '@/api/student/scholarship/all-scholarship'
import commonAPI from '@/api/common'
import ZjyPagination from '@/components/pagination'
import {getPermissionId, _refresh} from '@/utils'
import ZjyButton from '@/components/button'

import StudentProcess from '@/components/process/StudentProcess'
import ViewApply from './ViewApply'
import ViewSetting from './ViewSetting'
import axios from 'axios'

import ZjyTable from '@/components/table'
export default {
  data () {
    return {
      data: {},    // 设置详情
      value: {},   // 对应审批
      list: [],
      currentPage: 1,
      total: 0,
      query: {
        offset: 0,
        limit: 10
      },
      loading: false,
      visible: false,
      type: '', // 查看或申请操作

      columns: [
        {
          index: true
        }, {
          label: '奖学金名称',
          prop: 'scholarshipName',
          width: 200
        }, {
          label: '人数限制',
          prop: 'numberLimit'
        }, {
          label: '奖学金级别',
          prop: 'scholarshipLevel'
        }, {
          label: '金额',
          prop: 'money'
        }, {
          label: '发放对象',
          prop: 'grantObject'
        }, {
          label: '申请年份',
          prop: 'grantWayName'
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
              cmd: 'view'
            },
            {
              label: '申请',
              render: row =>  row.applyStatus === '0',
              cmd: 'create'
            }
          ]
        }
      ],
      // 申请原因
      applyReason: '',
      hasError: false
    }
  },

  methods: {
    statusFormat (cellValue) {
      return ['可申请', '申请中'][+cellValue]
    },

    makeFormData (data, steps) {
      return {
        'applyReson': this.applyReason,
        'swmsApprovalList': steps
      }
    },

    handleSubmit (data, steps) {
      if (!this.applyReason) {
        this.hasError = true
      } else {
        allAPI.create(data.scholarshipsettingUid, this.makeFormData(data, steps)).then(response => {
          if (response.code === 1) {
            MSG.success('申请成功')
            this.visible = false
            this.refresh()
          } else {
            this.$alert(response.message)
          }
        }).catch(error => {

        })
      }
    },

    view (row) {
      this.type = +this.$t('zjy.operator.VIEW')
      this.data = row
      this.visible = true
      // allAPI.queryForObject(row.scholarshipsettingUid).then(response => {
      //   this.data = response.data
      //   // Object.assign(this.data, {
      //   //   applyReson: ''
      //   // })
      //   this.visible = true
      // }).catch(error => {})
    },

    create (row) {
      this.type = +this.$t('zjy.operator.CREATE')

      axios.all([commonAPI.queryInitial(getPermissionId(this.$route)), allAPI.queryForObject(row.scholarshipsettingUid)]).then(
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
    ZjyButton,

    StudentProcess,
    ViewApply,
    ViewSetting,

    ZjyTable
  },

  props: {
    active: Boolean
  },

  computed: {
    title () {
      return this.type === +this.$t('zjy.operator.CREATE') ? '奖学金申请' : '奖学金详情'
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        allAPI.queryForList(this.query).then(response => {
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
    },
    visible (val) {
      if (!val) {
        this.applyReason = ''
        this.hasError = false
        this.type = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
