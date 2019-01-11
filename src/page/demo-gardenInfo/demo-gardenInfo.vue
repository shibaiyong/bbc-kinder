/** 
 * @Desc: demo演示园所信息
 */
<template>
  <div class="demo-garden">
    <v-header></v-header>
    <!-- 数据展示 -->
    <div class="data-box">
      <div class="data-box-inner">
        <!-- 头部操作区域 -->
        <section class="data-select">
          <!-- 下拉框 -->
          <Select v-model="model1" style="width:200px;float:left;margin-right: 20px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 按钮 -->
          <Button  @click.native.stop="_addGardenClick">
            <Icon type="plus" style="margin-right: 5px"></Icon>添加幼儿园
          </Button>
        </section>

        <!-- 数据头部-->
        <section class="data-header">
          <Col span="12">园所</Col>
          <Col span="3">区县</Col>
          <Col span="3">班级数量</Col>
          <Col span="3">职工人数</Col>
          <Col span="3">学生人数</Col>
        </section>

        <!-- 数据盒子 -->
        <ul class="show-section">
          <li class="show-item" v-for="(garden, index) in gardenDatas" :key="index">
            <Col span="12">
              <Col span="8" class="no-wrap">{{garden.schoolName}}</Col>
              <Col span="6">
                <span v-if="garden.status === 1" class="list-status status-used">已接入</span>
                <span v-else class="list-status status-noused">待接入</span>
              </Col>
              <Col span="6" style="text-align:center">
                <!-- 查看 -->
                <Icon
                  v-if="garden.status === 1" 
                  type="ios-eye" 
                  class="clickable list-icon" 
                  title="查看"
                  @click.native.stop='_showGardenDetail(garden)' 
                  :size="22">
                </Icon>
                <!-- 编辑 -->
                <Icon
                  v-if="garden.status === 1" 
                  type="edit" 
                  class="clickable list-icon" 
                  style="margin: 0 10px"
                  title="编辑"
                  @click.native.stop='_editGardenDetail(garden)' 
                  :size="22">
                </Icon>
                <!-- 删除 -->
                <Icon
                  v-if="garden.status === 1" 
                  type="trash-a" 
                  class="clickable list-icon" 
                  title="删除"
                  @click.native.stop='_deleteGarden(garden)' 
                  :size="22">
                </Icon>
              </Col>
            </Col>
            <Col span="3">{{garden.country}}</Col>
            <Col span="3">{{garden.classesNum}}</Col>
            <Col span="3">{{garden.staffsNum}}</Col>
            <Col span="3">{{garden.studentsNum}}</Col>
          </li>
        </ul>
      </div>
    </div>

    <!-- 添加、查看、修改弹窗 -->
    <Modal
      v-model="formVisible">
      <div slot="header" style="color: white">
        {{formTitle}}
      </div>
      <Form 
        :model="form"
        :rules="form"
        :labelWidth="90"
        ref="Form">
        <!-- 学校名称 -->
        <FormItem prop="schoolName" label="学校名称">
          <Input v-model="form.schoolName" placeholder="请输入学校名称"/>
        </FormItem>
        <!-- 园长姓名 -->
        <FormItem prop="kinderName" label="园长姓名">
          <Input v-model="form.kinderName" placeholder="请输入园长姓名"/>
        </FormItem>
        <!-- 园长电话 -->
        <FormItem prop="phone" label="园长电话">
          <Input v-model="form.phone" placeholder="请输入园长电话" :maxlength="11"/>
        </FormItem>
        <!-- 区县 -->
        <FormItem prop="country" label="区县">
          <Select v-model="model1" style="float:left;margin-right: 20px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <!-- 详细地址 -->
        <FormItem prop="address" label="详细地址">
          <Input v-model="form.address" placeholder="请输入详细地址"/>
        </FormItem>
        <!-- 简介 -->
        <FormItem label="简介" prop="textarea">
          <Input 
            v-model="form.textarea" 
            type="textarea" 
            :autosize="{minRows: 2,maxRows: 6}" 
            style="line-height: 1"
            placeholder="请输入简介信息">
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <button 
          v-if="formTitle === '添加幼儿园'" 
          class="ivu-btn"
          style="margin-left: 300px" 
          disabled="disabled">添加
        </button>
        <button 
          v-if="formTitle === '查看幼儿园信息'" 
          class="ivu-btn"
          style="margin-left: 400px" 
          disabled="disabled">确定
        </button>
        <button 
          v-if="formTitle === '修改幼儿园信息'" 
          class="ivu-btn"
          style="margin-left: 300px" 
          disabled="disabled">修改
        </button>
        <button 
          v-if="formTitle === '添加幼儿园' || formTitle === '修改幼儿园信息'"
          style="margin-left: 20px"
          @click="formVisible = false" 
          class="ivu-btn ivu-btn-primary">取消
        </button>
      </div>
    </Modal>

    <!-- 删除弹窗 -->
    <Modal
      v-model="deleteVisible">
      <div slot="header" style="color: white">删除幼儿园</div>
      <p>是否要删除幼儿园<span style="color: red;font-weight:bold">{{deleteForm.schoolName}}</span></p>
      <div slot="footer">
        <button 
          class="ivu-btn"
          style="margin-left: 170px" 
          disabled="disabled">删除
        </button>
        <button 
          style="margin-left: 20px"
          @click="deleteVisible = false" 
          class="ivu-btn ivu-btn-primary">取消
        </button>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'demo-garden',
    data: function() {
      return {
        model1: '城关区',
        cityList: [
          {
            value: '城关区',
            label: '城关区'
          }
        ],

        // 院所数据
        gardenDatas: [
          { country: '城关区', schoolName: '城关区第九双语幼儿园', classesNum: 12, staffsNum: 44, studentsNum: 382, status: 1 },
          { country: '城关区', schoolName: '拉萨市实验幼儿园', classesNum: 27, staffsNum: 103, studentsNum: 1191, status: 0 },
          { country: '城关区', schoolName: '拉萨市实验幼儿园东城分园', classesNum: 4, staffsNum: 9, studentsNum: 128, status: 0 },
          { country: '城关区', schoolName: '城关区第一幼儿园', classesNum: 8, staffsNum: 23, studentsNum: 320, status: 0 },
          { country: '城关区', schoolName: '城关区第二幼儿园', classesNum: 8, staffsNum: 26, studentsNum: 260, status: 0 },
          { country: '城关区', schoolName: '城关区第三幼儿园', classesNum: 9, staffsNum: 24, studentsNum: 338, status: 0 },
          { country: '城关区', schoolName: '城关区第四幼儿园', classesNum: 4, staffsNum: 14, studentsNum: 270, status: 0 },
          { country: '城关区', schoolName: '城关区第五双语幼儿园', classesNum: 5, staffsNum: 14, studentsNum: 136, status: 0 },
          { country: '城关区', schoolName: '城关区第六幼儿园', classesNum: 5, staffsNum: 13, studentsNum: 152, status: 0 },
          { country: '城关区', schoolName: '城关区第七幼儿园', classesNum: 16, staffsNum: 32, studentsNum: 519, status: 0 },
          { country: '城关区', schoolName: '城关区第八双语幼儿园', classesNum: 9, staffsNum: 22, studentsNum: 357, status: 0 },
          { country: '城关区', schoolName: '城关区第十双语幼儿园', classesNum: 10, staffsNum: 21, studentsNum: 308, status: 0 },
          { country: '城关区', schoolName: '城关区第十一双语幼儿园', classesNum: 8, staffsNum: 13, studentsNum: 184, status: 0 },
          { country: '城关区', schoolName: '城关区第十二双语幼儿园', classesNum: 7, staffsNum: 16, studentsNum: 240, status: 0 },
          { country: '城关区', schoolName: '城关区第十三幼儿园', classesNum: 7, staffsNum: 21, studentsNum: 253, status: 0 },
          { country: '城关区', schoolName: '城关区第十四双语幼儿园', classesNum: 8, staffsNum: 10, studentsNum: 220, status: 0 },
          { country: '城关区', schoolName: '城关区第十六幼儿园', classesNum: 3, staffsNum: 10, studentsNum: 57, status: 0 },
          { country: '城关区', schoolName: '城关区第十九双语幼儿园', classesNum: 2, staffsNum: 8, studentsNum: 59, status: 0 },
          { country: '城关区', schoolName: '城关区北京小学幼儿园', classesNum: 8, staffsNum: 15, studentsNum: 270, status: 0 }
        ],

        // 表单相关
        formVisible: false,
        formTitle: '',
        form: {
          schoolName: '',
          kinderName: '',
          phone: '',
          textarea: '',
          country: '',
          address: ''
        },

        deleteVisible: false,
        deleteForm: {
          schoolName: ''
        }
      }
    },
    mounted: function() {

    },
    methods: {
      /** 
       * 设置弹窗的样式和文字，清空表单
       * @param {String} str: 传人的弹窗的title
      */
      _initFormModel: function(str) {
        this.formTitle = str
        this.formVisible = true
        this.$refs['Form'].resetFields()
      },

      /** 
       * 添加幼儿园点击
      */
      _addGardenClick: function() {
        this._initFormModel('添加幼儿园')
      },

      /** 
       * 查看幼儿园
      */
      _showGardenDetail: function(item) {
        this._initFormModel('查看幼儿园信息')
        this.form.schoolName = item.schoolName
        this.form.kinderName = '刘瑾洁'
        this.form.phone = '18076991336'
        this.form.address = '拉萨市城关区蔡公堂乡（教育城）第九双语幼儿园'
        this.form.textarea = '拉萨市城关区第九双语幼儿园于2015年开始建园，2016年3月开始开园招生,幼儿园地处于拉萨市城关区教育城。幼儿园占地面积19亩，建筑面积8253平方米，有教学楼两栋，办公楼一栋。' +
    '开设班级有大班，中班，小班，可容纳幼儿450余人。' 



    // '我园为幼儿提供轻松健康的生活成长环境，让幼儿在玩中学，学中玩。户外活动场所全部铺设了防滑彩色橡胶，安装了组合滑梯，儿童摇椅，跷跷板等大型活动娱乐设施。室内活动场地有健康区角，美术区角，音乐区角，科学区角，社会区角，语言区角，有声阅览室，舞蹈室等可供幼儿活动的场所。' + 
    // '教室内安装了电脑一体机，钢琴，衣柜，鞋柜等教学生活设备。我园注重教师队伍建设，重视提高教师的综合素质。幼儿园始终坚持以“以一切为了孩子，为了孩子的一切”为服务宗旨，以《幼儿园工作规程》、《幼儿园教育直到纲要》、《3到6岁儿童发展指南》为指针，让幼儿能够德智体美全面发展，给孩子创设一个快乐的环境。' +
    // '办园理念：培养健康活泼的快乐幼儿！成就勤业精业的幸福老师！办园宗旨：让每个幼儿享受快乐的教育，感受成长的快乐！园风：让爱洒遍每个角落'+   
    // '让快乐伴随每个幼儿!园训：微笑面对家长   精心呵护幼儿教风：游戏化  生活化  个性化  综合化'
        // console.log('item:', item)
      },

      /** 
       * 修改幼儿园
      */
      _editGardenDetail: function(item) {
        this._initFormModel('修改幼儿园信息')
        this.form.schoolName = item.schoolName
        this.form.kinderName = '刘瑾洁'
        this.form.phone = '18076991336'
        this.form.address = '拉萨市城关区蔡公堂乡（教育城）第九双语幼儿园'
        this.form.textarea = '拉萨市城关区第九双语幼儿园于2015年开始建园，2016年3月开始开园招生,幼儿园地处于拉萨市城关区教育城。幼儿园占地面积19亩，建筑面积8253平方米，有教学楼两栋，办公楼一栋。' +
    '开设班级有大班，中班，小班，可容纳幼儿450余人。'
    
    // '我园为幼儿提供轻松健康的生活成长环境，让幼儿在玩中学，学中玩。户外活动场所全部铺设了防滑彩色橡胶，安装了组合滑梯，儿童摇椅，跷跷板等大型活动娱乐设施。室内活动场地有健康区角，美术区角，音乐区角，科学区角，社会区角，语言区角，有声阅览室，舞蹈室等可供幼儿活动的场所。' + 
    // '教室内安装了电脑一体机，钢琴，衣柜，鞋柜等教学生活设备。我园注重教师队伍建设，重视提高教师的综合素质。幼儿园始终坚持以“以一切为了孩子，为了孩子的一切”为服务宗旨，以《幼儿园工作规程》、《幼儿园教育直到纲要》、《3到6岁儿童发展指南》为指针，让幼儿能够德智体美全面发展，给孩子创设一个快乐的环境。' +
    // '办园理念：培养健康活泼的快乐幼儿！成就勤业精业的幸福老师！办园宗旨：让每个幼儿享受快乐的教育，感受成长的快乐！园风：让爱洒遍每个角落'+   
    // '让快乐伴随每个幼儿!园训：微笑面对家长   精心呵护幼儿教风：游戏化  生活化  个性化  综合化'
        // console.log('item:', item)
      },

      /** 
       * 删除幼儿园
      */
      _deleteGarden: function(item) {
        this.deleteVisible = true
        this.deleteForm.schoolName = item.schoolName
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .demo-garden
    position relative
    width 100%
    height 100%
    .data-box
      position absolute
      padding 20px
      top 104px
      right 20px
      bottom 20px
      left 20px
      overflow-y auto
      border-radius 10px
      background-color rgb(255, 249, 235)
      box-shadow 0px 0px 15px 0px rgba(0, 0, 0, 0.2),inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
      .data-box-inner
        position relative
        width 100%
        height 100%
        border-radius 5px
        background-color white
        box-shadow 0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)
        .data-select
          padding 20px
        .data-header
          margin 10px 20px 0
          height 40px
          line-height 40px
          padding-right 16px
          font-size 18px
          text-indent 10px
          border-bottom 1px solid #ddd9c6
          color #99601c  
        .show-section
          position absolute
          top 124px
          left 0
          bottom 10px
          right 0
          padding 0 20px 0 20px
          overflow-y auto
          .show-item
            width 100%
            list-style none
            text-indent 12px
            height 40px
            line-height 40px
            color #99601c
            &:hover
              background rgba(117,199,59,.15)
            &:hover .list-icon  
              display inline-block  
            .list-status
              box-sizing content-box
              display inline-block  
              width 100px
              height 24px
              line-height 24px
              border-radius 5px
              text-align center
              text-indent 0
              font-size 12px
              border 1px solid
              color white
            .status-used
              border-color #67cd96
              background-color #67cd96
            .status-noused
              border-color #ff8d77
              background-color #ff8d77
            .list-icon
              display none       

  @media screen and (max-width: 1700px)
    .demo-garden
      .data-box
        top 94px
        right 10px
        bottom 10px
        left 10px
        padding 10px    
</style>
