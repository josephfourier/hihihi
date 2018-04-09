<!-- 学生违纪处分 -->
<template>
  <div class="zjy-app">

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

    <el-dialog title="违纪处分" :visible.sync="visible" width="800px">
      <zjy-form-view :data="data">
      </zjy-form-view>
    </el-dialog>

  </div>
</template>

<script>
import api from './api'

import ZjyTable from '@/components/table'
import ZjyPagination from '@/components/pagination'
import ZjyFormView from './FormView'

import properties from './properties'

export default {
  data () {
    return {
      data: {},
      list: [],
      currentPage: 1,
      total: 0,
      query: properties.query,

      loading: false,
      visible: false,

      columns: properties.columns
    }
  },

  methods: {

    view (row) {
      this.data = row
      this.visible = true
    },

    currentChange (pageNumber) {
      this.currentPage = pageNumber
    }
  },

  components: {
    ZjyPagination,
    ZjyTable,
    ZjyFormView
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryForList(this.query).then(response => {
          this.list = response.rows
          this.total = response.total
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
<style lang='scss' scoped>

</style>
