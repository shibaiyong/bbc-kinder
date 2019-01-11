/** 
 * @Desc: 课表管理子页面
 */
<template>
  <content-box :whiteInner="false">
    <!-- 课程预览详情的内容框子 -->
    <div class="mask mask-box" v-show="lessonDetailVisible">
      <!-- loading -->
      <v-loading v-show="DialogloadingVisible"></v-loading>
       <!-- dialog -->
      <div class="dialog-box center" ref="contentBox">
        <!-- 头部展示 -->
        <div class="dialog-header clear-float">
          <span>{{resourceTitle}}</span>
          <!-- 关闭按钮 -->
          <Icon 
            type="close" 
            style="margin-top: 20px;margin-left: 20px; font-size: 20px" 
            class="float-right clickable"
            @click.native="lessonDetailVisible = false"></Icon>
          <!-- 资源种类切换tab -->
          <ul class="tab-list clear-float" v-if="tabList.length">
            <li 
              class="tab-item clickable" 
              :class="{'active': tabItem.name === currentTabView}"
              v-for="(tabItem, index) in tabList" 
              :key="index"
              @click="_tabItemClick(tabItem)">
              {{ tabItem.title }}
            </li>
          </ul>
        </div>
        <!-- 数据区域 -->
        <div class="course-resource" ref="courseResourceBox">
          <component
            ref="ChildComponent" 
            :is="currentTabView" 
            :preparePlanUrl="preparePlanUrl"
            :coursewareUrl="coursewareUrl"
            :videos="courseware.videos"
            :resId="resId"
            :resCover="resCover"
            :manualList="manual"
            :materialPackageList="materialPackage"/>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="course-table-manage">
      <!-- loading -->
      <v-loading v-show="loadingVisible"></v-loading>

      <!-- S 左侧课程 -->
      <Col span="8" class="fill-height" style="padding-right:15px;">
        <div class="left-course fill">
          <Row>
          <!-- S 级联选择器 -->
            <Col span="15" style="padding-right:12px;">
              <Cascader 
                size="small" 
                v-model="cascaderModel"
                :clearable="false" 
                :data="cascaderData"
                @on-change="_cascaderChange">
              </Cascader>
            </Col>
            <!-- E 级联选择器 -->

            <!-- S 搜索框 -->
            <Col span="9">
              <searchbar 
                ref="searchbar"
                @search="_search" 
                placeholder="请输入关键字">
              </searchbar>
            </Col>
            <!-- E 搜索框 -->
          </Row>

          <!-- S 领域筛选 -->
          <RadioGroup 
            v-if="!filterData.searchKeyword"
            class="domain-filter"
            v-model="filterData.domainId" 
            @on-change="_domainChange">
            <Radio :label="domain.value" v-for="domain in domainList" :key="domain.value">
              {{ domain.label }}
            </Radio>
          </RadioGroup> 
          <!-- S 领域筛选 -->

          <!-- S 返回按钮 -->
          <Button 
            v-else 
            size="small"
            style="margin-top:8px;"
            @click.native="_goBack">返回课程选择页面
          </Button>
          <!-- E 返回按钮 -->
          
          <!-- S 课程列表 -->
          <div class="course-list-wrapper" ref="courseListWrapper" >
            <ul class="course-list clear-float" v-if="courseList.length" >
              <Col :span="courseColSpan" style="padding:0 7px 15px;" v-for="course in courseList" :key="course.courseId" >
                <li 
                  class="course-item clickable" 
                  ref="courseItem"
                  draggable="true"
                  @dragstart="_courseDragStart($event, course)"
                  @dragend="$event.dataTransfer.clearData('course')"
                  @mouseover="$event.currentTarget.lastChild.style.display = 'block'"
                  @mouseleave="$event.currentTarget.lastChild.style.display = 'none'"
                  @touchstart="_test($event, course)"
                  @touchend="_test1($event,course)"
                  @touchmove="_moveE($event)">
                  <img class="cover" :src="course.cover"></img>
                  <p class="course-title no-wrap" >{{ course.courseName }}</p>

                  <!-- S 课程信息 -->
                  <div class="course-info" style="display:none;">
                    {{ course.target }}
                    <p class="course-more" @click.stop="_showLessonDetail(course.courseId, $event)">查看详情></p>
                  </div>
                  <!-- E 课程信息 -->
                </li>
              </Col>
            </ul>
          </div>
          <!-- E 课程列表 -->

          <!-- S 分页 -->
          <Page
            class="course-list-paging"
            size="small"
            :current="filterData.pageIndex"
            :page-size="filterData.pageSize"
            :total="courseListTotal"
            @on-change="_courseListPageChange">
          </Page>
          <!-- E 分页 -->
        </div>
      </Col>
      <!-- E 左侧课程 -->

      <!-- S 右侧日历 -->
      <Col span="16" class="fill-height">
        <div class="right-calendar fill">
          <full-calendar 
            :gradeId="gradeId" 
            :touchInfo="getInfo"
            @getCourseList="_getCourseList"
            @setLessonInfo="_getLessonInfo">
          </full-calendar>
        </div>
      </Col>
      <!-- E 右侧日历 -->
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  import Searchbar from 'component/searchbar'
  import FullCalendar from 'component/full-calendar'
  import PreparePlan from './component/prepare-plan'
  import Courseware from './component/courseware'
  import Manual from './component/manual'
  import MaterialPackage from './component/material-package'
  import { requestGetFilterList, requestGetCourseList, requestGetLessonDetailById } from 'api/course-table-manage'
  import touchObj from 'lib/touch'

  export default {
    name: 'CourseTableManage',
    components: {
      Searchbar,
      FullCalendar,
      PreparePlan,
      Courseware,
      Manual,
      MaterialPackage
    },
    data: function() {
      return {
        // 筛选器
        filterData: {
          pageIndex: 1,
          pageSize: 30,
          categoryId: '',
          courseId: '',  
          themeId: '', 
          domainId: '',
          searchKeyword: '',
        },
        // 级联选择器
        cascaderModel: [],
        cascaderData: [],
        // 领域
        defaultDomain: [{label: '全部', value: ''}],
        domainList: [],
        // 课程列表
        courseList: [],
        courseListTotal: 0,
        courseColSpan: 8,
        // loading状态
        loadingVisible: true,
        DialogloadingVisible: true,

        // 课程详情弹窗
        lessonDetailVisible: false,
        // 资源种类列表和当前项
        currentTabView: '',
        tabList: [],
        resourceTitle: '',
        // 资源路径
        preparePlanUrl: '',
        coursewareUrl: '',
        manual: [],
        materialPackage: [],
        // 课件对应的视频数据对象
        courseware: {
          videos: {},
        },

        // 资源Id
        resId: '',
        // 公共的图片信息
        resCover: '',
        //移动获取的对象
        touchCon:{}
      }
    },
    computed: {
      /**
       * 获取路由gradeId
       */
      gradeId: function() {
        return this.$route.params.gradeId
      },

      getInfo:function(){
       return !this.touchCon ? null : this.touchCon
      },
      /**
       * 领域id
       */
      domainId: function() {
        return this.filterData.domainId
      }
    },
    watch: {
      /**
       * 班级年级改变
       */
      gradeId: function(value) {
        this.loadingVisible = true
        this.filterData.domainId = ''
        this._getFilterList()
      },

      /**
       * 选中领域改变
       */
      domainId: function() {
        this.filterData.pageIndex = 1
      },
    },
    methods: {
      /** 
       * 设置dialog的宽度和高度数字 
      */
      _setDialogCssValue: function() {
        const contentBoxEl = this.$refs.contentBox
        if (contentBoxEl) {
          const screenWidth = document.body.clientWidth 
          const contentBoxWidth = screenWidth * 0.58
          const contentBoxHeight = contentBoxWidth * 9 / 16 + 40
          contentBoxEl.style.width = contentBoxWidth + 'px'
          contentBoxEl.style.height = contentBoxHeight + 'px'
        }  
      },

      /**
       * 从搜索页返回到课程列表
       */
      _goBack: function() {
        this.filterData.searchKeyword = ''
        this.$refs.searchbar.keyword = ''
        this._getCourseList()
      },

      /**
       * 课程列表分页页码改变
       */
      _courseListPageChange: function(value) {
        this.filterData.pageIndex = value
        this._getCourseList()
      },

      /**
       * 课程拖拽
       */
      _courseDragStart: function(event, course) {
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("course", JSON.stringify(course))
      },

      /**
       * 领域选中改变
       */
      _domainChange: function(value) {
        this.filterData.domainId = value
        this._getCourseList()
      },

      /**
       * @param (Array)value 选中值组成的数组
       * @param (Array)selectedData 保持源数据结构的选中值组成的数组
       */
      _cascaderChange: function(value, selectedData) {
        if (selectedData.length) {
          this._setFilterData(value)
          const domainList = selectedData[selectedData.length - 1].list
          this.domainList = domainList ? this.defaultDomain.concat(domainList) : this.defaultDomain
        }
        // 获取课程列表
        this._getCourseList()
      },

      /**
       * 设置筛选器id
       */
      _setFilterData: function(value) {
        this.filterData.categoryId = value[0] ? value[0] : ''
        this.filterData.courseId = value[1] ? value[1] : ''
        this.filterData.themeId = value[2] ? value[2] : '' 
      },

      /**
       * 获取课程列表
       */
      _getCourseList: function() {
        this.courseList = []
        requestGetCourseList(this.gradeId, this.filterData)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestGetCourseList SUCCESS', res)
              this.courseList = res.data.datas
              this.courseListTotal = res.data.totalCount
              this._initCourseItemHeight()
              // 隐藏loading
              setTimeout(() => this.loadingVisible = false, 300)     
            }
            else {
              // console.log('requestGetCourseList FAIL', res)
              // 隐藏loading
              setTimeout(() => this.loadingVisible = false, 300)     
            }
          })
          .catch(err => {
            // console.log('requestGetCourseList FAIL', err)
          })
      },

      /**
       * 获取筛选器列表
       */
      _getFilterList: function() {
        requestGetFilterList(this.gradeId)
          .then(res => {
            if (res.code === 200) {
              // 隐藏loading
              setTimeout(() => this.loadingVisible = false, 300)     
              // console.log('requestGetFilterList SUCCESS', res)
              this.cascaderData = res.data
              if (!this.cascaderData.length) {
                return
              }
              // 级联选择器默认选中（递归）
              let defaultSelect = []
              let getDefault = item => {
                defaultSelect.push(item.value)
                if (item.children) {
                  return getDefault(item.children[0])
                }
                // 最末级有这个字段，用来获取单选组件的数据
                if (item.list) {
                  return this.domainList = this.defaultDomain.concat(item.list)
                }
              }
              getDefault(this.cascaderData[0])
              this.cascaderModel = defaultSelect
              // 设置筛选器id
              this._setFilterData(defaultSelect)
              // 获取课程列表
              this._getCourseList()
            }
            else {
              // console.log('requestGetFilterList FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestGetFilterList FAIL', err)
          })
      },

      /**
       * 搜索
       */
      _search: function(keyword) {
        this.filterData.searchKeyword = keyword
        this._getFilterList()
      },

      /* 
       * 设置课程项高度
       */
      _initCourseItemHeight: function() {
        setTimeout(() => {
          if (this.$refs.courseItem && this.$refs.courseItem.length) {
            const courseItemHeight = Array.from(this.$refs.courseItem)[0].clientWidth / 16 * 9
            for (let course of this.$refs.courseItem) {
              course.style.height = courseItemHeight + 'px'
            }
          }
        }, 0)
      },

      /**
       * 设置视频列表为2列
       */
      _initCourseColSpan: function() {
        const screenWidth = document.documentElement.clientWidth
        if (screenWidth > 1600) {
          this.courseColSpan = 8
        }
        else {
          this.courseColSpan = 12
        }
      },

      /** 
       * 更多详情项和右侧课程眼睛查看点击事件
      */
      _showLessonDetail: function(id, event) {
        if (event) {
          event.target.parentNode.style.display = 'none'
        }
        // 调用获取课程详细内容的api
        requestGetLessonDetailById(id).then(res => {
          if (res.code === 200) {
            console.log('requestGetCourseResource SUCCESS', res)
            // 弹出弹窗，同时设置当前的ul项为教案
            this.currentTabView = 'prepare-plan'
            // 清空数据
            this.tabList = []
             // 资源数据的赋值
            this.preparePlanUrl = res.data.teachingCase
            this.coursewareUrl = res.data.courseware.defaultUrl
            this.manual = res.data.manual ? res.data.manual : []
            this.materialPackage = res.data.materialPackage ? res.data.materialPackage : []
            this.courseware.videos = res.data.courseware.videos
            this.resourceTitle = res.data.resourceTitle

            // 设置此处的resId和cover图片数据
            this.resId = id
            this.resCover = res.data.cover.slice(res.data.cover.indexOf('show'))


            // 设置tab数据列表
            let tabList =  [
              {title: '教案', name: 'prepare-plan'},
              {title: '课件', name: 'courseware'}
            ]
            if (this.manual.length) {
              tabList.push({title: '手册', name: 'manual'})
            }
            if (this.materialPackage.length) {
              tabList.push({title: '材料包', name: 'material-package'})
            }
            this.tabList = tabList  
            // 展示内容loading
            this.DialogloadingVisible = true
            // 显示弹窗
            this.lessonDetailVisible = true
            // loading关闭
            setTimeout( () => {
              this.DialogloadingVisible = false
            }, 1000)
          }
        })
      },

      /** 
       * 接收到子组件emit的信息
      */
      _getLessonInfo: function(val) {
        // 显示弹窗
        this._showLessonDetail(val.resourceId)
      },

      /** 
       * tab项点击
      */
      _tabItemClick: function(tabItem) {
        this.currentTabView = tabItem.name
      },

      _test: function(event, course) {
        event.preventDefault()
      },

      _test2: function() {
        // console.log('第阿娇')
      },

      _test1: function(e,course) {
        let that = this
        touchObj.init(e.changedTouches[0].pageX,e.changedTouches[0].pageY,course,function(val){
          if(typeof val == 'string'){
            that.$VMessage('info', '请拖动到指定课表内')
            return
          }
          that.touchCon = val
        },that)
        // console.log('第阿娇123:', e)
      },

      _moveE: function(e) {
        // console.log('移动:', e)
      }
    },
    created: function() {
      this._getFilterList()
    },
    mounted: function() {
      this._setDialogCssValue()
      this._initCourseColSpan()
      // 屏幕缩放监听事件
      window.addEventListener('resize', () => {
        this._initCourseItemHeight()
        this._initCourseColSpan()
        this._setDialogCssValue()
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .mask-box
    .dialog-box
      z-index 999
      background #fff9eb
      border-radius 10px
      box-shadow 0px 0px 15px 0px rgba(0,0,0,0.2), inset 0px 0px 5px 0px rgba(0,0,0,0.15)
      .dialog-header
        position relative
        top 0
        left 0
        right 0
        padding 0 20px 
        height 60px
        line-height 60px
        color #57311b
        .tab-list
          float right 
          margin-top 15px
          margin-right 10px
          .tab-item
            float left
            height 30px
            line-height 30px
            padding 0 15px
            text-align center
            margin-left 10px
            border-radius 30px
            transition .3s
            &.active, &:hover
              color $color-text-sub
              background-color rgb(255, 238, 221)
              box-shadow inset 0px -1px 2px 0px rgba(0, 0, 0, 0.35),inset 0px 2px 1px 0px rgba(255, 253, 242, 0.004)
      /* 课件内容 */
      .course-resource
        position absolute
        top 60px
        right 0
        bottom 0
        left 0
        border-bottom-left-radius 10px
        border-bottom-right-radius 10px
  .course-table-manage
    width 100%
    height 100%
    position relative
    .left-course,
    .right-calendar
      position relative
      padding 12px
      border-radius 5px
      background-color rgb(255, 255, 255)
      box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
    .left-course
      position relative
      .domain-filter
        display flex
        height 46px
        line-height 46px
        color #99601c
      .course-list-wrapper
        position absolute
        top 90px
        right 0
        bottom 45px
        left 0
        padding 0 5px 140px 10px
        overflow-y auto
        .course-list
          .course-item
            position relative
            border-radius 5px
            box-shadow 0px 1px 4px 0px rgba(55, 52, 39, 0.8),inset 0px 1px 3px 0px rgba(255, 255, 255, 0.77)
            .cover
              width 100%
              height 100%
              border-radius 5px
            .course-title
              position absolute
              right 0
              bottom 0
              left 0
              height 22px
              line-height 22px
              padding 0 10px
              font-size 12px
              color #fff
              background-color rgba(0,0,0,.6)
              border-bottom-left-radius 5px
              border-bottom-right-radius 5px
            .course-info
              position absolute
              z-index 99999
              top 95%
              right -10px
              left -10px
              padding 5px
              border-radius 5px
              color #99601c
              font-size 12px
              border 1px solid rgb(56, 190, 117)
              background-color rgb(255, 255, 255)
              .course-more
                text-align right
                font-size 12px
      .course-list-paging
        position absolute
        left 0
        right 0
        bottom 10px
        text-align center
</style>

