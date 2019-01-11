/** 
 * @Desc: 全园文档
 */
<template>
  <content-box :whiteInner="false">
    <!-- 主要内容 -->
    <div class="garden-manage">
      <!-- 文档显示区域 -->
      <iframe class="document-show-box" ref="iframeBox" :srcdoc="printHtml"></iframe>
      
      <!-- 左侧控制区域 -->
      <Col span="4" class="fill-height" style="padding-right:15px">
        <div class="left-control fill">
          <!-- title -->
          <div class="text-center clickable control-title">分类</div>

          <!-- 数据动态组件 -->
          <ul class="control-data">
            <li 
              class="type-li clickable"
              :class="{'active-li': activeId === Number(index)}" 
              v-for="(typeItem, index) in typeDatas"
              :key="index"
              @click.stop="_typeItemClick(typeItem, index)">
              <span class="type-circle"></span>
              <span class="type-text no-wrap">{{typeItem.title}}</span>
              <span class="type-num">({{typeItem.templateCount}})</span>
            </li>
          </ul>
        </div>
      </Col>

      <!-- 右侧列表 -->
      <Col span="20" class="fill-height">
        <v-loading v-show="loadingVisible"></v-loading>

        <div class="right-list fill">
          <!-- 按钮区域 -->
          <section class="buttons-section clear-float">
            <Button 
              v-show="createBtnVisible"
              size="small"
              style="margin-right:5px;padding: 0 10px"
              @click.native="_createBtnClick">
              <v-icon size="14" type="icon-create-folder" style="margin-right:4px;"/>新建模版
            </Button>
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.download"
              @click="_handleLoadFile"
              style="margin-right:5px;padding: 0 10px">
              <v-icon size="14" type="icon-download" style="margin-right:4px;"/>下载
            </Button>  
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.print"
              @click="_handlePrintFile"
              style="margin-right:5px;padding: 0 10px">
              <Icon type="printer" style="margin-right:4px;"></Icon>打印
            </Button>
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.copy"
              style="margin-right:5px;padding: 0 10px"
              @click.native="_moveOrCopyFileClick(false)">
              <v-icon size="14" type="icon-copy" style="margin-right:4px;"/>复制到
            </Button>
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.move"
              style="margin-right:5px;padding: 0 10px"
              @click.native="_moveOrCopyFileClick(true)">
              <v-icon size="14" type="icon-move" style="margin-right:4px;"/>移动到
            </Button>
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.delete"
              style="margin-right:5px;padding: 0 10px"
              @click.native="deleteDialogVisible = true">
              <v-icon size="14" type="icon-remove" style="margin-right:4px;"/>删除
            </Button>
           
            <!-- 搜索框 -->
            <searchbar
              class="float-right" 
              ref="searchbar"
              :width="160"
              @search="_search" 
              placeholder="文档名称/发布者名称">
            </searchbar>
          </section>

          <!-- 列表区域 -->
          <file-list
            :tableTitle="`模版名称`"
            :categoryId="current_categoryId"
            :noItemVisible="false" 
            :fileList="fileList"
            :checkAll.sync="checkAll"
            :belongDocument="showOtherItemFlag"
            :belongClass="belongClass"
            :countFlag="showCountFlag"
            :countNum="countNum"
            @fileSelectChange="_fileSelectChange"
            @singleFileSelectChange="_singleFileSelectChange"
            @checkAllChange="_checkAllChange"
            @downloadEmit="_handleLoadFile"
            @deleteEmit="deleteDialogVisible = true"
            @copyEmit="_moveOrCopyFileClick(false)"
            @moveEmit="_moveOrCopyFileClick(true)"
            @printEmit="_handlePrintFile">
          </file-list>

          <!-- S 删除模版对话框 -->
          <Modal
            title="删除模版"
            v-model="deleteDialogVisible"
            @on-ok="_handleDeleteFile">
            <v-icon 
              type="icon-prompt-error" 
              size="24" 
              color="#FC0000" 
              class="float-left" 
              style="margin-right:10px;">
            </v-icon>
            <p>确实要删除模版吗？删除后不可恢复。</p>
          </Modal>

          <!-- 移动，复制 -->
          <Modal
            :title="isMove ? '移动到' : '复制到'" 
            v-model="moveOrCopyDialogVisible"
            @on-ok="_handleMoveOrCopyFile">
            <div class="move-file-content clear-float">
              <span class="float-left">文档分类</span>
              <Select class="float-left move-select" v-model="typeModel" placeholder="请选择分类" @on-change="_typeChange" :label-in-value="true">
                <Option v-for="item in typesList" :value="item.id" :label="item.title" :key="item.id">{{ item.title }}</Option>
              </Select>
            </div>
          </Modal>
        </div>
      </Col>  
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  // 组件
  import Searchbar from 'component/searchbar'
  import FileList from 'component/file-list'
  // 工具
  import { sessionStorageUtil } from 'lib/util'
  // 接口
  import { requestGetTypeList , requestGetTemplateList, _handleTemplate, _download } from 'api/document-module'

  export default {
    name: 'garden-document',
    components: {
      Searchbar,
      FileList
    },
    data: function() {
      return {
        loadingVisible: false,
        // 分类数据
        typeDatas: [],
        activeId: 0, //当前选中的分类Id

        // 按钮显示的标识
        createBtnVisible: true,
        buttonVisible: {
          upload: false,
          download: false,
          delete: false,
          copy: false,
          move: false,
          print: false
        },
        isMove: true,
        // 删除
        deleteDialogVisible: false,
        // 移动或者复制
        moveOrCopyDialogVisible: false,
        uploadTaskDialogVisible: false,
        uploading: true,
        uploadlist: [], // 上传的列表
        // 分类类别的值
        typeModel: '',
        typeId: null,
        typeTitle: '',
        typesList: [],

        // 左侧条件的类别
        current_title: '', //左侧类别的名称
        current_obj: {}, //左侧选中的数据对象
        current_categoryId: 0,

        // 文件相关
        // 显示表格头部其他文字的标识
        showOtherItemFlag: true,
        // 显示选中文件个数的标识
        showCountFlag: false,
        countNum: 0,
        belongClass: '',
        checkAll: false,
        fileList: [],
        // 选中文件列表
        selectFileList: [],

        printHtml: ''
      }
    },
    watch: {
      /**
       * 监视选中文件列表数据
       * @param  {array} newValue：新值
       */
      selectFileList: function(newValue) {
        // 全选和非全选
        if (this.fileList.length !== 0) {
          this.checkAll = newValue.length === this.fileList.length ? true : false
        }
        // 根据选择的文件的个数，在表格中显示选中文件的个数和按钮的显示
        if (newValue.length !== 0) {
          this.showOtherItemFlag = false
          this.showCountFlag = true
          this.countNum = newValue.length
          // 判断当前点击项
          this._resetBtnVisible()
          this.buttonVisible.upload = true
          this.buttonVisible.download = true
          this.buttonVisible.print = true
          this.buttonVisible.delete = true
          this.buttonVisible.copy = true
          this.buttonVisible.move = true
          // 如果只有一个被选中,打印按钮消失
          if (newValue.length !== 1) {
            this.buttonVisible.print = false
          }
        }
        // 没有选中文件 
        else {
          this.showOtherItemFlag = true
          this.showCountFlag = false
          this.countNum = 0
          // 根据选中的文件类型显示不同的按钮组
          this._resetBtnVisible()
        }
      } 
    },
    mounted: function() {
      this._requestGetTypeData()
    },
    methods: {
      /** 
       * 清空数据，重置按钮显示和恢复全不选
      */
      _clearData: function() {
        this.fileList = []
        this.selectFileList = []
        this._resetBtnVisible()
        this.checkAll = false
      },

      /** 
       * 重置Button显示
      */
      _resetBtnVisible: function() {
        this.buttonVisible = {
          upload: true,
          download: false,
          print: false,
          delete: false,
          copy: false,
          move: false 
        }
      },

      /** 
       * 获取分类数据列表（时间和分类都一起获取）
      */
      _requestGetTypeData: function() {
        this.typeDatas = []
        // 请求接口数据
        requestGetTypeList({'type': 1}).then(response => {
          if (response.code === 200 ) {
            let types = response.data.categoryList
            // 修改全部模版
            types[0]['title'] = '全部模版'
            // 赋值
            this.typeDatas = types
            let selsecList = response.data.categoryList.filter(item => {
              return item.categoryId !== 2 && item.categoryId !== 1
            })
            let selectArr = [].concat(selsecList)
            // 设置分类的下拉数据
            selectArr.map(item => {
              if (item.fileStatus) {
                item.id = item.fileStatus + '+' + item.title
              }
              if (item.categoryId) {
                item.id = item.categoryId + '+' + item.title
              }
              return item
            })
            this.typesList = selectArr
            // 模拟点击数组的某一项
            this._typeItemClick(this.typeDatas[Number(this.activeId)], Number(this.activeId))
          }
        })
      },

      /** 
       * 分类项点击
      */
      _typeItemClick: function(item, i) {
        // console.log('iem:', item)
        // 设置列表显示的图标
        this.belongClass = 'template'
        this.activeId = Number(i)
        // 设置当前点击项的数据，用来之后的数据操作
        this.current_categoryId = item.categoryId
        this.current_title = item.title
        // console.log('categoryId:', this.current_categoryId)
        // 清空数据
        this._clearData()
        // 设置请求的参数
        let obj = {}
        // 传递的是文档类型
        if(item.categoryId) {
          obj.categoryId = Number(item.categoryId)
        }
        // 获取文档数据
        this._requestGetTemplateDatas(obj)
      },

      /** 
       * 获取所有的模版列表
      */
      _requestGetTemplateDatas: function(obj) {
        this.loadingVisible = true
        return requestGetTemplateList(obj).then(response => {
          if (response.code === 200) {
            // console.log('所有的模版数据:', response.data)
            if (response.data.length) {
              // 设置当前的文档的ID数组
              let idArr = []
              idArr = response.data.map(item => {
                return item.templateId
              })
              // 存储当前获取的ID数组对象
              sessionStorageUtil.set('current_template_Ids', idArr)

              // 设置是否被选中的属性
              this.fileList = response.data.map(item => {
                item.checked = false
                return item
              })
            }
            else {
              this.fileList = []
            } 
          }
          // 关闭loading
          setTimeout(() => {
            this.loadingVisible = false
          }, 500)
        })
      },

      /** 
       * 接收搜索的值
      */
      _search: function(keyword) {
        let pattern = new RegExp('[?*/\<>:"|]')
        if (null === keyword || keyword === '' || pattern.test(keyword)) {
          return this.$VMessage('error', '请填写正确的查询内容')
        } else {
          // 设置请求的参数对象
          let obj = {}
          obj.queryCriteria = keyword + ''
          // 获取文档数据
          this._requestGetTemplateDatas(obj)
        }
      },

      /**
       * 全选状态改变
       */
      _checkAllChange: function(newValue) {
        // 改变文件选中状态，设置为全部选中
        for (let file of this.fileList) {
          if (file.checked !== newValue) {
            file.checked = newValue
          }
        }
        // 改变selectFileList数据
        if (newValue) {
          // 勿将fileList赋给selectFileList，会建立引用
          this.selectFileList = [].concat(this.fileList)
        } 
        else {
          this.selectFileList = []
        }
      },

      /**
       * 文件选中状态改变
       * @param  {object} file：当前选中文件
       */
      _fileSelectChange: function(file) {
        this.selectFileList = [].concat(this.selectFileList)
        file.checked ? this._addElement(this.selectFileList, file) : this._removeEleById(this.selectFileList, file.templateId)
      },

      /** 
       * 单个文件的状态改变
       * @param  {object} file：当前选中文件
      */
      _singleFileSelectChange: function(file) {
        if (file.checked) {
          for (let fileItem of this.fileList) {
            fileItem.checked = false
            if (file.templateId === fileItem.templateId) {
              fileItem.checked = true
            }
          }
          // 清空被选中的文件
          this.selectFileList = []
          this._addElement(this.selectFileList, file)
        }
      },

      /**
       * 添加一个元素到selectFileList
       * @param  {array} arr：目标数组
       * @param  {object} file：要添加的元素
       */
      _addElement: function(arr, file) {
        const isContain = this._contain(arr, file.templateId)
        if (!isContain) {
          arr.push(file)
        }
      },

      /**
       * 根据id删除数组中的一个元素
       * @param  {array} arr：目标数组
       * @param  {number} id：要删除元素的id属性
       */
      _removeEleById: function(arr, id) {
        arr.forEach(item => {
          if(item.templateId === id) {
            arr.splice(arr.indexOf(item), 1)
          }
        })
      },

      /**
       * 判断数组中是否有某个元素
       * @param  {array} arr：要判断的数组
       * @param  {number} id：元素的id
       */
      _contain: function(arr, id) {
        let flag = false
        arr.forEach(item => {
          if (item.templateId === id) {
            flag = true
          }
        })
        return flag
      },

      /** 
       * 重新获取模版分类和对应的模版文件数据
      */
      _refrashData: function() {
        this._requestGetTypeData()
      },

      /** 
       * 删除模版确定
      */
      _handleDeleteFile: function() {
        let params = {
          templateIds: this._getSplitString()
        }
        _handleTemplate('/api/v2/file/template/delete', params, 'delete').then( res => {
          if (res.code === 200) {
            this.deleteDialogVisible = false
            this._refrashData()
            this.$VMessage('success', '模版删除成功')
          }
        })
      },

      /** 
       * 下载文件
      */
      _handleLoadFile: function() {
        // 如果下载个数过多，提示一下
        if (this.selectFileList.length >= 20) {
          this.$VMessage('info', '文件选择过多，将会影响下载速度')
        }
        let params = {
          fileIds: this._getSplitString(),
          moduleType: 2
        }
        // api
        _download(params)
      },

      /** 
       * 打印文件
      */
      _handlePrintFile: function() {
        this.printHtml = ''
        this.printTitle = ''
        let templateId = this._getSplitString()
        _handleTemplate(`/api/v2/file/template/${templateId}`).then(res => {
          if (res.code === 200) {
            this.printHtml = res.data.content
            this.printTitle = res.data.title
          }
        })
        // 必须用定时才能成功的执行打印的处理
        setTimeout( () => {
          this._handlePrint()
        }, 300) 
      },

      /** 
       * 打印的处理
      */
      _handlePrint: function() {
        let preHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><div>' 
        let printHtml = this.printHtml
        let nextHtml = '</div></body></html>'
        let allHtml = preHtml + printHtml + nextHtml
        let printPage = window.open('', 'printPage')
        printPage.document.write(allHtml)
        // 是否存在还需产品
        // printPage.document.title = this.printTitle
        printPage.print()
        printPage.close()   
      },

      /**
       * 移动到或者复制到被点击
       * @param  {array} isMove：是否是移动
       */
      _moveOrCopyFileClick: function(isMove) {
        this.isMove = isMove
        // 重置数据和显示数据
        this.typeModel = this.typesList[0]['id']
        this.typeId = this.typesList[0]['categoryId']
        this.moveOrCopyDialogVisible = true
      },

      /** 
       * 移动或者复制的下拉列表改变
      */
      _typeChange: function(val) {
        // console.log('val:', val)
        if (val.value) {
          let str = val.value
          this.typeId = str.split('+')[0]
          this.typeTitle = str.split('+')[1]
        }
      },

      /** 
       * 移动或者复制到确定
      */
      _handleMoveOrCopyFile: function() {
        // 请求移动文件
        if (this.isMove) {
          this._moveTemplate(this.typeId, this._getSplitString())
        } 
        // 请求复制文件
        else {
          this._copyTemplate(this.typeId, this._getSplitString())
        }
      },

      /**
       * 请求移动文件
       * @param  {number} typeId: 目标分类Id
       * @param  {string} templateIds：文件id，可多个，逗号分隔
       */
      _moveTemplate: function(typeId, templateIds) {
        let params = {
          destCategoryId: typeId,
          templateIds: templateIds
        }
        // api
        _handleTemplate('/api/v2/file/template/move', params, 'post').then( res => {
          if (res.code === 200) {
            this.moveOrCopyDialogVisible = false
            this._refrashData()
            this.$VMessage('success', '模版移动成功')
          } else if (res.code === 204) {
            this.moveOrCopyDialogVisible = true
            this.$VMessage('error', '模版移动失败')
          }
        })
      },

      /**
       * 请求复制文件
       * @param  {number} typeId: 目标分类Id
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _copyTemplate: function(typeId, templateIds) {
        let params = {
          destCategoryId: typeId,
          templateIds: templateIds
        }
        // api
        _handleTemplate('/api/v2/file/template/copy', params, 'post').then( res => {
          if (res.code === 200) {
            this.moveOrCopyDialogVisible = false
            this._refrashData()
            this.$VMessage('success', '模版复制成功')
          } else if (res.code === 204) {
            this.moveOrCopyDialogVisible = true
            this.$VMessage('error', '模版复制失败')
          }
        })
      },

      /**
       * 将id组成的数组，用逗号分隔成字符串
       */
      _getSplitString: function() {
        const fileIds = this.selectFileList.map(file => {
          return file.templateId
        })
        return fileIds.join(',')
      },

      /** 
       * 创建模版按钮点击，跳转新的页面
      */
      _createBtnClick: function() {
        let current_title = this.current_title
        let categoryId = null
        // current_title === '全部模版' || 
        if ( current_title === '全部模版' || current_title === '未分类') {
          categoryId = ''
        } else {
          categoryId = this.current_categoryId
        }
        // 打开新页面，同时传递当前所属的类别分类参数
        window.open(window.location.origin + `/#/editor?source=template&categoryid=${categoryId}`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .garden-manage
    width 100%
    height 100%
    position relative
    .document-show-box
      position absolute
      bottom 0
      right 0
      width 800px
      height 450px
      overflow hidden
      z-index -999
      visibility hidden
    .left-control,
    .right-list
      position relative
      padding 12px
      border-radius 5px
      background-color rgb(255, 255, 255)
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
    .left-control
      .control-title
        float left
        width 50%
        height 50px
        line-height 50px
        color #99601c
        border-bottom 1px solid white
      .active-title  
        color #99601c
        border-color #99601c
    .left-control
      .control-data
        position absolute
        left 0
        right 0
        bottom 10px
        top 55px
        padding 5px 0px    
        overflow-y auto
        .type-li
          display flex
          align-items center
          height 40px
          line-height 40px
          // padding-left 10px
          padding 0 13%
          color #99601c
          font-size 14px
          &:hover
            background rgba(117,199,59,.15) 
        .type-li
          .type-circle
            // display inline-block
            display none
            width 5px
            height 5px
            margin-right 5px
            border-radius 50%
            background #99601c    
          .type-text
            max-width 200px
            height 40px
            line-height 40px
            margin-right 5px
        .active-li
          background rgba(117,199,59,.15) 
    .right-list
      padding 20px 

  .move-file-content
    padding 0 20px
    line-height 34px
    .move-select
      width 240px
      margin-left 20px  
</style>
