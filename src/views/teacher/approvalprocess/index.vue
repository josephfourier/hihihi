<!--<template>-->
<!--<div class="app-approval">-->
<!--<MultiMenu-->
<!--class="zjy-multi-menu"-->
<!--:data="data"-->
<!--v-model="value"-->
<!--:titles="titles"-->
<!--:widths="widths"-->
<!--:filterable="filterable"-->
<!--:props="props"-->
<!--:types="types"-->
<!--:placeholder="placeholder"-->
<!--:render-content="renderFunc"-->
<!--:selected="selected"-->
<!--:elts="elts"-->
<!--:defaultSelected="data[0]"-->
<!--@selected-change="selectedChange"-->
<!--@del="del"-->
<!--@create="create"-->
<!--@config="config"-->
<!--:highlights="[true, false]"-->
<!--:loading="loading"-->
<!--&gt;-->
<!--<a slot="header">添加步骤</a>-->
<!--</MultiMenu>-->

<!--<el-dialog title="节点处理人配置" :visible.sync="dialogVisible" @close="reset" width="675px">-->
<!--<div class="zjy-radio-container">-->
<!--<div class="zjy-radio-wrap">-->
<!--<template>-->
<!--<span>{{ levels.length > 0 ? levels[0].dictName : 'radio' }}</span>-->
<!--<el-radio-group v-model="level">-->
<!--<el-radio v-for="(item) in levels" :key="item.valueId" :label="item.valueKey">-->
<!--{{ item.valueName }}-->
<!--</el-radio>-->
<!--</el-radio-group>-->
<!--</template>-->
<!--</div>-->

<!--<div class="zjy-radio-wrap">-->
<!--<span>{{ handlers.length > 0 ? handlers[0].dictName : 'radio' }}</span>-->
<!--<template>-->
<!--<el-radio-group v-model="handler">-->
<!--<el-radio v-for="(item) in handlers" :key="item.valueId" :label="item.valueKey">-->
<!--{{ item.valueName }}-->
<!--</el-radio>-->
<!--</el-radio-group>-->
<!--</template>-->
<!--</div>-->
<!--</div>-->

<!--<MultiMenu-->
<!--class="zjy-multi-menu"-->
<!--:data="positions"-->
<!--v-model="teachers"-->
<!--:titles="['选择职务','选择个人']"-->
<!--:widths="['285px', '285px']"-->
<!--:filterable="[true, true]"-->
<!--:props="props2"-->
<!--:elts="['radio','radio']"-->
<!--:dialogVisible="dialogVisible"-->
<!--:level="level"-->
<!--:handler="handler"-->
<!--:defaultSelected="defaultSelectedPost"-->
<!--:defaultSelectedSub="defaultSelectedTeacher"-->
<!--@selected-change="updateTeachers"-->
<!--@selected-change_="selectTeacher"-->
<!--:hightlights="[false,false]">-->
<!--</MultiMenu>-->

<!--<div slot="footer" class="dialog-footer">-->
<!--<zjy-button @click.native="reset" type="plain">取 消</zjy-button>-->
<!--<zjy-button @click="saveOrUpdate" type="primary">确 定</zjy-button>-->
<!--</div>-->

<!--</el-dialog>-->
<!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import MultiMenu from '@/components/multi-menu/Menu'-->
<!--import approvalAPI from '@/api/approval'-->

<!--import ZjyButton from '@/components/button'-->

<!--export default {-->
<!--name: 'App',-->
<!--data () {-->
<!--return {-->
<!--// 主菜单数据-->
<!--data: [],-->

<!--// 子菜单数据-->
<!--value: [],-->

<!--// 主菜单当前项-->
<!--selected: {},-->

<!--// 菜单标题-->
<!--titles: ['1.选择功能', '2.流程设置'],-->

<!--// 菜单宽度-->
<!--widths: ['200px', '600px'],-->

<!--// 菜单是否显示搜索-->
<!--filterable: [true, false],-->

<!--// 判断配置步骤时为新增或更新-->
<!--isUpdate: false,-->

<!--props: [-->
<!--{-->
<!--key: 'permissionId',-->
<!--label: 'name'-->
<!--},-->
<!--{-->
<!--key: 'approvalStep',-->
<!--label: 'postName'-->
<!--}-->
<!--],-->

<!--// 弹出窗主菜单属性-->
<!--props2: [-->
<!--{-->
<!--key: 'postId',-->
<!--label: 'postName'-->
<!--},-->
<!--{-->
<!--key: 'teacherId',-->
<!--label: 'teacherName'-->
<!--}-->
<!--],-->

<!--// 菜单主体渲染类型-->
<!--types: ['ul', 'table'],-->

<!--// 渲染函数-->
<!--renderFunc (h, option, type) {-->
<!--if (type === 'ul') {-->
<!--return <span>{option.name}</span>-->
<!--}-->
<!--},-->

<!--// 对话框显示-->
<!--dialogVisible: false,-->

<!--levels: [],-->

<!--// 范围 学校 院系-->
<!--level: '-1',-->

<!--handlers: [],-->

<!--// 处理人-->
<!--handler: '-1',-->

<!--// 职务信息-->
<!--positions: [],-->

<!--// 选择的职务-->
<!--selectedPost: {},-->

<!--// 教师信息(个人)-->
<!--teachers: [],-->

<!--// 选择的教师-->
<!--selectedTeacher: {},-->

<!--// handlerSelected: {},-->
<!--// teacherSelected: {},-->

<!--// 渲染checkbox, radio-->
<!--elts: [],-->

<!--placeholder: '请输入搜索条件',-->

<!--// 更新回显-->
<!--// 默认选中的职务-->
<!--defaultSelectedPost: {},-->
<!--// 默认选中的教师-->
<!--defaultSelectedTeacher: {},-->

<!--currentUid: '',-->
<!--currentStep: -1,-->
<!--loading: false-->
<!--}-->
<!--},-->

<!--methods: {-->
<!--selectedChange (item) {-->
<!--this.selected = item-->
<!--this.queryApprovalProcess(this.selected[this.keyPropMain])-->
<!--},-->

<!--// 根据id查询步骤列表-->
<!--queryApprovalProcess (id) {-->
<!--this.loading = true-->
<!--approvalAPI-->
<!--.queryApprovalProcess(id)-->
<!--.then(resp => {-->
<!--// 过滤错误数据(无templateUid定义为错误数据)-->
<!--this.value = resp.data == null-->
<!--? []-->
<!--: resp.data-->
<!--.filter(x => x.templateUid)-->
<!--.sort((x, y) => +x.approvalStep - +y.approvalStep)-->
<!--this.loading = false-->
<!--}-->
<!--)-->
<!--.catch(err => {})-->
<!--},-->

<!--del (item) {-->
<!--if (!item.templateUid) {-->
<!--this.value.splice(this.value.length - 1, 1)-->
<!--this.$alert('删除成功')-->
<!--return-->
<!--}-->

<!--approvalAPI.deleteProvalProcess(item.templateUid)-->
<!--.then(resp => {-->
<!--if (resp.code === 1) {-->
<!--this.value.splice(this.value.findIndex(v => v.templateUid === item.templateUid), 1)-->
<!--this.$alert('删除成功')-->
<!--}-->
<!--})-->
<!--.catch(err => {})-->
<!--},-->

<!--reset () {-->
<!--this.level = this.handler = '-1'-->
<!--this.dialogVisible = false-->
<!--this.teachers = []-->
<!--this.positions = []-->
<!--this.selectedPost = {}-->
<!--this.selectedTeacher = {}-->
<!--this.defaultSelectedPost = {}-->
<!--this.defaultSelectedTeacher = {}-->
<!--},-->

<!--config (item) {-->
<!--this.isUpdate = !!item.arg.templateUid-->
<!--this.dialogVisible = true-->
<!--this.handlers.length === 0 ? this.queryApprovalHandler() : ''-->
<!--this.levels.length === 0 ? this.queryApprovalLevel() : ''-->

<!--this.currentStep = item.arg.approvalStep-->

<!--// 回填信息-->
<!--if (this.isUpdate) {-->
<!--this.handler = item.arg.approvalType-->
<!--this.level = item.arg.teacherLevel-->
<!--this.selectedPost = this.defaultSelectedPost = item.arg-->
<!--this.currentUid = item.arg.templateUid-->
<!--}-->
<!--},-->

<!--// 查询处理人类型-->
<!--queryApprovalHandler () {-->
<!--approvalAPI-->
<!--.queryApprovalHandler()-->
<!--.then(resp => this.handlers = resp.data === null ? [] : resp.data)-->
<!--.catch(err => {})-->
<!--},-->

<!--// 查询处理级别-->
<!--queryApprovalLevel () {-->
<!--approvalAPI-->
<!--.queryApprovalLevel()-->
<!--.then(resp => this.levels = resp.data === null ? [] : resp.data)-->
<!--.catch(err => {})-->
<!--},-->

<!--// 根据级别查询职务-->
<!--queryPostList (level) {-->
<!--this.teachers = []-->

<!--if (this.handler == -1 || this.level == -1) return-->

<!--approvalAPI-->
<!--.queryPostList(level)-->
<!--.then(resp => this.positions = resp.data === null ? [] : resp.data)-->
<!--.catch(err => {})-->
<!--},-->

<!--// 添加步骤-->
<!--create () {-->
<!--const keyProp = this.props[1].key-->
<!--const labelProp = this.props[1].label-->

<!--if (this.value.length === 0) {-->
<!--this.value.push({-->
<!--approvalStep: 1,-->
<!--postName: ''-->
<!--})-->
<!--} else {-->
<!--const key = this.value[this.value.length - 1][keyProp]-->
<!--const done = this.value[this.value.length - 1][labelProp] !== ''-->
<!--if (!done) {-->
<!--this.$alert('请先配置第' + key + ' 步的信息')-->
<!--return-->
<!--}-->

<!--this.value.push({-->
<!--approvalStep: key + 1,-->
<!--postName: ''-->
<!--})-->
<!--}-->
<!--},-->

<!--// 保存流程步骤-->
<!--saveOrUpdate () {-->
<!--if (Object.keys(this.selectedPost).length === 0) {-->
<!--this.$alert('请选择职务')-->
<!--return-->
<!--} else if (this.handler === '2' && Object.keys(this.selectedTeacher).length === 0) {-->
<!--this.$alert('请选择个人')-->
<!--return-->
<!--}-->
<!--!this.isUpdate-->
<!--? approvalAPI.createProvalProcess(this.__create())-->
<!--.then(resp => {-->
<!--if (resp.code === 1) {-->
<!--this.$alert('配置成功')-->
<!--this.queryApprovalProcess(this.selected[this.keyPropMain])-->
<!--}-->
<!--})-->
<!--.catch(err => {})-->
<!--: approvalAPI.updateProvalProcess(this.__create())-->
<!--.then(resp => {-->
<!--this.queryApprovalProcess(this.selected[this.keyPropMain])-->
<!--})-->
<!--.catch(err => {-->

<!--})-->

<!--this.reset()-->
<!--},-->

<!--__getType () {-->
<!--if (this.handler === '1') {-->
<!--return {-->
<!--postName: this.selectedPost.postName,-->
<!--postId: this.selectedPost.postId-->
<!--}-->
<!--} else if (this.handler === '2') {-->
<!--return {-->
<!--teacherId: this.selectedTeacher.teacherId,-->
<!--teacherName: this.selectedTeacher.teacherName-->
<!--}-->
<!--}-->
<!--},-->

<!--// 创建一个表单提交实体-->
<!--__create () {-->
<!--const type = this.__getType()-->
<!--return {-->
<!--templateUid: this.currentUid || null,-->
<!--permissionId: this.selected.permissionId,-->
<!--permissionName: this.selected.name,-->
<!--approvalStep: this.currentStep,-->
<!--approvalType: this.handler,-->
<!--teacherLevel: this.level,-->
<!--approvalUri: this.selected.approvalUri,-->
<!--postName: this.selectedPost.postName || null,-->
<!--postId: this.selectedPost.postId || null,-->
<!--teacherId: this.selectedTeacher.teacherId || null,-->
<!--teacherName: this.selectedTeacher.teacherName || null-->
<!--}-->
<!--},-->

<!--updateTeachers (item) {-->
<!--this.selectedPost = item-->
<!--if (this.handler === '1') return-->
<!--approvalAPI.queryTeacherList(item.postId)-->
<!--.then(resp => {-->
<!--this.teachers = resp.data-->
<!--if (this.isUpdate) {-->
<!--this.defaultSelectedTeacher = this.teachers.find(i => i.teacherId === item.teacherId)-->
<!--}-->
<!--})-->
<!--.catch(err => {})-->
<!--},-->

<!--// 选中的教师信息-->
<!--selectTeacher (item) {-->
<!--this.selectedTeacher = item-->
<!--}-->
<!--},-->

<!--components: {-->
<!--MultiMenu,-->
<!--ZjyButton-->
<!--},-->

<!--computed: {-->
<!--keyPropMain () {-->
<!--return this.props[0].key || 'key'-->
<!--},-->

<!--labelPropMain () {-->
<!--return this.props[0].label || 'label'-->
<!--}-->
<!--},-->

<!--created () {-->
<!--approvalAPI-->
<!--.queryApprovalList()-->
<!--.then(resp => {-->
<!--this.data = resp.data-->
<!--})-->
<!--.catch(err => {})-->
<!--},-->

<!--watch: {-->
<!--level (val, old) {-->
<!--if (val === old) return-->

<!--this.selectedPost = {}-->
<!--this.selectedTeacher = {}-->
<!--this.queryPostList(val)-->
<!--},-->

<!--handler (val, old) {-->
<!--if (val === old) return-->
<!--this.selectedPost = {}-->
<!--this.selectedTeacher = {}-->

<!--// if (val === '-1' || val === '1') {-->
<!--//   this.teachers = []-->
<!--//   this.selectedTeacher = {}-->
<!--// }-->

<!--this.queryPostList(this.level)-->

<!--if (old === '1' || old === '2') this.defaultSelectedPost = {}-->
<!--},-->

<!--defaultSelectedPost (val, old) {-->
<!--if (Object.keys(val).length !== 0 && this.handler === '2') {-->
<!--approvalAPI.queryTeacherList(val.postId)-->
<!--.then(resp => {-->
<!--this.teachers = resp.data-->
<!--})-->
<!--.catch(err => {})-->
<!--}-->
<!--}-->

<!--}-->
<!--}-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.app-approval {-->
<!--padding: 30px 40px;-->

<!--.zjy-menu-panel {-->
<!--display: inline-block;-->
<!--vertical-align: top;-->
<!--}-->

<!--.zjy-radio-container {-->
<!--padding-bottom: 10px;-->
<!--.zjy-radio-wrap {-->
<!--margin-bottom: 10px;-->
<!--& > span {-->
<!--min-width: 100px;-->
<!--display: inline-block;-->
<!--}-->
<!--}-->
<!--}-->
<!--.el-radio + .el-radio {-->
<!--margin-left: 15px;-->
<!--}-->
<!--.el-radio__inner {-->
<!--width: 22px;-->
<!--height: 22px;-->
<!--}-->

<!--.el-radio__inner::after {-->
<!--width: 8px;-->
<!--height: 8px;-->
<!--}-->

<!--.el-radio__input.is-checked + .el-radio__label {-->
<!--color: #606266;-->
<!--}-->

<!--.el-radio__input.is-checked .el-radio__inner {-->
<!--background-color: #29c6d4;-->
<!--border: 1px solid #29c6d4;-->
<!--}-->
<!--.el-radio__inner:hover {-->
<!--border: 1px solid #29c6d4;-->
<!--}-->
<!--}-->
<!--</style>-->

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
          < span >
            {item.label
            }
          -{item.key
            }
          <
          /span>
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
        this.$alert('请先配置第' + (this.nextStepNo - 1) + '步的职务')
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
          this.$alert('删除成功')
          this.refresh()
        } else {
          this.$alert('删除失败')
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
        this.$alert('未选择职务')
      } else if (this.handler === '2' && !this.checkedTeacher) {
        this.$alert('未选择教师')
      } else {
        const d = this.makeFormData()
        if (d.templateUid) {
          approvalAPI.updateProvalProcess(d).then(response => {
            if (response.code !== 1) {
              this.$alert(response.message)
            } else {
              this.$alert('修改成功')
              this.refresh()
              this.visible = false
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          approvalAPI.createProvalProcess(d).then(response => {
            if (response.code === 1) {
              this.$alert('配置成功')
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
    }

    .teacher {
      float: left;
      width: 260px;
    }
  }

  .zjy-footer {
    clear: both
  }
</style>
