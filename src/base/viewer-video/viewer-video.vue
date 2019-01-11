/*
 * @Desc: 视频全屏预览组件
 */
<template>
  <div class="viewer-video mask" v-show="visible">
    <div class="viewer-video-wrapper center" ref="wrapper">
      <close-button 
        size="36"
        class="viewer-video-close"
        :isAttend="belongAttend" 
        @click.native="_closeVideo">
      </close-button>
      <!-- h5容器 -->
      <div style="width:100%;height:100%;" ref="playerWrapper"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CloseButton from 'base/close-button'
  import cookie from 'js-cookie'

  export default {
    name: 'ViewerVideo',
    components: {
      CloseButton
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      },
      videoObj: {
        type: Object
      },
      videoId: {
        type: [String, Number]
      },
      videoCover: {
        type: String
      },
      nofullscreenFlag: {
        type: Boolean,
        default: false
      },
      belongAttend: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        videoFullscreen: false,
        hfiveObj: {}
      }
    },
    watch: {
      videoUrl: function(oldValue, newValue) {
        if (newValue !== 'undefined' || oldValue !== 'undefined') {
          // 将视频区分格式进行操作(mp4和vs4分开)
          if( newValue.indexOf('http') === 0 ) {
            let videoEle = '<video src="' + this.videoUrl + '" width="100%" height="100%" controls="controls"/>'
            this.$refs.playerWrapper.innerHTML = videoEle
          } else {
            this.$refs.playerWrapper.innerHTML = '<video id="videoEle" class="fill"></video>'
            // DOM改变
            this.$nextTick( () => {
              if (window.Module.isSupportViewBoxPlayer()) {
                var subtitleObj = {
                  "en": this.enValue,
                  "zh": this.zhValue,
                  "en&zh-cn": this.enAndzhValue
                }
                var temp = {}
                temp.subtitle = subtitleObj
                temp.wrap = document.getElementById("videoEle")
                if ( this.videoUrl.indexOf('.vs4') === -1 ) {
                  let videoPath = this.videoUrl.slice(this.videoUrl.lastIndexOf('/')) + '.vs4'
                  let fileUrl = encodeURI(videoPath)
                  temp.videouri = `/resourceAuthentication/${this.videoId}${fileUrl}`
                } else {
                  let fileUrl = encodeURI(this.videoUrl.slice(this.videoUrl.lastIndexOf('/')))
                  temp.videouri = `/resourceAuthentication/${this.videoId}${fileUrl}`
                }
                temp.videoposter = `/${this.videoCover}`
                temp.t = 'bearer ' + this._getToken()
                temp.nofullscreen = this.nofullscreenFlag
                // console.log('H5temp:', temp)
                // 给视频对象进行配置
                let ss = window.Module.createViewBoxPlayer(temp)  
                this.hfiveObj = ss 
              } 
            })
          }
        } else {
          this.hfiveObj.stop()
        }
      },
      visible: function(newValue) {
        if (newValue) {
          let that = this
          that.$nextTick( () => {
            that._setDomStyle()
            // 设置一个定时，保证在视频数据加载之后在调用play方法（确保教师端我的收藏和素材库视频显示）
            setTimeout( () => {
              that.hfiveObj.play && that.hfiveObj.play()
            }, 500)
          })
        } 
      }
    },
    methods: {
      /** 
       * 设置DOM
      */
      _setDomStyle: function() {
        if (this.belongAttend) {
          let closeEle = document.querySelector('.viewer-video-close')
          let voiceBtn = document.querySelector('#viewshareplayervolume')
          let fullBtn = document.querySelector('#viewshareplayerflsn')
          this.$refs.wrapper.style.width = screen.width + 'px'
          this.$refs.wrapper.style.height = screen.height + 'px'
          closeEle.style.top = '25px'
          closeEle.style.right = 0
          closeEle.style.zIndex = 9
          fullBtn.style.display = 'none'
          voiceBtn.style.right = '20px'
          voiceBtn.addEventListener('click', this._setVoiceBarCSS)
        }
      },

      /** 
       * 设置音量的样式
      */
      _setVoiceBarCSS: function() {
        this.$nextTick(() => {
          let voiceBar = document.querySelector('#viewshareplayervolumebar')
          voiceBar.style.right = '20px'
        })
      },

      /**
       * 隐藏播放器
       */
      _closeVideo: function() {
        this.$emit('update:visible', false)
        this.hfiveObj.stop && this.hfiveObj.stop()
        this.hfiveObj = {}
        this.videoFullscreen = false
        this.$refs.wrapper.style.width = '1067px'
        this.$refs.wrapper.style.height = '600px'
      },

      /**
       * 实时获取token
       */
      _getToken: function() {
        let token = cookie.get('ktoken') ? cookie.get('ktoken') : '' 
        if (token) {
          return token
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-video
    .viewer-video-wrapper
      width 1067px
      height 600px
      background black
      .viewer-video-close
        position absolute
        top -40px
        right -50px
      .full-screen
        position absolute
        right -1px
        bottom -6px

  @media screen and (max-width 1600px) 
    .viewer-video
      .viewer-video-wrapper
        .viewer-video-close
          top -10px
          right -60px
</style>

