/** 
 * @Desc: demo演示园长信息
 */
<template>
  <div class="demo-kinder">
    <v-header></v-header>
    <!-- 数据展示 -->
    <div class="data-box">
      <div class="data-box-inner">
        <!-- 头部操作区域 -->
        <section class="data-select clear-float">
          <!-- 下拉框 -->
          <Select v-model="model1" style="width:200px;float:left;margin-right: 20px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 搜索框 -->
          <searchbar 
            ref="searchbar"
            class="float-right"
            @search="_search"
            style="margin-top: 4px;width: 250px" 
            placeholder="请输入学校/园长姓名/联系电话">
          </searchbar>
        </section>

        <!-- 数据头部-->
        <section class="data-header">
          <Col span="6">园所</Col>
          <Col span="3">区县</Col>
          <Col span="3">园长姓名</Col>
          <Col span="12">联系电话</Col>
        </section>

        <!-- 数据盒子 -->
        <ul class="show-section">
          <li class="show-item" v-for="(kinder, index) in kinderDatas" :key="index">
            <Col span="6">{{kinder.schoolName ? kinder.schoolName : '--'}}</Col>
            <Col span="3">{{kinder.country ? kinder.country : '--'}}</Col>
            <Col span="3">{{kinder.kinderName ? kinder.kinderName : '--'}}</Col>
            <Col span="12">
              <Col span="3" class="no-wrap">{{kinder.phone ? kinder.phone : '--'}}</Col>
              <Col span="6" style="text-align:center">
                <Icon 
                  type="edit"
                  v-if="kinder.status === 1" 
                  class="clickable list-icon" 
                  style="margin: 0 10px"
                  title="编辑"
                  @click.native.stop='_editKinder(kinder)' 
                  :size="22">
                </Icon>
              </Col>
            </Col>
          </li>
        </ul>
      </div>
    </div>

    <!-- 弹窗 -->
    <Modal
      v-model="formVisible">
      <div slot="header" style="color: white">修改园长信息</div>
      <Form 
        :model="form"
        :rules="form"
        :labelWidth="90"
        style="padding:0 30px;"
        ref="Form">
         <!-- 学校名称 -->
        <FormItem prop="schoolName" label="学校名称">
          <Input v-model="form.schoolName" placeholder="请输入学校名称" style="width:260px" disabled/>
        </FormItem>
        <!-- 园长姓名 -->
        <FormItem prop="kinderName" label="园长姓名">
          <Input v-model="form.kinderName" placeholder="请输入园长姓名" style="width:260px"/>
        </FormItem>
        <!-- 园长电话 -->
        <FormItem prop="phone" label="园长电话">
          <Input v-model="form.phone" placeholder="请输入园长电话" :maxlength="11" style="width:260px"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <button 
          class="ivu-btn"
          style="margin-left: 170px" 
          disabled="disabled">修改
        </button>
        <button 
          style="margin-left: 20px"
          @click="formVisible = false" 
          class="ivu-btn ivu-btn-primary">取消
        </button>
      </div>
    </Modal>  
  </div>
</template>

<script type="text/ecmascript-6">
  import Searchbar from 'component/searchbar'

  export default {
    name: 'demo-kinder',
    components: {
      Searchbar
    },  
    data: function() {
      return {
        model1: '城关区',
        cityList: [
          {
            value: '城关区',
            label: '城关区'
          }
        ],

        // 园长数据
        kinderDatas: [
          { country: '城关区', schoolName: '城关区第九双语幼儿园', kinderName: '刘瑾洁', phone: 18076991336, status: 1 },
          { country: '城关区', schoolName: '拉萨市实验幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '拉萨市实验幼儿园东城分园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第一幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第二幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第三幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第四幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第五双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第六幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第七幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第八双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十一双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十二双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十三幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十四双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十六幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区第十九双语幼儿园', kinderName: '--', phone: '--', status: 0 },
          { country: '城关区', schoolName: '城关区北京小学幼儿园', kinderName: '--', phone: '--', status: 0 }
        ],

        // 修改的弹窗
        formVisible: false,
        form: {
          schoolName: '',
          kinderName: '',
          phone: ''
        }
      }
    },
    mounted: function() {

    },
    methods: {
      /** 
       * 搜索框
      */
      _search: function(val) {
        // console.log('val:', val)
      },

      /** 
       * 编辑园长点击
      */
      _editKinder: function(item) {
        this.formVisible = true
        this.$refs['Form'].resetFields()
        this.form.schoolName = item.schoolName
        this.form.kinderName = item.kinderName
        this.form.phone = item.phone
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  .demo-kinder
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
          text-indent 2px
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
            text-indent 4px
            height 40px
            line-height 40px
            color #99601c
            &:hover
              background rgba(117,199,59,.15)
            &:hover .list-icon  
              display inline-block
            .list-icon
              display none         

  @media screen and (max-width: 1700px)
    .demo-kinder
      .data-box
        top 94px
        right 10px
        bottom 10px
        left 10px
        padding 10px 
</style>
