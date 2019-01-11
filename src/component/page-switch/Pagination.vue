<template>
    <div class="pagination">
        
        <ul>
            <li class="total"><span>共&nbsp;{{totalNum}}&nbsp;条</span></li>

            <li><a href="javascript:void(0);" @click="changeCurrentPage('previous')" class="smallturnpage">&#x3C;</a></li>
            
            <template v-if="turnLeft">
                <li><a href="javascript:void(0);" @click="changeCurrentPage(1)">1</a></li>
                <li><a href="javascript:void(0);" v-turntoarrow="leftarrow" @click="changeCurrentPage('previouspage')" class="turnpage">&#xB7;&#xB7;&#xB7;</a></li>    
            </template>
            
            <li v-for="(item,index) in showPageNum" :class="{'active':item == currentPage}" :key='index'><a href="javascript:void(0);" @click="changeCurrentPage(item)">{{ item }}</a></li>
            
            <template v-if="turnRight">
                <li><a href="javascript:void(0);" v-turntoarrow="rightarrow" @click="changeCurrentPage('nextpage')" class="turnpage">&#xB7;&#xB7;&#xB7;</a></li>
                <li><a href="javascript:void(0);" @click="changeCurrentPage(totalShowPageNum.length)">{{totalShowPageNum.length}}</a></li>
            </template>

            <li><a href="javascript:void(0);" @click="changeCurrentPage('next')" class="smallturnpage">&#x3E;</a></li>

            <li v-show="go" class="gopage">前往&nbsp;<input type="text" v-model="inputNum"/>&nbsp;页</li>
            <li v-show="go"><a href="javascript:void(0);" @click="gopage" class="comfireturnpage">确定</a></li>
        </ul>

    </div>
</template>

<script>
export default {
    name:'coustom-pagination',
    props:{

        totalNum:{
            type:[String,Number],
            default:100
        },

        pageSize:{
            type:Number,
            default:10
        },

        go:{
          type:Boolean,
          default:false
        }
    },
    data(){
        return {
            currentPage:1,
            showPaginationBtn:5,
            showPageNum:[],
            turnLeft:false,
            turnRight:true,
            leftarrow:'leftarrow',
            rightarrow:'rightarrow',
            inputNum:'',
        }
    },
    // updated(){
    //     console.log('updated')
    // },
    created(){
        //初始化----分页组件
        // console.log('created');
        this.showPage(this.currentPage);

    },
    mounted(){
        this.showPage(this.currentPage)
    },
    computed:{

        totalShowPageNum(){

            var num = Math.ceil(this.totalNum*1/this.pageSize)
            var pageNumArray = []

            for(var i = 0; i < num; i++){

              pageNumArray[i] = i + 1

            }

            return pageNumArray;
        },
        lastTotalNum(){ 

            return this.totalShowPageNum.length;

        }
    },
    methods:{
        changeCurrentPage(params){
            //如果没有超出.就执行以下逻辑。
            if(params == 'previous' && this.currentPage > 1){

                this.currentPage = --this.currentPage;

            }else if(params == 'next' && this.totalShowPageNum.length > this.currentPage){
                
                this.currentPage = ++this.currentPage;
           
            }else if(typeof params == 'number'){

                this.currentPage = params;

            }else if(params == 'previouspage'){
                
                var newPage = this.currentPage - this.showPaginationBtn;
                this.currentPage = newPage < 1 ? 1 : newPage;

            }else if(params == 'nextpage'){

                var newPage = this.currentPage + this.showPaginationBtn;
                this.currentPage = newPage > this.totalShowPageNum.length ? this.totalShowPageNum.length : newPage;

            }else{
                //this.currentPage <= 1 || this.currentPage >= this.totalShowPageNum.length
                //避免每次点击翻页按钮都去调用下面的方法.
                return false;
            }

            this.$emit('currentChange',this.currentPage);

            this.showPage(this.currentPage,params);
        },

        gopage(e){
            var pagenum = this.inputNum;
            var maxnum = this.totalShowPageNum.length
            this.currentPage = pagenum*1
            
            if(pagenum > maxnum){
                e.target.value = maxnum;
                this.currentPage = maxnum*1
            }else if(pagenum < 1){
                e.target.value = 1
                this.currentPage = 1
            }
            this.$emit('currentChange',this.currentPage)
            this.showPage(this.currentPage)
        },

        showPage(currentPage,type){
            var showPaginationBtn = this.showPaginationBtn;
            
            var showPaginationBtns = this.showPaginationBtn; 

            var start = Math.ceil( showPaginationBtns/2 );

            var end = this.lastTotalNum + 2 - start;
            if(this.lastTotalNum <= showPaginationBtns){
                this.turnLeft = false;
                this.turnRight = false;
                var rest = start - currentPage;
                this.showPageNum = this.totalShowPageNum.slice(0, currentPage - 1 + start + rest)
            }else if(currentPage <= start){

                this.turnLeft = false;
                this.turnRight = true;
                var rest = start - currentPage;
                this.showPageNum = this.totalShowPageNum.slice(0, currentPage - 1 + start + rest)
            
            }else if(currentPage >= (end-1)){
                this.turnLeft = true;
                this.turnRight = false;
                var rest = currentPage - end + 1;//右侧不足按钮个数的一半的时候,要在左侧添加按钮，按钮的个数就是rest;
                this.showPageNum = this.totalShowPageNum.slice(currentPage - start - rest, currentPage - 1 + start)
            
            }else if(currentPage > start && currentPage < end){

                this.turnLeft = true;
                this.turnRight = true;
                this.showPageNum = this.totalShowPageNum.slice(currentPage - start, currentPage - 1 + start)
            
            }
        } 
    },
    watch:{
       totalNum(){
           this.showPage(this.currentPage);
       } 
    },
    directives:{
            turntoarrow:{
                inserted:function(el, binding, vnode){
                    el.onmouseover = function(){
                        if( binding.value == 'leftarrow' ){
                            this.innerHTML = '&#x3C;&#x3C;';
                        }else{
                            this.innerHTML = '&#x3E;&#x3E;';
                        }
                    };
                    el.onmouseout = function(){
                        this.innerHTML = '&#xB7;&#xB7;&#xB7;';
                    }

                }
            }
        }
}
</script>

<style>
    .pagination{
        display:inline-block;
    }

    .pagination ul li a{
        text-decoration: none;
    }
    .pagination ul li.active a{
        color:white;
        font-weight: bold;
        background:#75C73B;
    }

    .pagination ul{
        overflow:hidden;
        margin: 0;padding:0;
    }

    .pagination ul li{
        float:left;
        margin: 0;padding:0;
        margin:0 5px;
        color:#75C73B;
    }

    .pagination ul li a,.pagination ul li.total span{
        display: block;
        padding:3px 8px;
        box-sizing:border-box;
        border-radius: 4px;
        color:#75C73B;
        font-size: 14px
    }
    .pagination ul li.total span{
        color:#75C73B;
        font-weight: bold;
    }
    .pagination ul li a{
        color:#75C73B;
    }
    .pagination ul li a.turnpage{
        width:38px;
        color:#75C73B;
    }
    .pagination ul li a.smallturnpage{
        border:1px solid #75C73B;
        color:#75C73B;
    }
    .pagination ul li a.comfireturnpage{
        padding:6px 12px;
        border:1px solid #75C73B;
        font-weight: bold;
        font-size: 14px;
        color:#75C73B;
    }
    
    .pagination ul li.gopage input{
        width:50px;
        border:1px solid #75C73B;
        border-radius: 4px;
        text-align: center;
        outline: none;
        padding:5px 10px;
        color:#75C73B;

    }


    
</style>

