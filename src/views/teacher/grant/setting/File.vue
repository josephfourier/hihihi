<template>
  <div class="zjy-app">
    <zjy-table-operator>
      <operator-item @click="create" clz="create">新增</operator-item>
    </zjy-table-operator>

    <div class="zjy-table">
      <zjy-table :data="list" :loading="loading" :columns="columns" @view="handleView" @edit="handleEdit" @delete="handleDelete">
      </zjy-table>
    </div>

    <div class="zjy-dialog zjy-preview">
      <el-dialog title="助学金文件查看" :visible.sync="visible" width="800px">
        <image-view :src="src" v-if="isImageView">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="handleClick">关闭</zjy-button>
          </div>
        </image-view>
        <zjy-preview v-else src="https://wkbos.bdimg.com/v1/wenku52//aac7d325b2fdae6ff10c983564c80241?responseContentDisposition=attachment%3B%20filename%3D%22%25E4%25B9%25A6%25E6%25B3%2595%25E4%25B8%258E%25E6%25B3%2595%25E4%25B9%25A6.doc%22%3B%20filename%2A%3Dutf-8%27%27%25E4%25B9%25A6%25E6%25B3%2595%25E4%25B8%258E%25E6%25B3%2595%25E4%25B9%25A6.doc&responseContentType=application%2Foctet-stream&responseCacheControl=no-cache&authorization=bce-auth-v1%2Ffa1126e91489401fa7cc85045ce7179e%2F2018-04-18T10%3A04%3A55Z%2F3600%2Fhost%2F7b5bd6536f7ae8c1a2095d0d19daad4ee4d9a5dfac61efac5f1d13b21ca1c5d3&token=1e1174b9e2c6ecb38c8051e6914749ac91e5d243610e472c42e4a8294913570f&expire=2018-04-18T11:04:55Z">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="handleClick">关闭</zjy-button>
          </div>
        </zjy-preview>
      </el-dialog>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="新增文件" :visible.sync="visible2" width="800px">
        <zjy-grant v-if="visible2" :post="postList" :visible.sync="visible2" @submit="handleCreate"></zjy-grant>
      </el-dialog>
    </div>

    <div class="zjy-dialog">
      <el-dialog title="编辑文件" :visible.sync="visible3" width="800px">
        <grant-update v-if="visible3" :data="data" :post="postList" :visible.sync="visible3" @submit="handleUpdate"></grant-update>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'
import ZjyPreview from '@/components/preview'
import ImageView from './ImageView'
import ZjyButton from '@/components/button'
import api from './api'

import ZjyGrant from './grant'
import GrantUpdate from './grantUpdate'
import { _refresh } from '@/utils'
import properties from './properties'

export default {
  data() {
    return {
      list: [],

      //  职务列表
      postList: [],

      data: {},
      isImageView: false,
      src: '',
      loading: false,
      visible: false,
      visible2: false,
      visible3: false,
      columns: properties.columnsFile
    }
  },
  methods: {
    refresh() {
      this.loading = true
      api.queryFileList(1).then(response => {
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

    queryPostList() {
      return new Promise((resolve, reject) => {
        if (this.postList.length === 0) {
          api.queryPostList().then(response => {
            if (response.code !== 1) {
              reject('获取职务列表失败')
            } else {
              this.postList = response.data.map(i => {
                return {
                  label: i.postName,
                  key: i.postId
                }
              })
              this.postList.push({
                label: '学生',
                key: 0
              })
              resolve()
            }
          }).catch(error => { })
        } else resolve()
      })
    },

    create() {
      this.queryPostList().then(_ => {
        this.visible2 = true
      }).catch(error => {
        MSG.warning(error)
      })
    },

    handleCreate(formData) {
      api.saveFile(formData).then(response => {
        if (response.code !== 1) {
          MSG.warning('保存失败')
        } else {
          this.visible2 = false
          this.refresh()
          setTimeout(_ => {
            MSG.success('保存成功')
          }, 200)
        }
      }).catch(error => { })
    },

    handleUpdate(formData) {
      api.updateFile(formData).then(response => {
        if (response.code !== 1) {
          MSG.warning('修改失败')
        } else {
          this.visible3 = false
          this.refresh()
          setTimeout(_ => {
            MSG.success('修改成功')
          }, 200)
        }
      }).catch(error => { })
    },

    handleClick() {
      this.visible = false
    },

    handleEdit(row) {
      this.queryPostList().then(_ => {
        this.data = row
        this.visible3 = true
      }).catch(error => {
        MSG.warning(error)
      })
    },

    handleView(row) {
      this.isImageView = this.isImage(row.filePath)
      this.src = row.filePath
      this.visible = true
    },

    handleDelete(row) {
      api.deleteFile(row.noticeUid).then(response => {
        if (response.code === 1) {
          MSG.success('删除成功')
          this.refresh()
        } else {
          MSG.warning('删除失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    isImage(filePath) {
      return /\.(jpg|png|jpeg)$/ig.test(filePath)
    }

  },

  components: {
    ZjyTableOperator,
    OperatorItem,
    ZjyTable,
    ZjyPreview,
    ZjyButton,
    ZjyGrant,
    GrantUpdate,
    ImageView
  },

  created() {
    this.refresh()
  },

  watch: {
  }
}
</script>

<style>
.AppHeaderPanel {
  display: none;
}
.WACFrameWord.cui-exth {
  margin-top: -88px;
}
.cui-toolbar-buttondock.alignright {
  display: none;
}
</style>
