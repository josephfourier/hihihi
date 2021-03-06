<template>
  <div class="zjy-form" v-loading="loading">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
      <el-form-item label="文件名称" prop="fileName" class="block">
        <el-input v-model="formData.fileName" disabled class="upload-file__input"></el-input>
      </el-form-item>

      <el-form-item label="文件路径" prop="filePath" v-show="false">
        <el-input v-model="formData.filePath"></el-input>
      </el-form-item>

      <el-form-item label="上传附件" style="margin-bottom: 0; overflow:hidden;">
         <el-upload
          class="upload-file"
          :action="action" 
          :headers="{'Zjy-Token': token}" 
          :on-preview="handlePreview" 
          :on-remove="handleRemove" 
          :before-upload="handleBeforeUpload" 
          :on-change="handleChange" 
          :on-success="handleSuccess" 
          :on-error="handleError"
          :on-progress="handleProgress"
          :show-file-list="false"
        >
          <div class="upload-wrapper" style="display:flex;flex-direction:row"> 
            <el-button size="small" type="primary" class="upload-btn" @click="handleClick">上传附件</el-button>
            <transition name="el-zoom-in-center">
              <div class="upload-status" v-if="showPercent">
                <zjy-progress :percentage="percent" color="#37c6d4" :percentageText="percentText"></zjy-progress>
              </div>
            </transition>
          </div>
          <div slot="tip" class="upload__tip">只能上传excel,word,ppt及图片格式文件</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="开放阅读" prop="isOpen" style="margin-bottom:10px">
        <el-radio-group v-model="formData.isOpen">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="查看范围" prop="readType" style="margin-bottom:10px">
        <el-radio-group v-model="formData.readType">
          <el-radio label="1">全部可见</el-radio>
          <el-radio label="0">部分可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div class="panel" v-if="show">
          <select-panel
            :data="post" 
            :title="'选择范围'" 
            :defaultChecked="defaultChecked"
            @checked="handleChecked" 
            :filterable="false"
          >
          </select-panel>
        </div>
      </transition>
      <div class="zjy-footer">
        <zjy-button type="plain" @click="$emit('update:visible', false)">取消</zjy-button>
        <zjy-button type="primary" @click="submitForm('formData')">提交</zjy-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
import SelectPanel from '@/components/select-panel'
import ZjyProgress from '@/components/progress'

import { mapGetters } from 'vuex'

export default {

  data() {
    return {
      formData: {},
      action: process.env.BASE_URL + '/upload/stufileUpload',
      done: false,
      loading: false,
      showPercent: false,
      percent: 0,
      percentText: '',
      defaultChecked: [],
      rules: {
        fileName: [
          { required: true, message: '请上传文件', trigger: 'change' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开放阅读', trigger: 'change' }
        ],
        readType: [
          { required: true, message: '请选择文件查看范围', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters(['token']),
    show () {
      return this.formData.readType === '0'
    }
  },
  methods: {
    handleClick () {
    },
    handleBeforeUpload(file) {
      this.done = false
      this.showPercent = true
    },
    handleProgress(event, file, fileList) {
      this.percent = +((event.percent).toFixed(2))
      this.percentText = this.percent < 99 ? this.percent + '%' : '处理中...'
    },

    handleChange(file, fileList) {
      // if (this.hasError) return
      // if (!/\.(xls|xlsx)$/gi.test(file.name)) {
      //   MSG.warning('请上传excel格式文件')
      //   this.clearFile()
      //   return false
      // }
      // this.fileName = file.name
      // this.myfile = file
    },

    handleSuccess(response, file, fileList) {
      this.loading = false
      this.done = true
      if (response.code === 1) {
        this.formData.filePath = response.data
        this.formData.fileName = file.name  
        this.percentText = '完成'
      } else {
        this.percentText = '失败'
      }
    },


    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleError (err, file, fileList) {

    },
    handleChecked(val) {
      this.formData.swmsNoticeReadscopeList = val.map(element => {
        return {
          postId: element
        }
      })
    },
    submitForm(formName) {
      if (this.show && !this.formData.swmsNoticeReadscopeList ||
      this.show && this.formData.swmsNoticeReadscopeList.length === 0
      ) {
        MSG.warning('请选择可见范围')
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          return false
        }
      })
    }
  },
  props: {
    post: Array,
    data: Object,
    visible: Boolean
  },
  components: {
    ZjyButton,
    SelectPanel,
    ZjyProgress
  },

  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val && val.swmsNoticeReadscopeList) {
          this.defaultChecked = val.swmsNoticeReadscopeList.map(i => {
            return i.postId
          })
        }
        this.formData = {...val}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inline {
  .el-input {
    width: 250px;
  }
}
.panel {
  width: 260px;
  margin-top: -9px;
  position: relative;
  left: 183px;
}
.upload-btn {
  width: 80px;
  color: #fff;
  background-color: #36c6d3;
  border-color: #36c6d3;
  border-radius: 25px;
  padding: 7px 15px;
}
.upload__tip {
  font-size: 12px;
}
.upload-status {
  width: 200px;
  padding-top: 5px;
  margin-left: 20px;
}
</style>
