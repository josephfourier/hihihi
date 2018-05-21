<!-- 学生档案实体 -->
<template>
  <div class="zjy-form" id="zjy-upload-form">
    <p class="zjy-form__title">学生信息</p>
    <el-form :model="data" :rules="rules" ref="data" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="学号" prop="studentCode" class="inline">
            <el-input v-model="studentCode" readonly :class="['search-input']">
              <div class="search" slot="append">
                <img src="@/assets/imgs/zjy-icon-search.png" alt="搜索">
              </div>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学生姓名" prop="studentName" class="inline pull-right">
            <el-input v-model="data.studentName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="班级" prop="className" class="inline">
        <el-input v-model="data.className" readonly></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="facultyName" class="inline pull-right">
        <el-input v-model="data.facultyName" readonly></el-input>
      </el-form-item>

      <el-form-item label="档案编号" prop="stufileNo" class="inline pull-left">
        <el-input type="text" v-model="data.stufileNo" readonly></el-input>
      </el-form-item>

       <el-form-item label="建档日期" prop="stufileDate" class="inline pull-right">
           <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="data.stufileDate" style="width: 100%;position:absolute;" readonly></el-date-picker>
          </el-form-item>
      <!-- <span class="concat">+ 学号 +</span>
      <el-form-item  class="inline pull-right append" prop="append">
        <el-input type="text" v-model="data.append" readonly></el-input>
      </el-form-item> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="接收人" prop="recipient" class="inline pull-left">
            <el-input type="text" v-model="data.recipient" readonly></el-input>
          </el-form-item>

        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="建档日期" prop="stufileDate" class="pull-right">
           <el-date-picker type="date" :editable="false" placeholder="选择日期" v-model="data.stufileDate" style="width: 100%;position:absolute;" readonly></el-date-picker>
          </el-form-item>
        </el-col> -->
      </el-row>

    </el-form>
    <p class="zjy-form__title" v-if="fileList.length > 0">档案材料清单</p>

    <div class="zjy-table" v-if="fileList.length > 0">
      <el-table :data="fileList" style="width: 100%" :show-header="false" border element-loading-background="rgba(0, 0, 0, 0.2)">

        <el-table-column label="材料名称" width="250">
          <template slot-scope="scope">
            <p class="setting-name">{{ scope.row.stufileName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="文件上传" width="200">
          <template slot-scope="scope">
            <zjy-upload
              :ref="'upload' + scope.$index"
              v-if="!fileList[scope.$index].stufilePath"
              class="zjy-table-upload"
              accept="image/gif, image/jpeg"
              :action="action + '?index=' + scope.$index"
              :headers="{'Zjy-Token': token}"
              multiple
              :limit="3"
              :showFileList="false"
              :file-list="fl"
            >
              <el-button size="small" type="primary">
                上传附件
              </el-button>
            </zjy-upload>
            <p v-else class="file-name">{{ fileList[scope.$index].stufileOldname }}</p>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <transition name="breadcrumb1">
              <div v-if="fileList[scope.$index].stufilePath">

                <div class="table-oper-group">
                  <a :href="fileList[scope.$index].stufilePath" target="_blank" class="zjy-btn-download" download>
                    <i class="zjy-icon"></i>
                    <span>下载</span>
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
                </div>
              </transition>
            </template>

            <!-- <div :ref="'ref' + scope.$index"></div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="data.stufileDescription">
      <p class="zjy-form__title">档案说明</p>
      <zjy-input type="textarea" v-model="data.stufileDescription" readonly></zjy-input>
    </template>

    <div class="zjy-footer">
      <zjy-button type="primary" @click="$emit('update:visible', false)">关闭</zjy-button>
    </div>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
import ZjyInput from '@/components/input'
import { mapGetters } from 'vuex'
import ZjyUpload from '@/components/upload/index'

export default {
  name: 'zjy-file-view',
  data () {
    return {
      data: {},
      action: process.env.BASE_URL + 'upload/stufileUpload',
      rules: {
        // stufileNo: [
        //   { required: true, message: '请输入档案编号', trigger: 'blur' }
        // ],
        // recipient: [
        //   { required: true, message: '请输入接收人', trigger: 'blur' }
        // ],
        // stufileDate: [
        //   { required: true, message: '请选择建档日期', trigger: 'blur' }
        // ]
      },
      fileIndex: -1,
      activeFileIndex: -1,
      activeSettingId: '',
      fileList: [],
      fl: [],
      pers: []
    }
  },

  computed: {
    ...mapGetters(['token'])
  },

  methods: {
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

  watch: {
    formData: {
      immediate: true,
      handler (val, oldVal) {
        this.data = val
        try {
          if (this.data.ucenterStudent.studentCode) {
            this.studentCode = this.data.ucenterStudent.studentCode
            this.data.studentName = this.data.ucenterStudent.studentName
            this.data.className = this.data.ucenterStudent.className
            this.data.facultyName = this.data.ucenterStudent.facultyName
            this.data.studentCode = this.data.ucenterStudent.studentCode
            this.data.stufileNo = val.stufileNo
            // const splite = val.stufileNo.split(this.studentCode)
            // this.data.stufileNo = splite[0]
            // this.data.append = splite[1]
          }
        } catch (e) {
        }
      }
    },

    list: {
      immediate: true,
      handler (val) {
        this.fileList = val.filter(i => i.stufilePath)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.el-form {
  padding: 0 50px;
  .el-form-item {
    width: 300px;
    margin-bottom: 20px;
  }
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
.el-progress-bar {
  width: 90%;
}
.cancel {
  position: relative;
  top: 2px;
}
[id*="tip"] {
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
