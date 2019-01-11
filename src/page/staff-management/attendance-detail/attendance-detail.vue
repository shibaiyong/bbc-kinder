/** 
 * @Desc: 考勤明细
 */
 
<template>
  <div class="attendance-detail">
    <!-- loading -->
    <v-loading v-show="loadingVisible"></v-loading>

    <!-- 内容头部 -->
    <section class="clear-float detail-header no-print">
      <!-- 日历区域 -->
      <DatePicker 
        type="month" 
        placeholder="Select date"
        :options="attendanceDetailOptions"
        :clearable="false"
        format="yyyy-MM"
        @on-change="_dateChange" 
        :value="dateModel"
        style="width: 220px;float: left">
      </DatePicker>

      <!-- 状态标识 -->
      <ul class="float-left vertical-center attendance-mark">
        <!-- 正常出勤 -->
        <Icon type="checkmark" class="marR5 green"></Icon>
        <span class="marR20">正常出勤</span> 
        <!-- 缺勤 -->
        <Icon type="close" class="marR5 pink"></Icon>
        <span class="marR20">缺勤</span>
        <!-- 病假 -->
        <Icon type="ios-circle-outline" class="marR5 orange"></Icon>
        <span class="marR20">病假</span>
        <!-- 事假 -->
        <Icon type="android-checkbox-outline-blank" class="marR5 blue"></Icon>
        <span class="marR20">事假</span>
        <!-- 休息 -->
        <Icon type="stop" class="marR5"></Icon>
        <span class="marR20">休息</span>
        <!-- 不在职 -->
        <Icon type="minus" class="marR5 grey"></Icon>
        <span class="marR20">不在职</span>
      </ul>

      <!-- 按钮 -->
      <Button 
        type="ghost"
        class="float-right"
        @click="_handlePrintFile"
        style="margin-right:5px;padding: 0 10px">
        <Icon type="printer" style="margin-right:8px;"></Icon>打印
      </Button>
      <Button 
        type="ghost"
        @click="_handleLoadFile"
        class="float-right"
        style="margin-right:5px;padding: 0 10px">
        <v-icon size="14" type="icon-download" style="margin-right:8px;"/>下载
      </Button>  
    </section>

    <!-- 数据 -->
    <section class="detail-data" ref="printBox">
      <!-- 日期头部 -->
      <header 
        class="data-header clear-float" 
        v-if="currentMonth.length"
        :style="{paddingRight: attendanceDetailDatas.length >10 ? '16px': '0px'}">
        <li class="w4 data-li float-left">姓名</li>
        <li 
          :class="{'sleep-li': ((currentYear < 2018 && (day.day === '六' || day.day === '日')) || day.holidayType !== 0)}" 
          class="w3 data-li float-left"
          v-for="(day, index) in currentMonth" 
          :key="index">
          <span class="data-span">{{ day.date }}</span>
          <span class="data-span">{{ day.day }}</span>
        </li>
      </header>

      <!-- 数据容器 -->
      <div class="data-container">
        <ul class="data-list clear-float" v-if="attendanceDetailDatas.length"  v-for="(attendance, index) in attendanceDetailDatas" :key="index" @mouseleave.stop="_bodyClick">
          <!-- 教师的名字 -->
          <li class="w4 float-left list-item no-wrap" :title="attendance.employeeName">{{attendance.employeeName}}</li>
          <!-- 每天的数据列表 -->
          
          <!-- 星期的灰色背景 -->
          <!-- :style="{background: ((currentYear < 2018 && (day.day === '六' || day.day === '日')) || day.holidayType !== 0) ? '#999' : ''}" -->
          <li 
            class="w3 float-left list-item"
            v-for="(day, index) in attendance.attendanceDetail" 
            :key="index">
            <!-- 出勤 -->
            <span v-if="day.leaveType === 1" class="mar10 clickable" style="color: #75C73B;" @click.stop="_changeStatus($event)">✔</span>
            <!-- 缺勤 -->
            <span v-if="day.leaveType === 2" class="mar10 clickable" style="color: #F84B62;" @click.stop="_changeStatus($event)">✖</span>
            <!-- 病假 -->
            <span v-if="day.leaveType === 3" class="mar10 clickable" style="color: #FF9902;" @click.stop="_changeStatus($event)">○</span>
            <!-- 事假 -->
            <span v-if="day.leaveType === 4" class="mar10 clickable" style="color: #5494EA;" @click.stop="_changeStatus($event)">□</span>
            <!-- 休息 -->
            <span v-if="day.leaveType === 5" class="mar10 clickable" color="#e3e3e0" @click.stop="_changeStatus($event)">○</span>
            <!-- 不在职 -->
            <span v-if="day.leaveType === -1" class="mar10" style="color: #ccc;">一</span>

            <!-- 更改状态UL -->
            <ul class="list-ul no-print" >
              <li class="list-li clickable" @click.stop="_statusChangeClick(day, 1, attendance.employeeId, $event)">
                <span class="marR5">✔</span>
                <span class="marR20">正常出勤</span> 
              </li>
              <li class="list-li clickable" @click.stop="_statusChangeClick(day, 2, attendance.employeeId, $event)">
                <span class="marR5 ">✖</span>
                <span class="marR20">缺勤</span>
              </li>
              <li class="list-li clickable" @click.stop="_statusChangeClick(day, 3, attendance.employeeId, $event)">
                <span class="marR5">○</span>
                <span class="marR20">病假</span> 
              </li>
              <li class="list-li clickable" @click.stop="_statusChangeClick(day, 4, attendance.employeeId, $event)">
                <span class="marR5">□</span>
                <span class="marR20">事假</span> 
              </li>
              <li class="list-li clickable" @click.stop="_statusChangeClick(day, 5, attendance.employeeId, $event)">
                <span color="#e3e3e0" class="marR5">○</span>
                <span class="marR20">休息</span>
              </li>
            </ul>
          </li>
        </ul>

        <ul style="text-align:center;padding-top: 20px" v-if="noDataVisible">
          暂无相关数据
        </ul>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  // 工具
  import moment from 'moment'
  // api
  import { _getHandle, requestChangeStatus, _setCalendarStatus, _download } from 'api/staff'

  export default {
    name: 'attendance-detail',
    data: function() {
      return {
        // loading
        loadingVisible: false,

        // 日历相关
        dateModel: moment(new Date()).format('YYYY-MM'),
        attendanceDetailOptions: {
          disabledDate (date) {
            return date.getTime() > ( Date.now() )
          }
        },

        // 当前月数据
        currentMonth: [],
        // 当前的职工数据
        attendanceDetailDatas: [], 
        currentYear: 0,
        noDataVisible: false
      }
    },
    mounted: function() {
      // this._getMonthDay(this.dateModel)
      this._getData(this.dateModel)
      document.addEventListener('click', this._bodyClick)
    },
    methods: {
      /** 
       * 页面其余位置点击，关闭当前显示的ul
      */
      _bodyClick: function() {
        if(document.querySelectorAll(".list-ul")) {
          const allList = document.querySelectorAll(".list-ul")
          for (const iterator of allList) {
            iterator.style.display = 'none'
          }
        }
      },

      /** 
       * 获取当前时间对应的月具体天数数据
       * @param String {data}: 当前月份的数据
      */
      _getMonthDay: function(data) {
        this.loadingVisible = true
        if (data != null && data.length > 0) {
          let dates = data[0].attendanceDetail;
          if (dates == null || dates.length < 1) {
            this._getDefaultMonthDay
            return
          }
          this.currentYear = data[0].attendanceDetail[0].attendanceTime.split('-')[0]
          let arr = []
          for(let i = 0; i< dates.length; i++) {
            let date = dates[i]
            // 补齐格式
            let d = date.date
            // 获取当前的时间格式数据
            let obj = {
              'date': d < 10 ? '0' + d : d ,
              'day': date.day,
              'holidayType': date.holidayType
            }
            // 放入表格中
            arr.push(obj)
          }
          setTimeout( () => {
            this.loadingVisible = false
          }, 300)
          this.currentMonth = [].concat(arr)
          this.attendanceDetailDatas = data
        } 
      },

      /** 
       * 获取默认数据
       * @param String {time}: 当前月份的数据
      */
      _getDefaultMonthDay: function(time) {
        this.loadingVisible = true
        this.currentYear = date.attendanceTime.split('-')[0]
        let d = new Date(time.split('-')[0], time.split('-')[1]-1, 0).getDate() 
        let arr = []
        for(let i =1; i<= d; i++) {
          // 补齐格式
          let d = i < 10 ? '0'+ i : i + ''
          // 获取当前的时间格式数据
          let dayValue = time + '-'+ d
          let today = new Array("日","一","二","三","四","五","六")         
          let day = today[new Date(dayValue).getDay()]
          let obj = {
            'date': i,
            'day': today[new Date(dayValue).getDay()]
          }
          // 放入表格中
          arr.push(obj)
        }
        setTimeout( () => {
          this.loadingVisible = false
        }, 300)
        this.currentMonth = [].concat(arr)
      },

      /** 
       * 日历时间切换
      */
      _dateChange: function(val) {
        this.dateModel = val
        this.attendanceDetailDatas = []
        // console.log('此时的值:', this.dateModel)
        // 重新获取时间表格的头部数据
        this._getMonthDay(this.dateModel)
        // 重新获取对应时间的表格数据
        this._getData(this.dateModel)
      },

      /** 
       * 获取对应时间的数据
      */
      _getData: function(time) {
        return _getHandle('api/v2/getMonthAttendanceDetail?deadline=' + time, null).then(response => {
          if (response.code === 200 ) {
            if (response.data.length) {
              this.noDataVisible = false
              this._getMonthDay(response.data)
            } else {
              setTimeout( () => {
                this.loadingVisible = false
                this.noDataVisible = true
              }, 300)
            }
          } 
        })
      },

      /** 
       * 下载文件
      */
      _handleLoadFile: function() {
        let param = {
          deadline: this.dateModel
        }
        let name = `${this.dateModel.split('-')[0]}年${this.dateModel.split('-')[1]}月${this.$store.state.orgName}职工考勤表.xlsx`
        _download(`api/v2/downloadAttendance`, param, name)
      },

      /** 
       * 打印文件
      */
      _handlePrintFile: function() {
        // console.log('日期：', this.dateModel)
        let time = this.dateModel
        // 设置打印的样式文件
        let styleHtml = `<style media="print">*{margin: 0;padding: 0;color: black !important;background: white !important;border: none}
        @page{size: A4 landscape;}
        .no-print{display: none !important}
        .no-wrap{text-overflow: ellipsis;overflow: hidden;white-space: nowrap}
        .vertical-center{display: flex;align-items: center;flex-direction: row-reverse}
        li{list-style: none}#warap{margin: 0 auto}.float-left{float:left}.clear-float{zoom:1}
        .clear-float::after{clear:both;content:'.';height:0;display: block;visibility: hidden}
        .data-header{height:50px;line-height:50px;text-align:center;margin-bottom: 10px;border-bottom: 1px solid black;}
        .data-header .w4{width: 100px !important;height:50px;line-height:50px;}
        .data-header .w3{width: 30px !important;height:49px;line-height:50px;}
        .data-header .data-li .data-span{display:block;height:25px;line-height:25px;border: none;font-size: 14px}
        .data-container .data-list{height: 40px;line-height: 40px; text-align:center }
        .data-container .data-list .w4{width: 100px !important;height:40px;line-height:40px;font-size: 12px} 
        .data-container .data-list .w3{width: 30px !important;height:40px;line-height:40px;font-size: 12px}
        </style>`
        // .data-container .data-list .sleep-li{color: red }  
        let preHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/>${styleHtml}</head><body><div>`
        let HeaderHtml = `<p style="text-align:center;font-size: 20px;margin-bottom:20px">${time.split('-')[0]}年${time.split('-')[1]}月${this.$store.state.orgName}职工考勤表</p>` 
        let iconHtml = '<div class="vertical-center" style="margin: 10px 0;font-size: 12px;padding-right: 20px">' +
          '<span>不在职</span><span>一:</span>' + '<span style="margin-right: 5px">休息,</span><span color="#e3e3e0">○:</span>' + 
          '<span style="margin-right: 5px">事假,</span><span>□:</span>' + '<span style="margin-right: 5px">病假,</span><span>○:</span>' +
          '<span style="margin-right: 5px">缺勤,</span><span>✖:</span>' + '<span style="margin-right: 5px">出勤,</span><span>✔:</span>' + '</div>'
        let printHtml = `<section id="wrap">${this.$refs.printBox.innerHTML}</section>`
        let nextHtml = '</div></body></html>'
        let allHtml = preHtml + HeaderHtml + iconHtml + printHtml + nextHtml
        console.log('all:', allHtml)
        let attendancePage = window.open('', 'attendancePage')
        attendancePage.document.write(allHtml)
        
        // 执行打印
        attendancePage.print()
        attendancePage.close()   
      },

      /** 
       * 点击图标，展示状态数据UL
      */
      _changeStatus: function(event) {
        // 隐藏所有
        const allList = document.querySelectorAll(".list-ul")
        for (const iterator of allList) {
          iterator.style.display = 'none'
        }
        // 显示当前
        let element = event.target.parentNode.querySelector(".list-ul")
        if (element) {
          element.style.display = 'block'
        }   
      },

      /** 
       * 切换状态
      */
      _statusChangeClick: function(item, i, empId, event) {
        // 前端修改展示的数据状态
        item['leaveType'] = Number(i)
        // 隐藏ul
        if (event.target.parentNode.parentNode.tagName === 'UL') {
          event.target.parentNode.parentNode.style.display = 'none'
        } else {
          event.target.parentNode.style.display = 'none'
        }
        // 请求接口，修改该职工的状态数据
        _setCalendarStatus(item, empId)
      },

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .attendance-detail
    position relative
    height 100%
    padding 24px 2%
    /* 头部 */
    .detail-header
      .attendance-mark
        height 34px
        line-height 34px
        margin-left 20px
        color #99601c
        .marR5
          margin-right 5px
        .marR20
          margin-right 20px
        .green
          color #75C73B
        .pink
          color #F84B62
        .orange
          color #FF9902
        .blue
          color #5494EA
        .grey
          color #ccc
    /* 数据 */       
    .detail-data
      position absolute
      bottom 10px
      left 2%
      right 2%
      top 70px
      padding-top 10px
      /* 数据头部 */
      .data-header
        height 64px
        line-height 50px
        // text-align center
        border-bottom 1px solid #E0CFBA
        color #99601c
        .w3
          width 3%
          min-width 30px
        .w4
          width 6%
          min-width 50px
        .sleep-li
          // background #999  
        .data-li
          list-style-type none
          height 100%
          span
            display block
            height 25px
            line-height 25px 

      /* 数据容器 */               
      .data-container
        position absolute
        top 80px
        left 0
        right 0
        bottom 0
        overflow-y auto
        .data-list
          height 40px
          line-height 40px  
          // border-bottom 1px solid
          &:hover
            background rgba(117,199,59,.15)
          &:last-child
            border-bottom none  
          .w3
            width 3%
            min-width 30px
          .w4
            width 6%
            min-width 50px
          .sleep-li
            background #999 
          .list-item
            position relative
            // text-align center
            font-size 13px
            color #99601c
            .list-ul
              position absolute
              top 30px
              right -70px
              z-index 99
              display none
              width 90px
              padding 0 10px
              background #fff
              border 1px solid
              .list-li
                text-align left
                height 30px
                line-height 30px
                font-size 12px

  @media print
    * {
      margin: 0; 
      padding: 0;
      color: black !important;
      background: white !important
    }
    .no-print{
      display:none;
    }
    li {
      list-style: none
    }                
</style>
