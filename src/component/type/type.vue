/** 
 * @Desc: 分类
 */
<template>
  <div class="type-list fill-width">
    <!-- 列表展示 -->
    <section class="type-data">
      <li 
        class="type-li clickable"
        :class="{'active-li': activeId === Number(index)}" 
        v-for="(typeItem, index) in typeList"
        :key="index"
        @click.stop="_typeItemClick(typeItem, index)">
        <span class="type-circle"></span>
        <span class="type-text no-wrap">{{typeItem.title}}</span>
        <span class="type-num">({{typeItem.fileCount}})</span>
      </li>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil } from 'lib/util'

  export default {
    props: {
      typeList: {
        type: Array
      }
    },
    data: function() {
      return {
        activeId: null
      }
    },
    watch: {
      typeList: {
        handler(newValue) {
          newValue.length && this._getInitTypeData()
        },
        deep: true
      }
    },
    methods: {
      /** 
       * 获取初始化的分类数据,默认选中第一项
      */
      _getInitTypeData: function() {
        if (this.typeList.length) {
          let activeId = +sessionStorageUtil.get('active_type_index')
          this.activeId = activeId ? activeId : 0
          let item = this.typeList[activeId] ? this.typeList[activeId] : this.typeList[0]
          this.$emit('typeChange', item)
        }
      },

      /** 
       * 列表项点击
       * @param {Object} item: 当前项的数据对象
      */
      _typeItemClick: function(item, i) {
        sessionStorageUtil.set('active_type_index', Number(i))
        this.activeId = Number(i)
        this.$emit('typeChange', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .type-list
    position relative
    height 100%
    .type-data
      position absolute
      top 0px
      left 0
      right 0
      bottom 15px
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
        &:last-child
          border-top 1px solid
        &:nth-last-child(2)
          border-top 1px solid
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
</style>
