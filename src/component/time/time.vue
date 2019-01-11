/** 
 * @Desc: 时间
 */
<template>
  <div class="time-list fill-width">
    <!-- 有数据 -->
    <section class="time-data" v-if="timeList.length">
      <div class="time-data-list" v-for="(timeItem, index) in timeList" :key="index">
        <div class="data-list-title clickable" @click.stop="_yearItemClick(timeItem)">
          <span class="data-circle"></span>
          <span class="data-text">{{timeItem.year + '年'}}</span>
          <span class="data-arrow">
            <Icon type="arrow-up-b" v-show="activeYearIndex === Number(timeItem.year)"></Icon>
            <Icon type="arrow-down-b" v-show="activeYearIndex !== Number(timeItem.year)"></Icon>
          </span>  
        </div>
        <ul
          v-if="timeItem.child.length" 
          class="data-list-data"
          :class="{'data-list-show': activeYearIndex === Number(timeItem.year)}">
          <li 
            class="data-li clickable" 
            v-for="(item, index) in timeItem.child" 
            :key="index"
            :class="{'active-li': activeliIndex === item.month}" 
            @click.stop="_monthItemClick(item)">
            <span class="data-li-text no-wrap">{{item.month + '月'}}</span>
            <span class="data-li-num">({{item.num}})</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 无数据 -->
    <section v-else class="time-data">
      <p class="center time-data-p">
        还没有文档，
        <span class="clickable" @click.stop="$router.push({path:'/editor',query:{source:'file'}})">前去创建</span>
      </p> 
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      timeList: {
        type: Array
      }
    },
    data: function() {
      return {
        activeYearIndex: 0,
        activeliIndex: '',
        iconType: 'arrow-up-b'
      }
    },
    mounted: function() {
      this._getInitData()
    },
    methods: {
      /** 
       * 获取初始化数据
      */
      _getInitData: function() {
        if(this.timeList.length) {
          this.activeYearIndex = Number(this.timeList[0]['year'])
          // 如果有第一项数据
          if (this.timeList[0].child && this.timeList[0].child[0]) {
            this._monthItemClick(this.timeList[0].child[0])
          }
        }
      },

      /** 
       * 年数据点击
       * @param {Object} item: 点击的对象数据
      */
      _yearItemClick: function(item) {
        this.activeYearIndex = Number(item.year)
        this.activeliIndex = ''
      },

      /** 
       * 月份点击
       * @param {String} id: 点击项对应的Id
      */
      _monthItemClick: function(timeItem) {
        let item = {
          year: Number(this.activeYearIndex),
          mon: timeItem.month,
          type: 'time'
        }
        this.activeliIndex = timeItem.month
        this.$emit('monthChange', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .time-list
    position relative
    height 100%
    .time-data
      position absolute
      top 0
      left 0
      right 0
      bottom 15px
      padding 5px 0px
      overflow-y auto
      font-size 14px
      .time-data-p
        top 20%
        width 100%
        text-align center 
      .time-data-list
        .data-list-title
          display flex
          justify-content center
          align-items center
          height 40px
          line-height 40px
          // padding-left 10px
          // padding 0 13%
          color #99601c
          font-size 16px
          .data-circle
            // display inline-block
            display none
            width 5px
            height 5px
            margin-right 5px
            border-radius 50%
            background #99601c
          .data-arrow
            margin-left 5px  
        .data-list-data
          display none
          // padding-left 10px
          color #99601c
          font-size 13px
          .active-li
            background rgba(117,199,59,.15)
          .data-li
            display flex
            justify-content center
            align-items center
            height 30px
            line-height 30px
            text-align center
            &:hover
              background rgba(117,199,59,.15)
          .data-li    
            .data-li-text, .data-li-num
              min-width 30px
        .data-list-show
          display block         
</style>
