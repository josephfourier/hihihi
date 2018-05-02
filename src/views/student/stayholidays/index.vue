<!-- 学生假期留校管理 -->
<template>
  <div class="zjy-app">

    <zjy-table-operator v-if="hasPermission('swms:stayholidays-stu:create')">
      <operator-item @click="create" clz="create">新增</operator-item>
    </zjy-table-operator>

    <zjy-table
      :data="list"
      :loading="loading"
      :columns="columns"
      @view="view"
    >
    </zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <el-dialog title="title" :visible.sync="visible" width="800px">
      <student-process
        v-if="visible"
        :data="data"
        v-model="value"
        :visible.sync="visible"
        @submit="handleSubmit"
      >
        <template slot-scope="props" slot="header">
          <zjy-form
            :data="props.formData"
            :reason.sync="reason"
            :type.sync="type"
            :hasError="hasError"
          ></zjy-form>
        </template>
      </student-process>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="visible2" width="800px">
      <process-view
        :data="data"
        v-model="value"
        :visible.sync="visible2"
        @submit="handleSubmit"
      >
        <template slot-scope="props" slot="header">
          <zjy-form-view
            :data="props.formData"
            :reason.sync="reason"
            :type.sync="type"
            :hasError="hasError"
          ></zjy-form-view>
        </template>

        <template slot-scope="props" slot="footer">
          <zjy-footer
            :data="props.data"
            :steps="props.steps"
            :visible.sync="visible2"
            :reason="reason"
            :type="type"
            @update="update"
            @delete="_delete"
          ></zjy-footer>
        </template>
      </process-view>
    </el-dialog>

  </div>
</template>

<script>
import stayholidaysAPI from './api'
import {getPermissionId, _refresh} from '@/utils'

import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyTable from '@/components/table'
import ZjyPagination from '@/components/pagination'
import StudentProcess from '@/components/process/StudentProcess'
import ProcessView from '@/components/process/ProcessView'
import ZjyForm from './form'
import ZjyFormView from './FormView'
import ZjyFooter from './Footer'

import commonAPI from '@/api/common'
import axios from 'axios'
import properties from './properties'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      value: {}, // 流程数据
      data: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      title: '留校申请',
      loading: false,
      visible: false,
      visible2: false,

      columns: properties.columns,
      // 业务数据
      reason: '',
      type: '',
      hasError: false
    }
  },

  methods: {
    create () {
      axios.all([
        commonAPI.queryInitial(getPermissionId(this.$route)),
        commonAPI.queryStudent()
      ]).then(axios.spread((r1, r3) => {
        if (r1.code !== 1  || r3.code !== 1) {
          this.$alert('获取数据失败')
        } else {
          this.value = r1.data   // 流程数据传入组件即可
          // 添加业务数据
          Object.assign(this.data, {
            student: r3.data,
            holidayType: this.holidayTypeList
          })
          this.visible = true
        }
      }))
    },

    handleSubmit (data, steps) {
      if (!this.type || !this.reason) {
        this.hasError = true
      } else {
        const arg = this.makeFormData(data, steps)
        stayholidaysAPI.create(arg).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.create.success'))
            }, 200)
            this.visible = false
            this.refresh()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    view (row) {
      commonAPI.queryApprovalProcess(row.studentId, row.stayholidayUid).then(response => {
        this.data = row
        this.type = row.holidayId
        this.reason = this.data.stayReason
        this.value = response.data
        Object.assign(this.data, {
          holidayType: this.holidayTypeList
        })
        this.visible2 = true
      })
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },

    makeFormData (data, steps) {
      return {
        'studentId': data.student.studentId,
        'holidayId': this.type,
        'holidayName': this.data.holidayType.find(i => i.valueKey == this.type).valueName,
        'stayReason': this.reason,
        'schoolCode': data.student.schoolCode,
        'swmsApprovalList': steps
      }
    },

    update (data, steps) {
      if (!this.reason) {
        this.hasError = true
      } else {
        stayholidaysAPI.update(data).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.update.success'))
            }, 200)
            this.visible2 = false
            this.refresh()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

    _delete (data) {
      stayholidaysAPI.delete(data.stayholidayUid).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.visible2 = false
          this.refresh()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    refresh () {
      _refresh.call(this)
    },
    clear () {
      this.type = ''
      this.reason = ''
      this.hasError = false
    }
  },

  computed: {
    ...mapGetters(['holidayTypeList'])
  },

  created () {
    this.$store.dispatch('setHolidayTypeList')
  },

  components: {
    ZjyPagination,
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    StudentProcess,
    ProcessView,
    ZjyForm,
    ZjyFormView,
    ZjyFooter
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stayholidaysAPI.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
        }).catch(error => {
          console.log(error)
        }).finally(_ => {
          this.loading = false
        })
      }
    },
    visible (val) {
      if (!val) {
        this.clear()
      }
    },
    visible2 (val) {
      if (!val) {
        this.clear()
      }
    }
  }
}
</script>
