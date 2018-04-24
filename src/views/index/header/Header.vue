<!--  -->
<template>
  <div class="zjy-header">
    <div class="wrapper">
      <div class="school">
        <span>{{ user.schoolName }}</span>
        <span class="spacer"></span>
        <span>学工系统</span>
      </div>

      <el-dropdown class="user-info">
        <span class="el-dropdown-link">
          <i class="zjy-icon zjy-icon-user"></i>
          <span>{{ user.fullName }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><a @click="back">返回个人中心</a></el-dropdown-item>
          <el-dropdown-item><a @click="logout">退出系统</a></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="badge-wrap" v-if="user.usertypeId === +$t('zjy.userType.teacher')">
        <!-- 通过size可以为el-dropdown-menu添加不同的class -->
        <el-dropdown class="badge" popper-class="your" size="mysize">
          <el-badge :value="todoValue" class="item todo" :max="5">
            <span class="el-dropdown-link">待办</span>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="todoValue == 0">
              暂无
            </el-dropdown-item>
            <el-dropdown-item class="clearfix" v-for="item in todoList" :key="item.dataUid" v-else>
              <my-list :data="item" @click="handleClick" ></my-list>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="badge">
          <el-badge :value="noticeValue" class="item notice" :max="5">
            <span class="el-dropdown-link">
              通知
            </span>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="noticeValue == 0">
              暂无
            </el-dropdown-item>
            <el-dropdown-item 
              class="clearfix" 
              v-for="item in noticeList" 
              :key="item.noticeUid"  
              v-else
            >
              <notice-list :data="item" @click="handleNotice" ></notice-list>
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
  data () {
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
    handleNotice (data) {
      this.visible2 = true
      this.src = data.filePath
      this.noticeTitle = data.fileName
      this.$store.dispatch('removeFromNoticeList', data.noticeUid).then(response => {
      }).catch(error => {
        MSG.warning('阅读失败')
      })
    },
    handleClick (uid, pid) {
      this.uid = uid
      this.active = this.approves.find(i => i.permissionId === pid)
      this.visible = true
    },

    handleRefresh () {
      this.$store.dispatch('refresh')
    },

    back () {
      window.location.href = process.env.SSO_URL
    },

    logout () {
      this.$store.dispatch('logout').then().catch(error => {
        MSG.warning('退出失败')
      })
    },
     isImage (filePath) {
      return /\.(jpg|png|jpeg)$/ig.test(filePath)
    }
  },

  computed: {
    ...mapGetters(['user', 'approves', 'todoList', 'noticeList']),
    todoValue () {
      return this.todoList.length
    },
    noticeValue () {
      return this.noticeList.length
    },
    componentName () {
      return this.active.approvalUri
    },
    title () {
      return this.active.name
    }
  }
}
</script>
<style lang='scss' scoped>
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
    position: absolute;
    top: 0;
    right: 15px;
    height: 60px;
    margin-right: 35px;
    line-height: 60px;
    cursor: pointer;

    .zjy-icon-user {
      width: 20px;
      height: 20px;
      background: url('./zjy-icon-user.png') no-repeat 0 0;
    }
  }

  .badge-wrap {
    float: right;
    /*margin-right: 50px;*/
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
    position: absolute;
    right: 200px;
    top: 14px;
    line-height: 34px;
  }
  .badge+.badge {
    margin-left: 35px;
  }
  .badge {
    .item {
      cursor: pointer;
      outline: none;
    }
    .todo {
      background: url('./ic_deal.png') 0px 9px no-repeat;
      padding-left: 20px;
    }
    .notice {
      background: url('./ic_notice.png') 0 9px no-repeat;
      padding-left: 20px;
    }
  }
</style>
