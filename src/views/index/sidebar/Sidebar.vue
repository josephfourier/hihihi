<!--  -->
<template>
   <div class="sidebar-wrap" :class="{hideSide: isCollapse}">
    <div class="logo">
      <img src="./logo.png" alt="职教云logo">
    </div>
    <el-menu
      :default-active="$route.path"
      class="zjy-el-menu"
      @open="handleOpen"
      @close="handleClose"
      text-color="#bdbfc7"
      active-text-color="#fff"
      :unique-opened=true
      :collapse="isCollapse">
      <el-submenu v-for="item in multi" :index="item.name" :key="item.name">
        <template slot="title">
          <i :class="item.meta.icon" class="zjy-icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <router-link :to="children.path" v-for="children in item.children" :key="children.path">
          <el-menu-item :index="children.path">
            <i class="zjy-bar"></i>
            {{ children.name }}
          </el-menu-item>
        </router-link>
      </el-submenu>

      <router-link v-for="item in single" :key="item.name" :to="item.children[0].path">
        <el-menu-item :index="item.children[0].path">
          <i :class="item.meta.icon" class="zjy-icon"></i>
          <span slot="title">{{ item.children[0].name }}</span>
        </el-menu-item>
      </router-link>

    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  props: {
    routes: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    isCollapse () {
    },
    multi () {
      return this.routes.filter(
        item => !item.hidden && item.children.length > 1
      )
    },
    single () {
      return this.routes.filter(
        item => !item.hidden && item.children.length === 1
      )
    }
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    }
  }
}
</script>
<style lang='scss' scoped>
@import "src/styles/mixin.scss";

.sidebar-wrap {
  @include menu-width;
  z-index: 998;
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  .zjy-el-menu {
    background-color: #1e2a3c;
    position: relative;
    top: 1px;
    @include menu-width;
    height: 100%;
    &.el-menu--collapse {
      @include menu-width-collapse;
    }
  }
  .logo {
    background-color: #1e2a3c;
    width: 160px;
    height: 59px;
    box-shadow: 0 1px 0px 0px #26334b;
  }
  &.hideSide {
    @include menu-width-collapse;
  }
}
// 左侧条
.zjy-bar {
  height: 0;
  width: 4px;
  position: absolute;
  left: 0;
  top: 50%;
  bottom: 50%;
  display: inline-block;
  background-color: #37c6d4;
  transition: all 0.3s;
}
// 菜单图标
.zjy-icon {
  margin-right: 5px;
  position: relative;
  top: 1px;
  background: url("./zjy-icon-basic.png") no-repeat 0 0;
}

.zjy-icon-basic {
  background: url("./zjy-icon-basic.png") no-repeat 0 0;
}
.zjy-icon-rewards {
  background: url("./zjy-icon-rewards.png") no-repeat 0 0;
}
.zjy-icon-fund {
  background: url("./zjy-icon-fund.png") no-repeat 0 0;
}
.zjy-icon-statistical {
  background: url("./zjy-icon-statistical.png") no-repeat 0 0;
}

.zjy-icon-general {
  background: url("./zjy-icon-general.png") no-repeat 0 0;
}

// 激活时变色，打开时不变色
.el-submenu.is-active,
.el-menu-item.is-active {
  .zjy-icon-basic ,.zjy-icon {
    background: url("./zjy-icon-basic1.png") no-repeat 0 0;
  }
  .zjy-icon-fund {
    background: url("./zjy-icon-fund1.png") no-repeat 0 0;
  }
  .zjy-icon-statistical {
    background: url("./zjy-icon-statistical1.png") no-repeat 0 0;
  }
  .zjy-icon-general {
    background: url("./zjy-icon-general1.png") no-repeat 0 0;
  }
  .zjy-icon-rewards {
    background: url("./zjy-icon-rewards1.png") no-repeat 0 0;
  }
}
</style>
