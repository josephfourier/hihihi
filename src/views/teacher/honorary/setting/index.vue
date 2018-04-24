<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="visible=true">新增</operator-item>
      <!--<operator-item @click="batchRemove" clz="delete">删除</operator-item>-->
    </zjy-table-operator>

    <zjy-table v-loading="loading" :data="list" :columns="columns" @edit="edit" @delete="_delete" @selection-change="handleSelectionChange"></zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog :title="title" :visible.sync="visible" width="800px">
        <honorary-setting v-if="visible" :data="formData" :visible.sync="visible" @submit="handleSubmit">
        </honorary-setting>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settingAPI from '@/api/teacher/Honorary/setting'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import ZjyPagination from '@/components/pagination'

import { _refresh } from '@/utils'

import properties from './properties'
import HonorarySetting from './HonorarySetting'

export default {
  name: 'index',
  data() {
    return {
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      loading: false,
      visible: false,

      formData: {},

      selectedRows: [],
      columns: properties.columns
    }
  },

  methods: {
    currentChange(pageNumber) {
      this.currentPage = pageNumber
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },

    refresh(auto) {
      return _refresh.call(this, auto)
    },

    batchRemove() {

    },
    //  ------------ 表格头操作 END ------------

    edit(row) {
      this.formData = row
      this.visible = true
    },

    _delete(row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      settingAPI.delete(row.honorarysettingUid).then(response => {
        if (response.code === 1) {
          this.refresh(auto)
          MSG.success('删除成功')
        } else {
          this.$alert(response.message)
        }
      })
    },
    //  ------------ 表格操作 END ------------

    //  验证成功提交表单数据
    handleSubmit(formData) {
      if (this.type === +this.$t('zjy.operator.EDIT')) {
        settingAPI.update(formData.honorarysettingUid, formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            setTimeout(_ => {
              MSG.success('修改成功')
            }, 200)
            this.refresh().visible = false
          }
        })
      } else {
        settingAPI.create(formData).then(response => {
          if (response.code !== 1) {
            this.$alert(response.message)
          } else {
            setTimeout(_ => {
              MSG.success('新建成功')
            }, 200)
            this.refresh().visible = false
          }
        })
      }
    }
  },

  computed: {
    title() {
      return !this.formData.honorarysettingUid ? '新增荣誉称号' : '修改荣誉称号'
    },
    type() {
      return !this.formData.honorarysettingUid ? +this.$t('zjy.operator.CREATE') : +this.$t('zjy.operator.EDIT')
    }
  },

  components: {
    ZjyPagination,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,

    HonorarySetting
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
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
    visible(val) {
      if (!val) this.formData = {}
    }
  }
}
</script>

<style scoped>

</style>
