<!--  -->
<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="入学年份" :options="years" :value.sync="enterYear"></search-select>
      <search-select label="班级" :options="classes" :value.sync="classId"></search-select>
      <search-input label="学号" :value.sync="studentNo"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <operator-item @click="create" clz="create">新增</operator-item>
      <operator-item @click="_import" clz="import">导入</operator-item>
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="view"
        @edit="edit"
        @selection-change="handleSelectionChange"
      >
      </zjy-table>
    </div>

    <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination
        :currentPage="currentPage"
        :total="total"
        @current-change="pageChanged"
      >
      </zjy-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="visible" width="800px">
      <zjy-file
        v-if="visible"
        :formData="file"
        v-model="settings"
        :type="type"
        :visible.sync="visible"
        :list="fileList"
      ></zjy-file>
    </el-dialog>

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

import {dateFormat as _dateFormat, _refresh, export2excel} from '@/utils'

import stufileManageAPI from '@/api/teacher/stufile/manage'
import stufileAPI from '@/api/teacher/stufile/setting'
import commonAPI from '@/api/common'

import ZjyFile from './File'

export default {
  data () {
    return {
      //  搜索
      enterYear: '',
      classId: '',
      studentNo: '',
      query: {
        offset: 0,
        limit: 10,
        enterYear: '',
        classId: '',
        studentNo: ''
      },
      //  --------------- 搜索 END ---------------
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,

      //  初始化select
      years: [
        {
          label: '2017年',
          value: 2017
        },
        {
          label: '2018年',
          value: 2018
        }
      ],

      classes: [],
      //  --------------- 初始化select END ---------------
      columns: [
        {
          index: true,
          select: true
        }, {
          label: '学号',
          prop: 'studentNo'
        }, {
          label: '姓名',
          prop: 'studentName'
        }, {
          label: '院系',
          prop: 'facultyName'
        }, {
          label: '专业',
          prop: 'specialtyName'
        }, {
          label: '班级',
          prop: 'className'
        }, {
          label: '建档日期',
          prop: 'stufileDate',
          formatter: _dateFormat
        }, {
          label: '入学年份',
          prop: 'enterYear'
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
              label: '编辑',
              cmd: 'edit'
            }
          ]
        }
      ],
      // dialog
      visible: false,

      //  其它
      type: 1,
      title: '',
      file: {}, // 学生档案
      fileList: [],
      settings: [],

      selectedRows: [] // 多选行
    }
  },

  methods: {
    searchFilter () {
      this.currentPage = 1
      this.query.classId = this.classId
      this.query.enterYear = this.enterYear
      this.query.studentNo = this.studentNo
      this.refresh()
    },

    create () {
      this.type = +this.$t('zjy.operator.CREATE')
      this.file = {}
      this.title = '新增学生档案'
      this.visible = true
      this.clearFileList()
    },

    _import () {
    },
    _export () {
      const header = ['学号', '姓名', '院系', '专业', '班级', '建档日期', '入学年份']
      const filter = ['studentNo', 'studentName', 'facultyName', 'specialtyName', 'className', 'stufileDate', 'enterYear']
      const data = this.selectedRows.length > 0 ? this.selectedRows : this.list
      this.loading = true
      export2excel(header, filter, data, '学生档案', (filterVal, data) => {
        return data.map(v => filter.map(j => {
          if (j === 'stufileDate') {
            return _dateFormat(v[j])
          } else return v[j]
        }))
      }).then(_ => {
        this.loading = false
      })
    },

    // 多选导出
    handleSelectionChange (rows) {
      this.selectedRows = rows
    },

    clearFileList () {
      for (let i = 0; i < this.fileList.length; ++i) {
        this.fileList[i].stufileName = ''
        this.fileList[i].stufilePath = ''
        this.fileList[i].listUid = ''
        this.fileList[i].stufileUid = ''
      }
    },

    edit (row) {
      this.type = +this.$t('zjy.operator.EDIT')
      this.title = '编辑学生档案'
      stufileManageAPI.queryForObject(row.stufileUid).then(response => {
        if (response.code !== 1) this.$alert('获取学生档案失败')
        this.file = response.data
        const _ = response.data.stufileListList
        this.clearFileList()

        for (let i = 0; i < this.fileList.length; ++i) {
          this.fileList[i].stufileUid = row.stufileUid
        }

        for (let i = 0; i < this.fileList.length; ++i) {
          for (let j = 0; j < _.length; ++j) {
            if (_[j].swmsStufileSetting && this.fileList[i].stufilesettingUid == _[j].swmsStufileSetting.stufilesettingUid) {
              this.fileList[i].stufileName = _[j].swmsStufileSetting.stufileName
              this.fileList[i].stufilePath = _[j].stufilePath
              this.fileList[i].listUid = _[j].listUid
            }
          }
        }
        this.visible = true
      }).catch(error => {
        console.log(error)
      })
    },
    view (row) {
      this.type = +this.$t('zjy.operator.VIEW')
      this.title = '查看学生档案'
      stufileManageAPI.queryForObject(row.stufileUid).then(response => {
        if (response.code !== 1) this.$alert('获取学生档案失败')
        this.file = response.data
        const _ = response.data.stufileListList
        this.clearFileList()

        for (let i = 0; i < this.fileList.length; ++i) {
          this.fileList[i].stufileUid = row.stufileUid
        }

        for (let i = 0; i < this.fileList.length; ++i) {
          for (let j = 0; j < _.length; ++j) {
            if (_[j].swmsStufileSetting && this.fileList[i].stufilesettingUid == _[j].swmsStufileSetting.stufilesettingUid) {
              this.fileList[i].stufileName = _[j].swmsStufileSetting.stufileName
              this.fileList[i].stufilePath = _[j].stufilePath
              this.fileList[i].listUid = _[j].listUid
            }
          }
        }
        this.visible = true
      }).catch(error => {
        console.log(error)
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    // --------------- 搜索 END ---------------

    refresh () {
      _refresh.call(this)
    }
  },

  created () {
    stufileAPI.queryForList().then(resposne => {
      if (resposne.code !== 1) {
        this.$alert('获取档案设置失败')
      } else {
        this.settings = resposne.data
        for (let i = 0; i < this.settings.length; ++i) {
          this.fileList.push({
            index: i,
            stufileName: '',
            stufilesettingUid: this.settings[i].stufilesettingUid,
            stufilePath: ''
          })
        }
      }
    }).catch(error => {
      console.log(error)
    })

    commonAPI.queryClassList().then(response => {
      if (response.code !== 1) {
        console.warn('query classes error')
      } else {
        this.classes = response.data.map(i => {
          return {
            label: i.className,
            value: i.classId
          }
        })
      }
    }).catch(error => {
      console.log(error)
    })
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

    ZjyFile
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val, oldval) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        stufileManageAPI.queryForList(this.query).then(response => {
          if (response.code === 1) {
            this.list = response.rows
            this.total = response.total
          } else {
            this.$alert(response.message)
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      }
    }

  }
}

</script>
<style lang='scss' scoped>
</style>
