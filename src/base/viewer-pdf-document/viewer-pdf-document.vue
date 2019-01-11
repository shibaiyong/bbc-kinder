/*
 * @Desc: pdf全屏预览组件
 */
<template>
  <div 
    class="viewer-pdf-document" 
    ref="viewerPdfDocument" 
    v-if="visible">
    <!-- S 文档 -->
    <!-- <embed 
      type="application/pdf" 
      width="100%" 
      height="100%" 
      :src="preparePlanUrl">
    </embed>  -->
    <pdfshower 
      :pdfurl="preparePlanUrl" 
      :scale="scaleValue" 
      @onErr="onErr">
    </pdfshower>
    <!-- E 文档 -->

    <!-- 按钮 -->
    <page-switch
      v-if="visible"
      :exitVisible="true"
      :documentBelong="false"
      :rightValue="50"
      :bottomValue ="60"
      @goExit="_goExit"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import pdfshower from 'vue-pdf-shower'
  import PageSwitch from 'component/page-switch'

  import { enterFullScreen, exitFullScreen, isFullscreen } from 'lib/util'

  export default {
    name: 'ViewerPdfDocument',
    props: {
      // pdf链接
      preparePlanUrl: {
        type: String,
        required: true,
        default: 'http://192.168.0.158/show/1816/tb/tb.pdf'
      },
    },
    components: {
      pdfshower,
      PageSwitch
    },
    data: function() {
      return {
        // 控制组件显示状态
        visible: false,
        scaleValue: 1
      }
    },
    methods: {
      /**
       * 显示组件
       */
      _show: function() {
        // console.error('enterfullscreen')
        this.visible = true
        this.$nextTick( () => {
          // 当前不是全屏才通过requestFullScreen开启全屏
          !isFullscreen() && enterFullScreen(this.$refs.viewerPdfDocument)
          // 绑定事件 
          this._bindEvent()
          this._setCss()
        })
      },

      /**
       * 隐藏组件
       */
      _hide: function() {
        // console.error('exitfullscreen')
        // 退出全屏、解绑事件
        exitFullScreen()
        this._removeEvent()
        this.visible = false
      },

      /**
       * 绑定keydown、resize事件
       */
      _bindEvent: function() {
        window.addEventListener('resize', this._resizeEvent)
      },

      /**
       * 解绑keydown、resize事件
       */
      _removeEvent: function() {
        window.removeEventListener('resize', this._resizeEvent)
      },

      /**
       * resize事件（通过requestFullScreen开启的全屏，按esc默认退出全屏，会触发resize事件）
       */
      _resizeEvent: function() {
        // 当前不是全屏，才隐藏组件
        if (!isFullscreen()) {
          this._hide()
        } 
        this._setCss()
      },

      // 加载失败的callback
      onErr(err) {
        console.log('错误信息：', err)
      },

      /** 
       * js设置样式
      */
      _setCss: function() {
        let widthValue = screen.availWidth
        let heightValue = screen.availHeight
        // 设置样式
        let ele = document.getElementById('cvsWraper')
        // 设置定时器，保证渲染之后成功操作
        setTimeout( () => {
          let canvas =  Array.prototype.slice.call(ele.getElementsByClassName('canvas-item'))
          canvas.map(item => {
            item.style.display = 'block'
          }) 
          ele.style.width = widthValue + 'px'
          ele.style.height = heightValue + 'px'
        }, 300)
      },

      /** 
       * 退出全屏
      */
      _goExit: function() {
        this._hide()
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-pdf-document
    position fixed
    top 0 
    right 0
    bottom 0
    left 0
    z-index 999
    background #000000
</style>