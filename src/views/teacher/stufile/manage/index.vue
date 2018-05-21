<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-date label="入学年份" :value.sync="enterYear"></search-date>
      <search-select label="班级" :options="myClassList" :value.sync="classId" :loading="isLoading" @focus="handleFocus"></search-select>
      <search-input label="学号" :value.sync="studentCode"></search-input>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="zjy-line"></div>

    <zjy-table-operator>
      <template v-if="hasPermission('swms:stufile-tea:create')">
        <operator-item @click="create" clz="create">新增</operator-item>
        <operator-item @click="_import" clz="import">导入</operator-item>
      </template>
      <operator-item @click="_export" clz="export">导出</operator-item>
    </zjy-table-operator>

    <transition name="slide-fade">
      <div class="svg" v-if="show">
        <svg style="top:5px; left:70px;position:relative;z-index:999;overflow:hidden" width="20" height="10" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polygon points="10,0 20,11 0,11" style="fill:rgb(255,255,255);stroke:rgb(55,198,212);stroke-width:1" />
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
              :file-list="myFileList"
              :before-upload="handleBeforeUpload"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-progress="handleProgress"
              :auto-upload="false"
              :show-file-list="false"
              accept="
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
              "
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
      <zjy-pagination :currentPage="currentPage" :total="total" @current-change="pageChanged">
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
        @refresh="handleRefresh"
      ></zjy-file>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="visible2" width="800px">
      <file-view v-if="visible2" :formData="file" v-model="settings" :visible.sync="visible2" :list="fileList"></file-view>
    </el-dialog>

  </div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import SearchDate from '@/components/table-search/search-date'

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

import ZjyPagination from '@/components/pagination'

import { _refresh, export2excel, dateFormat as _dateFormat } from '@/utils'

import stufileManageAPI from '@/api/teacher/stufile/manage'
import stufileAPI from '@/api/teacher/stufile/setting'

import ZjyFile from './File'
import FileView from './FileView'
import ZjyProgress from '@/components/progress'

import api from './api'
import properties from './properties'
import { mapGetters } from 'vuex'

export default {
  name: 'student-file',
  data () {
    return {
      action: process.env.BASE_URL + '/manage/upload/uploadDatas',
      percent: 0,
      percentText: '',
      showPercent: false,
      showError: false,
      hasError: false,
      errorLink: 'javascript:;',
      fileName: '导入文件',

      myfile: '',
      baseModel: 'swmsStufile',
      myFileList: [
        // {name: 'test.jpeg', url: ''}
      ],
      enterYear: new Date().getFullYear().toString(),
      classId: '',
      studentCode: '',
      query: properties.query,
      list: [],
      currentPage: 1,
      total: 0,
      loading: false,
      columns: properties.columns,
      visible: false,
      visible2: false,
      show: false,

      type: 1,
      title: '',
      file: {}, // 学生档案
      fileList: [],
      settings: [],

      queryExport: properties.queryExport,
      selectedRows: [],
      exportData: []
    }
  },

  methods: {
    handleFocus () {
      if (this.myClassList.length === 0) {
        this.$store.dispatch('setClassList')
      }
    },
    handleSuccess (response, file, fileList) {
      if (response.code == 90002) {
        this.errorLink = response.data
        this.showError = true
        this.hasError = true
      } else if (response.code === 90003) {
        this.hasError = true
        MSG.warning(response.message)
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
    isAcceptedFile (file) {
      return /\.(xls|xlsx)$/gi.test(file.name)
    },
    handleChange (file, fileList) {
      // 成功时也会调用，添加show修复此问题
      if (this.hasError || !this.show) return
      if (!this.isAcceptedFile(file)) {
        MSG.warning('不支持的文件格式')
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
      api.ajaxDownload('/export/template/swmsStufile', {}, '学生档案导入模板.xlsx').catch(error => {
        MSG.warning('下载错误')
      })
    },
    searchFilter () {
      this.currentPage = 1
      this.query.classId = this.classId
      this.query.enterYear = this.enterYear
      this.query.studentCode = this.studentCode.trim()
      this.refresh()
    },

    create () {
      this.type = +this.$t('zjy.operator.CREATE')
      this.file = {}
      this.title = '新增学生档案'
      this.querySetting().then(_ => {
        this.visible = true
        this.clearFileList()
      }).catch(error => {
        MSG.warning(error)
      })
    },

    fileListFormat (fileList) {
      let result = ''
      fileList.forEach(x => {
        if (x.swmsStufileSetting) {
          result += x.swmsStufileSetting.stufileName
          result += ','
        }
      })
      return result.replace(/,$/gi, '')
    },

    _export () {
      this.loading = true
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

        export2excel(header, filter, data, excelName, (filter, data) => {
          return data.map(v => filter.map(j => {
            if (j === 'stufileDate') {
              return _dateFormat(v[j])
            } else if (j === 'stufileListList') {
              return this.fileListFormat(v[j])
            } else return v[j]
          }))
        }).finally(_ => {
          this.exportData = []
        })
      }).finally(_ => {
        this.loading = false
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
        this.queryExport.enterYear = this.enterYear
        this.queryExport.studentCode = this.studentCode.trim()
        stufileManageAPI.queryForList(this.queryExport).then(response => {
          if (response.code !== 1) {
            reject(new Error('获取导出数据失败'))
          } else {
            resolve(response.rows)
          }
        })
      })
    },
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
      this.loading = true
      this.querySetting().then(_ => {
        stufileManageAPI.queryForObject(row.stufileUid).then(response => {
          if (response.code !== 1) MSG.success('获取学生档案失败')
          this.file = response.data
          const _ = response.data.stufileListList
          this.clearFileList()

          for (let i = 0; i < this.fileList.length; ++i) {
            this.fileList[i].stufileUid = row.stufileUid
          }

          for (let i = 0; i < this.fileList.length; ++i) {
            for (let j = 0; j < _.length; ++j) {
              if (_[j].swmsStufileSetting && this.fileList[i].stufilesettingUid == _[j].swmsStufileSetting.stufilesettingUid) {
                this.fileList[i].stufileOldname = _[j].stufileOldname
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
      }).finally(_ => {
        this.loading = false
      })
    },

    querySetting () {
      return new Promise((resolve, reject) => {
        if (this.settings.length > 0) resolve()
        else {
          stufileAPI.queryForList().then(resposne => {
            if (resposne.code !== 1) {
              // MSG.success('获取档案设置失败')
              reject('获取档案设置失败')
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
              resolve()
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },

    view (row) {
      this.type = +this.$t('zjy.operator.VIEW')
      this.title = '查看学生档案'
      this.loading = true
      this.querySetting().then(_ => {
        stufileManageAPI.queryForObject(row.stufileUid).then(response => {
          if (response.code !== 1) MSG.success('获取学生档案失败')
          this.file = response.data
          const _ = response.data.stufileListList
          this.clearFileList()

          for (let i = 0; i < this.fileList.length; ++i) {
            this.fileList[i].stufileUid = row.stufileUid
          }

          for (let i = 0; i < this.fileList.length; ++i) {
            // this.fileList[i].stufileName = this.fileList[i].stufileOldname
            for (let j = 0; j < _.length; ++j) {
              if (_[j].swmsStufileSetting && this.fileList[i].stufilesettingUid == _[j].swmsStufileSetting.stufilesettingUid) {
                this.fileList[i].stufileName = _[j].swmsStufileSetting.stufileName
                this.fileList[i].stufileOldname = _[j].stufileOldname
                this.fileList[i].stufilePath = _[j].stufilePath
                this.fileList[i].listUid = _[j].listUid
              }
            }
          }
          this.visible2 = true
        }).catch(error => {
          console.log(error)
        })
      }).finally(_ => {
        this.loading = false
      })
    },

    pageChanged (pageNumber) {
      this.currentPage = pageNumber
    },

    refresh () {
      return _refresh.call(this)
    },
    handleRefresh () {
      this.refresh()
    }
  },

  destroyed () {
    this.query.enterYear = new Date().getFullYear().toString()
    this.query.classId = ''
    this.query.studentCode = ''
    this.query.offset = 0
  },

  computed: {
    ...mapGetters(['token', 'classList']),
    myClassList () {
      return this.classList.map(i => {
        return {
          label: i.className,
          value: i.classId
        }
      })
    },
    isLoading () {
      return this.myClassList.length === 0
    }
  },

  components: {
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect,
    SearchDate,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem,
    ZjyPagination,
    ZjyProgress,

    ZjyFile,
    FileView
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
            MSG.warning(response.message)
          }
        }).catch(error => {
        }).finally(() => {
          this.loading = false
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
