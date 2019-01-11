<template>
    <div class="dataTables">

        <table class="inews-table">
            <thead>
                <tr>
                    <th v-show="checkBox" :style="{'width':'72px'}"><span :style="{'width':'72px'}"><CheckBox :totalSelect="isTotal"/><i class="allcheck">全选</i></span></th>
                    <!-- <th class="textleft" :style="{'width':'200px',textAlign:'center'}">收费方案名称</th>
                    <th :style="{'width':'270px'}">收费时长</th>
                    <th :style="{'width':'150px'}">收费金额</th>
                    <th :style="{'width':'150px'}">收费状态</th>
                    <th :style="{'width':'350px'}">方案说明</th> -->
                    <th v-for="item in titles" :style="{'width':item.width,'textAlign':item.textleft?item.textleft:'','paddingLeft':item.paddingLeft?item.paddingLeft:''}">{{ item.name }}</th>
                    <th :style="{'width':'262px'}">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in data' :key="item.id" v-show="data.length">

                    <td v-show="checkBox"><span><CheckBox :label="item.id" :dataArr="dataArr" :all="checkAll" /></span></td>
                    <td class="textleft paddingleft">{{ item.title }}</td>
                    <td>{{ item.type | formatType}}</td>
                    <td>{{ item.total }}</td>
                    <td class="statusico">
                      <img v-focus="item" :src="srcImg"/>
                    </td>
                    <!-- <td><span class="planname" :title="item.planName"></span></td> -->
                    <!-- <td class="textleft"><span class="planname reportName" :title="item.reportName">{{item.reportName}}</span></td> -->
                    <td>{{item.description}}</td>
                    <td>
                      <button @click="$emit('edit',item)" class="btn6030 edit" v-show="edit">修改</button>
                      <button @click="$emit('detail',item)" class="btn6030 detail" v-show="detail">明细</button>
                      <button @click="$emit('delete',item)" class="btn6030 delete" v-show="remove">移除</button>
                    </td>
                </tr>
                <tr v-show="!data.length" class="empty"><td :colspan="titles.length"><img src="../../image/empty_data.png"><p>您还没有添加任何收费方案~</p></td></tr>
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
                {name:'收费金额',width:'496px'},
                {name:'收费状态',width:'392px'},
                {name:'方案说明',width:'482px'}
              ]
            }
          }
        },
        data(){
            return {
              srcImg:'',
                status:0,
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
            },
            changeStatus(id,status){
              console.log(id,status)
              this.$emit('change',{id:id,status:status})
            }
        },
        mounted(){

        },
        computed:{
            // hasTotal(){//当各个复选框被选中时,全选框也被选中
            //     return this.dataArr.length == this.data.length
            // }
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
            }
            
        },
        directives: {
          focus: {
            bind(el,binding,vonode){
              let val = binding.value
              if(val.status == 1){
                el.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAATCAYAAADmtp8+AAAAAXNSR0IArs4c6QAABGpJREFUSA21Vl1MXEUU/mbu3V1giYIGavmpMQZE0yZtiJbW8qMBExNfSE1qUd+Ul1abxqRPJiZqor75Qx+UPpi0abSmUR9MKhgFF1trBJrWaGxAhIYCoYZ0gV12d+4dz5nlwu5yVyDUSe6dmfP7zbnnnLkCPuNY39427eI5C+KAhqjQ0MU+YneMJCAWBPRNB3pASHz2Qcvl3lzjIpNw5LvHagPCOgWpG5ku5CpbrC4zVTa91lqndWjiJQUkPdg+E2gmWoRAv3Sy9Zfry1wmp8cr3+9rtgW+JEopncoo0EnN7MlsdWaQDCyAQrRUdmBn2QGUFVUbs7OxG/htNoIfbpxF0o2z3zkXov2jJy/1s4ABypEM2fbPWmgDUlD4ViK4cpStwTQgHeCB8B4crnsd9xZt9zX4T2wKZ39/G6PRIUgp5pKO08CRtVk6ZFvdDJIY9LmJkAOuJFSO52vehCVsYgm4mjwuDyltuK7CNxMnMTZ/1SNnzeZzu4JA7saRPV0UhBwHGdJ8gKP1Xej69ShG54dKA1J0E7tZcOFIyB5hgU+QBTLX4EMlDaij5+u/3zemw3YJOmreQPcfxzNcZS+9z22pApx49EzeSGZrARzZdy51QIklKK2eImzyEEfRgFo+KK9zQbKhgAxBualcm+vuXUejueLwhkGyQY7sE1UdVF8atmUfovqhCs/MSR+3VeE6VBc/jMpwLe4OlmPftnYjFZSFtN9m9rPxCYxEB9dqUyG7KRe7yprW8tah7CpvwoXxUxQgNNoasoLT0ht+kVRuEgknjpBVhGjyllmn5Tlfldkr7R9p7jiO0igLV3kuNjyXF1fDJV03YFWYYjLFkz+/MR3/yzyPlD6OgekvMBUbMc44R3fe04ihWxfyO8/slfml8nK8Piul1JN5pTIYtghie9GDmI6NZlA3vpyJTmxceFnS0xHCnZRaiwjo1ObJY0rCwgu1b+Gn6fMkxsKbGNxIKLeuTPZvQiktOkw6rEsYB6TjOucynZuel2OyvuxpTC2O4OLM+SyOQ3m5mIpm0XI33DItKtne0TOYnb+Zy867Z9nekdOQpJtSqXMmM1/7cX8/JJoYPQ+/gkpz1r4FKVK6r2UsU/jgTkojsaCwI7AbJ1o/Xtc+67zX24nxxBUEC63Ih22Xmw20paR6mTrnnPdVWdAvsn5o/gukJy8tgUCBhbHFYbz7bSdmo/kjyzyWGVsYJh17Lno71sl2TER5cax/f1PAEl+BrtJVKnM2F+G0RvbbHJxu3VTCQWKeFvEg2mpfRP39Lbjvrh0m72duT2BwvA89108DBUmEwvZcQqmDnzwz2EfW9ApQNv1q/96aoOR7n+5Wj+PNLLCF4YFVSRepJQfJmAOVcE2fZLMcdTskESi0YAdlZGEh3vnps9f+JJapXl8YxyMNreZqFWikiqsk2Tvy42zAUjrzlcqN3FEu0v839OMs9RT1zItKqc+724d7CCAn/kqL8QVKAv/n8Hzy7D3sz2uSHjhvNlj+BXJRuwzwb8rIAAAAAElFTkSuQmCC")
                el.setAttribute('status','1')
              }else{
                el.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAATCAYAAADmtp8+AAAAAXNSR0IArs4c6QAABJRJREFUSA29Vl1sVEUU/mbu3Nulf7oKoa1ifKElwZ8EfWiJS42ktSZKBKu1CfUvlAcTAVMeNLGamEjCA8b4pIWHgqLQgEQxoVA1Ka0Rg1ETLaaADyaUUrFuKf3Zdu+94zmzvZe13V1X03g2996ZM+ec+eb8zQpkoNH6zXVayKeFwAPQuoJEijOILSZrAkJc1hr9QvuHbj31Yc984yKdcXX9M5Ww/H1SiBjzeZGUDUnJc/6lSNApFoMC+2zLh6Yf76n7fFdsWfblgfPBHuFu8bqWWl/iGIlFdSQCp/ERFFSvgbqtzMi6Q1cwe+Z7JI92Q83MQDLoRQLLGzBgA5LePk18IC48vTHa80Evrxug7ElL6TO0HsW9q1DS1gp7+TJeX0DuyFVM7tkH66dBWAQ0L7BLIsB04u+2oqUEZTzkzQXO+NSnSQqsjrtJVLNnKaCApfy9DFLfU4Xo7lezgmRZRQco3f0K3Lur+NSGGGyux37pWci7KkMZuaIcTvu2cM5G2GP8cKTYAfzQOKoc7OV1Obq+uY4OsC4ZcVDatjUvDzGoorYtSBTYqbziuOUgt+NjWA21oYTVshHuu53hPDhkwDCAGSg9QmPdGBW3Inc2sZudxgbYZZnDHRhI/3JqqE0Pw/3oOBxpMih9OTW2Few3tgMceiL7/V0QxNNj41DbnjM879hJ+P3fmTEDZqJiSnmXpjzypNWkpBSxGc9HUc39RujfvJyaNZg8+ClsE7AMmkkXydf2hAvy0YcgIgXwjpwIebkG5M85wDqmqCFUuL4Pp2J5Lp2Ma05FGcZIV1sc+gxeLVsK9fyToa5YQS05mYRYeWfI838YgN99OpzzgD3LXjVj80aF4jn3r/9KnibtLDhx5Q+4HYeMaUFVrna8AExMwf/qG/gXf0ttOTmVdWs+uskGsk/5KoZYMjE0nFUh20JeOqNxgB6reQPc9w4i+Ta1tubHjGeZj8RMNvMhX0IOSQp9P7eEsf6z4UK+g2tfn6U2QtoZoh7YEHdUQFFB6YEL0D/TRTM6BrfzCOy3dsLa1AA4diC64MuB4mhp4fdJd3a2iyoK17qOY3p4ZIFwNkZi+HfS+Rw26aZSfqGkWF0J9WILPALmfdIdCugff0Fy5y4CqSDX3hfyg0GQnzxnsL7rdZk0GKnf3DvpJWOJ1Sux6p03/7GXsqHBl19H4cCvuJk6ssNgc7k1QJDnNwDKteNpfbr0xP5aczONXZ/eWiRVnK/Fc9vbc3qWvX5uRztdoedRZCmobD00T1DpYgwwADkX9vjMrG5lmSC7xKXapx6Ujn30ujsbHVcStzRtwNJYNQpvLze2pi5dxmj/t/jz8GcodbXxZCEBzfu+T0c0bxyAC9gm3FrHtacfLzm13/SuACjLiMGaJ6pKSpyOhOfHJl0X054Ll9oPk01Fs4SAFSvbeDIirUUBaYzTi8Ex8R89Gvd6SbTe1NN5IcW94dH0ubxY21hvKdVEFb2W/nCVU0SK2XNcOA4B5nCbElqkvKT8nqDSHvKg+4TnHS4+eeCLAFDwTffofJ4pNGIGMiZtaH7j8IHG//D9C+4arABhzve+AAAAAElFTkSuQmCC")
                el.setAttribute('status','2')
              }
            },
            inserted: function (el,binding,vonode) {
              let val = binding.value
              el.onclick=function(){
                if( el.getAttribute('status') == '1'){
                  vonode.context.changeStatus(val.id,2)
                  el.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAATCAYAAADmtp8+AAAAAXNSR0IArs4c6QAABJRJREFUSA29Vl1sVEUU/mbu3Nulf7oKoa1ifKElwZ8EfWiJS42ktSZKBKu1CfUvlAcTAVMeNLGamEjCA8b4pIWHgqLQgEQxoVA1Ka0Rg1ETLaaADyaUUrFuKf3Zdu+94zmzvZe13V1X03g2996ZM+ec+eb8zQpkoNH6zXVayKeFwAPQuoJEijOILSZrAkJc1hr9QvuHbj31Yc984yKdcXX9M5Ww/H1SiBjzeZGUDUnJc/6lSNApFoMC+2zLh6Yf76n7fFdsWfblgfPBHuFu8bqWWl/iGIlFdSQCp/ERFFSvgbqtzMi6Q1cwe+Z7JI92Q83MQDLoRQLLGzBgA5LePk18IC48vTHa80Evrxug7ElL6TO0HsW9q1DS1gp7+TJeX0DuyFVM7tkH66dBWAQ0L7BLIsB04u+2oqUEZTzkzQXO+NSnSQqsjrtJVLNnKaCApfy9DFLfU4Xo7lezgmRZRQco3f0K3Lur+NSGGGyux37pWci7KkMZuaIcTvu2cM5G2GP8cKTYAfzQOKoc7OV1Obq+uY4OsC4ZcVDatjUvDzGoorYtSBTYqbziuOUgt+NjWA21oYTVshHuu53hPDhkwDCAGSg9QmPdGBW3Inc2sZudxgbYZZnDHRhI/3JqqE0Pw/3oOBxpMih9OTW2Few3tgMceiL7/V0QxNNj41DbnjM879hJ+P3fmTEDZqJiSnmXpjzypNWkpBSxGc9HUc39RujfvJyaNZg8+ClsE7AMmkkXydf2hAvy0YcgIgXwjpwIebkG5M85wDqmqCFUuL4Pp2J5Lp2Ma05FGcZIV1sc+gxeLVsK9fyToa5YQS05mYRYeWfI838YgN99OpzzgD3LXjVj80aF4jn3r/9KnibtLDhx5Q+4HYeMaUFVrna8AExMwf/qG/gXf0ttOTmVdWs+uskGsk/5KoZYMjE0nFUh20JeOqNxgB6reQPc9w4i+Ta1tubHjGeZj8RMNvMhX0IOSQp9P7eEsf6z4UK+g2tfn6U2QtoZoh7YEHdUQFFB6YEL0D/TRTM6BrfzCOy3dsLa1AA4diC64MuB4mhp4fdJd3a2iyoK17qOY3p4ZIFwNkZi+HfS+Rw26aZSfqGkWF0J9WILPALmfdIdCugff0Fy5y4CqSDX3hfyg0GQnzxnsL7rdZk0GKnf3DvpJWOJ1Sux6p03/7GXsqHBl19H4cCvuJk6ssNgc7k1QJDnNwDKteNpfbr0xP5aczONXZ/eWiRVnK/Fc9vbc3qWvX5uRztdoedRZCmobD00T1DpYgwwADkX9vjMrG5lmSC7xKXapx6Ujn30ujsbHVcStzRtwNJYNQpvLze2pi5dxmj/t/jz8GcodbXxZCEBzfu+T0c0bxyAC9gm3FrHtacfLzm13/SuACjLiMGaJ6pKSpyOhOfHJl0X054Ll9oPk01Fs4SAFSvbeDIirUUBaYzTi8Ex8R89Gvd6SbTe1NN5IcW94dH0ubxY21hvKdVEFb2W/nCVU0SK2XNcOA4B5nCbElqkvKT8nqDSHvKg+4TnHS4+eeCLAFDwTffofJ4pNGIGMiZtaH7j8IHG//D9C+4arABhzve+AAAAAElFTkSuQmCC")
                  el.setAttribute('status','2')
                }else{
                  vonode.context.changeStatus(val.id,1)
                  el.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAATCAYAAADmtp8+AAAAAXNSR0IArs4c6QAABGpJREFUSA21Vl1MXEUU/mbu3V1giYIGavmpMQZE0yZtiJbW8qMBExNfSE1qUd+Ul1abxqRPJiZqor75Qx+UPpi0abSmUR9MKhgFF1trBJrWaGxAhIYCoYZ0gV12d+4dz5nlwu5yVyDUSe6dmfP7zbnnnLkCPuNY39427eI5C+KAhqjQ0MU+YneMJCAWBPRNB3pASHz2Qcvl3lzjIpNw5LvHagPCOgWpG5ku5CpbrC4zVTa91lqndWjiJQUkPdg+E2gmWoRAv3Sy9Zfry1wmp8cr3+9rtgW+JEopncoo0EnN7MlsdWaQDCyAQrRUdmBn2QGUFVUbs7OxG/htNoIfbpxF0o2z3zkXov2jJy/1s4ABypEM2fbPWmgDUlD4ViK4cpStwTQgHeCB8B4crnsd9xZt9zX4T2wKZ39/G6PRIUgp5pKO08CRtVk6ZFvdDJIY9LmJkAOuJFSO52vehCVsYgm4mjwuDyltuK7CNxMnMTZ/1SNnzeZzu4JA7saRPV0UhBwHGdJ8gKP1Xej69ShG54dKA1J0E7tZcOFIyB5hgU+QBTLX4EMlDaij5+u/3zemw3YJOmreQPcfxzNcZS+9z22pApx49EzeSGZrARzZdy51QIklKK2eImzyEEfRgFo+KK9zQbKhgAxBualcm+vuXUejueLwhkGyQY7sE1UdVF8atmUfovqhCs/MSR+3VeE6VBc/jMpwLe4OlmPftnYjFZSFtN9m9rPxCYxEB9dqUyG7KRe7yprW8tah7CpvwoXxUxQgNNoasoLT0ht+kVRuEgknjpBVhGjyllmn5Tlfldkr7R9p7jiO0igLV3kuNjyXF1fDJV03YFWYYjLFkz+/MR3/yzyPlD6OgekvMBUbMc44R3fe04ihWxfyO8/slfml8nK8Piul1JN5pTIYtghie9GDmI6NZlA3vpyJTmxceFnS0xHCnZRaiwjo1ObJY0rCwgu1b+Gn6fMkxsKbGNxIKLeuTPZvQiktOkw6rEsYB6TjOucynZuel2OyvuxpTC2O4OLM+SyOQ3m5mIpm0XI33DItKtne0TOYnb+Zy867Z9nekdOQpJtSqXMmM1/7cX8/JJoYPQ+/gkpz1r4FKVK6r2UsU/jgTkojsaCwI7AbJ1o/Xtc+67zX24nxxBUEC63Ih22Xmw20paR6mTrnnPdVWdAvsn5o/gukJy8tgUCBhbHFYbz7bSdmo/kjyzyWGVsYJh17Lno71sl2TER5cax/f1PAEl+BrtJVKnM2F+G0RvbbHJxu3VTCQWKeFvEg2mpfRP39Lbjvrh0m72duT2BwvA89108DBUmEwvZcQqmDnzwz2EfW9ApQNv1q/96aoOR7n+5Wj+PNLLCF4YFVSRepJQfJmAOVcE2fZLMcdTskESi0YAdlZGEh3vnps9f+JJapXl8YxyMNreZqFWikiqsk2Tvy42zAUjrzlcqN3FEu0v839OMs9RT1zItKqc+724d7CCAn/kqL8QVKAv/n8Hzy7D3sz2uSHjhvNlj+BXJRuwzwb8rIAAAAAElFTkSuQmCC")
                  el.setAttribute('status','1')
                }
              }
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
    .inews-table tr .statusico>img{
      margin-top:auto
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
  .inews-table tbody .empty:hover{
    background:white
  }
</style>
