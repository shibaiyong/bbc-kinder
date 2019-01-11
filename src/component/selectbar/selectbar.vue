/** 
 * @Desc: 模拟的选择下拉框
 */
<template>
  <!-- 模拟select展示框 -->
  <div class="select-bar" ref="slbar" @click.stop="getFlag()">
    <!-- 右侧小三角标签 -->
    <div class="select-icon" :class="{'down-icon':isFlag,'up-icon':!isFlag}" ></div>
    <!-- 左侧的宽度展示的内容 -->
    <div class="select-input">
      <span ref="span">分类：请选择分类</span>
    </div>
    <!-- 下面需要显示的列表内容 -->
    <div class="select-list" v-show='isFlag'>
      <ul>
        <li v-for="(item,index) in itemList"  @click="getActive(item.categoryId)"  class="select-li" :class="{'select-active':item.isActive}">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {requestGetTypeList} from 'api/document-module'
  import {getParams,sessionStorageUtil} from 'lib/util'

  export default {
    name: 'select-bar',
    props: {
      wd:{
        type:String,
        default:'0',
        required:true
      },
      lf:{
        type:String,
        default:'0'
      },
      tp:{
        type:String,
        default:'0'
      }
    },
    data: function() {
      return {
        isFlag:false,//false是向下的 true是向上的 
        itemList:[]
      }
    },
    watch: {
      wd: {
        immediate: true,
        handler: function(val, oldVal) {
          var that=this;
          that.$nextTick(function(){
             that.$refs.slbar.style.width=val+'px'
          })
        }
      },
      lf: {
        immediate:true,
        handler:function(val,oldVal){
          var that=this
          that.$nextTick(function(){
            that.$refs.slbar.style.left = val + 'px'
          })
        }
      },
      tp:{
        immediate:true,
        handler:function(val,oldVal){
          var that=this
          that.$nextTick(function(){
             that.$refs.slbar.style.top = val + 'px'
          })
        }
      }
    },
    methods: {
      getFlag: function(){
        this.isFlag=!this.isFlag;
      },

      getCategoryData(_id){
        var self_this = this;
        requestGetTypeList({'type': 1}).then((res)=>{
          if(res.code == '200' && !!res.data && res.data['categoryList'].length>0){
            self_this.itemList = res.data['categoryList'].filter((item)=>{
              return item.categoryId !== 1 && item.categoryId !== 2
            })
            self_this.getActive(+_id)
          }
        })
      },

      getActive: function(_id){
        var cont = '请选择分类'
        var that = this
        this.itemList.forEach(function(ele,index){
          if(_id != null && typeof Number(_id) == 'number'){
            ele.categoryId==_id ? ele.isActive=true : ele.isActive = false
            //将选中的item.content内容放入到span里面去
            if(ele.categoryId == _id){
              cont = ele.title
              that.$nextTick(function(){
                that.$refs.span.innerText = cont
                //回传给父组件
                that.$emit('curCategoryEvent', +_id)
                sessionStorageUtil.set('templateCateId', _id ? +_id : '')
                that.isFlag = false
              })
            }
          } else {
            //如果为null
            index === 0 ? ele.isActive = true : ele.isActive=false
            sessionStorageUtil.set('templateCateId', '')
          }
        })
      },

      _bodyClick: function() {
        this.isFlag = false
      }
    },
    mounted:function(){
      document.addEventListener('click', this._bodyClick)
      var that = this
      var paramObj = getParams(location.href)
      paramObj.categoryid && paramObj.categoryid.length >0 ? this.getCategoryData(paramObj.categoryid) : this.getCategoryData();
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  .select-active{
    color: #db9d58;
    background: #fae5d1
  } 
    .select-li{
      margin: 0;
      line-height: 30px;
      clear: both;
      color: #a6804d;
      font-size: 14px!important;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      -webkit-transition: background .2s ease-in-out;
      transition: background .2s ease-in-out;
      padding 0px 10px
      &:hover{
        color: #db9d58;
        background: #fae5d1
      }
     }
   
    .select-bar
     position relative
     width 0px
     height 30px
     line-height 30px
     border-radius 15px
     background-color #f7f1c8
     .select-icon{
      position absolute
      right 10px
      top 12px
      height 0px
      width 0px
      }
     .select-input
      position absolute
      width 90%
      height 100%
      line-height 100%
      user-select: none;
      cursor: pointer;
      color: #e4bb7c;
      background: #f7f1c8;
      border-radius:16px;
      padding:10px 0px 0px 10px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all .2s ease-in-out;
      font-size 12px
     .select-list
      position absolute
      top 40px
      left 0px
      width inherit
      height auto
      background-color #fff
      max-height: 200px;
      overflow: auto;
      padding: 5px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 10px;
      -webkit-box-shadow: 0 1px 6px 0 #bbb;
      box-shadow: 0 1px 6px 0 #bbb;
      z-index: 9999;
      
      
  .up-icon{
    border-left 5px solid transparent
    border-right 5px solid transparent
    border-top 5px solid #289656
  }
 .down-icon{
    border-left 5px solid transparent
    border-right 5px solid transparent
    border-bottom 5px solid #289656
  }
</style>
