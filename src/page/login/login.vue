/** 
 * @Desc: 登录
 */
<template>
  <div class="login">
    <login-content-box>
      <!-- 注册 -->
      <div class="register-item">
        <router-link to="/register" class="login-item">注册</router-link>
      </div>

      <!-- 其他文本内容 -->
      <div class="login-content">
        <!-- logo -->
        <div class="logo-item">
          <!-- <img src="../../image/login-logo.png" alt=""> -->
          <img src="../../image/tgs-logo.png" alt="">
        </div>
        <!-- 文字提示 -->
        <div class="text-item error-item">
          <v-icon type="icon-login-error" :size="14" v-if="errorFlag"></v-icon>
          {{loginText}}
        </div>
        <!-- 手机号 -->
        <div class="form-item">
          <input 
            class="form-input" 
            type="text" 
            ref="Phone"
            maxlength="11" 
            placeholder="请输入手机号" 
            v-model="loginForm.userName"
            autocomplete="off">
        </div>
        <!-- 密码  -->
        <div class="form-item">
          <input type="password" style="display: none">
          <input 
            class="form-input" 
            type="password" 
            ref="Password" 
            maxlength="32"
            placeholder="请输入密码" 
            v-model="loginForm.password"
            autocomplete="off">
        </div>
        <!-- 记住密码 -->
        <div class="check-item clear-float" style="padding: 0 10px">
          <Checkbox v-model="rememberValue" style="color: #946526">记住密码</Checkbox>
          <router-link to="/forget-password" class="forget-item float-right">忘记密码</router-link>
        </div>
        <!-- 登录按钮 -->
        <button class="button-item" @click="_handleLogin">登录</button>
      </div>
    </login-content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import cookie from 'js-cookie'
  import { Base64 } from 'js-base64'
  import { 
    sessionStorageUtil, 
    localStorageUtil,  
    validataPhone, 
    validatePassword 
  } from 'lib/util'
  import LoginContentBox from 'component/login-content-box'
  import { requestGetToken,requestRefreshToken } from 'api/token'

  export default {
    name: 'Login',
    components: {
      LoginContentBox
    },
    data: function() {
      return {
        loginForm: {
          userName: '',
          password: ''
        },
        loginText: '', // 登录的校验文字
        errorFlag: false, 
        rememberValue: true,
        timeOut: null // 定时器
      }
    },
    // 当前路由离开的时候要清除定时器
    beforeRouteLeave: function(to, from, next) {
      clearTimeout(this.timeOut)
      next()
    },
    mounted: function() {
      this._getDataFromStorage()
    },
    methods: {
      /** 
       * 从存储中获取数据并且赋值
       */
      _getDataFromStorage: function() {
        this.loginForm.userName = localStorageUtil.get('kinder-userName') ? localStorageUtil.get('kinder-userName') : this.loginForm.userName 
        this.loginForm.password = localStorageUtil.get('kinder-password') ? localStorageUtil.get('kinder-password') : this.loginForm.password
      },

      /** 
       * 5秒后自动清除登录的提示文字  
       */
      _clearLoginText: function() {
        this.timeOut = setTimeout( ()=> {
          this.loginText = ''
          this.errorFlag = false
        }, 5000)
      },

      /** 
       * 记住密码 
       */
      _rememberUserInfo: function() {
        localStorageUtil.set('kinder-userName', this.loginForm.userName)
        localStorageUtil.set('kinder-password', this.loginForm.password)
      },

      /** 
       * 不记住密码,清除之前的数据 
       */
      _removeUserInfo: function() {
        localStorageUtil.remove('kinder-userName')
        localStorageUtil.remove('kinder-password')
      },

      /**
       * 登录 
       */
      _handleLogin: function() {
        // 校验变量
        let validatePhoneValue = validataPhone(this.loginForm.userName)
        let validatePasswordValue = validatePassword(this.loginForm.password)
        // 每次点击前先清除定时器
        clearInterval(this.timeOut)
        // 手机校验
        if (validatePhoneValue) {
          this.loginText = ''
          this.errorFlag = false
        } else {
          this.loginText =  '请输入手机号码'
          this.errorFlag = true
          this.$refs.Phone.focus()
          this._clearLoginText()
        }

        // 手机校验通过之后，密码格式校验错误
        if(validatePhoneValue && !validatePasswordValue) {
          this.loginText = '请输入6~32位的密码'
          this.errorFlag = true
          this.$refs.Password.focus()
          this._clearLoginText()
        }

        // 手机和密码格式都校验通过
        if(validatePasswordValue && validatePhoneValue ) {
          const param = {
            userName: this.loginForm.userName,
            password: Base64.encode(this.loginForm.password)
          }
          // 调用获取token的方法
          this._getToken(param)
            .then(() => {
              // 根据是否记住密码来进行操作
              this.rememberValue ? this._rememberUserInfo() : this._removeUserInfo()
              if (param.userName === '18687570807') {
                this.$router.push('/home')
              } else {
                this.$router.push('/student-manage')
              }
            })
        } 
      },

      /** 
       * 获取token
       * @param {object} param: 用户信息
      */
      _getToken: function(param) {
        return requestGetToken(param)
          .then( response => {
            // 存储临时的手机号
            var anyDays = (response.expires_in - 60)/60/60/24
            sessionStorageUtil.set('temp_phone', param.userName)
            cookie.set('ktoken', response.access_token, { expires: anyDays})
            //定期刷新cookie
            let cycleTime = (response.expires_in-1800)*1000
            let checkTokenExpire = setInterval(function(){
              let refresh_tttoken = response.refresh_token
              requestRefreshToken( refresh_tttoken )
                .then( res => {
                  //设置token的失效日期
                  anyDays = (res.expires_in - 60)/60/60/24
                  cookie.set('ktoken', res.access_token, { expires: anyDays})
                })
                .catch( err => {
                  console.log(err)
                })
            },cycleTime)
            // 设置登录信息
            return Promise.resolve(response.refresh_token)
          })
          .catch( error => {
            let status = error.status
            switch(status) {
              case 400:
                this.errorFlag = true
                this.loginText = error.data.error_description
                break
              case 401:
                this.errorFlag = true
                this.loginText = '用户名或者密码错误'
                break
              default:
                this.errorFlag = true
                this.loginText = '用户名或者密码错误'
                break
            }
            // 定时清除文字提示
            this._clearLoginText()
            return Promise.reject(error)
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .login
    height 100%
    // background url(../../image/login-bom.png) no-repeat 0 bottom, url(../../image/login-top.png) no-repeat 0 top
    background url(../../image/login-bg.png) no-repeat center
    background-size cover
    /* 注册 */
    .register-item
      position relative
      height 16px
      line-height 16px
      .login-item
        position absolute
        right 0px
        top 0
        color #99601c
        font-size 16px
    /* 其他文本内容 */  
    .login-content
      width 400px
      margin 0 auto
      /* logo */
      .logo-item
        height 140px
        line-height 140px
        text-align center
        margin-top -10px
        margin-bottom 7px
      /* 文字信息提示 */
      .text-item
        height 14px
        line-height 14px
        padding-left 10px
        margin-bottom 15px
        text-align left
        font-size 14px
      .error-item
        color red
          
      /* 表单item */
      .form-item
        height 50px
        margin-bottom 15px
        .form-input
          width 100%
          height 100%
          padding-left 30px
          color #99601c
          font-size 18px
          border-radius 10px
          border 1px solid #E0CFBA
          // background-color #fff!important
          // box-shadow 0 2px 1px 0 rgba(255,255,255,.004), inset 0 2px 1px 0 rgba(79,72,42,.23), inset 0 0 2px 0 rgba(79,72,42,.23)

      /* 记住密码 */  
      .check-item
        height 17px
        line-height 17px
        margin-bottom 15px
        text-align left  
        .forget-item
          font-size 14px
          margin-right 5px

      /* 下一步按钮 */    
      .button-item
        width 260px
        height 50px
        line-height 50px
        border-radius 10px
        font-size 24px
        // background-image linear-gradient(to bottom, #55c888, #088844)  
        background #75C73B
        box-shadow 0 2px 4px 0 rgba(0,0,0,0.20), inset 0 -1px 2px 0 rgba(95,95,95,0.40), inset 0 1px 2px 0 rgba(255,255,255,0.50)
        // border-radius: 10px; 
        color white  
</style>
