<!-- 学生档案实体 -->
<template>
  <div
    class="zjy-form"
    id="zjy-upload-form"
    v-loading="checkLoading"
    element-loading-text="正在查找学生信息"
  >
    <p class="zjy-form__title">学生信息</p>
    <el-form :model="data" :rules="rules" ref="data" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学号:" prop="studentNo" class="inline is-required" v-if="type === 2">
            <el-input @change="handleChange" v-model="data.studentNo" :class="['search-input']">
              <div class="search" slot="append" @click="check">
                <img src="@/assets/imgs/zjy-icon-search.png" alt="搜索">
              </div>
            </el-input>
          </el-form-item>

          <el-form-item label="学号:" class="inline" v-else>
            <el-input :value="data.studentNo" :class="['search-input']" disabled>
              <div class="search" slot="append" @click="check">
                <img src="@/assets/imgs/zjy-icon-search.png" alt="搜索">
              </div>
            </el-input>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="学生姓名:" prop="studentName" class="inline pull-right">
            <el-input :value="student.studentName || data.studentName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="班级:" class="inline">
        <el-input :value="student.className || data.className" disabled></el-input>
      </el-form-item>
      <el-form-item label="院系:" class="inline pull-right">
        <el-input :value="student.facultyName || data.facultyName" disabled></el-input>
      </el-form-item>

      <el-form-item label="档案编号" prop="stufileNo" class="inline pull-left">
        <el-input type="text" v-model="data.stufileNo" maxlength="16"></el-input>
      </el-form-item>
      <span class="concat">+ 学号 +</span>
      <el-form-item  class="inline pull-right append" prop="append">
        <el-input type="text" v-model="data.append" maxlength="16"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="接收人" prop="recipient" class="inline pull-left">
            <el-input type="text" v-model="data.recipient" maxlength="64"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="建档日期" prop="stufileDate" class=" pull-right">
            <el-date-picker type="date" placeholder="选择日期" v-model="data.stufileDate" style="width: 100%;position:absolute;" :editable="false"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="zjy-form__title" v-if="fileList.length > 0">
      <p>档案材料清单<span class="warning">上传附件格式仅限为pdf、word、excel、jpg格式</span></p>
    </div>

    <div class="zjy-table" v-if="fileList.length > 0">
      <el-table :data="value" style="width: 100%" :show-header="false" v-loading="loading" border element-loading-background="rgba(0, 0, 0, 0.2)">

        <el-table-column label="材料名称" width="250">
          <template slot-scope="scope">
            <p class="setting-name">{{ scope.row.stufileName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="文件上传" width="200">
          <template slot-scope="scope">
            <zjy-upload
              :ref="'upload' + scope.$index"
              :disabled="isUploading"
              v-if="!fileList[scope.$index].stufilePath"
              class="zjy-table-upload"
              accept="
                image/jpeg,
                application/msword,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                application/pdf
              "
              :action="action + '?index=' + scope.$index"
              :headers="{'Zjy-Token': token}"
              :showFileList="false"
              :before-upload="handleBeforeUpload"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              :on-error="handleError"
              :auto-upload="true"
              :file-list="fl"
            >
              <el-button :disabled="isUploading" size="small" type="primary" @click="test(scope.row, scope.$index)">
                上传附件
              </el-button>
            </zjy-upload>
            <p v-else class="file-name">{{ fileList[scope.$index].stufileName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="268">
          <template slot-scope="scope">
            <transition name="breadcrumb1">
              <div v-if="fileList[scope.$index].stufilePath">

                <div class="table-oper-group">
                  <a :href="fileList[scope.$index].stufilePath" target="_blank" class="zjy-btn-download">
                    <i class="zjy-icon"></i>
                    <span>下载</span>
                  </a>

                  <a href="javascript:" @click="deleteFile(scope.$index)" class="zjy-btn-delete">
                    <i class="zjy-icon"></i>
                    <span>删除</span>
                  </a>
                </div>

              </div>
            </transition>

            <template v-if="!fileList[scope.$index].stufilePath">
              <p :id="'tip' + scope.$index"></p>
              <transition name="breadcrumb1">
                <div role="progressbar" class="el-progress el-progress--line" color="#36c6d3" :id="'per' + scope.$index">
                  <div class="el-progress-bar">
                    <div class="el-progress-bar__outer" style="height: 6px;">
                      <div class="el-progress-bar__inner" style="width: 0%;" :ref="'ref' + scope.$index">
                      </div>
                    </div>
                  </div>
                  <div class="el-progress__text" style="font-size: 12px;" :ref="'ref2' + scope.$index">0%</div>
                  <a href="javascript:;" @click="abort" class="upload-abort" v-if="isUploading && activeFileIndex === scope.$index">取消</a>
                </div>
              </transition>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p class="zjy-form__title">档案说明</p>
    <zjy-input type="textarea" v-model="data.stufileDescription" :maxlength="256"></zjy-input>

    <div class="zjy-footer">
      <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
      <zjy-button type="primary" @click="submitForm('data')">提交</zjy-button>
    </div>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
import ZjyInput from '@/components/input'
import stufileManageAPI from '@/api/teacher/stufile/manage'
import { mapGetters } from 'vuex'
import ZjyUpload from '@/components/upload/index'

export default {
  data () {
    var checkStudent = (rule, value, callback) => {
      if (!value) {
        this.doQuery = false
        return callback(new Error('请输入学号'))
      } else {
        if (!this.doQuery) return
        this.checkLoading = true
        stufileManageAPI.checkExists(value).then(response => {
          if (response.code !== 1) {
            callback(new Error(response.message))
          } else {
            this.student = response.data
            callback()
          }
        }).catch(error => {
          console.log(error)
        }).finally(_ => {
          this.doQuery = false
          this.checkLoading = false
        })
      }
    }
    return {
      data: {},
      checkLoading: false,
      action: process.env.BASE_URL + '/upload/stufileUpload',
      rules: {
        studentNo: [
          { validator: checkStudent, trigger: 'change' }
        ],
        stufileNo: [
          { required: true, message: '请输入档案编号', trigger: 'change' }
        ],
        append: [
          { required: true, message: '请输入档案编号', trigger: 'change' }
        ],
        recipient: [
          { required: true, message: '请输入接收人', trigger: 'change' }
        ],
        stufileDate: [
          { required: true, message: '请选择建档日期', trigger: 'change' }
        ]
      },

      doQuery: false,
      student: {},

      fileIndex: -1,
      activeFileIndex: -1,
      activeSettingId: '',
      fileList: [],
      fl: [],
      loading: false,
      isUploading: false,
      pers: []
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  methods: {
    abort () {
      this.$refs['upload' + this.activeFileIndex].abort()
      this.$refs['ref' + this.activeFileIndex].style.width = 0 + '%'
      this.$refs['ref2' + this.activeFileIndex].innerHTML = 0 + '%'
      this.isUploading = false
    },
    test (row, index) {
      if (this.isUploading) return
      this.activeFileIndex = index
      this.activeSettingId = row.stufilesettingUid
    },

    deleteFile (index) {
      this.fileList[index].stufilePath = ''
      this.fileList[index].stufileName = ''
    },

    handleUpload (index, row) {
    },

    handleProgress (event, file, fileList) {
      try {
        this.isUploading = true
        const index = this.activeFileIndex

        this.$refs['ref' + index].style.width = event.percent + '%'
        this.$refs['ref2' + index].innerHTML = Math.floor(event.percent) < 100 ? Math.floor(event.percent) + '%' : (this.isUploading = false, '处理中')
      } catch (e) {
        console.log('destroyed...')
      }
    },

    isValidatedFile (file) {
      return /\.(jpeg|jpg|doc|docx|xls|xlsx|pdf)$/gi.test(file.name)
    },

    handleBeforeUpload (file) {
      if (!this.isValidatedFile(file)) {
        MSG.warning('不支持的文件格式')
        return false
      }

      this.fileList[this.activeFileIndex].index = this.activeFileIndex
      this.fileList[this.activeFileIndex].stufileName = file.name
      this.fileList[this.activeFileIndex].uid = file.uid
      this.fileList[this.activeFileIndex].stufilesettingUid = this.activeSettingId

      document.querySelector('#tip' + this.activeFileIndex).innerHTML = ''
      this.$refs['ref' + this.activeFileIndex].style.width = 0 + '%'
      this.$refs['ref2' + this.activeFileIndex].innerHTML = 0 + '%'

      document.querySelector('#per' + this.activeFileIndex).style.display = 'block'
      return true
    },

    handleSuccess (response, file, fileList) {
      try {
        let which = -1
        which = this.fileList.findIndex(x => x.uid === file.uid)

        if (response.code !== 1 && which !== -1) {
          document.querySelector('#tip' + which).title = response.message
          document.querySelector('#tip' + which).innerHTML = '上传失败'
          document.querySelector('#per' + which).style.display = 'none'
          // this.$alert(response.message)
          this.loading = false
          this.isUploading = false
          return
        }

        const path = response.data.substring(0, response.data.lastIndexOf('?index='))

        const index = response.data.substring(response.data.lastIndexOf('?index=') + 7, response.data.length)

        this.fileList[index].stufilePath = path

        // this.$refs['ref' + which].innerHTML = ''
        this.loading = false
        this.isUploading = false
      } catch (e) {

      }
    },

    handleError (err, file, fileList) {
      console.log(err)
    },

    handleEdit (index, row) {
      console.log(index, row)
    },

    handleDelete (index, row) {
      console.log(index, row)
    },

    check () {
      if (this.type === 1) return
      this.doQuery = true
      this.$refs.data.validateField('studentNo')
    },

    handleChange () {
      // this.clearData()
    },

    submitForm (formName) {
      if (this.type === 2) { this.doQuery = true }

      this.$refs[formName].validate(valid => {
        if (valid) {
          let arg = {}

          arg.stufileNo = this.type === 1
            ? this.data.stufileNo + this.data.studentNo + this.data.append
            : this.data.stufileNo + this.student.studentNo + this.data.append
          arg.recipient = this.data.recipient
          arg.schoolCode = this.data.schoolCode
          arg.stufileDate = new Date(this.data.stufileDate).getTime()
          arg.stufileDescription = this.data.stufileDescription
          arg.status = 1

          let stufileListList = []
          this.fileList.forEach((item, index) => {
            if (item.stufilePath) {
              stufileListList.push({
                listUid: item.listUid,
                stufileUid: item.stufileUid,
                stufilePath: item.stufilePath,
                swmsStufileSetting: item.swmsStufileSetting,
                stufilesettingUid: item.stufilesettingUid
              })
            }
          })

          arg.stufileListList = stufileListList

          if (this.type === 2) {
            arg.studentNo = this.data.studentNo
            arg.studentId = this.student.studentId

            stufileManageAPI.create(arg).then(response => {
              if (response.code === 1) {
                setTimeout(_ => {
                  MSG.success('添加成功')
                }, 200)
                this.$emit('update:visible', false)
                this.$emit('refresh')
              } else {
                this.$alert(response.message)
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            stufileManageAPI.update(this.data.stufileUid, arg).then(response => {
              if (response.code === 1) {
                setTimeout(_ => {
                  MSG.success('修改成功')
                }, 200)

                this.$emit('update:visible', false)
                this.$emit('refresh')
              } else {
                this.$alert(response.message)
              }
            }).catch(error => {
              console.log(error)
            })
          }
        }
      })
    }
  },

  props: {
    formData: Object,
    value: Array, // 学生档案设置列表
    type: Number, // 何种操作
    list: Array,
    visible: Boolean
  },

  components: {
    ZjyButton,
    ZjyUpload,
    ZjyInput
  },

  beforeDestroy () {
    for (let i = 0; i < this.fileList.length; ++i) {
      if (this.isUploading) try { this.$refs['upload' + i].abort() } catch (e) { }
    }
  },

  watch: {
    formData: {
      immediate: true,
      handler (val) {
        this.data = val
        try {
          if (this.data.ucenterStudent.studentNo) {
            this.studentNo = this.data.ucenterStudent.studentNo
            this.data.studentName = this.data.ucenterStudent.studentName
            this.data.className = this.data.ucenterStudent.className
            this.data.facultyName = this.data.ucenterStudent.facultyName
            this.data.studentNo = this.data.ucenterStudent.studentNo
            const splite = val.stufileNo.split(this.studentNo)
            this.data.stufileNo = splite[0]
            this.data.append = splite[1]
          }
        } catch (e) {
        }
      }
    },

    list: {
      immediate: true,
      handler (val) {
        this.fileList = val
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.warning {
  font-size: 12px;
  font-weight: normal;
  background-color: #fbefbd;
  color: #9e5b0b;
  padding: 3px 10px;
  margin-left: 10px;

}
.el-form {
  padding: 0 50px;
  .el-form-item {
    width: 300px;
    margin-bottom: 20px;
  }
}

.search-input {
  width: 220px;
}

.tip {
  position: absolute;
  left: 0;
  line-height: 12px;
  top: 45px;
  font-size: 12px;
  display: inline-block;
  z-index: 999;
  color: #f56c6c;
}

.search {
  display: block;
}

.zjy-table-upload {
  .el-button--primary {
    color: #fff;
    background-color: #36c6d3;
    border-color: #36c6d3;
    border-radius: 25px;
  }
}

.el-button--small,
.el-button--small.is-round {
  padding: 7px 15px;
}

.setting-name {
  padding: 4px 0;
}

.zjy-form__title {
  font-weight: bold;
  &:last-of-type {
    padding-top: 15px;
  }
}
.el-progress {
  width: 260px;
  position: relative;
}
.el-progress-bar {
  width: 230px;
}

a.upload-abort {
  position: absolute;
  top: 0;
  right: 5px;
  height: 15px;
  line-height: 15px;
  padding-left: 15px;
  background: url('./ic_abort.png') left center no-repeat;
}
[id*='tip'] {
  text-align: center;
}
.append {
  margin-left: -80px;
}
.concat {
  position: relative;
  right: -15px;
}
</style>
