/** 
 * @Desc: 一级导航
 */
<template>
  <li class="sub-nav">
    <div 
      class="content"
      @mouseover="mouseoverEvent" 
      @mouseout="mouseoutEvent">
      <div 
        class="title clickable hover-light"
        @click="_subNavClick" :style="clickFlag?'':'opacity: 0.7;'">
        {{ title }}
      </div>
      <div v-if="edit">
        <!-- S 下拉菜单 -->
        <Dropdown trigger="click" class="edit-dropdown">
          <v-icon 
            v-show="editVisible"
            class="edit-button clickable hover-light" 
            type="icon-edit" 
            size="16">
          </v-icon>
          <DropdownMenu slot="list">
            <DropdownItem @click.native.stop="$emit('addClass')">添加班级</DropdownItem>
            <DropdownItem @click.native.stop="$emit('editGrade')">修改年级信息</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!-- E 下拉菜单 -->
      </div>
    </div>
    <transition name="fold">
      <ul v-show="isOpen" ref="navItems" class="nav-items">
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VSubNav',
    props: {
      title: {
        type: String
      },
      open: {
        type: Boolean,
        default: false
      },
      edit: {
        type: Boolean,
        default: false
      },
      clickFlag: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        editVisible: false,
        isOpen: this.open,
        dropdownVisible: false,
      }
    },
    watch: {
      open: function(value) {
        this.isOpen = value
      }
    },
    methods: {
      /**
       * 一级菜单点击事件，关闭所有一级菜单，取反当前项
       */
      _subNavClick: function() {
        // alert('触发')
        if (this.$refs.navItems.children.length) {
          // 关闭其他
          for (let subNav of this.$parent.$children) {
            if (this._uid !== subNav._uid) {
              subNav.isOpen = false
            } 
          }
          // 改变自己
          this.isOpen = !this.isOpen
        }
      },

      mouseoverEvent: function() {
        this.editVisible = true
      },

      mouseoutEvent: function() {
        this.editVisible = false
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fold-transition
    transition height 2s ease
  .fold-enter, .fold-leave
    height 0
  .sub-nav
    width 204px
    line-height 70px
    font-size 23px
    margin-bottom 15px
    text-align center
    background url('./img/sub-menu-bg.png') no-repeat
    .content
      position relative
      .title
        transform matrix( 1.05427974947808,0,0,1.04599770829923,0,0)
        text-shadow 0px 1px 0px rgba(255, 229, 189, 0.004),0px 1px 1.6px rgba(121, 62, 15, 0.95)
        width 72%
        margin 0 auto
      .edit-dropdown
        position absolute
        top 55px
        right 20px
        .edit-button
          position absolute
          top -27px
          right 0px
</style>

