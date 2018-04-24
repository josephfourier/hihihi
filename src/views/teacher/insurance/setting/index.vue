<!-- 投保管理教师端 -->
<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item clz="create" @click="create" class="create">新增</operator-item>
      <operator-item @click="batchRemove" clz="delete">批量删除</operator-item>
    </zjy-table-operator>

    <zjy-table v-loading="loading" :data="list" :columns="columns" @edit="edit" @delete="_delete" @selection-change="handleSelectionChange"></zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="currentChange">
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog :title="title" :visible.sync="visible" width="800px">
        <insurance-setting v-if="visible" :formData="setting" :type="type" :visible.sync="visible" @submit="handleSubmit">
        </insurance-setting>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import insuranceAPI from '@/api/teacher/insurance/setting'
import InsuranceSetting from './InsuranceSetting'
import ZjyPagination from '@/components/pagination'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import { _refresh } from '@/utils'
import properties from './properties'
export default {
  data() {
    return {
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

      type: 1, // 1编辑 2新增
      setting: {}, // 新增投保设置
      selectedRows: [],

      columns: properties.columns
    }
  },

  methods: {
    handleSubmit(data) {
      if (this.type === 1) {
        insuranceAPI.update(data.inssettingUid, data).then(response => {
          if (response.code === 1) {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.update.success'))
            }, 200)

            this.refresh().visible = false
          }
        })
      } else {
        insuranceAPI.create(data).then(response => {
          if (response.code === 1) {
            setTimeout(_ => {
              MSG.success(this.$t('zjy.message.create.success'))
            }, 200)
            this.refresh().visible = false
          }
        })
      }
    },
    create() {
      this.title = '新增保险'
      this.type = 2
      this.visible = true
    },

    edit(row) {
      insuranceAPI.queryForObject.call(this, row.inssettingUid).then(response => {
        this.title = '编辑保险'
        this.type = 1
        this.visible = true
        this.setting = response.data
      }).catch(error => {
        console.log(error)
      })
    },

    _delete(row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      insuranceAPI.delete(row.inssettingUid).then(response => {
        if (response.code !== 1) {
          MSG.warning(response.message)
        } else {
          this.refresh(auto)
          MSG.success(this.$t('zjy.message.delete.success'))
        }
      }).catch(error => {
        console.log(error)
      })
    },

    batchRemove() {
      let ids = ''
      this.selectedRows.forEach(x => {
        ids += x.inssettingUid + '-'
      })

      this.loading = true
      insuranceAPI.batchRemove(ids.replace(/^-|-$/g, '')).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          MSG.success(this.$t('zjy.message.delete.success'))
          this.refresh()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleSelectionChange(rows) {
      this.selectedRows = rows
    },

    currentChange(pageNumber) {
      this.currentPage = pageNumber
    },

    refresh() {
      return _refresh.call(this)
    }
  },

  components: {
    ZjyPagination,
    InsuranceSetting,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val, oldval) {
        if (val === -1 || val === 0) return

        this.query.offset = this.query.limit * (val - 1)
        insuranceAPI.queryForList.call(this, this.query).then(response => {
          this.list = response.rows
          this.total = response.total
        }).catch(error => {
          console.log(error)
        })
      }
    },

    visible(val) {
      if (!val) this.setting = {}
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
