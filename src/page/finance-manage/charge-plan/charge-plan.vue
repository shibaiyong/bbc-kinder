/** 
 * @Desc: 收费
 */
<template>
  <content-box :whiteInner="false">

    <div class="box-container">
      <div class="title">
        <k-button :sty="addSty" @click.native="addFee"><v-icon size="14" type="icon-add" style="margin-right:12px;"/>新增明细</k-button>
      </div>
      <div class="inputgroup">
        <ul class="selectinfo">
          <li>
            <label>班级</label>
            <Select v-model="addChargePlanForm.type" style="width:160px;" placeholder="请选择">
              <Option
                  v-for="item in chargeTime"
                  :value="item.value"
                  :key="item.value">
                  {{ item.label }}
              </Option>
            </Select>
          </li>
          <li>
            <label>基本状态</label>
            <Select v-model="addChargePlanForm.type" style="width:160px;" placeholder="请选择">
              <Option
                  v-for="item in chargeTime"
                  :value="item.value"
                  :key="item.value">
                  {{ item.label }}
              </Option>
            </Select>
          </li>
          <li>
            <label>支付状态</label>
            <Select v-model="addChargePlanForm.type" style="width:160px;" placeholder="请选择">
              <Option
                  v-for="item in chargeTime"
                  :value="item.value"
                  :key="item.value">
                  {{ item.label }}
              </Option>
            </Select>
          </li>
        </ul>
        <div class="calender">
          <div class="starttime">
            <label>开单时间</label>
            <DatePicker
              size="small"
              type="date"
              placeholder="请选择日期"
              :value="birthday"
              :options="birthdayOption"
              @on-change="(value) => { birthday = value }"
              style="width: 220px">
            </DatePicker>
          </div>
          <span class="go">到</span>
          <div class="endtime">
            <DatePicker
              size="small"
              type="date"
              placeholder="请选择日期"
              :value="birthday"
              :options="birthdayOption"
              @on-change="(value) => { birthday = value }"
              style="width: 220px">
            </DatePicker>
          </div>
          <div class="student">
            <label :style="{marginRight:'15px'}">收费金额</label><Input size="large"
              v-model="addChargePlanForm.money"
              placeholder="请输入收费金额"/>
          </div>
          <div class="buttons">
            <k-button @click.native="searchPlan" :sty="searchSty">搜索</k-button>
            <k-button @click.native="reset" :sty="resetSty">重置</k-button>
            <k-button @click.native="reset" :sty="resetSty">导出</k-button>
          </div>
        </div>
      </div>

      <DataTable :data="tabledata" :titles="titles" @delete="deleteFee" @detail="checkFee" @edit="editFee" :checkBox="true"></DataTable>

    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  // 工具
  import { sessionStorageUtil , getCurrentDate, localStorageUtil} from 'lib/util'
  // 组件
  import kButton from "component/button/button"
  import DataTable from "page/finance-manage/charge-plan/plandatatable/plandatatable.vue"

  // 接口
  import { requestGetTypeList, requestGetDocumentList } from 'api/document-module'

  export default {
    name: 'charge-plan',
    components: {
      kButton,
      DataTable
    },
    data:function() {
      return {
        birthday:'',
        searchSty:{
          background: '#FFFFFF',
          border: '1px solid #99601C',
          borderRadius: '10px',
          color: '#99601C',
          width:'80px',
          height:'40px',
          marginRight:'15px'
        },
        resetSty:{
          background: '#FFFFFF',
          border: '1px solid #FF9902',
          borderRadius: '10px',
          color: '#FF9902',
          width:'80px',
          height:'40px',
          marginRight:'15px'
        },
        addSty:{
          marginRight:'31px'
        },
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
          }
        ],
        addChargePlanForm:{
          title:'',
          type:1,
          description:'',
          money:''
        },
        tabledata:[
          {id:1,chargeProjectId:1,money:200,description:'ahahah'},
          {id:2,chargeProjectId:2,money:200,description:'ahahah'},
          {id:3,chargeProjectId:3,money:200,description:'ahahah'},
          {id:4,chargeProjectId:4,money:200,description:'ahahah'}
        ],
        titles:[
          {name:'收费方案名称',width:'620px',textleft:'left',paddingLeft:'50px'},
          {name:'收费时长',width:'292px'},
          {name:'收费金额',width:'496px'}       
        ]
      }
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    mounted() {
      
    },
    methods: {
      addFee(){
        this.$router.push('/finance-manage/charge-plan-add')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .box-container
    padding 25px 25px 25px 25px
    box-shadow 0 0 5px 0 rgba(0,0,0,0.10), inset 1px 0 3px 0 rgba(169,159,136,0.65)
    border-radius 10px
    box-sizing border-box
    background white
    height 760px

  .starttime,.endtime,.student,.buttons
    display inline-block
    vertical-align middle
  .student
    margin-left 40px
    margin-right 20px
  .selectinfo,.calender
    overflow hidden
  
  .calender
    margin-top 15px
    >>>.ivu-input
      border 1px solid #99601c!important
      height 40px
    .go
      display inline-block
      vertical-align middle
      margin 0 20px

  .selectinfo>li
    float left
    margin-right 40px
  .inputgroup
    margin-bottom 15px
  .inputgroup label
    color #99601C
    font-weight bold
  
  .selectinfo
    margin-top 15px
    >>>.ivu-modal-header-inner
      font-size 16px
    >>>.ivu-input
      border 1px solid #99601c!important  
    >>>.ivu-input-wrapper 
      background white 
      width 260px
    >>>.ivu-input-large
      border 1px solid #99601c!important
    >>>.ivu-select-selection
      border 1px solid #99601c
      overflow hidden
      color #99601c
      height 40px
    >>>.ivu-select-selected-value
      height 40px
    >>>.ivu-modal
      top 26%
  
  .ivu-input-wrapper
      width 260px
    label
      margin-right 15px
    .ivu-select.ivu-select-single
      width 260px !important
      text-align left
</style>
