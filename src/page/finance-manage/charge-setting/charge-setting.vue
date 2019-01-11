/** 
 * @Desc: 收费
 */
<template>
  <content-box :whiteInner="false">
    <div class="box-container">
      <div class="title">
        <k-button @click.native="addFee"><v-icon size="14" type="icon-add" style="margin-right:12px;"/>新建方案</k-button>
        <div class="charge-opreate">
          <span>收费方案名称</span>
          <Input v-model="chargePlanName" size="large" placeholder="请输入收费方案"></Input>
          <k-button @click.native="searchPlan" :sty="searchSty">搜索</k-button>
          <k-button @click.native="reset" :sty="resetSty">重置</k-button>
        </div>
      </div>
      
      <DataTable :data="tabledata" :titles="titles" @delete="deleteFee" @detail="checkFee" @edit="editFee" @change="changeStatus"/>
      
      <hr/>

      <div class="chargepagination" v-show='!hidden'>
        <pageSwitch :totalNum="total" @currentChange="pageChange"/>
      </div>
      <Modal v-model="deleteModal" title="提示操作"
            @on-ok="confirmDeleteFee"
            @on-cancel="cancelDeleteFee">
        <p class="delete">确认删除该收费方案吗？</p>
      </Modal>
      
      <Modal v-model="addPlanModal" :title="modalTitle"
              @on-ok="submitFormData">
          <ul class="planModalForm">
            <li>
              <label :style="{marginRight:'32px'}"><span class="red">*</span>方案名称</label><Input 
                size="large"
                v-model="addChargePlanForm.title" 
                placeholder="请输入收费方案"/>
                <p v-show="errorChargePlanShow">{{errorChargePlan}}</p>
            </li>
            <li>
              <label><span class="red">*</span>收费时长</label>
              <Select v-model="addChargePlanForm.type" style="width:160px;" placeholder="请选择">
                <Option
                    v-for="item in chargeTime"
                    :value="item.value"
                    :key="item.value">
                    {{ item.label }}
                </Option>
              </Select>
              <p v-show="errorChargeTimeShow">{{errorChargeTime}}</p>
            </li>
            <li>
              <label>方案说明</label>
              <Input v-model="addChargePlanForm.description" type="textarea" :autosize="{minRows: 2}" placeholder="字数限制在100字以内"></Input>
              <p v-show="errorChargeDesShow">{{errorChargeDes}}</p>
            </li>
          </ul>
      </Modal>
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">

import kButton from "component/button/button"
import Time from "component/time"
import DataTable from "component/datatable/datatable.vue"
import {reqAddChargeSet, reqListChargeSet, reqEditChargeSet, reqDeleteChargeSet, reqCheckChargeSet, reqChangeStatus} from "api/finance-manage"
import pageSwitch from "component/page-switch/Pagination.vue"
export default {
  name: "charge-setting",
  components: {
    kButton,
    Time,
    DataTable,
    pageSwitch
  },
  data: function() {
    return {
      status:'',
      modalTitle:'',
      total:100,
      pageSize:10,
      pageIndex:1,
      addChargePlanForm:{
        title:'',
        type:1,
        description:''
      },
      chargePlanName:'',
      addPlanModal:false,
      deleteModal:false,
      feeId:'',
      errorChargePlan:'',
      errorChargePlanShow:false,
      errorChargeTime:'',
      errorChargeTimeShow:false,
      errorChargeDes:'',
      errorChargeDesShow:false,
      chargeTime: [
        {
          value: 1,label: '年收'
        },
        {
          value: 2,label: '期收'
        },
        {
          value: 3,label: '季收'
        },
        {
          value: 4,label: '月收'
        },
      ],
      
      searchSty:{
        background: '#FFFFFF',
        border: '1px solid #99601C',
        borderRadius: '10px',
        color: '#99601C',
        width:'80px',
        height:'40px',
        marginRight:'13px'
      },
      resetSty:{
        background: '#FFFFFF',
        border: '1px solid #FF9902',
        borderRadius: '10px',
        color: '#FF9902',
        width:'80px',
        height:'40px'
      },
      tabledata: [
        
      ],
      titles:[
        {name:'收费方案名称',width:'620px',textleft:'left',paddingLeft:'50px'},
        {name:'收费时长',width:'292px'},
        {name:'收费金额',width:'496px'},
        {name:'收费状态',width:'392px'},
        {name:'方案说明',width:'482px'}
      ]
    }
  },
  watch: {},

  mounted: function() {
    this.getListChargeSet()
  },
  methods: {
    reset(){
      window.location.reload()
    },
    deleteFee(item){
      this.feeId = item.id
      this.deleteModal = true
    },
    editFee(item){

      this.addPlanModal = true
      this.modalTitle = '修改收费方案'
      // let param = Object.assign({},this.addChargePlanForm,item)
      this.addChargePlanForm.title = item.title
      this.addChargePlanForm.type = item.type
      this.addChargePlanForm.description = item.description
      this.addChargePlanForm.status = item.status
      this.addChargePlanForm.id = item.id
    },
    addFee(){
      //清空表单数据
      Object.assign(this.addChargePlanForm,{title:'', type:1, description:''})
      this.addPlanModal = true
      this.modalTitle = '新增收费方案'
    },
    checkFee(item){
      this.$router.push({path:'/finance-manage/charge-setting-detail',query:{chargePlanId:item}})
    },
    //改变状态
    changeStatus(item){
      console.log(item)
      this.reqChangeStatus(item)
    },
    //点击搜索按钮 进行方案的搜索
    searchPlan(){
      this.getListChargeSet(this.chargePlanName)
    },
    //删除收费方案
    confirmDeleteFee(){
      
      reqDeleteChargeSet(this.feeId)
        .then(
          res => {
            if(res.code == '200'){
              this.deleteModal = false
              this.getListChargeSet(this.chargePlanName)
              this.$VMessage('success','删除成功')
            }
          }
        )
        .catch(
          err => console.log(err)
        )
    },
    cancelDeleteFee(){
      // this.$VMessage('error','删除失败')
    },
    //提交数据
    submitFormData(){
      if(this.modalTitle=='修改收费方案'){
        this.editChargePlan()
      }else{
        this.addChargePlan()
      }
    },
    //获取分页数据
    pageChange(index){
      this.pageIndex = index
      this.getListChargeSet()
    },
    //获取列表
    getListChargeSet( title ){
      let name = title ? title : ''
      let param = {
        title:name,
        pagenum:this.pageIndex,
        pagesize:10
      }
      reqListChargeSet(param)
        .then(
          res => {
            if(res.code == 200){
              this.tabledata = res.data.datas
              this.total = res.data.totalCount
            }
          }
        )
        .catch(
          err => console.log(err)
        )
    },
    //切换状态
    reqChangeStatus(param){
      
      reqChangeStatus( param )
        .then(
          res => {
            console.log(res)
          }
        )
        .catch(
          err => {
            console.log(res)
          }
        )
    },
    //新增收费方案
    addChargePlan(){
      let that = this
      let flag = this.validateForm(this.addChargePlanForm)
      if(!flag) return false
      reqAddChargeSet( this.addChargePlanForm ).then(
          res => {
            if(res.code == 200){
              this.addPlanModal = false
              this.getListChargeSet()
              this.$VMessage('success','添加成功')
            }
          }
        )
        .catch(
          err => console.log(err)
        )
    },
    //编辑收费方案
    editChargePlan(){
      reqEditChargeSet( this.addChargePlanForm )
        .then(
          ( res ) => {
            if(res.code == 200){
              this.addPlanModal = false
              this.getListChargeSet()
              this.$VMessage('success','修改成功')
            }
          }
        )
        .catch(
          ( err ) => {
            console.log(err)
          }
        )
    },
    //表单验证
    validateForm( formData ) {
      console.log(formData)
      let name = formData.title
      let planDescription = formData.description
      let time = formData.time

      if(name == ''){
        this.errorChargePlan = '项目名称不能为空'
        this.errorChargePlanShow = true
        return false
      }else if(name.length > 15){
        this.errorChargePlan = '项目名称不能超过15个字'
        this.errorChargePlanShow = true
        return false
      }else{
        this.errorChargePlanShow = false
      }

      if(time == ""){
        this.errorChargeTime = '时长不能为空'
        this.errorChargeTimeShow = true
        return false
      }else{
        this.errorChargePlanShow = false
      }

      
      if(planDescription.length > 100){
        this.errorChargeDes = '描述长度不能超过100个字'
        this.errorChargeDesShow = true
        return false
      }else{
        this.errorChargeDesShow = false
      }
      return true
    },
    //重置表单
    resetForm( name ) {
      this[name].resetFields()
    }
  },
  computed:{
    hidden(){
        let len = this.pageSize
        if( len >= this.total){
          return true
        }else{
          return false
        }
      }
  }
}
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  hr 
    margin-left 50px
    border 1px solid #E0CFBA
  .title
    display inline-block
    margin-bottom 25px
    width 100%
    padding-left 50px
    .ivu-input-wrapper
      width 260px
      margin-right 13px
  .charge-opreate
    float right
    
  .charge-opreate>span
    margin-right 13px
  
  .delete
    text-align center
    margin-top 56px
    margin-bottom 60px
  .ivu-modal-wrap .ivu-btn
    height 40px
    padding 0 25px
    line-height 40px
    font-size 16px
  >>>.ivu-modal-header-inner
    font-size 16px
  >>>.ivu-input
      border 1px solid #99601c!important  
  >>>.ivu-input-wrapper 
    background white 
  >>>.ivu-input-large
    border 1px solid #99601c!important
    
  >>>.ivu-select-selection
    border 1px solid #99601c
    overflow hidden
    color #99601c
  >>>.ivu-modal
    top 26%
  .planModalForm
    text-align center
    .ivu-input-wrapper
      width 260px
    label
      margin-right 30px
    .ivu-select.ivu-select-single
      width 260px !important
      text-align left
      .ivu-select-placeholder
        border 1px solid #99061c
  .planModalForm>li
    margin-bottom 30px
    p
      width 260px
      margin-left 100px
      text-align left
      margin-left 152px
      color red
  
  
  .red
    color red
    display inline-block
    vertical-align middle
    position relative
    right 6px

  .box-container
    padding 25px 25px 25px 25px
    box-shadow 0 0 5px 0 rgba(0,0,0,0.10), inset 1px 0 3px 0 rgba(169,159,136,0.65)
    border-radius 10px
    box-sizing border-box
    height 760px
    position relative
    background white
  
  .chargepagination
    position absolute
    bottom 0
    right 50px
</style>

