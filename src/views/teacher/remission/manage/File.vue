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

    <div class="zjy-dialog zjy-preview">
      <el-dialog title="学费减免文件查看" :visible.sync="visible" width="800px">
        <image-view :src="src" v-if="isImageView">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="handleClick">关闭</zjy-button>
          </div>
        </image-view>
        <zjy-preview v-else :src="src">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="handleClick">关闭</zjy-button>
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
  data() {
    return {
      list: [],
      isImageView: false,
      src: '',
      loading: false,
      visible: false,

      columns: properties.columnsFile
    }
  },
  methods: {
    refresh() {
      this.loading = true
      api.queryFileList(2).then(response => {
        if (response.code !== 1) {
          alert(response.message)
        } else {
          this.list = response.data
        }
      }).catch(error => {
        console.log(error)
      }).finally(_ => {
        this.loading = false
      })
    },
    handleClick() {
      this.visible = false
    },

    handleView(row) {
      this.isImageView = this.isImage(row.filePath)
      this.src = row.filePath
      this.visible = true
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

  created() {
    this.refresh()
  }
}
</script>