/** 
 * @Desc: 月度报表
 */
 
<template>
  <div class="month-report">
    <!-- 日历区域 -->
    <DatePicker 
      type="month" 
      placeholder="Select date"
      :options="todayAttendanceOptions"
      :clearable="false"
      format="yyyy-MM"
      @on-change="_dateChange" 
      :value="dateModel"
      style="width: 220px">
    </DatePicker>

    <!-- 数据区域-->
    <div class="month-data">
      <!-- 数据头部-->
      <div class="data-header">
        <Row>
          <Col span="4" style="width: 14.5%;">姓名</Col>
          <Col span="4">应出勤(天)</Col>
          <Col span="4">实际出勤(天)</Col>
          <Col span="3">缺勤(天)</Col>
          <Col span="3">病假(天)</Col>
          <Col span="3">事假(天)</Col>
          <Col span="3">休息(天)</Col>
        </Row>
      </div>
      <!-- 数据 -->
      <div class="data-container">
        <li class="data-list clear-float" v-for="(item, index) in attendanceDatas" :key="index">
          <Row>
            <Col span="4" class="clickable list-item no-wrap" @click.native.stop="_showAttendanceCalendar(item)">{{item.employeeName}}</Col>
            <Col span="4" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.attendanceShould}}</Col>
            <Col span="4" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.attendancePractical}}</Col>
            <Col span="3" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.absenteeism}}</Col>
            <Col span="3" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.diseaseLeave}}</Col>
            <Col span="3" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.personalLeave}}</Col>
            <Col span="3" class="clickable list-item" @click.native.stop="_showAttendanceCalendar(item)">{{item.vacation}}</Col>
          </Row>
        </li>
      </div>
    </div>

    <!-- 考勤日历对话框 -->
    <div class="mask attendance-box" v-show="attendanceCalendarVisible">
      <div class="center container">
        <!-- 对话框头部 -->
        <section class="attendancen-title ivu-modal-header clear-float">
          <!-- title -->
          <span class="float-left">{{attendanceCalendarTitle}}</span>
          <!-- close -->
          <Icon 
            type="close" 
            class="clickable float-right attendance-close"
            @click.native="attendanceCalendarVisible = false">
          </Icon>
        </section>

        <section class="attendance-content">
          <!-- 日历头部 -->
          <ul class="week-title clear-float week-mark">
            <li class="float-left week-li">日</li>
            <li class="float-left week-li">一</li>
            <li class="float-left week-li">二</li>
            <li class="float-left week-li">三</li>
            <li class="float-left week-li">四</li>
            <li class="float-left week-li">五</li>
            <li class="float-left week-li">六</li>
          </ul>

          <!-- 日历内容 -->
          <ul class="week-title clear-float" v-for="(week, index) in weeksData" :key="index">
            <li 
              class="float-left week-li" 
              v-for="(day, index) in week"
              @mouseleave.stop="_bodyClick"
              :class="{'sleep-li': Number(day.month) !== Number(currentMonth) || day.holidayType !== 0}">
              <div class="li-title" v-if="Number(day.month) === Number(currentMonth)" @click.stop>
                {{ day.date }}
              </div>
              <div
                class="li-status"
                v-if="Number(day.month) === Number(currentMonth)" 
                @click.stop>
                <!-- 状态 -->
                <Icon 
                  v-if="day.leaveType === 1"
                  type="checkmark" 
                  :class="{'clickable': Number(day.month) === Number(currentMonth)}"
                  @click.native.stop="_changeStatus(day, $event)">
                </Icon>

                <Icon 
                  type="close" 
                  v-if="day.leaveType === 2"
                  :class="{'clickable': Number(day.month) === Number(currentMonth)}"
                  @click.native.stop="_changeStatus(day, $event)">
                </Icon>

                <Icon 
                  v-if="day.leaveType === 3"
                  type="ios-circle-outline" 
                  :class="{'clickable': Number(day.month) === Number(currentMonth)}"
                  @click.native.stop="_changeStatus(day, $event)">
                </Icon>

                <Icon 
                  v-if="day.leaveType === 4"
                  type="android-checkbox-outline-blank" 
                  :class="{'clickable': Number(day.month) === Number(currentMonth)}"
                  @click.native.stop="_changeStatus(day, $event)">
                </Icon>

                <Icon 
                  v-if="day.leaveType === 0 ||　day.leaveType === 5"
                  type="stop" 
                  :class="{'clickable': Number(day.month) === Number(currentMonth)}"
                  @click.native.stop="_changeStatus(day, $event)">
                </Icon>
                <!-- 不在职 -->
                <Icon type="minus" v-if="day.leaveType === -1">
                </Icon>
              </div>
              <ul class="li-list" v-if="Number(day.month) === Number(currentMonth)">
                <li class="list-item clickable" @click.stop="_statusChangeClick(day, 1, $event)">
                  <Icon type="checkmark" class="marR5"></Icon>
                  <span class="marR20">正常出勤</span> 
                </li>
                <li class="list-item clickable" @click.stop="_statusChangeClick(day, 2, $event)">
                  <Icon type="close" class="marR5"></Icon>
                  <span class="marR20">缺勤</span>
                </li>
                <li class="list-item clickable" @click.stop="_statusChangeClick(day, 3, $event)">
                  <Icon type="ios-circle-outline" class="marR5"></Icon>
                  <span class="marR20">病假</span> 
                </li>
                <li class="list-item clickable" @click.stop="_statusChangeClick(day, 4, $event)">
                  <Icon type="android-checkbox-outline-blank" class="marR5"></Icon>
                  <span class="marR20">事假</span> 
                </li>
                <li class="list-item clickable" @click.stop="_statusChangeClick(day, 5, $event)">
                  <Icon type="stop" class="marR5"></Icon>
                  <span class="marR20">休息</span>
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <!-- 日历底部 -->
        <footer class="vertical-center attendance-footer">
          <!-- 正常出勤 -->
          <Icon type="checkmark" class="marR5"></Icon>
          <span class="marR20">正常出勤</span> 
          <!-- 缺勤 -->
          <Icon type="close" class="marR5"></Icon>
          <span class="marR20">缺勤</span>
          <!-- 病假 -->
          <Icon type="ios-circle-outline" class="marR5"></Icon>
          <span class="marR20">病假</span>
          <!-- 事假 -->
          <Icon type="android-checkbox-outline-blank" class="marR5"></Icon>
          <span class="marR20">事假</span>
          <!-- 休息 -->
          <Icon type="stop" class="marR5"></Icon>
          <span class="marR20">休息</span>
          <!-- 不在职 -->
          <Icon type="minus" class="marR5"></Icon>
          <span class="marR20">不在职</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import moment from 'moment'
  // api
  import { _getHandle, _setCalendarStatus } from 'api/staff'
  import { requestGetCourseTable } from 'api/course-table-manage'

  export default {
    name: 'month-report',
    data: function() {
      return {
        // 日期数据
        dateModel: moment(new Date()).format('YYYY-MM'),
        // 日期配置
        todayAttendanceOptions: {
          disabledDate (date) {
            return date.getTime() > ( Date.now() )
          }
        },

        // 考勤日历visible
        attendanceCalendarVisible: false,
        attendanceCalendarTitle: '',
        weeksData: [],
        // 当前月份
        currentMonth: 0,

        // 月度数据
        attendanceDatas: [], 
        //教师id
        employeeId: 0
      }
    },
    mounted: function() {
      document.addEventListener('click', this._bodyClick)
      this._getData(moment(this.dateModel).format('YYYY-MM'))
    },
    methods: {
      /** 
       * 页面其余位置点击，关闭当前显示的ul
      */
      _bodyClick: function() {
        if(document.querySelectorAll(".li-list")) {
          const allList = document.querySelectorAll(".li-list")
          for (const iterator of allList) {
            iterator.style.display = 'none'
          }
        }
      },

      /** 
       * 获取对应时间的数据
      */
      _getData: function(time) {
        return _getHandle('api/v2/getMonthAttendance?deadline=' + time, null).then(response => {
          if (response.code === 200 && response.data) {
            this.attendanceDatas = []
            this.attendanceDatas = response.data
          }
        })
      },

      /** 
       * 日历时间切换
      */
      _dateChange: function(val) {
        this.dateModel = val
        this._getData(val)
      },

      /** 
       * 显示考勤日历
      */
      _showAttendanceCalendar: function(item) {
        this.currentMonth = moment(this.dateModel).format('MM')
        // 获取对应时间，对应人员的日历数据
        _getHandle('api/v2/getMonthAttendance/' + item.employeeId + '?deadline=' + moment(this.dateModel).format('YYYY-MM'), null).then(res => {
          if (res.code === 200 && res.data) {
            let datas = res.data.attendance
            this.employeeId = item.employeeId

            this.weeksData = datas
            this.attendanceCalendarTitle = '考勤日历 —' + item.employeeName + '  ' + moment(this.dateModel).format('YYYY年M月')  
            this.attendanceCalendarVisible = true
          }
        })
      },

      /** 
       * 更改ul列表的显示状态
      */
      _changeStatus: function(item, event) {
        if (item) {
          let UlElement =  event.target.parentNode.parentNode.querySelector(".li-list")
          if (UlElement) {
            UlElement.style.display = (UlElement.style.display === 'block' ? 'none' : 'block')
          }
        }
      },

      /** 
       * 职工考勤状态改变点击,修改展现状态
       * @param {item}
      */
      _statusChangeClick: function(item, i, event) {
        // 前端修改展示的数据状态
        item['leaveType'] = Number(i)
        // 隐藏ul
        if (event.target.parentNode.parentNode.tagName === 'UL') {
          event.target.parentNode.parentNode.style.display = 'none'
        } else {
          event.target.parentNode.style.display = 'none'
        }

        // 请求接口，修改该职工的状态数据
        _setCalendarStatus(item, this.employeeId).then(res=> {
          if (res.code === 200) {
            // 成功之后重新调取今月数据的接口
            this._getData(this.dateModel)
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .month-report
    position relative
    height 100%
    padding 26px 2%
    .month-data
      position absolute
      bottom 10px
      left 2%
      right 2%
      top 82px
      padding-top 10px
      /* 数据头部 */
      .data-header
        height 36px
        line-height 20px
        text-align left
        // margin-left 40px
        // margin-right 14px
        border-bottom 1px solid #E0CFBA
        color #99601c

      /* 数据容器 */
      .data-container
        position absolute
        top 54px
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
        .data-list
          .list-item
            padding-left 2px 

  /* 考勤日历弹窗 */
  .attendance-box
    .container
      top 40%
      width 520px
      background #fff
      line-height 1
      border-radius 10px              
      .attendancen-title
        color #ffffff
        .attendance-close
          margin 10px 0 10px 10px
      .attendance-content    
        .week-mark
          border-bottom 1px solid
          height 40px !important
          line-height 40px !important
          .week-li
            height 40px !important
            line-height 40px !important 
        .week-title
          .week-li
            position relative
            width 14.28%
            text-align center
            height 60px
            .li-title
              height 30px
              line-height 30px
            .li-status
              height 30px
              line-height 30px
            .li-list
              position absolute
              right -60px
              top 20px
              z-index 99
              display none
              width 80px
              background #fff
              border 1px solid
              .list-item
                height 30px
                line-height 30px
                font-size 12px
          .sleep-li
            color #c1c1bc
            background #e3e3e0
            // cursor not-allowed
      .attendance-footer
        height 30px
        line-height 30px
        padding 0 32px
        margin 10px 0
        font-size 12px
        .marR5
          margin-right 5px
        .marR20
          margin-right 20px      
</style>
