/** 
 * @Desc: 预览页面
 */
<template>
  <div class="previewer-list">
    <!-- head -->
    <div class="previewer-head">
      <!-- <div class="previewer-logo">
        BBC幼儿课堂
      </div> -->
      <div class="previewer-logo">
        <!-- 糖果树幼儿课堂 -->
      </div>
      <div class="previewer-select">
        <select-bar :wd='width1' :lf='left1' :tp='top1' style="display:none;"></select-bar>
      </div>
      <!-- 按钮 -->
      <div class="previewer-btns vertical-center">
        <!-- 上一页 -->
        <Icon 
          type="ios-skipbackward" 
          size="35"
          title="上一页" 
          class="btn-color clickable"
          :class="{'disabledClass': upDisabled}" 
          @click.native="getUp">
        </Icon>
        <!-- 下一页 -->
        <Icon 
          type="ios-skipforward" 
          size="35"
          title="下一页"
          class="btn-color clickable" 
          :class="{'disabledClass': nextDisabled}" 
          @click.native="getNext">
        </Icon>
        <!-- 下载 -->
        <v-icon 
          size="25" 
          type="icon-download"
          title="下载"
          class="btn-color clickable" 
          @click.native="download"/>
        <!-- 打印  -->
        <Icon 
          type="printer" 
          size="35"
          title="打印"
          class="btn-color clickable" 
          @click.native="printClick">
        </Icon>
        <!-- 删除 -->
        <Icon 
          type="trash-a"
          size="35"
          title="删除"
          class="btn-color clickable" 
          :class="{'disabledClass': deleteDisabled }" 
          @click.native="deleteBtn">
        </Icon>
        <!-- 编辑 -->
        <Icon 
          type="edit"
          title="编辑"
          size="35"
          class="btn-color clickable"
          @click.native="getEditor"></Icon>
      </div>
    </div>
    <!-- content -->
    <div class="previewer-box">
      <div class="previewer-content">
        <div class="previewer-title">
          <h1 >{{fileContent.title}}</h1>
        </div>
        <div class="previewer-html">
          <!-- 预览title -->
          <div class="previewer-tag">
            <span>发布者：<span>{{fileContent.author}} &nbsp;</span></span>
            <span>分类：<span>{{fileContent.categoryName ? fileContent.categoryName : '未分类'}} &nbsp;</span></span>
            <span>发布时间：<span>{{ fileContent.createTime | unixTimestampToYearString }} &nbsp; {{ fileContent.createTime | unixTimestampToTimeString }}</span></span>
          </div>
          <!-- 预览主要内容  -->
          <div class="previewer-center" v-html="fileContent.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SelectBar from 'component/selectbar'
  import { getParams, sessionStorageUtil} from 'lib/util'
  import { requestGetTemplateInfo, requestGetFileInfo, _handleFile, _handleTemplate, _download} from 'api/document-module'
  
  export default {
    name: 'Previewer',
    components: {
     SelectBar
    },
    data: function() {
      return {
        width1:"300",
        left1:'0',
        top1:'30',
        fileContent:{
          title:'',
          author:'',
          createTime:'',
          categoryName:'',
          content:'',
          categoryid:'',
          source:''
        },
        currentId:'',
        upDisabled: false,
        nextDisabled: false,
        deleteDisabled: false,

        // 打印的内容
        printHtml: ''
      }
    },
    watch: {
      '$route': '_routerQueryChange',
    },
    mounted: function() {
      //获取预览页面的数据
      this._getInitData()
    },
    methods: {
      /** 
       * 路由改变
      */
      _routerQueryChange: function() {
        this._getInitData()
      },

      /** 
       * 获取路由和页面初始化的数据样式
      */
      _getInitData: function() {
        this.getPreviewerData()
        this.currentId = getParams(location.href).fileid || getParams(location.href).templateid
        this.fileContent.categoryid = getParams(location.href).categoryid
        this._setPageBtnStyle()
      },

      /* 
        获取预览页面数据接口
      */
      getPreviewerData:function(){
        var query = getParams(location.href)
        this.fileContent.source = query.source
        if(query.source === 'template'){
          //调用模板获取单个接口
          this.getTemplate(query.templateid)
        }else if(query.source === 'file'){
          //调用文档获取单个接口
          this.getFile(query.fileid)
        }
      },

      /* 
        获取文档接口
      */
      getFile:function(id){
        var self_this = this
        requestGetFileInfo({'fileid': id}, null, id).then((res)=>{
          if(res.code === 200 && !!res.data){
            self_this.fileContent.author = res.data.author
            self_this.fileContent.title = res.data.title
            self_this.fileContent.content = res.data.content
            self_this.fileContent.createTime = res.data.createdTime
            self_this.fileContent.categoryName = res.data.categoryTitle
          }
        })
      },

      /* 
        获取模板接口
      */
      getTemplate:function(id){
        var self_this = this
        requestGetTemplateInfo({'templateId': id}, null, id).then((res)=>{
          if(res.code === 200 && !!res.data){
            self_this.fileContent.author = res.data.author
            self_this.fileContent.title = res.data.title
            self_this.fileContent.content = res.data.content
            self_this.fileContent.createTime = res.data.createdTime
            self_this.fileContent.categoryName = res.data.categoryTitle
            }
          })
        },

      /* 
        下一页
      */
      getNext: function(){
        if (!this.nextDisabled) {
          this._changePageNum(true)
        }
      },

      /* 
        上一页
      */
      getUp: function(){
        if(!this.upDisabled) {
          this._changePageNum(false)
        }
      },

       /** 
       * 设置路由跳转的参数
      */
      _setRouterQueryData: function(id) {
        let source = this.$route.query.source
        let obj = {}
        if (source === 'template') {
          obj = {
            source: source,
            categoryid: this.$route.query.categoryid,
            templateid: id
          }
        } else {
          obj = {
            source: source,
            categoryid: this.$route.query.categoryid,
            fileid: id
          }
        }
        // 页面切换
        this.$router.push({path:'/previewer', query: obj})
      },

      /** 
       * 页码切换的统一方法
       * @params {Boolean} flag：s上下页切换的标识， true为下一页， false为上一页
      */
      _changePageNum: function(flag) {
        // 声明变量，获取当前的Id数组
        var fileIdArrList
        // 根据当前路径中的类型从不同的存储中获取想要的ID数组
        if(getParams(location.href).source === 'template'){
          fileIdArrList = sessionStorageUtil.get('current_template_Ids')
        }else{
          fileIdArrList = sessionStorageUtil.get('current_Ids')
        }
        // 进行切换的操作
        let currentId = this.currentId
        let currentIndex = fileIdArrList.indexOf(+this.currentId)
        let len = fileIdArrList.length
        // 下一页
        if (flag) {
          // 切换按钮样式的判断和改变
          let nextEle = fileIdArrList[currentIndex+1]
          // 存在下一个元素
          if (nextEle) {
            this._setRouterQueryData(nextEle)
          }
        }
        // 上一页
        else {
           // 切换按钮样式的判断和改变
          let nextEle = fileIdArrList[currentIndex-1]
          // 存在下一个元素
          if (nextEle) {
            this._setRouterQueryData(nextEle)
          }
        }
      },
     
      /* 
        删除
      */
      deleteBtn: function(){
        var self_this = this
        var type = 1 //分类
        if(!getParams(location.href).categoryid){
          type = 3 //回收箱
        }else if(getParams(location.href).categoryid === 'draft'){
          type = 2
        }
        var path = getParams(location.href).source === 'template' ? '/api/v2/file/template/delete' : '/api/v2/file/station/delete'
        var params = null
        getParams(location.href).source === 'template' ? params = {
          templateIds: getParams(location.href).templateid
        } : params = {
          fileIds : getParams(location.href).fileid,
          deleteType : type
        }
        // api请求
        _handleFile(path, params, 'delete').then(function(res){
          if(res.code === 200){
            self_this.$VMessage('success','删除成功')
            // 删除当前的Id数据
            let fileIdArrList
            if (getParams(location.href).source === 'template') {
              fileIdArrList = sessionStorageUtil.get('current_template_Ids')
              fileIdArrList.splice(fileIdArrList.indexOf(+self_this.currentId), 1)
              sessionStorageUtil.set('current_template_Ids', fileIdArrList)
            } else {
              fileIdArrList = sessionStorageUtil.get('current_Ids')
              fileIdArrList.splice(fileIdArrList.indexOf(+self_this.currentId), 1)
              sessionStorageUtil.set('current_Ids', fileIdArrList)
            }
            // 获取下一个数据的Id
            let i = fileIdArrList.indexOf(+self_this.currentId)+1
            let current = fileIdArrList[i]
            // 存在数据
            if(current) {
              self_this._setRouterQueryData(current)
            } 
          }
        }).catch(function(err){
          self_this.$VMessage('error','删除失败')
        })
      },

      /* 
        下载
      */
      download: function() {
        let params
        getParams(location.href).source === 'template' ? params = {
            fileIds: this.currentId,
            moduleType: 2
          } : params = {
            fileIds: this.currentId,
            moduleType: 1
          }
        // api
        _download(params)
      },

      /* 
        编辑        
      */
      getEditor: function(){
        if(this.fileContent.source === 'file'){
          this.$router.push({path:'/editor',query:{'source':this.fileContent.source,"fileid":getParams(location.href).fileid,'categoryid':this.fileContent.categoryid}})
        }else{
          this.$router.push({path:'/editor',query:{'source':this.fileContent.source,"templateid":getParams(location.href).templateid,'categoryid':this.fileContent.categoryid}})
        }
      },

      /** 
       * 打印
      */
      printClick: function() {
        this.printHtml = ''
        let source = this.$route.query.source
        source === 'file' ? this._filePrint() : this._templatePrint() 
        // 必须用定时才能成功的执行打印的处理
        setTimeout( () => {
          this._handlePrint()
        }, 300)
      },

      /** 
       * 文档打印的方法
      */
      _filePrint: function() {
        _handleFile(`/api/v2/file/station/${this.currentId}`).then(res => {
          if (res.code === 200) {
            this.printHtml = res.data.content
          }
        })
      },

      /** 
       * 模板打印
      */
      _templatePrint: function() {
        _handleTemplate(`/api/v2/file/template/${this.currentId}`).then(res => {
          if (res.code === 200) {
            this.printHtml = res.data.content
          }
        })
      },

      /** 
       * 打印的处理
      */
      _handlePrint: function() {
        let preHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><div>' 
        let printHtml = this.printHtml
        let nextHtml = '</div></body></html>'
        let allHtml = preHtml + printHtml + nextHtml
        // console.log('all:', allHtml)
        let printPage = window.open('', 'printPage')
        printPage.document.write(allHtml)
       
        printPage.print()
        printPage.close()   
      },

      /** 
       * 判断上下页按钮样式
      */
      _setPageBtnStyle: function(){
        let fileIdArrList
        if (getParams(location.href).source === 'template') {
          fileIdArrList = sessionStorageUtil.get('current_template_Ids')
        } else {
          fileIdArrList = sessionStorageUtil.get('current_Ids')
        }
        // 根据下标显示按钮样式
        let index = fileIdArrList.indexOf(+this.currentId)
        let len = fileIdArrList.length-1
        // 如果只有一个
        if (index === 0 && index === len) {
          this.nextDisabled = true
          this.upDisabled = true
          return
        }
        // 第一个
        if (index === 0 && index < len) {
          this.upDisabled = true
          this.nextDisabled = false
          return
        }
        // 最后一个
        if (index === len) {
          this.upDisabled = false
          this.nextDisabled = true
          return
        }

        // 在中间
        if (0 < index < len) {
          this.upDisabled = false
          this.nextDisabled = false
          return
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .previewer-list
    width 100%
    min-height 100%
    background-color #f7f2c8
  .previewer-head
    height 84px
    line-height 84px
    width 100%
    
    background url(../../component/header/img/header-top-bg.png) repeat-x center left
    background-size 16px 84px
    .previewer-logo
      position absolute
      top 0px
      left 40px
      width 200px
      height 84px
      font-size 30px
      font-weight bold
      color white
      background url(../../image/header-logo.png) no-repeat center center
      background-size 100% 
    .previewer-select 
      width 1000px
      margin 0px auto
    .previewer-btns
      position absolute
      right 20px
      top 25px
      .btn-color
        color #ffffcc
        margin 0 10px
        &:hover
          color white
      .disabledClass  
        color #666666 !important
        cursor not-allowed !important
  .previewer-box
    width 1200px
    margin 20px auto 0
    background-color #fff9eb
    border-radius 10px
    box-shadow 0px 0px 15px 0px rgba(0,0,0,0.2), inset 0px 0px 5px 0px rgba(0,0,0,0.15)
    padding 20px  
    .previewer-content
      border-radius 5px
      background-color #fff
      box-shadow 0px 0px 3px 0px rgba(0,0,0,0.2), inset 0px 1px 2.55px 0.45px rgba(169,159,136,0.65)
      .previewer-title
        margin 0 10px
        height 60px
        line-height 60px
        border-bottom 1px solid #ddd9c6
        text-align center
        h1
          font-size 20px
        
      .previewer-html
        min-height calc(100vh - 250px)
        padding 10px 20px
        overflow-x auto 
        .previewer-tag
          margin-bottom 10px
          span 
            font-size 14px
            color #999999    
</style>
