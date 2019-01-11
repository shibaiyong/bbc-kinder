/** 
 * @Desc: 全园文档
 */
<template>
  <content-box :whiteInner="false">
    <!-- 主要内容 -->
    <div class="garden-manage">
      <!-- 左侧控制区域 -->
      <Col span="4" class="fill-height" style="padding-right:15px">
        <div class="left-control fill">
          <!-- title -->
          <div 
            class="text-center clickable control-title"
            :class="{'active-title': currentTabView === 'TypeVue'}" 
            @click.stop="_tabItemClick('TypeVue')">分类</div>
          <div 
            class="text-center clickable control-title"
            :class="{'active-title': currentTabView === 'TimeVue'}" 
            @click.stop="_tabItemClick('TimeVue')">时间</div>

          <!-- 数据动态组件 -->
          <div class="control-data">
            <component
              ref="ChildComponent"
              :is="currentTabView"
              :typeList="typeDatas"
              :timeList="timeDatas"
              @typeChange="_getTypeData"
              @monthChange="_getMonthData"/>
          </div>
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
              <v-icon size="14" type="icon-create-folder" style="margin-right:4px;"/>新建文档
            </Button>
            <!-- <Button
              size="small"
              v-show="buttonVisible.upload" 
              @click.native="$refs.uploadFileInput.click()"
              style="margin-right:5px;padding: 0 10px">
              <v-icon size="14" type="icon-upload" style="margin-right:6px;"/>上传
              <input 
                ref="uploadFileInput" 
                type="file"
                multiple="multiple" 
                @change="_handleUploadFile" 
                hidden />
            </Button> -->
                <!-- accept=".docx"  -->
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
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.smash"
              style="margin-right:5px;padding: 0 10px"
              @click.native="smashDialogVisible = true">
              <v-icon size="14" type="icon-remove" style="margin-right:4px;"/>粉碎
            </Button>
            <Button 
              type="ghost"
              size="small"
              v-show="buttonVisible.reply"
              style="margin-right:5px;padding: 0 10px"
              @click.native="_replyClick">
              <Icon type="reply-all" size="16" style="margin-right:4px;"></Icon>还原
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
            :tableTitle="`文档名称`" 
            :categoryId="current_categoryId"
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
            @smashEmit="smashDialogVisible = true"
            @replyEmit="_replyClick"
            @printEmit="_handlePrintFile">
          </file-list>

          <!-- S 删除文件对话框 -->
          <Modal
            title="删除文件"
            v-model="deleteDialogVisible"
            @on-ok="_handleDeleteFile">
            <v-icon 
              type="icon-prompt-error" 
              size="24" 
              color="#FC0000" 
              class="float-left" 
              style="margin-right:10px;">
            </v-icon>
            <p v-if="typeName === 'document' || typeName === 'time'">确实要删除文档吗？删除后可在“回收站”恢复。</p>
            <p v-if="typeName === 'draft'">确实要删除草稿吗？删除后不可恢复。</p>
          </Modal>

          <!-- 粉碎 -->
          <Modal
            title="粉碎文件"
            v-model="smashDialogVisible"
            @on-ok="_handleSmashFile">
            <v-icon 
              type="icon-prompt-error" 
              size="24" 
              color="#FC0000" 
              class="float-left" 
              style="margin-right:10px;">
            </v-icon>
            <p v-if="typeName === 'recycle'">是否要彻底粉碎文档？文档粉碎后不可恢复。</p>
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

      <!-- 文档显示区域 -->
      <iframe class="document-show-box" ref="iframeBox" :srcdoc="printHtml"></iframe>
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil , getCurrentDate, localStorageUtil} from 'lib/util'
  // 组件
  import TypeVue from 'component/type'
  import TimeVue from 'component/time'
  import Searchbar from 'component/searchbar'
  import FileList from 'component/file-list'
  // 接口
  import { requestGetTypeList, requestGetDocumentList, _handleFile, _download } from 'api/document-module'

  export default {
    name: 'garden-document',
    components: {
      TypeVue,
      TimeVue,
      Searchbar,
      FileList
    },
    data: function() {
      return {
        loadingVisible: false,
        currentTabView: 'TypeVue',

        // 分类数据
        typeDatas: [],
        timeDatas: [],

        // 按钮显示的标识
        createBtnVisible: true,
        buttonVisible: {
          upload: false,
          download: false,
          smash: false,
          delete: false,
          copy: false,
          move: false,
          print: false,
          reply: false
        },
        isMove: true,
        // 删除
        deleteDialogVisible: false,
        // 粉碎
        smashDialogVisible: false,
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
        typeName: '',
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

        //打印的内容
        printHtml: '',
        printTitle: '',

        timeOut: null
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
          let name = this.typeName
          switch (name) {
            // 文档
            case 'document':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              this.buttonVisible.copy = true
              this.buttonVisible.move = true
              break
            // 草稿箱
            case 'draft':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              break
            // 回收站 
            case 'recycle':
              this._resetBtnVisible()
              this.buttonVisible.reply = true
              this.buttonVisible.smash = true
              break
            // 时间 
            case 'time':
              this._resetBtnVisible()
              this.buttonVisible.download = true
              this.buttonVisible.print = true
              this.buttonVisible.delete = true
              break  
          }
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
          //  根据选中的文件类型显示不同的按钮组
          let name = this.typeName
          switch (name) {
            // 文档
            case 'document':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              break
            // 草稿箱
            case 'draft':
              this._resetBtnVisible()
              this.buttonVisible.upload = true
              break
            // 回收站 
            case 'recycle':
              this._resetBtnVisible()
              break
            case 'time':
              this._resetBtnVisible()
              break  
          }
        }
      }
    },
    beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
      clearTimeout(this.timeOut)
      next()
    },
    mounted: function() {
      this._requestGetTypeData()
      this._watchLocal()
    },
    methods: {
      /** 
       * 监视数据 
      */
      _watchLocal: function() {
        this.timeOut = setInterval(this.localData, 5000)
      },

      /** 
       * 获取存储的数据
      */
      localData: function() {
        let value = localStorageUtil.get('fileChange')
        value && this.afrashTypeData()
        localStorageUtil.set('fileChange', false)
      },

      /** 
       * 清空数据，重置按钮显示和恢复全不选
      */
      _clearData: function() {
        this.fileList = []
        this.selectFileList = []
        this.typeName = ''
        this._resetBtnVisible()
        this.checkAll = false
        this.$refs.searchbar._clearValue()
      },

      /** 
       * 重置Button显示
      */
      _resetBtnVisible: function() {
        this.buttonVisible = {
          upload: false,
          download: false,
          print: false,
          delete: false,
          smash: false,
          copy: false,
          move: false,
          reply: false
        }
      },

      /** 
       * 获取分类数据列表（时间和分类都一起获取）
      */
      _requestGetTypeData: function() {
        this.typeDatas = []
        this.timeDatas = []
        // 请求接口数据
        requestGetTypeList({'type': 0}).then(response => {
          if (response.code === 200 ) {
            // 设置草稿箱和回收站数据
            let arr = [
              {
                "fileStatus": 2,
                "title": "草稿箱",
                "isSystem": false,
                "fileCount": response.data.draftCount,
                "templateCount": 0
              },
              {
                "fileStatus": 3,
                "title": "回收站",
                "isSystem": false,
                "fileCount": response.data.recycledCount,
                "templateCount": 0
              }
            ]
            this.typeDatas = response.data.categoryList.concat(arr)
            this.timeDatas = response.data.dateList
            // 设置分类的下拉数据
            let selsecList = response.data.categoryList.filter(item => {
              return item.categoryId !== 2 && item.categoryId !== 1
            })
            let selectArr = [].concat(selsecList)
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
          }
        })
      },

      /** 
       * 获取所有的文档列表
      */
      _requestGetDocumentDatas: function(obj) {
        this.selectFileList = []
        this.loadingVisible = true
        return requestGetDocumentList(obj).then(response => {
          if (response.code === 200) {
            if (response.data.length) {
              // 设置当前的文档的ID数组
              let idArr = []
              idArr = response.data.map(item => {
                return item.fileId
              })
              // 存储当前获取的ID数组对象
              sessionStorageUtil.set('current_Ids', idArr)
              // 设置是否被选中的属性
              this.fileList = response.data.map(item => {
                item.checked = false
                return item
              })
            }
            else {
              this.fileList = []
            }
            // 关闭loading
            setTimeout(() => {
              this.loadingVisible = false
            }, 500)
          }
        })
      },

      /** 
       * tab项点击
      */
      _tabItemClick: function(name) {
        this._clearData()
        this.currentTabView = name
        // 当点击的是分类项，重新请求数据
        if(name === 'TypeVue') {
          this._requestGetTypeData()
        }  
      },

      /** 
       * 接收type改变,根据类别的数据来重置按钮的显示和类型的显示
      */
      _getTypeData: function(item) {
        // 清空数据
        this._clearData()
        // 获取类型值
        let typeValue = item.title + ''
        // 设置当前的选中项的Title值,存储起来用来判断
        this.current_title = item.title
        this.current_categoryId = item.categoryId ? Number(item.categoryId) : ''
        this.current_obj = item
        switch (typeValue) {
          // 草稿箱
          case '草稿箱':
            this.typeName = 'draft'
            this.belongClass = 'draft'
            this.buttonVisible.upload = true
            this.current_categoryId = 'draft'
            break
          // 回收  
          case '回收站':
            this.typeName = 'recycle'
            this.belongClass = 'recycle'
            break
          // 文档
          default:
            this.typeName = 'document'
            this.belongClass = 'document'
            this.buttonVisible.upload = true
            break
        }
        // 设置请求的参数
        let obj = {}
        // 传递的是文档类型
        if(item.categoryId) {
          obj.categoryId = Number(item.categoryId)
        }
        // 传递的回收站和草稿箱
        if (item.fileStatus) {
          obj.fileStatus = Number(item.fileStatus)
        }
        // 获取文档数据
        this._requestGetDocumentDatas(obj)
      },

      /** 
       * 接收年月数据改变
      */
      _getMonthData: function(item) {
        // 设置一些变量
        this.typeName = 'time'
        this.current_title = '时间'
        this.belongClass = 'time'
        this.current_obj = item
        let obj = {}
        obj.queryTime = item.year + '-' + item.mon
        // 获取文档数据
        this._requestGetDocumentDatas(obj)
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
          // 根据当前对象的数据进行参数赋值
          if (this.current_obj.categoryId) {
            obj.categoryId = this.current_obj.categoryId
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
          if (this.current_obj.fileStatus) {
            obj.fileStatus = this.current_obj.fileStatus
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
          if (this.current_obj.year) {
            obj.queryTime = this.current_obj.year + '-' + this.current_obj.mon
            // 获取文档数据
            this._requestGetDocumentDatas(obj)
          }
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
        file.checked ? this._addElement(this.selectFileList, file) : this._removeEleById(this.selectFileList, file.fileId)
      },

      /** 
       * 单个文件的状态改变
       * @param  {object} file：当前选中文件
      */
      _singleFileSelectChange: function(file) {
        if (file.checked) {
          for (let fileItem of this.fileList) {
            fileItem.checked = false
            if (file.fileId === fileItem.fileId) {
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
        const isContain = this._contain(arr, file.fileId)
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
          if(item.fileId === id) {
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
          if (item.fileId === id) {
            flag = true
          }
        })
        return flag
      },

      /** 
       * 重新获取文档和分类数据
      */
      afrashTypeData: function() {
        this._requestGetTypeData()
        if (this.currentTabView === 'TimeVue') {
          this._tabItemClick('TimeVue')
        }
      },

      /** 
       * 删除文件确定
      */
      _handleDeleteFile: function() { 
        let name = this.typeName
        // 是草稿的删除确定点击
        if (name === 'draft') {
          let params = {
            deleteType: 2,
            fileIds: this._getSplitString()
          }
          // api
          this._requestDeleteFile(params)
        }
        // 文档和时间的删除确定，进入回收战
        else {
          let params = {
            deleteType: 1,
            fileIds: this._getSplitString()
          }
          // api
          this._requestDeleteFile(params)
        }
      },

      /** 
       * 请求删除文档的操作
       * @param {object} params： 请求的参数
      */
      _requestDeleteFile: function(params) {
        _handleFile('/api/v2/file/station/delete', params, 'delete').then(res => {
          if (res.code === 200) {
            // 设置请求的参数
            let obj = {}
            // 传递的是文档类型
            if(this.current_obj.categoryId) {
              obj.categoryId = Number(this.current_obj.categoryId)
            }
            // 传递的回收站和草稿箱
            if (this.current_obj.fileStatus) {
              obj.fileStatus = Number(this.current_obj.fileStatus)
            }
            // 重新获取当前分类类别的数据同时切换到对应的动态组件中
            this.afrashTypeData()
            // 提示信息
            this.$VMessage('success', '文件删除成功')
            // 关闭弹窗
            this.deleteDialogVisible = false
          }
        })
      },

      /** 
       * 粉碎文件确定(粉碎只在回收站对应的数据中显示)
      */
      _handleSmashFile: function() {
        let name = this.typeName
        if (name === 'recycle') {
          let params = {
            deleteType: 3,
            fileIds: this._getSplitString()
          }
          // 调用粉碎请求
          _handleFile('/api/v2/file/station/delete', params, 'delete').then(res => {
            if (res.code === 200) {
              // 设置请求的参数
              let obj = {}
              // 传递的是文档类型
              if(this.current_obj.categoryId) {
                obj.categoryId = Number(this.current_obj.categoryId)
              }
              // 传递的回收站和草稿箱
              if (this.current_obj.fileStatus) {
                obj.fileStatus = Number(this.current_obj.fileStatus)
              }
              // 获取当前分类类别的数据
              this.afrashTypeData()
              // 提示信息
              this.$VMessage('success', '文件粉碎成功')
              // 关闭粉碎弹窗
              this.smashDialogVisible = false
            }
          })
        }
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
          moduleType: 1
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
        let fileId = this._getSplitString()
        _handleFile(`/api/v2/file/station/${fileId}`).then(res => {
          if (res.code === 200) {
            this.printHtml = res.data.content
            this.printTitle = res.data.title
          }
        })
        // 必须用定时才能成功的执行打印的处理
        setTimeout( () => {
          this._handlePrint()
        }, 500) 
      },

      /** 
       * 打印的处理
      */
      _handlePrint: function() {
        let preHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><div>' 
        let printHtml = this.printHtml
        let nextHtml = '</div></body></html>'
        let allHtml = preHtml + printHtml + nextHtml
        let gardenPrintPage = window.open('', 'gardenPrintPage')
        gardenPrintPage.document.write(allHtml)
        
        gardenPrintPage.print()
        gardenPrintPage.close()   
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
       * 还原按钮点击
      */
      _replyClick: function() {
        let params = {
          fileIds: this._getSplitString()
        }
        // api
        _handleFile('/api/v2/file/station/trashRecovery', params, 'post').then( res => {
          if (res.code === 200) {
            // 获取当前分类类别的数据
            this.afrashTypeData()
            // 提示信息
            this.$VMessage('success', '文件还原成功')
          } else if (res.code === 204) {
            // 提示信息
            this.$VMessage('error', '文件还原失败')
          }
        })
      },

      /** 
       * 移动或者复制的下拉列表改变
      */
      _typeChange: function(val) {
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
          this._moveFile(this.typeId, this._getSplitString())
        } 
        // 请求复制文件
        else {
          this._copyFile(this.typeId, this._getSplitString())
        }
      },

      /**
       * 请求移动文件
       * @param  {number} typeId: 目标分类Id
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _moveFile: function(typeId, fileIds) {
        let params = {
          destCategoryId: typeId,
          fileIds: fileIds
        }
        // api
        _handleFile('/api/v2/file/station/move', params, 'post').then(res => {
          if (res.code === 200) {
            this.$VMessage('success', '文件移动成功')
            this.moveOrCopyDialogVisible = false
            // 获取当前分类类别的数据
            this.afrashTypeData()
          } if (res.code === 204) {
            this.$VMessage('error', '文件移动失败')
            this.moveOrCopyDialogVisible = true
          }
        })
      },

      /**
       * 请求复制文件
       * @param  {number} typeId: 目标分类Id
       * @param  {string} fileIds：文件id，可多个，逗号分隔
       */
      _copyFile: function(typeId, fileIds) {
        let params = {
          destCategoryId: typeId,
          fileIds: fileIds
        } 
        // api
        _handleFile('/api/v2/file/station/copy', params, 'post').then(res => {
          if (res.code === 200) {
            this.$VMessage('success', '文件复制成功')
            this.moveOrCopyDialogVisible = false
            // 获取当前分类类别的数据
            this.afrashTypeData()
          } if (res.code === 204) {
            this.$VMessage('error', '文件复制失败')
            this.moveOrCopyDialogVisible = true
          }
        })
      },

      /**
       * 将id组成的数组，用逗号分隔成字符串
       */
      _getSplitString: function() {
        const fileIds = this.selectFileList.map(file => {
          return file.fileId
        })
        return fileIds.join(',')
      },

      /** 
       * 创建文档按钮点击，跳转新的页面
      */
      _createBtnClick: function() {
        let current_title = this.current_title
        let categoryId = null
        if (current_title === '全部文档' || current_title === '回收站' || current_title === '草稿箱' || current_title === '时间') {
          categoryId = ''
        } else {
          categoryId = this.current_obj.categoryId
        }
        // 打开新页面，同时传递当前所属的类别分类参数
        window.open(window.location.origin + `/#/editor?source=file&categoryid=${categoryId}`)
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
      padding 12px 0
      border-radius 5px
      background-color rgb(255, 255, 255)
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
    .left-control
      .control-title
        float left
        width 24%
        height 50px
        line-height 50px
        color #99601c
        border-bottom 3px solid white
        margin 0 13%
      .active-title  
        color #99601c
        border-color #99601c
    .left-control
      .control-data
        position absolute
        left 0
        right 0
        bottom 10px
        top 60px    
        overflow-y auto
    .right-list
      padding 20px 

  .move-file-content
    padding 0 20px
    line-height 34px
    .move-select
      width 240px
      margin-left 20px  
</style>
