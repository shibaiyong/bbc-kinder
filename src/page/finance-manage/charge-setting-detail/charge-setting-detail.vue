/** 
 * @Desc: 收费
 */
<template>
  <content-box :whiteInner="false">
    <div class="box-container">
    <div class="title">
      <k-button :sty="addSty" @click.native="addFee"><v-icon size="14" type="icon-add" style="margin-right:12px;"/>新增明细</k-button>
      <k-button :sty="searchSty" @click.native="goback">返回</k-button>
    </div>
    
    <span class="chargePlan">收费方案:&nbsp;{{chargePlanName}}</span><span class="chargeType">收费类型:&nbsp;{{chargeType | formatType}}</span>
    
    <DataTable :titles="titles" :data="tabledata" :totalMoney="allMoney" @delete="deleteFee" @edit="editFee" :detail="false"/>

    <Modal v-model="deleteModal" title="提示操作"
          @on-ok="confirmDeleteFee"
          @on-cancel="cancelDeleteFee">
      <p class="delete">确认删除该收费明细吗？</p>
    </Modal>
    
    <Modal v-model="addPlanModal" :title="addPlanModalMes"
            @on-ok="submitFormData">
        <ul class="planModalForm">
          <li>
            <label><span class="red">*</span>方案名称</label>
            <Select v-model="addChargePlanForm.feeItemId" style="width:160px;">
              <Option
                  v-for="item in chargeTime"
                  :value="item.idSetting"
                  :key="item.idSetting">
                  {{ item.valueSetting }}
              </Option>
            </Select>
          </li>
          <li>
            <label :style="{marginRight:'32px'}"><span class="red">*</span>收费金额</label><Input 
              size="large"
              v-model="addChargePlanForm.money" 
              placeholder="请输入收费金额"/></li>
          <li>
          <li>
            <label>项目说明</label>
            <Input v-model="addChargePlanForm.description" type="textarea" :autosize="{minRows: 2}" placeholder="字数限制在100字以内"></Input>
          </li>
        </ul> 
    </Modal>
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">

import kButton from "component/button/button"

import Selectbar from "component/selectbar"
import Time from "component/time"
import DataTable from "page/finance-manage/charge-setting-detail/datatable/datatable.vue"
import {reqEditChargeSetDetail, reqDeleteChargeSetDetail, reqAddChargeSetDetail, reqListChargeSetDetail, reqChargeName} from "api/finance-manage"
export default {
  name: "charge-set-detail",
  components: {

    kButton,

    Selectbar,
    Time,
    DataTable
  },
  data: function() {
    return {
      allMoney:0,
      chargePlanName:'',
      chargeType:'',
      total:100,
      pageSize:10,
      pageIndex:1,
      addChargePlanForm:{
        money:'',
        feeItemId:'',
        description:'',
        sortOrder:0
      },
      addPlanModalMes:'新增方案明细',
      addPlanModal:false,
      deleteModal:false,
      chargeSchemaId:'',
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
      addSty:{
        marginRight:'31px'
      },
      chargeTime: [
        {
          idSetting: 1,valueSetting: '托管费'
        },
        {
          idSetting: 2,valueSetting: '餐饮费'
        },
        {
          idSetting: 3,valueSetting: '保教费'
        },
        {
          idSetting: 4,valueSetting: '其他'
        },
      ],
      
      tabledata: [
        
      ],
      titles:[
        {name:'收费明细',width:'620px',textleft:'left',paddingLeft:'50px'},
        {name:'收费金额',width:'496px'},
        {name:'方案说明',width:'482px'}
      ]
    }
  },
  watch: {},

  mounted: function() {
    let item = this.$route.query.chargePlanId
    this.chargePlanName = item.title
    this.chargeType = item.type
    this.getListChargeSetDetail(item.id)

    this.reqChargeName()
  },
  methods: {
    deleteFee(item){
      console.log(item)
      this.chargeSchemaId = item.id
      this.deleteModal = true
      
    },
    editFee(item){
      this.addPlanModalMes = '修改收费明细'
      this.addPlanModal = true
      this.addChargePlanForm.description = item.description
      this.addChargePlanForm.money = item.money
      this.addChargePlanForm.id = item.id
      this.addChargePlanForm.feeItemId = item.chargeProjectId
      this.addChargePlanForm.chargeSchemaId = item.chargeSchemaId
    },
    addFee(){
      //新增之前清空输入框
      Object.assign(this.addChargePlanForm,{
        money:'',
        feeItemId:'',
        description:'',
        sortOrder:0
      })
      this.addPlanModalMes = '新增收费明细'
      this.addPlanModal = true
    },
    
    //删除收费方案
    confirmDeleteFee(){
      
      this.deleteChargeSetDetail(this.chargeSchemaId)
    },
    cancelDeleteFee(){
      // this.$VMessage('error','删除失败')
    },
    //提交数据
    submitFormData(){
      if(this.addPlanModalMes=='修改收费明细'){
        this.editChargePlan()
      }else{
        this.addChargePlan()
      }
    },
    //获取分页数据
    pageChange(index){
      this.pageIndex = index
      this.getListChangeSet()
    },
    reqChargeName(){
      reqChargeName()
        .then(
          res => {
            if(res.code == 200){
              this.tabledata = res.data
            }
          }
        )
        .catch(
          err => {
            console.log(err)
          }
        )
    },
    //新增收费方案
    addChargePlan(){
      this.addPlanModal = true
      let param = this.addChargePlanForm
      let item = this.$route.query.chargePlanId
      reqAddChargeSetDetail(param,item.id).then(
          res => {
            if(res.code == 200){
              this.addPlanModal = false
              this.getListChargeSetDetail(item.id)
              this.$VMessage('success','添加成功')
            }else if(res.code == 203){
              this.$VMessage('error',res.msg)
            }
          }
        )
        .catch(
          err => console.log(err)
        )
    },
    //获取列表
    getListChargeSetDetail( id ){
      reqListChargeSetDetail(id)
        .then(
          res => {
            if(res.code == 200){
              console.log( res.data )
              this.tabledata = res.data
              this.total = res.data.totalCount
              var allmoney = 0
              for( let i = 0; i < res.data.length; i++ ){
                allmoney += res.data[i].money
              }
              this.allMoney = allmoney
            }
          }
        )
        .catch(
          err => console.log(err)
        )
    },
    //删除
    deleteChargeSetDetail(id){
      reqDeleteChargeSetDetail(id)
        .then(
          res => {
            if(res.code == 200){
              let item = this.$route.query.chargePlanId
              //刷新数据
              this.getListChargeSetDetail(item.id)
              this.deleteModal = false
              this.$VMessage('success','删除成功')
            }
          }
        )
        .catch(
          err => {
            console.log(err)
          }
        )
    },
    //编辑收费方案
    editChargePlan(){
      console.log(this.addChargePlanForm)
      reqEditChargeSetDetail(this.addChargePlanForm)
        .then(
          res => {
            if(res.code == 200){
              let item = this.$route.query.chargePlanId
              this.getListChargeSetDetail(item.id)
              this.addPlanModal = false
              this.$VMessage('success','修改成功')
            }else if(res.code == 203){
              this.addPlanModal = false
              this.$VMessage('error',res.msg)
            }
          }
        )
        .catch(
          err => {
            console.log(err)
          }
        )
    },
    goback(){
      this.$router.go(-1)
    }
  },
  filters:{
    formatType( value ){
        if ( value == '1' ){
            return '年收'
        }else if( value == '2' ){
            return '期收'
        }else if( value == '3' ){
            return '季收'
        }else if( value == '4'){
            return '月收'
        }
    }       
  }
};
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  .title
    display inline-block
    margin-bottom 25px
    width 100%
    padding-left 50px
  .charge-opreate
    float right
  .charge-opreate>span
    margin-right 13px

  .chargePlan
    color #99601C
    margin-right 30px
    margin-bottom 25px
    margin-left 50px
    display:inline-block
  .chargeType
    color #99601C
    display inline-block
    margin-bottom 25px
  // .title 
  //   .charge-opreate
  //     .calenderWrapper
  //       width 260px
  //       .inputCalender
  //         background #FFFFFF
  //         border 1px solid #99601C
  //         border-radius 10px
  //         height 40px
  //       .inputCalender input
  //             background white !important
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
  .planModalForm>li
    margin-bottom 30px
  

  .red
    color red
    display inline-block
    vertical-align middle
    position relative
    right 6px

  >>>.ivu-modal-header-inner
    font-size 16px
  >>>.ivu-modal
    top 26%
  
  .box-container
    padding 25px 25px 25px 25px
    box-shadow 0 0 5px 0 rgba(0,0,0,0.10), inset 1px 0 3px 0 rgba(169,159,136,0.65)
    border-radius 10px
    box-sizing border-box
    background white
    height 760px
</style>

