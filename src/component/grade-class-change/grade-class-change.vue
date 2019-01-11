/** 
 * @Desc: 年级班级数据联动
 */
<template>
  <div class="change-box fill-width clickable" :class="{'box-clicked': visibleFlag}" @click.stop="_divBoxClick">
    <!-- 箭头 -->
    <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow change-icon"></i>
    <!-- placeholder文字 -->
    <span class="change-placeholder" v-if="innerFlag">请选择班级</span>
    <!-- 被选中的内容展示区域 -->
    <div class="selected-box" v-if="!innerFlag" ref="selectedBox">
      <span 
        class="selected-span" 
        v-for="(item, index) in selectedList" 
        :key="index"
        @click.stop>
        {{item.className}}
        <Icon type="close" :size="12" class="selected-span-icon" @click.stop.native="_removeSelectedItem(item, index)"></Icon>
      </span>
    </div>
    <!-- 操作面板 -->
    <div class="change-data-box" v-show="visibleFlag" ref="dataBox" :style="{'top': topValue + 'px'}">
      <dl class="clear-float data-dl" v-for="(item, index) in gradeLists" :key="index">
        <dt class="float-left data-dt no-wrap" @click.stop>{{item.gradeName}}</dt>
        <dd class="float-left data-dd">
          <span 
            v-for="(classItem, index) in item.classes" 
            :key="index" 
            class="data-span"
            :data-id="classItem.classId"
            :data-text="classItem.className"
            :title="classItem.classId" 
            @click.stop="_selectActiveClass($event, classItem)">{{classItem.className}}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      hasSelectedList: {
        type: Array,
        // 对象或数组且一定会从一个工厂函数返回默认值
        default: function () {
          return []
        }
      }
    },
    data: function() {
      return {
        // 内容的top值
        topValue: 40,
        // 选项内容旗帜
        visibleFlag: false,
        // div内部的显示内容旗帜,默认显示placeholder
        innerFlag: true,
        gradeLists: this.$store.state.gradeList,
        // 被选中的数据集合
        selectedList: []
      }
    },
    watch: {
      // 监听自己组件操作中的被选中的值，传递给父组件进行form提交
      'selectedList': {
        handler: function(newValue, oldValue) {
          this.innerFlag = Number(newValue.length) === 0
          this.$emit('_emitSelectedData', newValue)
        },
        deep: true
      },

      // 监听传递过来的已经选中的值
      'hasSelectedList': {
        handler:function(newValue,oldValue) {
          this._setHasClassData(newValue)
        },
        deep: true
      }
    },
    mounted: function() {
      document.addEventListener('click', this._bodyClick)
    },
    methods: {
      /** 
       * 组件初始化操作
      */
      _initEvent: function() {
        this.visibleFlag = false
        this.innerFlag = true
        this.selectedList = []
        let spanAll = Array.from(new Set(document.querySelectorAll('span.active-span')))
        spanAll.map( spanItem => {
          spanItem.className = "data-span"   
        })
      },

       /** 
       * 文档对象绑定点击事件,点击关闭下拉菜单
      */
      _bodyClick: function() {
        this.visibleFlag = false
      },

      /** 
       * div点击事件,显示下拉数据内容
      */
      _divBoxClick: function () {
        this.visibleFlag = !this.visibleFlag
      },

      /** 
       * 班级项选中
       * @param {Object} item: 当前点击的数据对象
       * @param {Object} event: 当前点击的事件对象
      */
      _selectActiveClass: function(event, item) {
        let className = event.target.className
        // 根据当前点击的类名进行操作
        // 当前点击的是已经点击过的
        if (className === 'active-span') {
          event.target.className = 'data-span'
          // 数组filter操作
          this.selectedList = this.selectedList.filter( listItem => {
            return (listItem.className !== item.className)
          })
        } else {
          event.target.className = 'active-span'
          this.selectedList.push(item)
        }
        // 数组去重
        Array.from(new Set(this.selectedList))
        // 设置div内容显示
        this.innerFlag = false
        // 获取放置显示数据的容器的高度和计算内容容器的top值
        this._setTopValue()
      },

      /** 
       * 删除选中的元素事件
      */
      _removeSelectedItem: function(item, i) {
        // 删除元素的操作
        this.selectedList.splice(i, 1)
        // 遍历span元素，将当前的要删除的元素干掉点击状态样式
        let spanAll = Array.from(new Set(document.querySelectorAll('span.active-span')))
        spanAll.map( spanItem => {
          if (Number(spanItem.getAttribute('data-id')) === item.classId && spanItem.getAttribute('data-text') === item.className) {
            spanItem.className = "data-span"
          }
        })
        // 获取放置显示数据的容器的高度和计算内容容器的top值
        this._setTopValue()
      },

      /** 
       * 设置top值的方法
      */
      _setTopValue: function() {
        this.$nextTick(()=>{  
          // 考虑元素是否存在了
          let heightValue = (this.$refs.selectedBox != undefined ? this.$refs.selectedBox.clientHeight : 33)
          this.topValue = +heightValue + 7
        }) 
      },

      /** 
       * 设置传递过来的职工班级和年级数据
       * @param {Array} arr: 传递的数组数值
      */
      _setHasClassData: function(arr) {
        arr.map( arrItem => {
          let spanAll = Array.from(new Set(document.querySelectorAll('span.data-span')))
          spanAll.map( spanItem => {
            if (Number(spanItem.getAttribute('data-id')) === arrItem.classId) {
              spanItem.click()
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  .box-clicked
    .change-icon
      transform rotate(180deg)
  .change-box
    position relative
    padding 0 !important
    border-radius 16px
    box-shadow 0 2px 1px 0 rgba(255,255,255,.004),inset 0 2px 1px 0 rgba(79,72,42,.23),inset 0 0 2px 0 rgba(79,72,42,.23)
    background-color #fff1db
    color #99601c
    height auto
    min-height 34px
    .change-icon
      position absolute
      top 18px !important
      right 10px !important
      z-index 999
    .selected-box
      padding-right 20px
      .selected-span
        position relative
        display inline-block
        margin 0 4px
        padding 0 18px 0 5px
        height 20px
        line-height 20px
        border-radius 30px
        font-size 12px
        background-color #36a16f
        color white
        .selected-span-icon
          position absolute
          right 6px 
          top 4px  
    .change-placeholder
      position absolute
      left 16px
      height 34px
      color #bbbec4
    .change-data-box
      position absolute
      left 0
      width 320px
      padding 10px
      z-index 99
      background-color #fff
      color #99601c
      border-radius 10px
      box-shadow 0 1px 6px 0 #bbb
      .data-dl
        line-height 2
        font-size 14px
        margin 5px 0
        .data-dt
          width 50px
          text-align center
          cursor auto
          color #c77412
        .data-dd
          width 240px
          .data-span
            &:hover
              background-color #36a16f
              color white
          .active-span
            background-color #36a16f
            color white
          span
            display inline-block
            min-width 50px
            margin 2px 5px
            padding 0 5px
            text-align center
            border-radius 30px
</style>
