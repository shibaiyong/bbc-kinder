/** 
 * @Desc: 编辑页面
 */
<template>
  <div class="editor-page">
    <!-- head 头部 -->
    <div class="editor-head">
      <!-- logo -->
      <span class="editor-logo">BBC幼儿课堂</span>
      <!-- <span class="editor-logo">糖果树幼儿课堂</span> -->
      <div class="editor-head-right">
        <div class="editor-classify">
          <select-bar :wd="widthVal" :tp="topVal" :lf="leftVal" class="editor-select" v-on:curCategoryEvent = "getCurrent"></select-bar>
        </div>
        <!-- 保存到草稿箱 只有新建的时候-->
        <img 
          v-if="isCreateFlag"
          class="editor-drafbox clickable" 
          src="../../image/draft.png" 
          title="草稿箱"
          @click.stop="_save(true)">
        <!-- 保存 -->
        <img 
          src="../../image/save.png"
          class="editor-drafbox clickable"
          style="margin-left: 5px" 
          title="保存"
          @click.stop="_save()">
      </div>
    </div>

    <!-- S 开始 -->
    <div class="editor-box">
      <div class="editor-content">
        <input 
          type="text" 
          class="editor-title" 
          :maxlength="50"
          placeholder="请输入标题" 
          v-model="titleValue"
          @blur="_blurEvent">
        <p class="editor-error">{{errorText}}</p>
       
        <!-- 富文本框 -->
        <script :id=id type="text/plain" ref="UeElement"></script>
      </div>
    </div>
    <!-- E 结束 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { baseURL } from 'config/config'
  import {getParams, sessionStorageUtil, localStorageUtil} from 'lib/util'
  import SelectBar from 'component/selectbar'
  import {requestGetFileInfo , requestGetTemplateInfo} from 'api/document-module'

  export default {
    name: 'Editor',
    components: {
     SelectBar
    },
    data: function() {
      const validateTitleName = (rule, value, callback) => {
        let pattern = new RegExp('[?*/\<>:"|]')
        if( value.match(pattern)){
          callback(new Error('请不要填写?*/\<>:"|等字符的名称'))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: baseURL + '/api/v2/ueditor/upload',
        id:'editor-content',
        model1:'请选择',
        widthVal:'200',
        topVal:'10',
        leftVal:'10',
        currentCategory: '',
        isCreateFlag: false,
        editor: null,
        titleValue: '',
        errorText: ''
      }
    },
    mounted: function() {
      UE.delEditor(this.id)
      this.editor = UE.getEditor(this.id, {
        autoHeightEnabled: true,
        allowDivTransToP: false, 
        serverUrl: this.uploadUrl,
        toolbars:[['fullscreen','undo', 'redo', '|',
          'fontsize', 'fontfamily', 'bold', 'italic', 'underline', '|', 
          'forecolor', 'insertimage', 'print', 'preview', 'template', '|', 
          'insertorderedlist', 'insertunorderedlist', 'inserttable', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify']],
        enableAutoSave: false
      })

      this.$nextTick(function(){
        this._isCreateOrEditor()
        this._setUeditorStyle()
      })
    },
    beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
      localStorageUtil.get('fileChange') && localStorageUtil.remove('fileChange')
      next()
    },
    methods: {
      /** 
       * 设置Ueditor样式
      */
      _setUeditorStyle: function() {
        let ele = document.querySelector('#editor-content')
        let barEle = document.querySelector('.edui-editor-toolbarbox')
        barEle.style.position = "relative"
        ele.style.width = '100%'
        ele.style.height = '100%'
      },

      /* 
        是否是新建还是编辑
      */
      _isCreateOrEditor(){
        var param = getParams(location.href)
        if(param.source === 'file'){
            document.title = '文档'
            param['fileid'] && param['fileid'].length>0 ? 
            (function(that){
              that.isCreateFlag = false 
              that._getFile()
            })(this) : (this.isCreateFlag = true)         
         } else if(param.source === 'template'){
            document.title = '模版'
            param['templateid'] && param['templateid'].length > 0 ? 
            (function(that){
              that.isCreateFlag = false 
              that._getTemplate()
            })(this) : (this.isCreateFlag = false)
         }
         //无论是文档 模板 新建 编辑都是需要放入本地存储里 记录分类id
         sessionStorageUtil.set('templateCateId', param['categoryid'] ? +param['categoryid'] : '')
      },

      /* 
        展示文档编辑的数据
      */
      _getFile(){
        // 关键点
        var that = this
        var paramObj = getParams(location.href)
        var params = {
          'fileId': paramObj.fileid
        }
        requestGetFileInfo(null,'get', Number(params['fileId']), params).then((res)=>{
          if(res.code === 200 && res.data){
            that.titleValue = res.data.title
            that.editor.ready(function() {
              if (paramObj.categoryid === 'draft') {
                that.templateBtnVisible("none")
              }
              if (res.data.content) {
                that.editor.setContent(res.data.content)
              }
            })
          }
        })
      },

      /** 
       * 模版图标是否显示
      */
     templateBtnVisible: function(styleValue) {
       let ele = document.getElementById("edui136_state")
        if (ele) {
          ele.style.display = styleValue
        }
      },

      /** 
       * 展示模板
      */
      _getTemplate(){
        var that = this
        var paramObj = getParams(location.href)
        var params={
          'templateId': paramObj.templateid
        }
        requestGetTemplateInfo(params, 'get' , Number(params['templateId'])).then((res)=>{
          if(res.code === 200 && res.data){
            that.titleValue = res.data.title
            if (res.data.content) {
              that.editor.ready(function() {
                if (res.data.content) {
                  that.editor.setContent(res.data.content)
                }
              })
            }
          }
        })
      },

      /** 
       * 保存
      */
      _save(isDraft){
        var param = getParams(location.href)
        if(param.source === 'file'){
          this._saveFile(isDraft) //保存文档
        }else if(param.source === 'template'){
          this._saveTemplate(isDraft) //保存模板
        }
      },

      /* 
        新建编辑、草稿箱
        categoryid（分类id） fileid（文本id）
        isDraft true为保存到草稿箱
      */
      _saveFile(isDraft){
        let that = this
        let query = getParams(location.href)
        let method = 'post'
        let url = null
        if (that._checkTitle(that.titleValue)) {
          let params = {
            categoryId: that.currentCategory || query.categoryid || '',
            title: that.titleValue,
            saveDraft: isDraft || false,
            content: that.editor.getContent() || ''
          }

          //草稿箱 未分类,全部置空
          if (params.categoryId === 'draft' || params.categoryId === '2' || params.categoryId === '1'){
            params.categoryId = ''
          }
          //文档的编辑
          if (query.fileid && query.fileid.length>0) {
            Object.assign(params,{
              fileId: query.fileid 
            })
            url = query.fileid
          }
          // api
          localStorageUtil.get('fileChange') && localStorageUtil.remove('fileChange')
          requestGetFileInfo( params, method, url).then((res)=>{
            if(res.code === 200 ){
              let fileid = res.data.fileId
              let categoryid = res.data.categoryId
              // 跳转
              that.$router.push({path:'/previewer', query:{"source": "file", "fileid": fileid, 'categoryid': categoryid}})
              // 存储数据解决刷新问题
              localStorageUtil.set('fileChange', true)
              //保存成功之后
              that.$VMessage('success','保存成功')
            }
            if (res.code === 205) {
              that.$VMessage('success', res.msg)
            }
          })
        }
      },

      /* 
        新建 编辑模板 、草稿箱
        categoryid（分类id） templateid（模板id）
        isDraft true为保存到草稿箱
      */
      _saveTemplate(isDraft){
        let that = this
        let query = getParams(location.href)
        let method = 'post'
        let url = null
        if(that._checkTitle(that.titleValue)){
          let params = {
            categoryId: that.currentCategory || query.categoryid || '',
            title: that.titleValue,
            saveDraft: isDraft || false,
            content: that.editor.getContent() || ''
          }
          if (params.categoryId === '2' || params.categoryId === '1') {
            params.categoryId = ''
          }
          if(query.templateid && query.templateid.length>0) {
            Object.assign(params,{
              templateId: query.templateid
            })
            url = query.templateid
          }
          // api请求
          localStorageUtil.get('fileChange') && localStorageUtil.remove('fileChange')
          requestGetTemplateInfo(params,method, url).then((res)=>{
            if(res.code === 200) {
              let templateid = res.data.templateId
              let categoryid = res.data.categoryId
              // 跳转预览
              that.$router.push({path:'/previewer', query:{"source": "template", "templateid": templateid, 'categoryid': categoryid}})
              // 存储
              localStorageUtil.set('fileChange', true)
              //保存成功之后
              that.$VMessage('success','保存成功')
            }
            if (res.code === 205) {
              that.$VMessage('success', res.msg)
            }
          }).catch((err)=>{
            that.$VMessage('error','保存失败')
          })
        } 
      },

      /** 
       * 获取当前的Id
      */
      getCurrent(id){
        this.currentCategory = id
        //display none block
        this.templateBtnVisible("block")
      },

      /** 
       * 失去焦点事件
      */
      _blurEvent: function() {
        this._checkTitle(this.titleValue)
      },

      /** 
       * 校验title格式
      */
      _checkTitle: function(str) {
        let flag 
        let pattern = new RegExp('[?？*/\<>:"|]')
        let lenPattern = /^.{1,50}$/
        // 是不是空值
        if (this.titleValue === '' || null == this.titleValue) {
          this.errorText = '标题内容不能为空'
          return flag = false
        } 
        else if (!str.match(lenPattern)) {
          this.errorText = '长度在50个字符之内'
          return flag = false
        }
        else if(str.match(pattern)) {
          this.errorText = '请不要填写？?*/\<>:"|等字符的名称'
          return flag = false
        } 
        else {
          this.errorText = ''
          return flag = true
        } 
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */

  .editor-page
    width 100%
    background url(../../image/bg.png) no-repeat 
  .editor-head
    height 84px
    line-height 84px
    width 100%
    background-image url('./img/header-bg.png') 
    .editor-logo
     margin-left 40px
     height 100%
     font-size 30px
     font-weight bold
     color white
    .editor-head-right
      height 84px
      line-height 84px
      float right
      margin-right 40px
      .editor-drafbox
        vertical-align middle
        margin-top -5px
      .editor-classify
       height 50px
       line-height 50px
       margin-right 20px
       display inline-block
       .editor-name
        display inline-block
       .editor-select
        display inline-block

  .editor-box
    width 1200px
    background #fff9eb
    margin 20px auto 0
    box-shadow 0px 0px 15px 0px rgba(0,0,0,0.2), inset 0px 0px 5px 0px rgba(0,0,0,0.15)
    border-radius 10px
    padding 20px
    box-sizing content-box      
    .editor-content
      width 100%
      display -webkit-flex
      display flex
      -webkit-flex-direction column
      flex-direction column
      -webkit-align-items center
      align-items center
      .editor-title
        box-sizing border-box
        margin 0 20px 
        width 100%
        height 44px
        line-height 44px
        padding-left 20px
        border-radius 15px
        background #f8e8cf
        color #e4b67f
        border 1px solid #d18530
      .editor-error
        box-sizing border-box
        width 100%
        height 30px
        line-height 30px
        text-align left
        padding-left 10px
        font-size 12px
        color red       
</style>
