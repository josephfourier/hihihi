<template>
  <div class="zjy-app">

    <zjy-table-search>
      <search-input label="用户姓名" :value.sync="query.teacherName"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

      <zjy-table
        :data="list"
        :columns="columns"
        :loading="loading"
        @view="handleView"
      ></zjy-table>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
        :pageSize="2"
      >
      </zjy-pagination>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="权限范围" :visible.sync="visible" width="800px">
        <zjy-list :data="permissionScope" :status="status" :message="message"></zjy-list>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import accountAPI from '@/api/teacher/account'

import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import ZjyPagination from '@/components/pagination'

import ZjyList from '@/components/list'
import ZjyTable from '@/components/table'

export default {
  data () {
    return {
      list: [],
      query: {
        offset: 0,
        limit: 2,
        teacherName: ''
      },
      teacherName: '',
      loading: false,
      currentPage: 1,
      total: 0,
      visible: false,

      permissionScope: [],
      status: '',
      message: '',

      columns: [
        {
          index: true,
          select: false
        },
        {
          label: '账号',
          prop: 'username',
          width: '300'
        },
        {
          label: '用户姓名',
          prop: 'teacherName',
          width: '200'
        },
        {
          label: '部门',
          prop: 'departmentName'
        },
        {
          label: '职务',
          prop: 'postName'
        },
        {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '查看',
              render: true,
              cmd: 'view'
            }
          ]
        }
      ]
    }
  },

  methods: {
    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    searchFilter () {
      this.loading = true
      this.teacherName = this.query.teacherName
      accountAPI.queryForList(0, this.query.limit, this.teacherName).then(resp => {
        this.list = resp.items
        this.total = resp.total
        this.loading = false
        this.currentPage = 1
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    //
    // refresh () {
    //   const old = this.currentPage
    //   this.currentPage = -1
    //   setTimeout(_ => {
    //     this.currentPage = old
    //   }, +this.$t('zjy.refresh.delay'))
    // },

    handleView (row) {
      this.queryScope(row.teacherLevel, row.departmentId).then(_ => {
        this.visible = true
      })
    },

    queryScope (level, id) {
      return new Promise((resolve, reject) => {
        accountAPI.queryPermissionScope(level, id).then(response => {
          let res = []
          if (typeof response.data === 'string') { res.push(response.data) } else res = response.data
          this.permissionScope = res
          this.status = response.code
          this.message = response.message
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

  },

  components: {
    ZjyTable,
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    ZjyPagination,
    ZjyList
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return
        this.loading = true
        accountAPI.queryForList((val - 1) * this.query.limit, this.query.limit, this.teacherName).then(resp => {
          this.list = resp.items
          this.total = resp.total
          this.loading = false
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>
<style lang="scss">
</style>
