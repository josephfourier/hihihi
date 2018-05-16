<template>
  <div class="zjy-app">

    <div class="zjy-table">
      <zjy-table
        :data="list"
        :loading="loading"
        :columns="columns"
        @view="handleView"
      >
      </zjy-table>
    </div>

     <div class="search">
      <span style="margin-right:10px;color:#666">本学年减免情况</span>
      <zjy-button type="primary" @click="handleClick">查询</zjy-button>
      <span style="color: #F09861" v-if="have">祝贺你，你本学年有享受免学费的资格</span>
      <span style="color: #F09861" v-if="notHave">你本学年不能享受免学费，如果你已经提出申请，请到资助中心了解原因</span>
    </div>

    <div class="zjy-dialog zjy-preview">
      <el-dialog title="学费减免文件查看" :visible.sync="visible" width="800px">
        <image-view :src="src" v-if="isImageView">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="visible=false">关闭</zjy-button>
          </div>
        </image-view>
        <zjy-preview v-else :src="src">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="visible=false">关闭</zjy-button>
          </div>
        </zjy-preview>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import ZjyTable from '@/components/table'

import ZjyPreview from '@/components/preview'
import ImageView from './ImageView'
import ZjyButton from '@/components/button'
import api from './api'

import { _refresh } from '@/utils'
import properties from './properties'

export default {
  data () {
    return {
      list: [],

      data: {},
      isImageView: false,
      src: '',
      loading: false,
      visible: false,
      columns: properties.columnsFile,

      have: '',
      notHave: ''
    }
  },
  methods: {
     handleClick () {
      api.queryMy(2).then(response => {
        if (response.data) {
          this.have = true
        } else {
          this.notHave = true
        }
      })
    },
    refresh () {
      this.loading = true
      api.queryFileList(2).then(response => {
        if (response.code !== 1) {
          MSG.warning(response.message)
        } else {
          this.list = response.data
        }
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
        this.loading = false
      })
    },

    handleView (row) {
      this.isImageView = this.isImage(row.filePath)
      this.src = row.filePath
      this.visible = true
      this.$store.dispatch('removeFromNoticeList', row.noticeUid).then(response => {
      }).catch(error => {
        MSG.warning('阅读失败')
      })
    },

    isImage (filePath) {
      return /\.(jpg|png|jpeg)$/ig.test(filePath)
    }
  },

  components: {
    ZjyTable,
    ZjyPreview,
    ZjyButton,
    ImageView
  },

  created () {
    this.refresh()
  },

  watch: {
  }
}
</script>

<style lang="scss" scoped>
  .search {
    margin-top: 20px;
    background-color: #FAF4DD;
    padding: 10px;
    &>span {
      font-size: 14px;
    }
  }
</style>
