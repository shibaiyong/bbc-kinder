/** 
 * @Desc: 收费
 */
<template>
  <content-box :whiteInner="false">
    <!-- 主要内容 -->
    <div class="refund-setting">
      <div class="fill-height">
        <div class="left-control fill">
          <!-- 顶部 title -->
          <Button 
            size="small"
            style="margin:12px 0 0 28px;padding: 0 10px"
             @click="listDialogFlag = true">
            <v-icon size="14" type="icon-add" style="margin-right:4px;"/>新增
          </Button>
          <!-- 联动 linkage -->
          <div class="linkage">
            <div class="class-select">
              <span class="select-txt">退费项目名称</span>
              </el-select>
              <el-input class="input-com" v-model="inputStudentName" placeholder="请输入名称查询"></el-input>
              <!-- <input class="input-com" type="text"> -->
            </div>
            <div class="class-select">
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px"
                @click.native="_createBtnClick">
                查询
              </Button>
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px;border: 1px solid #F84B62;color: #F84B62;"
                class="input-reset"
                @click.native="_moveOrCopyFileClick(true)">
                重置
              </Button>
            </div>
          </div>

          <!-- 表单区域 -->
          <div class="table">
            <div class="table-title line-item">
              <div v-for="(item, index) in titleData" :class="item.class" class="item">{{item.value}}</div>
            </div>
            <div class="table-body">
              <div v-for="(data, index) in bodyData" class="line-item">
                <div v-for="(item, j) in data" :class="item.class" class="item">
                  <span v-show="item.value==false" style="width: 100%;height: 40px;">&nbsp;</span>
                  <span v-show="item.value!='未支付'">{{item.value}}</span>
                  <div v-show="item.value=='未支付'">
                    <span style="color: #F84B62" v-show="item.value=='未支付'">{{item.value}}</span>
                  </div>
                  <div v-show="item.class=='operation'">
                    <span style="color: #269856" v-show="item.value1" @click="commitPay(index,j)">{{item.value1}}</span>
                    <span style="color: #FF9902" v-show="item.value2" @click="modify(data)">{{item.value2}}</span>
                    <span style="color: #5494EA" v-show="item.value3">{{item.value3}}</span>
                    <span style="color: #F84B62" v-show="item.value4" @click="deleteListItem(index)">{{item.value4}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div class="list-dialog add">
          <el-dialog
            :title="addOrDataupflag?'修改退费项目':'新增退费项目'"
            :visible.sync="listDialogFlag">
            <div class="dialog-main">
              <div class="class-select">
                <span class="select-txt"><span style="color:#F84B62">* </span>退费项目名称</span></span>
                <el-input class="input-com" v-model="addDialogInput1" placeholder="请输入"></el-input>
              </div>
              <div class="class-select">
                <span class="select-txt"><span style="color:#F84B62">* </span>是否考勤结算</span></span>
                <el-radio v-model="calculAttendRadio" label="1">是</el-radio>
                <el-radio v-model="calculAttendRadio" label="2">否</el-radio>
              </div>
              <div class="class-select">
                <span class="select-txt">最小结算天数</span>
                <el-input class="input-com" v-model="addDialogInput2" placeholder="请输入"></el-input>
              </div>
              <div class="class-select">
                <span class="select-txt">最大结算天数</span>
                <el-input class="input-com" v-model="addDialogInput3" placeholder="请输入"></el-input>
              </div>
              <div class="class-select">
                <span class="select-txt"><span style="color:#F84B62">* </span>金额</span></span>
                <el-input class="input-com" v-model="addDialogInput4" placeholder="请输入"></el-input>
              </div>
              <div class="class-select">
                <span class="select-txt" style="float: left">项目说明</span>
                <el-input
                  class="input-com textarea"
                  type="textarea"
                  maxlength = 100
                  placeholder="不能超过100个字符"
                  v-model="addDialogTextarea">
                </el-input>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <Button 
                type="ghost"
                size="small"
                style="margin-right:5px;padding: 0 10px;color:#fff;background:#269856;"
                @click="closeSaveDialog()">
                保存
              </Button>
              <Button 
                type="ghost"
                size="small"
                style="margin: 0 16px;padding: 0 10px;border: 1px solid #F84B62;color:#fff;background:#F84B62;"
                @click="closeSaveDialog()">
                取消
              </Button>
            </span>
          </el-dialog>

        </div>
        </div>
      </div>
      
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
    name: 'refund-setting',
    components: {
      TypeVue,
      TimeVue,
      Searchbar,
      FileList
    },
    data: function() {
      return {
        addOrDataupflag: false, // 列表否显示修改的数据
        addDialogInput1: '',  // 增加弹框 收费方案名称
        addDialogInput2: '',  // 增加弹框 最小结算天数
        addDialogInput3: '',  // 增加弹框 最大结算天数
        addDialogInput4: '',  // 增加弹框 金额
        calculAttendRadio: '1', // 增加弹框 是否计算考勤
        addDialogTextarea: '',  // 增加弹框 项目说明

        inputStudentName: '',  // 页面输入框 学生姓名
        inputSelectStudentName: '',  // 选择学生 学生姓名
        listDialogFlag: false,  // 列表弹框
        dialogVisible: false,  // 列表弹框
        classAddDataList: [
	        {
            classAddId: 'class1',
            classAddLabel: '托班一班'
          }, {
            classAddId: 'class2',
            classAddLabel: '托班二班'
          }, {
            classAddId: 'class3',
            classAddLabel: '小班一班'
          }, {
            classAddId: 'class4',
            classAddLabel: '小班二班'
          }, {
            classAddId: 'class5',
            classAddLabel: '中班一班'
          }, {
            classAddId: 'class6',
            classAddLabel: '中班二班'
          }, {
            classAddId: 'class7',
            classAddLabel: '中班三班'
          }, {
            classAddId: 'class8',
            classAddLabel: '大班一班'
          }
        ],
        gradeDataList: [
          {
            gradeId: 'grade1',
            gradeLabel: '托班'
          }, {
            gradeId: 'grade2',
            gradeLabel: '小班'
          }, {
            gradeId: 'grade3',
            gradeLabel: '中班'
          }, {
            gradeId: 'grade4',
            gradeLabel: '大班'
          }
        ],
        titleData: [
          {
            class: 'billing-name',
            value: '退费项目名称'
          }, {
            class: 'charge-type',
            value: '是否考勤结算'
          },{
            class: 'money',
            value: '金额'
          }, {
            class: 'charge-explain',
            value: '项目说明'
          },{
            class: 'operation',
            value: '操作'
          }
        ],
        bodyData: [
          [{
            class: 'billing-name',
            value: '保教费'
          }, {
            class: 'charge-type',
            value: '是'
          },{
            class: 'money',
            value: '3000.00'
          }, {
            class: 'charge-explain',
            value: ' '
          },{
            class: 'operation',
            value2: '修改',
            value4: '移除',
          }],
          [{
            class: 'billing-name',
            value: '餐饮费'
          }, {
            class: 'charge-type',
            value: '是'
          },{
            class: 'money',
            value: '1000.00'
          }, {
            class: 'charge-explain',
            value: ' '
          },{
            class: 'operation',
            value2: '修改',
            value4: '移除',
          }]
        ],
        addDialogTitleData: [
          {
            class: 'student',
            value: '姓名'
          },{
            class: 'sex',
            value: '性别'
          },{
            class: 'class',
            value: '班级'
          }
        ],
        addDialogBodyData: [
          [{
            class: 'student',
            value: '张小花'
          }, {
            class: 'sex',
            value: '女'
          }, {
            class: 'class',
            value: '一年一班'
          }],
            [{
            class: 'student',
            value: '陈巍巍'
          }, {
            class: 'sex',
            value: '男'
          }, {
            class: 'class',
            value: '一年四班'
          }]
        ],
        value: '',// 以上是选择下拉
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: '',
        value7: '', // 以上是日期下拉
        
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
      // this._requestGetTypeData()
      // this._watchLocal()
    },
    methods: {
      /** 
       * 弹框 删除数据
      */
      deleteListItem(index) {
        // 获取数组
        var arr = this.bodyData;
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.bodyData = arr;
      },
      /** 
       * 弹框修改的加数据
      */
      modify(data) {
        // 控制
        this.listDialogFlag = true;
        this.addOrDataupflag=true;
        // 要修改的数据
        this.addDialogInput1 = data[0].value; // 增加弹框 收费方案名称
        this.addDialogInput2 = 3;   // 增加弹框 最小结算天数
        this.addDialogInput3 = 31;   // 增加弹框 最大结算天数
        this.addDialogInput4 = data[2].value;   // 增加弹框 金额
        if(data[1].value=='是'){
          this.calculAttendRadio = '1';  // 增加弹框 是否计算考勤
        }else if(data[1].value=='否'){
          this.calculAttendRadio = '2';  // 增加弹框 是否计算考勤
        }
        this.addDialogTextarea = data[4].value;   // 增加弹框 项目说明
      },
      /** 
       * 关弹框 清除修改的加数据
      */
      closeSaveDialog(data) {
        // 控制
         this.addOrDataupflag=false;
         this.listDialogFlag = false;
        //  var itemData = []
        // 要修改的数据
        this.addDialogInput1 = ''; // 增加弹框 收费方案名称
        this.addDialogInput2 = '';   // 增加弹框 最小结算天数
        this.addDialogInput3 = '';   // 增加弹框 最大结算天数
        this.addDialogInput4 = '';   // 增加弹框 金额
        this.calculAttendRadio = '1';
        this.addDialogTextarea = '';   // 增加弹框 项目说明
      },
      /** 
       * input 重置
      */
      restInput(index,j) {
        var list = this.bodyData[index];
        console.log(list[j-1])
        if(index%3){
          this.bodyData[index][j-1].value = '已支付(支付宝)'
        }else if(index>3&&index%2){
          this.bodyData[index][j-1].value = '已支付(微信)'
        }else {
          this.bodyData[index][j-1].value = '已支付(现金)'
        }
      },
      /** 
       * 列表 确认支付
      */
      commitPay(index,j) {
        var list = this.bodyData[index];
        console.log(list[j-1])
        if(index%3){
          this.bodyData[index][j-1].value = '已支付(支付宝)'
        }else if(index>3&&index%2){
          this.bodyData[index][j-1].value = '已支付(微信)'
        }else {
          this.bodyData[index][j-1].value = '已支付(现金)'
        }
      },
      /** 
       * 列表弹框的处理
      */
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
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
        // this._clearData()
        this.currentTabView = name
        // 当点击的是分类项，重新请求数据
        // if(name === 'TypeVue') {
        //   this._requestGetTypeData()
        // }  
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
  .refund-setting
    width 100%
    height 100%
    position relative
    .fill-height
      overflow-y auto
    .document-show-box
      position absolute
      bottom 0
      right 0
      width 800px
      height 450px
      overflow hidden
      z-index -999
      visibility hidden
    .left-control
    .right-list
      position relative
      padding 12px
      border-radius 5px
      background-color rgb(255, 255, 255)
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
    .left-control
      .linkage
        text-align left
        .class-select
          display inline-block
          // width 12%
          margin 16px 0 0
          margin-left 36px
          .select-txt
            border none
            color #99601C
            margin-right 6px

      // 列表样式
      .table
        margin-top 16px
        width 100%
        line-height 40px
        color #99601C

        .table-title
          background rgba(204,204,204,0.15)
        .line-item
          width 100%
          height 40px
          clear both
          >div
            float left
            padding 0 12px
            width 20%
            font-size 14px
            text-align center
            box-sizing border-box

        .table-body
          width 100%
          // background #fff
          clear both
          .line-item
            &:hover
              background rgba(117,199,59,0.1)
            &:leave
              background #fff
            &.active-title 
              background rgba(117,199,59,0.15)
            .operation
              cursor pointer

      .item-tab-content
        width 420px
        margin 0 auto
        .vice-tab
          padding 12px 20px
          cursor pointer
          color #ccc
      .tabble-out
        margin 20px auto
        border-space 0px 0px
        border-collapse collapse
        .tabble-line
          border-right 1px solid #666
          border-bottom 1px solid #666
          .tabble-cow
            width 10%
            padding 8px 20px
            border-top 1px solid #666
            border-left 1px solid #666
      .control-title
        float left
        width 120px
        margin 0 20px
        height 50px
        line-height 50px
        color #99601c
        border-bottom 3px solid white
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
      width 320px
      margin-left 20px  
</style>

<style lang="stylus" rel="stylesheet/stylus">
.input-com
  width 260px
  display inline-block
  input
  textarea
    height 32px
    line-height 32px
    color #99601C
    padding 0 12px
    box-sizing border-box
    background #ffe6c1
    border 1px solid #99601C!important
    border-radius 16px

  .el-input__suffix
    .el-input__suffix-inner
      .el-input__icon
        line-height 32px
        color #99601C
  .el-select-dropdown__item.selected
    color #99601C

.el-select-dropdown__item.selected
  color #269856
</style>

<style>
  /* 日期 */
  .refund-setting .block .el-range-editor.el-range-editor.el-input__inner.input-com .el-range-separator{
    color: #99601C;
  }
  .refund-setting .block .el-range-editor.el-input__inner{
    width: 680px;
    height: 32px;
    line-height: 32px;
    color: #fff;
    padding: 0;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #fff!important;
    border-radius: 16px;
  }
  .refund-setting .el-date-table td.today span{
    color: #269856;
  }
  .refund-setting .el-date-table td.end-date span, .el-date-table td.start-date span{
    background: #269856;
  }
  .refund-setting .el-date-table td.available:hover{
    color: #269856;
  }

  .refund-setting .input-reset.ivu-btn-ghost:hover{
    background: rgba(248, 75, 98,.1)!important;
  }

  /* 弹框样式 */
  .refund-setting .list-dialog .el-dialog{
    width: 620px;
    height: 600px;
    background: #FFFBEB;
    border-radius: 16px;
    overflow: hidden;
  }
  .refund-setting .el-dialog__header{
    background: -webkit-linear-gradient(bottom, #E99D46 , #AA7334); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom, #E99D46, #AA7334); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom, #E99D46, #AA7334); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom, #E99D46 , #AA7334); /* 标准的语法 */
  }
  .refund-setting .el-dialog__header .el-dialog__title{
    color: #fff;
  }
  .refund-setting .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
    /* float: right; */
  }
  .refund-setting .el-dialog__body{
    padding: 12px 30px;
  }
  .refund-setting .el-dialog .el-dialog__body .table .line-item>div.item{
    width: 30%
  }

  .refund-setting .class-select{
    display: inline-block;
    margin: 16px 0 0;
    margin-right: 12px;
  }
  .refund-setting .class-select .el-radio .el-radio__input.is-checked+.el-radio__label{
    color: #269856;
  }
  .refund-setting .class-select .el-radio .el-radio__input.is-checked .el-radio__inner{
    border-color: #269856;
    background: #269856;
  }
  .refund-setting .class-select .el-radio{
    margin-left: 30px;
  }
  .refund-setting .class-select .select-txt{      
    border: none;
    color: #99601C;
    margin-right: 6px;
  }
  .refund-setting .class-select .input-com {      
    width: 160px;
  }
  .refund-setting .add .dialog-main .class-select .select-txt {
    display: inline-block;
    width: 144px;
    text-align: right;
  }
  .refund-setting .add .dialog-main .class-select .input-com {
    width: 260px;
  }
  .refund-setting .add .dialog-main .class-select .input-com .el-textarea__inner {
    border-radius: 10px;
    height: 136px!important;
    margin-left: 4px;
  }
  .refund-setting .add .el-dialog__footer {
    margin-top: 16px;
    text-align: center!important;
  }
          
</style>
