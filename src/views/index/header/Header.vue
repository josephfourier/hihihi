<template>
  <div class="zjy-header">
    <div class="wrapper">
      <div class="school">
        <span>{{ user.schoolName }}</span>
        <span class="spacer"></span>
        <span>学工系统</span>
      </div>

      <div class="right">

        <div class="badge-wrap">
          <!-- 通过size可以为el-dropdown-menu添加不同的class -->
          <el-dropdown class="badge" popper-class="your" size="header" v-if="user.usertypeId === +$t('zjy.userType.teacher')">
            <el-badge :value="todoValue" class="item todo" :max="15">
              <span class="el-dropdown-link">待办</span>
            </el-badge>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="todoValue == 0">
                <div class="list-item">
                  <p style="border:0">暂无</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item class="clearfix" v-else :style="{paddingBottom: todoList.length > 5 ? '1px' : '', maxHeight:'230px', height: todoList.length === 1 ? '39px' : todoList.length * 37 + (todoList.length < 5 ? 5 : 10) + 'px'}">
                <el-scrollbar class="scrollbar">
                  <my-list :data="item" @click="handleClick" v-for="item in todoList" :key="item.dataUid"></my-list>
                </el-scrollbar>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown class="badge" size="header" trigger="click">
            <el-badge :value="noticeValue" class="item notice" :max="15">
              <span class="el-dropdown-link">
                通知
              </span>
            </el-badge>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="noticeValue == 0">
                <div class="list-item">
                  <p style="border:0">暂无</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item class="clearfix" v-else :style="{paddingBottom: noticeList.length > 5 ? '1px' : '', paddingBottom: '1px',maxHeight:'230px', height: noticeList.length === 1 ? '39px' : noticeList.length * 37 + (noticeList.length < 5 ? 5 : 10) + 'px'}">
                 <el-scrollbar class="scrollbar">
                   <notice-list :data="item" @click="handleNotice" v-for="item in noticeList" :key="item.noticeUid"></notice-list>
                 </el-scrollbar>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-dropdown class="user-info">
          <span class="el-dropdown-link">
            <i class="zjy-icon zjy-icon-user"></i>
            <span>{{ user.fullName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  @click.native="back">
              <a>返回个人中心</a>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <a>退出系统</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog :visible.sync="visible" width="800px" :title="title" append-to-body>
      <insurance :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'insurance'"></insurance>
      <class-honorary :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'classHonorary'"></class-honorary>
      <faculty-honorary :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'facultyHonorary'"></faculty-honorary>
      <honorary :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'honorary'"></honorary>
      <poor :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'poor'"></poor>
      <scholarship :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'scholarship'"></scholarship>
      <stayholiday :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'stayholiday'"></stayholiday>
      <stuidcard :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'stuidcard'"></stuidcard>
      <allowance :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'allowance'"></allowance>
      <workstudy :uid="uid" :visible.sync="visible" v-if="visible && componentName === 'workstudy'"></workstudy>
    </el-dialog>

    <div class="zjy-dialog">
      <el-dialog class="notice" :title="noticeTitle" :visible.sync="visible2" width="800px" append-to-body>
        <image-view :src="src" v-if="isImage(src)">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="visible2=false">关闭</zjy-button>
          </div>
        </image-view>
        <zjy-preview v-else :src="src">
          <div class="zjy-footer">
            <zjy-button type="primary" @click="visible2=false">关闭</zjy-button>
          </div>
        </zjy-preview>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MyList from './MyList'
import NoticeList from './NoticeList'
import Insurance from './components/Insurance'
import ClassHonorary from './components/ClassHonorary'
import FacultyHonorary from './components/FacultyHonorary'
import Honorary from './components/Honorary'
import Poor from './components/Poor'
import Scholarship from './components/Scholarship'
import Stayholiday from './components/Stayholiday'
import Stuidcard from './components/Stuidcard'
import Allowance from './components/Allowance'
import Workstudy from './components/Workstudy'

import ZjyPreview from '@/components/preview'
import ImageView from './ImageView'
import ZjyButton from '@/components/button'

export default {
  data() {
    return {
      visible: false,
      visible2: false,
      uid: '',
      active: '',
      src: '',
      noticeTitle: ''
    }
  },
  components: {
    MyList,
    Insurance,
    ClassHonorary,
    FacultyHonorary,
    Honorary,
    Poor,
    Scholarship,
    Stayholiday,
    Stuidcard,
    Workstudy,
    Allowance,

    ZjyPreview,
    ImageView,
    ZjyButton,

    // 直接render则会在mounted后渲染，故分离出
    NoticeList
  },

  methods: {
    handleNotice(data) {
      this.visible2 = true
      this.src = data.filePath
      this.noticeTitle = data.fileName
      this.$store.dispatch('removeFromNoticeList', data.noticeUid).then(response => {
      }).catch(error => {
        MSG.warning('阅读失败')
      })
    },
    handleClick(uid, pid) {
      this.uid = uid
      this.active = this.approves.find(i => i.permissionId === pid)
      this.visible = true
    },

    handleRefresh() {
      this.$store.dispatch('refresh')
    },

    back() {
      window.location.href = process.env.SSO_URL
    },

    logout() {
      MSG.success('正在退出中...', 5000)
      this.$store.dispatch('logout').then(_ =>
        window.location.href = process.env.SSO_URL
      ).catch(error => {
        MSG.warning('退出失败')
      })
    },
    isImage(filePath) {
      return /\.(jpg|png|jpeg)$/ig.test(filePath)
    }
  },

  computed: {
    ...mapGetters(['user', 'approves', 'todoList', 'noticeList']),
    todoValue() {
      return this.todoList.length
    },
    noticeValue() {
      return this.noticeList.length
    },
    componentName() {
      return this.active.approvalUri
    },
    title() {
      return this.active.name
    }
  }
}
</script>
<style lang='scss' scoped>
.right {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  right: 0;
}
.wrapper {
  position: absolute;
  line-height: 60px;
  top: 0;
  right: 0;
  left: 0;
  box-shadow: 0px 0px 8px 0px #d7d9de;
  .school {
    padding-left: 20px;
    & > span {
      color: #666666;
    }
  }

  .user-info {
    height: 60px;
    margin-right: 35px;
    line-height: 60px;
    cursor: pointer;
    .zjy-icon-user {
      width: 20px;
      height: 20px;
      background: url("./zjy-icon-user.png") no-repeat 0 0;
    }
  }
  .badge-wrap {
    margin-right: 50px;
  }
}
.el-dropdown-menu.el-popper {
  top: 40px !important;
  min-width: 125px;
}

.badge-wrap {
  display: block;
  color: #606266;
  font-size: 14px;
  line-height: 34px;
}
.badge + .badge {
  margin-left: 35px;
}
.badge {
  height: 100%;
  line-height: 60px;
  .item {
    cursor: pointer;
    outline: none;
  }
  .todo {
    background: url("./ic_deal.png") 0px center no-repeat;
    padding-left: 20px;
  }
  .notice {
    background: url("./ic_notice.png") 0 center no-repeat;
    padding-left: 20px;
  }
}
.scrollbar{height: 100%;}
</style>
