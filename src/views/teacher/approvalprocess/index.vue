<template>
  <div class="zjy-app">
    <search-panel
      class="menu"
      :title="title"
      :filterable="true"
      :props="props"
      :renderContent="renderFunc"
      :data="menus"
      :defaultChecked="[0]"
      @option-checked="menuChecked"
    >
    </search-panel>
    <div class="workflow">
      <div class="workflow-header">
        <p>2.设置流程</p>
        <a href="javascript:;" class="zjy-link-add" @click="addWorkflow">
          <i class="zjy-link-icon zjy-icon-add"></i>
          添加步骤</a>
      </div>
      <div class="workflow-body">
        <!--<transition-group name="list" tag="table">-->
        <table v-loading="loading">
          <tr :key="'-1'" class="workflow-body__item">
            <th>步骤序号</th>
            <th>审批人职务 / 教师</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item,index) in workflow" :key="item.ctime + item.permissionId" class="workflow-body__item"
              v-if="hasWorkflow">
            <td>{{ item.approvalStep }}</td>
            <td v-if="item.approvalType === '2'">{{ item.teacherName }}</td>
            <td v-else>{{ item.postName }}</td>
            <td>
              <div class="zjy-link-group">
                <a href="javascript:;" class="zjy-link-config" @click="configWorkflow(item, index)">
                  <i class="zjy-link-icon zjy-icon-config"></i>
                  配置</a>
                <a href="javascript:;" class="zjy-link-delete" v-if="index === workflow.length - 1"
                   @click="deleteWorkflow(item, index)">
                  <i class="zjy-link-icon zjy-icon-delete"></i>
                  删除</a>
              </div>
            </td>
          </tr>
          <tr :key="'-2'" class="workflow-body__item" v-if="!hasWorkflow">
            <td colspan="3" :key="0" class="warning"><i></i><span>请添加步骤</span></td>
          </tr>
          <!--</transition-group>-->
        </table>
      </div>
    </div>
    <div class="zjy-dialog">
      <el-dialog title="节点处理人配置" :visible.sync="visible" width="625px">
        <div class="level">
          <span
            v-if="optionsLevel.length > 0"
          >{{ optionsLevel[0].dictName}}：</span>

          <el-radio-group v-model="level" @change="levelChecked">
            <el-radio
              v-for="item in optionsLevel"
              :key="item.valueId"
              :label="item.valueKey"
            >
              {{ item.valueName }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="handler">
          <span
            v-if="optionsHandler.length > 0"
          >{{ optionsHandler[0].dictName }}：
          </span>
          <el-radio-group v-model="handler" @change="handlerChecked">
            <el-radio
              v-for="item in optionsHandler"
              :key="item.valueId"
              :label="item.valueKey"
            >
              {{ item.valueName }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="panel-wrapper">
          <search-panel
            class="post"
            title="选择职务"
            :data="postList"
            :props="props"
            :filterable="true"
            type="radio"
            :defaultChecked="defaultPost"
            :clearChecked="isClearPost"
            @option-checked="postChecked"
          />
          <search-panel
            class="teacher"
            title="选择个人"
            type="radio"
            :data="teacherList"
            :filterable="true"
            :props="props"
            :defaultChecked="defaultTeacher"
            :clearChecked="isClearTeacher"
            @option-checked="teacherChecked"
          />
          <div class="zjy-footer clearfix">
            <zjy-button type="plain" @click="visible = false">取消</zjy-button>
            <zjy-button type="primary" @click="submit">提交</zjy-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import commonAPI from '@/api/common'
import approvalAPI from '@/api/approval'

import SearchPanel from '@/components/search-panel/search-panel'
import ZjyButton from '@/components/button'

export default {
  name: 'HelloWorld',

  data () {
    return {
      menus: [], // 审批流程菜单
      workflow: [], // 流程步骤
      title: '1.选择功能',
      visible: false,
      level: '',
      handler: '',
      optionsLevel: [],
      optionsHandler: [],
      defaultPost: [],    // 初始化选中的职位
      defaultTeacher: [], // 初始化选中的教师
      checkedPost: '',    // 当前选中的职位
      checkedTeacher: '', // 当前选中的教师
      checkedMenu: '',    // 当前选中的菜单
      isClearPost: false,
      isClearTeacher: false, // 清空Panel中选中
      loading: false,
      toSave: '',
      props: {
        label: 'label',
        key: 'key'
      },
      renderFunc (h, item) {
        return (
          <span>
            {item.label}
          </span>
        )
      },
      postList: [],
      teacherList: []
    }
  },

  created () {
    commonAPI.queryApprovalList().then(response => {
      if (response.code !== 1) {
        this.$alert(response.message)
      } else {
        this.menus = response.data.map(x => {
          return {
            label: x.name,
            key: x.permissionId
          }
        })
        if (this.menus.length > 0) {
          this.queryWorkflow(this.menus[0].key)
          this.checkedMenu = this.menus[0]
        }
      }
    })
  },

  methods: {
    addWorkflow () {
      if (!this.hasWorkflow || this.workflow[this.nextStepNo - 2].templateUid) {
        this.workflow.push({
          approvalStep: this.nextStepNo
        })
      } else {
        MSG.warning('请先配置第' + (this.nextStepNo - 1) + '步的职务')
      }
    },

    configWorkflow (item, index) {
      this.initOptions().then(_ => {
        if (this.workflow[index].templateUid) {
          this.toSave = item

          this.level = item.teacherLevel
          this.handler = item.approvalType

          this.queryPostList(this.level).then(response => {
            this.postList = response
            const i = this.postList.findIndex(i => i.key === item.postId)
            this.checkedPost = this.postList[i]
            this.defaultPost = new Array(1).fill(i)

            if (item.approvalType === '2') {
              this.queryTeacherList(this.checkedPost.key).then(response => {
                this.teacherList = response
                const i = this.teacherList.findIndex(i => i.key === item.teacherId)
                this.checkedTeacher = this.teacherList[i]
                this.defaultTeacher = new Array(1).fill(i)
              }).catch(error => {
                this.$alert(error)
              })
            }
          }).catch(error => {
            this.$alert(error)
          })
        } else {

        }
        this.visible = true
      })
    },

    makeFormData () {
      return {
        templateUid: this.toSave.templateUid || null,
        permissionId: this.checkedMenu.key,
        permissionName: this.checkedMenu.label,
        approvalStep: this.toSave.approvalStep || this.nextStepNo - 1,
        approvalType: this.handler,
        teacherLevel: this.level,
        approvalUri: this.workflow.length > 0 ? this.workflow[0].approvalUri : '',
        postName: this.checkedPost.label || null,
        postId: this.checkedPost.key || null,
        teacherId: this.checkedTeacher.key || null,
        teacherName: this.checkedTeacher.label || null
      }
    },

    deleteWorkflow (item, index) {
      if (item.templateUid) {
        this._delete(item)
      } else {
        this.workflow.splice(index, 1)
      }
    },

    menuChecked (item) {
      this.checkedMenu = item
      this.queryWorkflow(item.key)
    },

    queryWorkflow (id) {
      this.loading = true
      approvalAPI.queryApprovalProcess(id).then(response => {
        if (response.code !== 1) {
          this.$alert(response.message)
        } else {
          this.workflow = response.data.filter(x => x.templateUid).sort((x, y) => x.approvalStep - y.approvalStep)
          this.loading = false
        }
      })
    },

    _delete (item) {
      approvalAPI.deleteProvalProcess(item.templateUid).then(response => {
        if (response.code === 1) {
          // this.value.splice(this.value.findIndex(v => v.templateUid === item.templateUid), 1)
          MSG.success('删除成功')
          this.refresh()
        } else {
          MSG.success('删除失败')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    queryPostList (level) {
      return new Promise((resolve, reject) => {
        commonAPI.queryPostList(level).then(response => {
          if (response.code !== 1) {
            reject(response.message)
          } else {
            const list = response.data.map(i => {
              return {
                label: i.postName,
                key: i.postId
              }
            })
            resolve(list)
          }
        })
      })
    },

    queryTeacherList (id) {
      return new Promise((resolve, reject) => {
        commonAPI.queryTeacherList(id).then(response => {
          if (response.code !== 1) {
            reject(response.message)
          } else {
            const list = response.data.map(i => {
              return {
                label: i.teacherName,
                key: i.teacherId
              }
            })
            resolve(list)
          }
        })
      })
    },

    postChecked (item) {
      this.checkedPost = this.postList.find(i => i.key === item.key)
    },

    teacherChecked (item) {
      this.checkedTeacher = this.teacherList.find(i => i.key === item.key)
    },

    levelChecked (level) {
      if (!this.handler) return false

      this.clearPost()
      this.queryPostList(level).then(response => {
        this.postList = response
      }).catch(error => {
        console.log(error)
      })
    },

    handlerChecked (handler) {
      if (!this.level) return false
    },

    initOptions () {
      return new Promise((resolve, reject) => {
        axios.all([commonAPI.queryApprovalLevel(), commonAPI.queryApprovalHandler()]).then(axios.spread((r1, r2) => {
          if (r1.code !== 1 || r2.code !== 1) {
            reject(r1.message || r2.message)
          } else {
            this.optionsLevel = r1.data
            this.optionsHandler = r2.data
            resolve()
          }
        }))
      })
    },

    clearPost (flag) {
      if (flag) {
        this.postList = []
      }
      this.defaultPost = []
      this.checkedPost = ''
      this.isClearPost = true
      setTimeout(_ => {
        this.isClearPost = false
      }, 300)
    },

    clearTeacher (flag) {
      if (flag) {
        this.teacherList = []
      }
      this.defaultTeacher = []
      this.checkedTeacher = ''
      this.isClearTeacher = true
      setTimeout(_ => {
        this.isClearTeacher = false
      }, 300)
    },

    clearAll () {
      this.level = ''
      this.handler = ''
      this.defaultPost = []
      this.defaultTeacher = []
      this.checkedTeacher = ''
      this.checkedPost = ''
      this.teacherList = []
      this.postList = []
      this.isClearPost = true
      this.isClearTeacher = true
      this.toSave = ''

      setTimeout(_ => {
        this.isClearTeacher = false
        this.isClearPost = false
      }, 300)
    },

    submit () {
      if (!this.checkedPost) {
        MSG.success('未选择职务')
      } else if (this.handler === '2' && !this.checkedTeacher) {
        MSG.success('未选择教师')
      } else {
        const d = this.makeFormData()
        if (d.templateUid) {
          approvalAPI.updateProvalProcess(d).then(response => {
            if (response.code !== 1) {
              this.$alert(response.message)
            } else {
              setTimeout(_ => {
                MSG.success('修改成功')
              }, 200)
              this.refresh()
              this.visible = false
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          approvalAPI.createProvalProcess(d).then(response => {
            if (response.code === 1) {
              setTimeout(_ => {
                MSG.success('配置成功')
              }, 200)
              this.refresh()
              this.visible = false
            } else {
              this.$alert(response.message)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },

    refresh () {
      this.queryWorkflow(this.checkedMenu.key)
    }

  },

  computed: {
    hasWorkflow () {
      return this.workflow.length > 0
    },
    nextStepNo () {
      return this.workflow.length === 0 ? 1 : this.workflow[this.workflow.length - 1].approvalStep + 1
    }
  },

  components: {
    SearchPanel,
    ZjyButton
  },

  watch: {
    // 关闭弹窗后清除单选信息
    visible (val) {
      if (!val) this.clearAll()
    },

    checkedPost (val) {
      if (!val) this.clearTeacher(true)
      else {
        if (this.handler === '2') {
          this.queryTeacherList(val.key).then(response => {
            this.teacherList = response
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },

    handler (val) {
      if (val === '2') {
        if (this.checkedPost) {
          this.queryTeacherList(this.checkedPost.key).then(response => {
            this.teacherList = response
          }).catch(error => {
            console.log(error)
          })
        }
      }

      if (val === '1') {
        this.clearTeacher(true)
        if (!this.level) return
        this.queryPostList(this.level).then(response => {
          this.postList = response
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .zjy-app {
    overflow: hidden;
    padding: 30px 40px;
    font-size: 14px;
  }

  .menu {
    width: 260px;
    float: left;
    margin-right: 20px;
    margin-bottom: 10px;
    min-height: 300px;
  }

  .workflow {
    float: left;
    width: 600px;
    border: 1px solid #c6c6c6;
    min-height: 300px;
    .workflow-header {
      position: relative;
      height: 40px;
      line-height: 40px;
      background-color: #f2f2f2;
      text-align: left;
      text-indent: 20px;
      border-bottom: 1px solid #c6c6c6;
    }
    .workflow-body {
      table {
        width: 100%;
      }
      th:nth-of-type(1) {
        width: 30%;
      }
      th:nth-of-type(2) {
        width: 30%;
      }
      th:nth-of-type(3) {
        width: 40%;
      }
      th, td {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        text-align: center;
      }
      .workflow-body__item {

        border: 1px solid #c6c6c6;
        border-left: 0;
        border-right: 0;
        &:first-of-type {
          border-top: 0;
        }
        &:last-of-type {
          border-bottom: 0;
        }
      }
    }
  }

  .list-enter-active {
    transition: all 1s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  .zjy-link-group {
    width: 115px;
  }

  .warning {
    text-align: left !important;
    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: text-bottom;
      background: url('./zjy-icon-warning.png') 0 0;
      margin-right: 5px;
    }
  }

  .level {
    margin-bottom: 10px;
  }

  .handler {
    margin-bottom: 20px;
  }

  .handler span,
  .level span {
    width: 100px;
    display: inline-block;
    text-align: right;
    margin-right: 8px;
  }

  .panel-wrapper {
    overflow: hidden;
    .post {
      float: left;
      width: 260px;
      margin-right: 20px;
      min-height: 250px;
    }

    .teacher {
      float: left;
      width: 260px;
      min-height: 250px;
    }
  }

  .zjy-footer {
    clear: both
  }
</style>
