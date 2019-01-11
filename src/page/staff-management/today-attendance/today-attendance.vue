/** 
 * @Desc: 今日考勤
 */

<template>
  <div class="today-attendance">
    <!-- 日历区域 -->
    <DatePicker 
      type="date" 
      placeholder="请选择时间"
      :options="todayAttendanceOptions"
      :clearable="false"
      format="yyyy-MM-dd"
      @on-change="_dateChange" 
      :value="dateModel"
      style="width: 220px">
    </DatePicker>

    <!-- 表格 -->
    <div class="data-box">
      <!-- 头部 -->
      <div class="data-header clear-float">
        <section class="data-name w220 pl10 float-left">姓名</section>
        <section class="data-attendance w620 pl20 float-left">考勤</section>
      </div>

      <!-- 数据盒子 -->
      <div class="data-container">
        <li class="data-list clear-float" v-for="(attendance, index) in attendanceDatas" :key="index">
          <section class="w220 pl10 float-left no-wrap">{{attendance.employeeName}}</section>
          <section class="w620 pl20 float-left data-status vertical-center">
            <span 
              class="clickable" 
              :class="{'active-span green': Number(attendance.leaveType) === 1}"
              @click.stop="_changeStatus(attendance, 1)">出勤
            </span>
            <span 
              class="clickable" 
              :class="{'active-span pink': Number(attendance.leaveType) === 2}" 
              @click.stop="_changeStatus(attendance, 2)">缺勤
            </span>
            <span 
              class="clickable" 
              :class="{'active-span orange': Number(attendance.leaveType) === 3}" 
              @click.stop="_changeStatus(attendance, 3)">病假
            </span>
            <span 
              class="clickable" 
              :class="{'active-span blue': Number(attendance.leaveType) === 4}" 
              @click.stop="_changeStatus(attendance, 4)">事假
            </span>
            <span 
              class="clickable" 
              :class="{'active-span': Number(attendance.leaveType) === 5}" 
              @click.stop="_changeStatus(attendance, 5)">休息
            </span>
          </section>
        </li>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import moment from 'moment'
  // 接口
  import { _getHandle, requestChangeStatus } from 'api/staff'

  export default {
    name: 'today-attendance',
    data: function() {
      return {
        dateModel: moment(new Date()).format('YYYY-MM-DD'),
        todayAttendanceOptions: {
          disabledDate (date) {
            return date.getTime() > (Date.now())
          }
        },
        // 职工状态数据
        attendanceDatas: []
      }
    },
    mounted: function() {
      this._getData(this.dateModel)
    },
    methods: {
      /** 
       * 获取对应时间的数据
      */
      _getData: function(date) {
        return _getHandle('api/v2/getTodayAttendance?date=' + date, null).then(response => {
          if (response.code === 200 && response.data) {
            this.attendanceDatas = []
            this.attendanceDatas = response.data
          }
        })
      },

      /** 
       * 日历改变
      */
      _dateChange: function(value) {
        this.dateModel = value
        this._getData(this.dateModel)
      },

      /** 
       * 改变职工状态的点击事件
       * @param {Object} item: 当前的数据对象
       * @param {Number} id: 当前状态的ID
      */
      _changeStatus: function(item, id) {
        const now = this.dateModel
        // 前端修改状态
        item['leaveType'] = Number(id)
        // api
        item.date = this.dateModel
        requestChangeStatus(item).then(response => {
          if (response.code === 200 && response.data) {
            console.log("OK")
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .today-attendance
    position relative
    height 100%
    padding 24px 2%
    .data-box
      position absolute
      bottom 10px
      left 2%
      right 2%
      top 65px
      padding-top 10px
      /* 数据头部 */
      .data-header
        height 44px
        line-height 35px
        text-align left
        // padding-left 40px
        border-bottom 1px solid #E0CFBA
        color #99601c
        font-size 18px 
      /* 数据容器 */
      .data-container
        position absolute
        top 60px
        left 0
        right 0
        bottom 0
        overflow-y auto
        .data-list
          list-style none
          height 40px
          line-height 40px
          // padding-left 40px
          font-size 14px
          color #99601c
          &:hover
            background rgba(117,199,59,.15)
          .data-status
            height 40px
            line-height 40px
            span
              width 60px
              height 30px
              line-height 30px
              border-radius 10px
              font-size 12px
              text-align center
              // background-color #999999
              // color white
              margin-right 10px
              &:hover
                // background #99601c   
            .active-span
              // background #99601c
            .green
              color #75C73B
              border 1px solid #75C73B
            .pink
              color #F84B62
              border 1px solid #F84B62
            .orange
              color #FF9902
              border 1px solid #FF9902
            .blue
              color #5494EA
              border 1px solid #5494EA
            // .grey
            //   color #ccc    

    .data-box
      .w220
        width 40%
      .w620
        width 56%
      .pl10
        // padding-left 10px
      .pl20
        // padding-left 20px                
</style>
