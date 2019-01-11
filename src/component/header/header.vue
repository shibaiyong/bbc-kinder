/** 
 * @Desc: 公共头部
 */
<template>
  <div class="header clear-float">
    <!-- <div class="header-logo float-left">
      BBC幼儿课堂
    </div> -->
    <div class="header-logo float-left">
      <!-- 糖果树幼儿课堂 -->
    </div>

    <!-- 路由导航 -->
    <ul class="header-nav float-left clear-float">
      <router-link
        class="nav-item clickable float-left"
        tag="li"
        :key="index" 
        :to="navItem.to"
        v-for="(navItem, index) in navList">
        {{ navItem.title }}
      </router-link>
    </ul>

    <!-- 用户信息 -->
    <div class="header-user">
      <!-- 用户名称显示 -->
      <span v-if="!contentFlag" style="margin-right:10px;">{{ $store.state.orgName }}</span>
      <span v-if="!contentFlag" class="user-text" style="margin-right:10px;">{{ $store.state.userName }}</span>
      <span v-if="contentFlag" class="user-text" style="margin-right:10px;">教育局长</span>
      <Dropdown>
        <v-avatar 
          class="clickable"
          size="50"
          src="/static/res/img/user-avatar.png"/>
        <DropdownMenu slot="list">
            <DropdownItem v-if="!contentFlag" @click.native="editUserDialogVisible = true">修改个人信息</DropdownItem>
            <DropdownItem @click.native="$router.push('/login')">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!-- 版本信息 -->
    <div v-if="showFlag" class="header-version float-right">
      <p>前端版本信息：{{versionMsg}}</p>
      <p>后端版本信息：{{reVersion}}</p>  
    </div>

    <!-- 修改个人信息表单 -->
    <Modal 
      title="修改个人信息"
      v-model="editUserDialogVisible"
      @on-ok="_handleEditUser"
      @on-cancel="$refs['editUserForm'].resetFields()">
      <Form 
        :model="editUserForm"
        :rules="editUserFormRule"
        :labelWidth="60"
        ref="editUserForm"
        style="padding:0 80px;">
        <FormItem label="姓名" prop="name">
          <Input v-model="editUserForm.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input :disabled="true" v-model="editUserForm.phone"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil } from  'lib/util'
  import { FeVersion, versionMessage } from 'config/config'
  // 组件
  import VAvatar from 'base/avatar'
  // 请求
  import { requestPatchUserInfo } from 'api/user'
  import { requestGetVersionData } from 'api/version'

  export default {
    name: 'VHeader',
    components: {
      VAvatar
    },
    data: function() {
      return {
        // 导航
        navList: [],
        userInfo: {
          orgName: '',
          nickName: '',
          phone: ''
        },
        // 修改用户对话框
        editUserDialogVisible: false,
        editUserForm: {
          phone: this.$store.state.userPhone,
          name: this.$store.state.userName,
        },
        editUserFormRule: {
          name: [
            {
              required: true,
              message: '请输入姓名'
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 至 10 个字之间'
            }
          ]
        },

        // 下拉内容显示
        visibleFlag: false,
        orgModel: '',
        orgList: this.$store.state.orgList,

        // 版本信息
        showFlag: false,
        versionMsg: versionMessage,
        reVersion: '',

        // 
        contentFlag: false
      }
    },
    mounted: function() {
      this._setCss()
      this._checkHost()
      this._checkAccout()
    },
    methods: {
      /** 
       * JS调整UI框架组件的样式
      */
      _setCss: function() {
        this.$nextTick( () => {
          let ele = document.querySelector('.ivu-select-dropdown')
          if(ele) ele.style.right = '10px'
        })
      },

      /** 
       * 判断版本信息的显示网址
      */
      _checkHost: function (params) {
        this.showFlag = location.host.indexOf('net') !== -1  
        if (this.showFlag) {
          this._getRevisionData()
        }
      },

      /** 
       * 获取后端版本信息
      */
      _getRevisionData: function() {
        requestGetVersionData().then( response => {
          this.reVersion = response.version
        })
      },

      /** 
       * 根据登录的帐号显示头部的数据
      */
      _checkAccout: function() {
        let userName = sessionStorageUtil.get('temp_phone')
        let list = []
        this.navList = []
        // 根据帐号来设置路由的title数据
        // 如果是预定的帐号
        if (userName === '18687570807') {
          this.contentFlag = true
          list = [
            {
              to: '/home',
              title: '首页'
            },
            {
              to: '/gardens-info',
              title: '园所信息'
            },
            {
              to: '/kinder-info',
              title: '园长信息'
            }
          ]
        }
        // 普通的帐号 
        else {
          this.contentFlag = false
          list = [
            {
              to: '/student-manage',
              title: '学生管理'
            },
            {
              to: '/teaching-manage',
              title: '教学管理'
            },
            {
              to: '/staff-management',
              title: '职工管理'
            },
            {
              to: '/office-manage',
              title: '办公管理'
            },
            {
              to: '/finance-manage',
              title: '财务管理'
            },
            {
              to: '/control-center',
              title: '控制中心'
            }
          ]
        }
        this.navList = list
      },

      /**
       * 请求修改用户信息
       */
      _handleEditUser: function() {
        // 表单校验
        this.$refs['editUserForm'].validate((valid) => {
          if (valid) {
            // 提交修改
            requestPatchUserInfo(this.editUserForm)
              .then(res => {
                if (res.code === 200) {
                  // 重新获取数据
                  this.$VMessage('success', '个人信息修改成功')
                  this.$store.dispatch('getUserInfo')
                  this.editUserDialogVisible = false
                }
                else {
                  this.$VMessage('error', '个人信息修改失败')
                }
              })
            } 
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'

  .header
    width 100%
    height 84px
    line-height 84px
    padding 0 20px 
    color #fff
    font-size 16px
    font-weight bold
    background url(./img/header-top-bg.png) repeat-x center left
    background-size 16px 84px

    /* logo */
    .header-logo
      width 200px
      height 100%
      font-size 30px
      margin-right 20px
      background url(../../image/header-logo.png) no-repeat center center
      background-size 100% 
    /* nav */
    .header-nav
      margin-top 22px
      margin-left 40px
      .nav-item
        width 100px
        height 42px
        line-height 42px
        border-radius 10px
        margin-right 15px
        color #d3ecdf
        text-align center
        transition .3s
        &:hover
          background rgba(255,255,255,0.20)
          border-radius 10px
      .router-active
        background rgba(255,255,255,0.20)
        border-radius 10px
    /* 版本信息 */    
    .header-version
      position fixed
      bottom 0
      left 10px
      font-size 12px
      z-index 999
      p
        float left
        height 40px
        line-height 40px
        margin-right 30px
        color black
        // text-shadow 2px 2px 2px black
    /* 用户 */       
    .header-user
      float right
      margin-top 16px
      margin-right 10px
      height 50px
      line-height 50px
      .box-clicked
        .change-icon
          transform rotate(180deg)
      .header-select
        position relative
        width 150px
        height 34px 
        line-height 34px
        margin-right 5px
        .header-select-placeholder
          position absolute
          width 150px
        .header-select-text
          padding 0 34px 0 20px
          line-height 34px
          border 1px solid #ffa744
          box-shadow 0 1px 3px 0 rgba(148,140,98,.72), inset 0 2px 2px 0 rgba(0,0,0,.25), inset 0 -2px 0 0 rgba(255,255,255,.28)
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .header-select-ul
          position absolute
          top 34px
          left 0
          width 100%
          .header-select-li
            line-height 30px
            height 30px
            text-align center
            &:hover
              color #99601c
          .active-select
            color #99601c     
      .user-text
        color white
</style>
