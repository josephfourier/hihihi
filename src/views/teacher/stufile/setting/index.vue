<!-- 学生档案管理(教师) -->
<template>
  <div class="zjy-app">
    <div class="zjy-table">

      <zjy-table-operator>
        <operator-item clz="create" @click="create">新增</operator-item>
      </zjy-table-operator>

      <zjy-table
        v-loading="loading"
        :data="list"
        :columns="columns"
        @edit="edit"
        @delete="_delete"
      ></zjy-table>

      <div class="zjy-dialog">
        <el-dialog title="请输入档案材料名称" :visible.sync="visible" width="800px">
          <stufile-setting
            v-if="visible"
            :formData="stufile"
            :list="list"
            :type="type"
            @close="handleClose"
          ></stufile-setting>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import stufileAPI from '@/api/teacher/stufile/setting'
import StufileSetting from './StufileSetting'
import ZjyTable from '@/components/table'
import ZjyTableOperator from '@/components/table-operator'
import OperatorItem from '@/components/table-operator/operator-item'

export default {
  data () {
    return {
      list: [],
      stufile: {
        stufileName: '',
        status: '1'
      },
      type: +this.$t('zjy.operator.EDIT'), // 1编辑 2新增
      loading: false,
      visible: false,
      columns: [
        {
          index: true
        },
        {
          label: '档案材料名称',
          prop: 'stufileName'
        }, {
          label: '档案描述',
          prop: 'description'
        }, {
          label: '操作',
          operators: [
            {
              label: '编辑',
              cmd: 'edit'
            },
            {
              label: '删除',
              cmd: 'delete'
            }
          ]
        }
      ]
    }
  },

  methods: {
    create () {
      this.type = +this.$t('zjy.operator.CREATE')
      this.visible = true
    },

    _delete (row) {
      stufileAPI.delete(row.stufilesettingUid).then(response => {
        if (response.code === 1) {
          MSG.success('删除成功')
          this.refresh()
        }
      })
    },

    edit (row) {
      this.type = +this.$t('zjy.operator.EDIT')
      this.stufile = {...row}
      this.visible = true
    },

    handleClose (val) {
      this.visible = false
      if (val !== 0) {
        this.refresh()
      }
    },

    refresh () {
      this.loading = true
      stufileAPI.queryForList().then(response => {
        this.list = response.data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    }
  },

  components: {
    StufileSetting,
    ZjyTable,
    ZjyTableOperator,
    OperatorItem
  },

  created () {
    this.refresh()
  },

  watch: {
    visible (val) {
      if (!val) {
        this.stufile = {
          stufileName: '',
          status: '1'
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
