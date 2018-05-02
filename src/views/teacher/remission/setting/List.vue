<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="申请年份" :options="yearList" :value.sync="applyYear"></search-select>
      <search-select label="院系" :options="facultyList" :value.sync="facultyCode" :loading="isLoading" @focus="handleFocus"></search-select>
      <search-select label="班级" :options="classList" :value.sync="classId"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>
    <zjy-table-operator>
      <operator-item @click="_export" clz="export">导出</operator-item>
      <operator-item @click="_import" clz="import" v-if="hasPermission('swms:stulist:create')">导入</operator-item>
    </zjy-table-operator>

    <transition name="slide-fade">
      <div class="svg" v-if="show">
        <svg style="top:5px; left:70px;position:relative;z-index:999;overflow:hidden" width="20" height="10" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polygon points="10,0 20,11 0,11" style="fill:rgb(255,255,255);stroke:rgb(55,198,212);stroke-width:1"/>
        </svg>
        <div class="upload">
          <div class="download-body">
            <p class="file-input" @click="notClick" :title="fileName">{{ fileName }}</p>
            <el-upload
              class="myupload"
              ref="uploadExcel"
              :action="action"
              :headers="{'Zjy-Token': token}"
              :data="{baseModel: baseModel}"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-progress="handleProgress"
              :auto-upload="false"
              :show-file-list="false"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <a slot="trigger" class="upload-view" ref="uploadTrigger" @click="clearError">浏览</a>
              <a style="margin-left: 10px;" @click="submitUpload" class="upload-import">导入</a>
              <a style="margin-left: 10px;" @click="abortUpload" class="upload-abort">取消</a>
            </el-upload>
            <transition name="el-zoom-in-center">
              <div class="upload-status" v-if="showPercent">
                <zjy-progress :percentage="percent" color="#37c6d4" :percentageText="percentText"></zjy-progress>
              </div>
            </transition>

            <transition name="el-zoom-in-center">
              <div class="upload-error" v-if="showError">
                <p>上传失败,下载
                  <a :href="errorLink" target="_blank">错误信息</a>
                </p>
              </div>
            </transition>
          </div>
          <div class="download-link">
            <p>点击下载
              <a href="javascript:;" @click="download($event)">导入模板
                <span> (导入文件必须为excel格式)</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </transition>

    <div class="zjy-table">
      <zjy-table :data="list" :loading="loading" :columns="columns" @delete="handleDelete" @selection-change="handleSelectionChange">
      </zjy-table>
    </div>

     <div class="zjy-pagination" v-if="list.length !== 0">
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="pageChanged">
      </zjy-pagination>
    </div>
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

import ZjyProgress from '@/components/progress'
import { _refresh, export2excel } from '@/utils'

import api from './api'
import properties from './properties'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      applyYear: '',
      facultyCode: '',
      classId: '',
      studentCode: '',
      query: properties.query,
      currentPage: 1,
      total: 0,
      loading: false,
      yearList: properties.yearList,
      classList: [],
      facultyList: [],

      list: [],
      columns: properties.columns,

      action: process.env.BASE_URL + '/manage/upload/uploadDatas',
      percent: 0,
      percentText: '',
      show: false,
      showPercent: false,
      showError: false,
      hasError: false,
      errorLink: 'javascript:;',
      fileName: '导入文件',

      myfile: '',
      baseModel: 'tuitionWaiver',

      selectedRows: [],
      queryExport: properties.queryExport,
      exportData: []
    }
  },

  methods: {
    handleSuccess (response, file, fileList) {
      if (response.code == 90002) {
        this.errorLink = response.data
        this.showError = true
        this.hasError = true
      } else if (response.code === 90003) {
        this.hasError = true
        MSG.warning('导入数据异常')
      } else if (response.code === 90001) {
        MSG.success('导入数据成功')
        this.show = false
        this.refresh()
      }
      this.clearFile()
      this.showPercent = false
    },
    handleError (error, file, fileList) {
      console.log(error)
    },
    handleProgress (event, file, fileList) {
      this.percent = +(event.percent).toFixed(2)
      this.percentText = this.percent < 99 ? this.percent + '%' : '处理中...'
    },
    notClick () {
      this.$refs.uploadTrigger.click()
      this.clearError()
    },
    handleChange (file, fileList) {
      if (this.hasError || !this.show) return
      if (!/\.(xls|xlsx)$/gi.test(file.name)) {
        MSG.warning('请上传excel格式文件')
        this.clearFile()
        return false
      }
      this.myfile = file
      this.fileName = this.myfile.name
    },

    handleBeforeUpload (file) {
      this.clearError()
    },
    abortUpload () {
      this.$refs.uploadExcel.abort()
      this.clearFile()
      this.clearError()
    },
    submitUpload () {
      if (!this.myfile) MSG.warning('请选择文件')
      else {
        this.clearError()
        this.showPercent = true
        this.$refs.uploadExcel.submit()
      }
    },
    _import () {
      this.show = !this.show
      if (!this.show) {
        this.clearFile()
      } else { }
    },
    clearPercent () {
      this.showPercent = false
    },
    clearFile () {
      this.fileName = '导入文件'
      this.myfile = ''
      this.showPercent = false
    },
    clearError () {
      this.showError = false
      this.hasError = false
    },

    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },

    download (event) {
      event.preventDefault()
      api.ajaxDownload('/export/template/studyGrant', {}, 'excel.xlsx').catch(error => {
        MSG.warning('下载错误')
      })
    },

    clearSearch () {
      this.query.classId = ''
      this.query.applyYear = ''
      this.query.facultyCode = ''
      this.query.studentCode = ''
    },
    searchFilter () {
      this.currentPage = 1
      this.query.classId = this.classId
      this.query.applyYear = this.applyYear
      this.query.facultyCode = this.facultyCode
      this.query.studentCode = this.studentCode.trim()
      this.refresh()
    },
    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },
    handleFocus () {
      if (this.facultyList.length === 0) {
        api.queryFacultyList().then(response => {
          if (response.code !== 1) {
            MSG.warning('获取院系失败')
          } else {
            this.facultyList = response.data.map(i => {
              return {
                label: i.facultyName,
                value: i.facultyCode
              }
            })
          }
        })
      }
    },
    handleDelete (row) {
      const auto = this.list.length === 1 && this.currentPage !== 1
      this.loading = true
      api.deleteStudent(row.stulistUid).then(response => {
        if (response.code === 1) {
          setTimeout(_ => {
            MSG.success(this.$t('zjy.message.delete.success'))
          }, 200)
          this.refresh(auto)
        } else {
          console.warn(response.message)
          MSG.warning(this.$t('zjy.message.delete.error'))
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleSelectionChange (rows) { this.selectedRows = rows },
    _export () {
      this.getExportData().then(response => {
        this.exportData = response

        const header = properties.header
        const filter = properties.filter
        const excelName = properties.excelName
        const data = this.exportData
        if (data.length === 0) {
          MSG.warning(this.$t('zjy.message.export.none'))
          return
        }
        this.loading = true
        export2excel(header, filter, data, excelName).finally(_ => {
          this.loading = false
          this.exportData = []
        })
      })
    },
    getExportData () {
      return new Promise((resolve, reject) => {
        if (this.selectedRows.length > 0) {
          resolve(this.selectedRows)
        } else {
          if (this.exportData.length === 0) {
            this.exportSearch().then(response => {
              resolve(response)
            })
          }
        }
      })
    },

    exportSearch () {
      return new Promise((resolve, reject) => {
        this.queryExport.classId = this.classId
        this.queryExport.facultyCode = this.facultyCode
        this.queryExport.applyYear = this.applyYear
        this.queryExport.studentCode = this.studentCode.trim()
        api.queryList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },
    refresh (auto) {
      return _refresh.call(this, auto)
    }
  },
  computed: {
    ...mapGetters(['token']),
    isLoading () {
      return this.facultyList.length === 0
    }
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
    ZjyProgress
  },
  created () {
    // 重新渲染时先清除搜索条件
    this.clearSearch()
  },

  watch: {
    currentPage: {
      immediate: true,
      handler (val) {
        if (val === -1 || val === 0) return

        this.loading = true
        this.query.offset = this.query.limit * (val - 1)
        api.queryList(this.query).then(response => {
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
      if (val) {
        api.queryClassByFaculty(val).then(response => {
          if (response.code !== 1) {
            MSG.warning('获取班级失败')
          } else {
            this.classList = response.data.map(i => {
              return {
                label: i.className,
                value: i.classId
              }
            })
          }
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.file-input {
  width: 235px;
  height: 30px;
  border: 1px solid #e8edf2;
  line-height: 32px;
  padding-left: 5px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload-error {
  margin-left: 20px;
  background-color: #fef6d9;
  line-height: 32px;
  padding: 0 10px;
  a {
    padding-left: 0 !important;
    color: #f56c6c;
    padding-right: 15px;
    background: url("./ic_download.png") right 1px no-repeat;
  }
}
.upload-status {
  width: 250px;
  height: 30px;
  margin-left: 20px;
  line-height: 30px;
  .el-progress {
    line-height: 28px;
  }
}
.myupload {
  line-height: 32px;
  padding-left: 10px;
}
.download-body {
  display: flex;
  margin-bottom: 10px;
  a {
    padding-left: 15px;
  }
  a.upload-view {
    background: url("./ic_view.png") left center no-repeat;
  }
  a.upload-import {
    background: url("./ic_import.png") left center no-repeat;
  }
  a.upload-abort {
    background: url("./ic_abort.png") left center no-repeat;
  }
}
.upload {
  font-size: 12px;
  color: #666666;
  height: 60px;
  border: 1px solid #37c6d4;
  position: relative;
  padding: 10px 20px;

  .download-link {
    a {
      color: #0aacf8;
      span {
        color: #666666;
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.arrow {
  &:after {
    content: "";
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
    border-bottom-color: #37c6d4;
    top: -12px;
    left: 68px;
  }
}
.svg {
  position: relative;
  top: -16px;
  margin-bottom: -6px;
}
</style>
