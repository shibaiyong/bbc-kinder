<template>

  <button :style="newSty"><slot></slot></button>

</template>
<script>
  export default {
    name:'Button',
    props:{
      sty:{
        type:Object
      }
    },
    data(){
      return {
        initSty:{
          width:'130px',
          height:'40px',
          lineHeight:'40px',
          borderRadius:'10px',
          fontSize:'16px',
          background:'#62b12b',
          color:'white',
          textAlign:'center',
          verticalAlign:'middle'
        }
      }
    },
    components:{

    },
    created(){

    },
    mounted(){

    },
    methods:{

    },
    computed:{
      newSty(){
        return this.sty ? Object.assign(this.initSty,this.sty) : this.initSty
      }
    }
  }
</script>
<style scope lang="stylus" rel="stylesheet/stylus">

</style>