/*
 * @Desc: 备课云盘文件列表
 */
<template>
  <div class="files">
    <!-- S 文件头 -->
    <div class="file-header">
      <Col span="1" class="vertical-center">
        <Checkbox 
          v-model="currentCheckAll"
          @on-change="$emit('checkAllChange', currentCheckAll)">
        </Checkbox>
      </Col>
      <Col span="12" class="vertical-center">
        <span class="clickable vertical-center">
          <span v-if="countFlag" style="margin-right:5px;">已选中{{countNum}}项</span>
          <span v-else style="margin-right:5px;">{{tableTitle}}</span> 
        </span>
      </Col>
      <Col span="4" v-if="belongDocument && noItemVisible">
        <span class="clickable vertical-center">
          <span style="margin-right:5px;">发布者</span> 
        </span>
      </Col>
      <Col span="6" v-if="belongDocument && noItemVisible">
        <span class="clickable vertical-center">
          <span style="margin-right:5px;">发布时间</span> 
        </span>
      </Col>
    </div>
    <!-- E 文件头 -->

    <!-- S 文件列表 -->
    <div class="file-list" >
      <ul v-if="fileList.length">
        <li class="file-item" v-for="(file, index) in fileList" :key="index" @mouseleave.stop="_hideUl($event)">
          <Col span="1" class="vertical-center">
            <Checkbox v-model="file.checked" @on-change="$emit('fileSelectChange', file)"></Checkbox>
          </Col>
          <Col span="12" class="vertical-center file-name">
            <span 
              class="name no-wrap"
              :class="{'clickable': belongClass != 'recycle'}" 
              :title="file.title" 
              :style="{width: noItemVisible ? '200px': '300px'}" 
              @click.stop="_previewClick(file)"> 
              {{ file.title }}
            </span>
            <!-- 编辑 -->
            <Icon 
              type="compose" 
              class="clickable btns-icon" 
              :size="16" 
              title="编辑"
              v-if="iconButtonFlag.edit" 
              @click.native.stop="_editClick(file)">
            </Icon>
            <!-- 下载 -->
            <v-icon
              v-if="iconButtonFlag.download"  
              size="13" 
              class="clickable btns-icon" 
              type="icon-download"
              @click.stop.native="_fileDownloadEvent(file)" 
              title="下载"/>
            <!-- 打印 -->
            <Icon
              v-if="iconButtonFlag.print" 
              type="printer" 
              class="clickable btns-icon" 
              :size="16"
              @click.stop.native="_filePrintEvent(file)"   
              title="打印">
            </Icon>
            <!-- 还原 -->
            <Icon
              v-if="iconButtonFlag.reply" 
              type="reply-all" 
              class="clickable btns-icon" 
              :size="16"
              @click.stop.native="_fileReplyEvent(file)"  
              title="还原">
            </Icon>
            <!-- 粉碎 -->
            <v-icon 
              v-if="iconButtonFlag.delete" 
              size="14" 
              type="icon-remove" 
              class="clickable btns-icon"
              @click.stop.native="_fileSmashEvent(file)" 
              title="粉碎"/>
            <!-- 更多 -->
            <div
              v-if="iconButtonFlag.more"
              class="more-box" 
              style="position: relative;margin-right: 20px">
              <Icon 
                type="more"  
                class="clickable btns-icon" 
                :size="16" 
                title="更多" 
                @click.stop.native="_moreBtnClick(file, $event)"></Icon>
              <ul class="more-ul">
                <li v-if="liVisible.move" class="more-li clickable" @click.stop="_fileMoveEvent(file)">移动到</li>
                <li v-if="liVisible.copy" class="more-li clickable" @click.stop="_fileCopyEvent(file)">复制到</li>
                <li v-if="liVisible.delete" class="more-li clickable" @click.stop="_fileDeleteEvent(file)">删除</li>
              </ul>
            </div>
          </Col>
          <Col span="4" class="file-auth" v-if="noItemVisible">
            <span class="no-wrap auth">{{ file.author }}</span>
          </Col>
          <Col span="6" class="file-time" v-if="noItemVisible">
            <span class="no-wrap time">{{ file.createdTime | unixTimestampToYearString }} &nbsp; {{ file.createdTime | unixTimestampToTimeString }}</span>
          </Col>
        </li>
      </ul>
      <ul v-else style="text-align: center">
        暂无数据
      </ul>
    </div>
    <!-- E 文件列表 -->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'FileList',
    props: {
      noItemVisible: {
        type: Boolean,
        default: true
      },
      // 表格title
      tableTitle: {
        type: String,
        required: true
      },
      // 文件列表
      fileList: {
        type: Array
      },
      // 全选
      checkAll: {
        type: Boolean,
        default: false,
        required: true,
      },
      // 所属页面,
      belongDocument: {
        type: Boolean,
        default: true
      },
      // 选中文件个数
      countFlag: {
        type: Boolean,
        default: false
      },
      countNum: {
        type: Number,
        default: 0
      },
      // 传递的类别
      belongClass: {
        type: String,
        default: ''
      },
      // 当前的文档类别
      categoryId: {
        type: [Number, String],
        required: true
      }
    },
    data: function() {
      return {
        currentCheckAll: this.checkAll,
        // li内容的显示
        liVisible: {
          move: false,
          copy: false,
          delete: false
        },
        // 图标按钮
        iconButtonFlag: {
          edit: true,
          download: true,
          delete: true,
          print: true,
          reply: true,
          more: true
        }
      }
    },  
    watch: {
      checkAll: function(newValue) {
        this.currentCheckAll = newValue
      },
      belongClass: function(newValue) {
        let type = newValue
        switch (type) {
          case 'document':
            this.iconButtonFlag = {
              edit: true,
              download: true,
              delete: false,
              print: true,
              reply: false,
              more: true
            }
            this.liVisible = {
              move: true,
              copy: true,
              delete: true
            }
            break
          case 'draft':
            this.iconButtonFlag = {
              edit: true,
              download: true,
              delete: false,
              print: true,
              reply: false,
              more: true
            }
            this.liVisible = {
              move: false,
              copy: false,
              delete: true
            }
            break
          case 'recycle':
            this.iconButtonFlag = {
              edit: false,
              download: false,
              delete: true,
              print: false,
              reply: true,
              more: false
            }
            this.liVisible = {
              move: false,
              copy: false,
              delete: false
            }
            break
          default: 
            this.iconButtonFlag = {
              edit: true,
              download: true,
              delete: false,
              print: false,
              reply: false,
              more: true
            }
            this.liVisible = {
              move: true,
              copy: true,
              delete: true
            }     
        }
      }
    },
    methods: {
      /** 
       * 更多按钮点击,显示更多的操作
      */
      _moreBtnClick: function(item, event) {
        let UlElement = event.target.parentNode.querySelector(".more-ul")
        if (UlElement) {
          UlElement.style.display = UlElement.style.display == 'block' ? 'none' : 'block'
        }
      },

      /** 
       * 隐藏UL
      */
      _hideUl: function(event) {
        if (event.target.querySelector(".more-ul")) {
          event.target.querySelector(".more-ul").style.display = 'none'
        }
      },

      /** 
       * 文件被选中跳转的预览页面
       * @param {Object} file 对象数据
      */
      _previewClick: function(file) {
        if (this.belongClass !== 'recycle') {
          if (file.fileId) { 
            window.open(window.location.origin + `/#/previewer?source=file&fileid=${file.fileId}&categoryid=${this.categoryId}`)
          }
          if (file.templateId) {
            window.open(window.location.origin + `/#/previewer?source=template&templateid=${file.templateId}&categoryid=${this.categoryId}`)
          }
        }
      },

      /** 
       * 文件跳转到编辑页面
      */
      _editClick: function(file) {
        if (this.belongClass !== 'recycle') {
          if (file.fileId) {
            window.open(window.location.origin + `/#/editor?source=file&fileid=${file.fileId}&categoryid=${this.categoryId}`)
          }
          if (file.templateId) {
            window.open(window.location.origin + `/#/editor?source=template&templateid=${file.templateId}&categoryid=${this.categoryId}`)
          }
        }
      },

      /** 
       * 单个文件被选中
      */
      _fileSelected: function(file) {
        // 改变状态
        file.checked = true
        this.$emit('singleFileSelectChange', file)
      },

      /** 
       * 单个文件打印点击
      */
      _filePrintEvent: function(file) {
        this._fileSelected(file)
        this.$emit('printEmit', file)
      },

      /** 
       * 单个文件的粉碎点击
      */
      _fileSmashEvent: function(file) {
        this._fileSelected(file)
        this.$emit('smashEmit', file)
      },

      /** 
       * 单个文件的还原点击
      */
      _fileReplyEvent: function(file) {
        this._fileSelected(file)
        this.$emit('replyEmit', file)
      },

      /** 
       * 单个文件的下载点击
      */
      _fileDownloadEvent: function(file) {
        this._fileSelected(file)
        this.$emit('downloadEmit', file)
      },

      /** 
       * 单个文件的移动点击
      */
      _fileMoveEvent: function(file) {
        this._fileSelected(file)
        this.$emit('moveEmit', file)
      },

      /** 
       * 单个文件的复制点击
      */
      _fileCopyEvent: function(file) {
        this._fileSelected(file)
        this.$emit('copyEmit', file)
      },

      /** 
       * 单个文件的删除点击
      */
      _fileDeleteEvent: function(file) {
        this._fileSelected(file)
        this.$emit('deleteEmit', file)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .files
    padding-top 30px
    /* 头部 */
    .file-header
      height 42px
      line-height 30px
      margin 0 26px
      border-bottom 1px solid #E0CFBA
      color #99601c
    /* 列表 */
    .file-list
      position absolute
      top 126px
      right 20px
      bottom 0
      left 20px
      overflow-y auto
      padding-bottom 20px
      .file-item
        height 40px
        line-height 40px
        padding 0 26px
        &:hover
          background-color rgba(117,199,59,.15)
        .file-name .name 
          padding-right 20px
          color #99601c
          width 200px
        .file-name
          .btns-icon
            display none
            margin 5px 8px 5px
            color #75C73B
        .file-name
          &:hover .btns-icon
            display inline-block
        .file-name
          .more-ul
            display none
            position absolute
            top 20px
            left 30px
            width 60px
            background white
            padding 5px
            z-index 99
            border 1px solid #99601c
            .more-li          
              height 25px
              line-height 25px
              text-align center
              font-size 12px
              color #99601c
        .file-auth .auth
          color #99601c 
        .file-time .time
          color #99601c 
</style>

