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
    
  },
  computed:{
    
  }
}
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  
</style>

