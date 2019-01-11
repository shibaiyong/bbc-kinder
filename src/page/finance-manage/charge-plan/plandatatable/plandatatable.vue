<template>
  <div class="dataTables">
    <table class="inews-table">
      <thead>
        <tr>
          <th v-show="checkBox" :style="{'width':'72px'}"><span :style="{'width':'72px'}"><CheckBox :totalSelect="isTotal" :allSelect="hasTotal"/><span class="allcheck">全选</span></span></th>
          <th v-for="item in titles" :style="{'width':item.width,'textAlign':item.textleft?item.textleft:'','paddingLeft':item.paddingLeft?item.paddingLeft:''}">{{ item.name }}</th>
          <th :style="{'width':'262px'}">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='item in data' :key="item.id" v-show="data.length">
          <td v-show="checkBox"><span><CheckBox :label="item.id" :dataArr="dataArr" :all="checkAll" /></span></td>
          <td class="textleft paddingleft">{{ item.chargeProjectId | formatFee }}</td>
          <td>{{ item.money}}</td>
          <td>{{ item.description }}</td>
          <td>
            <button @click="$emit('edit',item)" class="btn6030 edit" v-show="edit">修改</button>
            <button @click="$emit('detail',item)" class="btn6030 detail" v-show="detail">明细</button>
            <button @click="$emit('delete', item)" class="btn6030 delete" v-show="remove">移除</button>
          </td>
        </tr>
        <tr v-show="!data.length" class="empty"><td :colspan="titles.length+1"><img src="../../../../image/empty_data.png"><p>您还没有添加任何收费明细~</p></td></tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    import axios from "axios"
    import CheckBox from "component/checkbox/checkbox"
    import kButton from "component/button/button"
    // import { deleteAllBulletinList, eventBus, downloadBulletinList, url } from "@/assets/js/api.js"
    export default {
        name:'dataTables',
        props:['data','checkBox'],
        props:{
          totalMoney:{
            type:[String,Number],
            default:100
          },
          data:{
            type:Array
          },
          checkBox:{
            type:Boolean,
            default:false
          },
          edit:{
            type:Boolean,
            default:true
          },
          remove:{
            type:Boolean,
            default:true
          },
          detail:{
            type:Boolean,
            default:true
          },
          titles:{
            type:Array,
            default:function(){
              return [
                {name:'收费方案名称',width:'520px'},
                {name:'收费时长',width:'292px'},
                {name:'收费金额',width:'496px'}
              ]
            }
          }
        },
        data(){
            return {
                tabledata:[],
                right:true,
                id:'',
                checkAll:'',
                dataArr:[]
            }
        },
        created(){
            // eventBus.$on('deleteAllBulletinList', params => {
            //     this.deleteAllBulletinList();
            // })
        },
        updated(){

        },
        methods:{
          isTotal(total){//全选框对外触发的方法。复选框全部被选中。
              this.checkAll = total;
          }
        },
        mounted(){

        },
        computed:{
            hasTotal(){//当各个复选框被选中时,全选框也被选中
                return this.dataArr.length == this.data.length
            }
        },
        filters:{
            formatType( value ){
                if ( value == '1' ){
                    return '年度'
                }else if( value == '2' ){
                    return '期间'
                }else if( value == '3' ){
                    return '季度'
                }else if( value == '4'){
                    return '月度'
                }
            },
            formatFee( value ){
                if ( value == '1' ){
                    return '托管费'
                }else if( value == '2' ){
                    return '餐饮费'
                }else if( value == '3' ){
                    return '保教费'
                }else if( value == '4'){
                    return '其他'
                }
            }
            
        },
        components:{
            CheckBox,
            kButton
        }
    }

</script>
<style scoped>

    .dataTables{
        width:100%;
    }
    /* 表格固定布局 */
    .inews-table{
        width:100%;
        word-break: break-all; word-wrap: break-word;
        font-size: 14px;
        color: #555555;
        border-collapse:collapse;
    }
    /* 按钮的公共样式 */
    .btn6030{
      /*width:24%; */
      height:30px;
      margin:4% 2%;
        /* font-size: 0.8%; */

    }



    .inews-table .textleft{
        text-align: left
    }
    .inews-table td,.inews-table th{
        text-align: center;
        border:none;
        vertical-align: middle;
        color: #99601C;
    }
    .inews-table th{
        height: 40px;
        font-weight: bold;
        font-size: 16px;
        background: rgba(204,204,204,0.20);
    }
    /* .inews-table th span{
        display: inline-block;
    } */
    /* .inews-table tr{
        border-top:1px solid #ccc;
    }
    .inews-table tr:last-child{
        border-bottom:1px solid #ccc;
    } */
    .inews-table tr td{
        height:58px;
    }
    .inews-table tr td span{
     display: block;
    }


    .inews-table tr td>img{
      margin-top:96px;
    }

    .inews-table tr td>p{
      font-size: 14px;
      color: #99601C;
      text-align: center;
      margin-top:20px;
    }

    .inews-table tbody tr:hover{
      background: rgba(117,199,59,0.15)
    }
      
    .inews-table tbody .empty:hover{
      background:white
    }
  .allcheck{
      display:inline-block;
      margin-left:24px;
      position:relative;
      right: 16px;
      vertical-align: middle;
      font-weight: bold;
  }
  .planname{
    width: 170px;
    height: 58px;
    line-height: 58px;
    display: block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .reportName{
    width: 280px;
  }

  .edit{
    color:#FF9902
  }
    
  .detail{
    color:#5494EA
  }
    
  .delete{
    color:#F84B62
  }
  .paddingleft{
    padding-left:50px
  }
</style>
