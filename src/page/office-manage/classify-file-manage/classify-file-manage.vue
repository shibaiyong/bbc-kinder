/** 
 * @Desc: 文档分类
 */
<template>
  <div class="classify-file-manage">
    <content-box :whiteInner="false">
      <div class="classify-manage">
        <!-- 创建文档 -->
        <Button 
          v-show="createBtnVisible"
          size="large"
          style="margin-right:8px;margin-top:10px;margin-left:10px;margin-bottom: 10px"
          @click.native="createFile" ref="fileBtn">
          <Icon type="plus" :size="14" style="margin-right:6px"></Icon>创建分类
        </Button>

        <!-- 列表 -->
        <section class="table-header clear-float">
          <div class="w300 pl10 pr10 float-left">分类</div>
          <div class="w100 pl10 pr10 float-left">文档数</div>
          <div class="w100 pl10 pr10 float-left">模板数</div>
          <div class="w200 pl10 pr10 float-left">操作</div>
        </section>

        <ul class="table-box">
          <li 
            v-for="(item, index) in itemList" 
            :key="index"
            class="clear-float table-li" 
            :data-id="index" 
            :data-length="itemList.length">
            <div class="w300 ellipsis pointClass pl10 pr10 float-left" :title="item.title">{{item.title}}</div>
            <div class="w100 pl10 pr10 float-left">{{item.fileCount}}</div>
            <div class="w100 pl10 pr10 float-left">{{item.templateCount}}</div>
            <div class="w200 pointClass pl10 pr10 float-left" :class="{'disabledClass': item.title === '全部文档' || item.title === '未分类'}">
              <Icon 
                type="compose" 
                color="#269856" 
                size='16' 
                title="编辑" 
                style="margin:5px 8px;color: #75C73B;"
                :class="{'disabledClass': item.title === '全部文档' || item.title === '未分类'}"
                @click.stop.native = "editorFile(item)">
              </Icon>
              <Icon 
                type="ios-trash" 
                color="#269856" 
                size='16' 
                title="删除" 
                style="margin:5px 8px;color: #75C73B;"
                :class="{'disabledClass': item.title === '全部文档' || item.title === '未分类'}" 
                @click.stop.native = "deleteFile(item.categoryId, item.title)">
              </Icon>
              <Icon 
                type="arrow-up-a" 
                color="#269856" 
                size='16' 
                title="向上"
                :class="{'disabledClass': item.title === '全部文档' || item.title === '未分类' || index === 1}" 
                style="margin:5px 8px;color: #75C73B;" 
                @click.stop.native = "upFile(item, index)"></Icon>
              <Icon 
                type="arrow-down-a" 
                color="#269856" 
                size='16'  
                title="向下" 
                style="margin:5px 8px;color: #75C73B;"
                :class="{'disabledClass': item.title === '全部文档' || item.title === '未分类' || index === (itemList.length -2)}"  
                @click.stop.native = "downFile(item, index)">
              </Icon>
            </div>
          </li>
        </ul>

        <!-- 弹出对话框 -->
        <Modal
          v-model="createVisible"
          :title='titleName'
          @on-ok="fileOk"
          @on-cancel="fileCancel">
            <Form ref="classForm" :model="classForm" :label-width="100" :rules="classFormRule" @submit.native.prevent style="width: 380px">
              <FormItem label="分类名称" prop='title'>
                <Input v-model="classForm.title" placeholder="最多可输入14个汉字" :maxlength='14'></Input>
              </FormItem>
            </Form>
        </Modal>

        <!-- 删除提示框 -->
        <Modal
          v-model="fileRemoveVisible"
          @on-ok="_handleRemoveFile"
          @on-cancel="_hanleCancelFile"
          title="删除分类">
          <p>删除后不可恢复，分类内文档和模板将会移至系统默认分类"未分类"?</p>
          <p>您确定要删除该分类吗？</p>
        </Modal>
      </div>
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6"> 
  import { requestGetTypeList, _handleType } from 'api/document-module'

  export default {
    name: 'classify-file-manage',
    data: function() {
      const validateTitleName = (rule, value, callback) => {
        if( value.trim() === '全部文档'){
          callback(new Error('不能再次创建全部文档'))
        } else if (value.trim() === '未分类') {
          callback(new Error('不能再次创建未分类'))
        } else {
          callback()
        }
      }
      return {
        createBtnVisible: true,
        itemList:[],

        // 创建弹窗flag
        createVisible: false,
        titleName:'',
        classForm:{
          title:''
        },
        classFormRule:{
          title:[
            { required: true, message: '分类名称不能为空', trigger: 'blur'},
            { validator: validateTitleName, trigger: 'blur' }
          ]
        },

        deleteId: 0,
        fileRemoveVisible:false,
        // 分类Id
        categoryId: 0,
        // id的数组
        idsArr: []
      }
    },
    mounted: function() {
      this._getFileData()
    },
    methods: {
      /** 
       * 新建分类点击
      */
      createFile: function() {
        this.titleName = '创建分类'
        this.createVisible = true
        this.classForm.title = ''
      },

      /** 
       * 创建和编辑的确定点击
      */
      fileOk: function() {
        this.$refs['classForm'].validate((valid) => {
          if (valid) {
            var that = this
            // 判断是不是创建
            if (this.titleName === '创建分类') {
              let params = {
                title: that.classForm.title
              }
              // 调用请求
              this._requestCreateClass(params)
            }
            // 判断是不是编辑
            if (this.titleName === '编辑分类') {
              let params = {
                title: that.classForm.title,
                categoryId: that.categoryId
              }
              // 调用编辑的请求
              this._requestPatchClass(params)
            }
          } 
        })
      },

      /** 
       * 调用创建分类的请求
      */
      _requestCreateClass: function(param) {
        return requestGetTypeList(param, 'post').then(res => {
          if(res.code === 200) {
            this.createVisible = false
            this.$VMessage('success', '创建分类成功', 1000)
            // 重新获取数据
            this._getFileData()
          }

          if (res.code === 206) {
            this.createVisible = true
            this.$VMessage('error', res.msg) 
          }

          if (res.code === 208) {
            this.createVisible = true
            this.$VMessage('error', res.msg) 
          }
        }).catch(function(err){
            this.createVisible = true
            this.$VMessage('error', '创建分类失败', 1000)
        })
      },

      /** 
       * 调用编辑分类的请求
      */
      _requestPatchClass: function(param) {
        return requestGetTypeList(param, 'post').then( res => {
          if (res.code === 206) {
            this.createVisible = true
            this.$VMessage('error', '分类命名重复', 1000)
            return
          }
          if (res.code === 200) {
            this.createVisible = false
            this.$VMessage('success', '分类修改成功', 1000)
            // 重新获取数据
            this._getFileData()
            return 
          }
        })  
      },

      /** 
       * 关闭弹窗
      */
      fileCancel(){
        this.$refs['classForm'].resetFields()
        this.createVisible = false
        this.categoryId = 0
        this.titleName = ''
      },

      /** 
       * 编辑分类按钮点击
       * @param {Object} item： 当前点击的数据对象
      */
      editorFile(item){
        if (item.title === '全部文档' || item.title === '未分类') {
          return
        } else {
          this.titleName = '编辑分类'
          this.createVisible = true
          this.classForm.title = item.title.trim()
          this.categoryId = item.categoryId
        }
      },

      /** 
       * 
      */
      deleteFile(_id, title){
        if (title === '全部文档' || title === '未分类') {
          return
        } else {
          //出现弹出框提示是否要删除
          this.deleteId = _id
          this.fileRemoveVisible = true
        }
      },

      /** 
       * 删除的确定按钮点击
      */
      _handleRemoveFile(){
        var self_this = this
        //确定的话调用后台接口 确定删除 删除成功之后再来做 退出弹出框
        requestGetTypeList({'categoryId': self_this.deleteId}, 'delete', `/api/v2/file/category/${self_this.deleteId}`).then(function(res){
          if(res.code === 200){
            self_this.fileRemoveVisible = false
            self_this._getFileData()
            self_this.$VMessage('success', '删除分类成功', 1000)
          }
        }).catch(function(err){
          self_this.fileRemoveVisible = false
          self_this.$VMessage('error', '删除分类失败', 1000)
        })
      },

      /** 
       * 关闭删除弹窗
      */
      _hanleCancelFile(){
        this.fileRemoveVisible = false
        this.deleteId = 0
      },

      /** 
       * 上移
      */
      upFile(item, i){
        //向上移动分类名称就是改变 数组的位置 交换一下位置
        if ( item.title === '全部文档' || item.title === '未分类' || i === 1) {
          return
        } else {
          let params = {
            categoryId: item.categoryId,
            destCategoryId: this.idsArr[i-1]
          }
          this._requestSortOrder(params)
        }
      },

      /** 
       * 下移
      */
     downFile(item, i){
       //向下移动分类名称 与数组的下个位置 交换数据
        if (item.title === '全部文档' || item.title === '未分类' || i === (this.itemList.length -2)) {
          return
        } else {
          let params = {
            categoryId: item.categoryId,
            destCategoryId: this.idsArr[i+1]
          }
          this._requestSortOrder(params)
        }
      },

      /** 
       * 上下移动请求的api
      */
     _requestSortOrder: function(data) {
        _handleType('/api/v2/file/category/sortOrder', data, 'post').then(res => {
          if (res.code === 200) {
            this.$VMessage('success', '顺序移动成功', 1000)
            this._getFileData()
          }
        })
      },

       /** 
        * 获取所有分类的数据
       */
       _getFileData: function(){
          var that = this
          requestGetTypeList({'type': 1}).then(function(res){
            if(res.code === 200){
              // 设置数据
              that.itemList = res.data['categoryList']
              // 获取ID的数组
              let idArr = res.data['categoryList'].map(item => {
                return item.categoryId
              })
              that.idsArr = idArr
            }
          })
       }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">  
  .w300{
    // width:300px
    width:25%
  }
  .w100{
    width:25%
  }
  .w200{
    width:25%
  }
  .pl10{
    padding-left 10px
  }
  .pr10{
    padding-right 10px
  }
  .ellipsis{
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
  }
  .pointClass{
    cursor: pointer;
  }
  .disabledClass{
    cursor: auto;
    color: #ddd !important
  }
  .line-solid{
    position:absolute
    top:40px
    left:0px
    height 1px
    width 100%
    background-color #ddd
  }
  .classify-file-manage
    width 100%
    .classify-manage
      position relative
      width 100%
      height 100%
      padding 20px
      border-radius 5px
      background-color #fff
      -webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2), inset 0px 1px 2.55px 0.45px rgba(169,159,136,0.65);
      box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2), inset 0px 1px 2.55px 0.45px rgba(169,159,136,0.65)
      .table-header
        font-size 16px
        height 36px
        line-height 20px
        border-bottom 1px solid #E0CFBA
        margin 10px 10px 0
        color #99601C
      .table-box
        position absolute
        left 30px
        right 0px
        bottom 20px
        top 130px
        overflow-y auto
        .table-li
          height 34px
          line-height 34px
          font-size 14px
          color #99601c
          &:hover
            background rgba(117,199,59,.15)
</style>
