<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="visible=true">新增</operator-item>
      <operator-item @click="batchRemove">删除</operator-item>
    </zjy-table-operator>

    <zjy-table
      v-loading="loading"
      :data="list"
      :columns="columns"
      @edit="edit"
      @delete="_delete"
      @selection-change="handleSelectionChange"
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
        <scholarship-setting
          v-if="visible"
          :formData="formData"
          :type="type"
          :visible.sync="visible"
          @submit="handleSubmit"
        >
        </scholarship-setting>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settingAPI from '@/api/teacher/scholarship/setting'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import ZjyPagination from '@/components/pagination'

import {_refresh} from '@/utils'

import ScholarshipSetting from './ScholarshipSetting'

export default {
  name: 'index',
  data () {
    return {
      list: [],
      currentPage: 1,
      total: 0,
      query: {
        offset: 0,
        limit: 10
      },

      loading: false,
      visible: false,

      formData: {},

      selectedRows: [],
      columns: [
        {
          index: true,
          select: true
        },
        {
          label: '奖学金名称',
          prop: 'scholarshipName',
          width: '300'
        },
        {
          label: '人员限数',
          prop: 'numberLimit',
          width: '200'
        },
        {
          label: '奖学金级别',
          prop: 'scholarshipLevel'
        },
        {
          label: '金额',
          prop: 'money'
        },
        {
          label: '开放申请',
          prop: 'isOpen',
          formatter: this.statusFormat
        },
        {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '删除',
              cmd: 'delete'
            },
            {
              label: '编辑',
              cmd: 'edit'
            }
          ]
        }
      ]
    }
  },

  methods: {
    currentChange (pageNumber) {
      this.currentPage = pageNumber
    },
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    refresh (auto) {
      return _refresh.call(this, auto)
    },

    statusFormat (cellValue) {
      return ['否', '是'][+cellValue]
    },

    batchRemove () {

    },
    //  ------------ 表格头操作 END ------------

    edit (row) {
      this.formData = row
      this.visible = true
    },

    _delete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      settingAPI.delete(row.scholarshipsettingUid).then(response => {
        if (response.code === 1) {
          this.refresh(auto)
        }
      })
    },
    //  ------------ 表格操作 END ------------

    //  验证成功提交表单数据
    handleSubmit (formData) {
      if (this.type === +this.$t('zjy.operator.EDIT')) {
        settingAPI.update(formData.scholarshipsettingUid, formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            this.$alert('修改成功')
            this.refresh().visible = false
          }
        })
      } else {
        settingAPI.create(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            this.$alert('新建成功')
            this.refresh().visible = false
          }
        })
      }
    }
  },

  computed: {
    title () {
      return !this.formData.scholarshipsettingUid ? '新增奖学金' : '修改奖学金'
    },
    type () {
      return !this.formData.scholarshipsettingUid ? +this.$t('zjy.operator.CREATE') : +this.$t('zjy.operator.EDIT')
    }
  },

  components: {
    ZjyPagination,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    ScholarshipSetting
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.query.offset = this.query.limit * (val - 1)
        settingAPI.queryForList.call(this, this.query).then(response => {
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
