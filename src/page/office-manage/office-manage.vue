/** 
 * @Desc: 办公管理
 */
<template>
  <div>
    <v-header></v-header>
    <!-- S 导航 -->
    <v-nav>
      <v-sub-nav title="全园文档" @click.native="$router.push('/office-manage/garden-document')">
      </v-sub-nav>
      <v-sub-nav title="模版管理" @click.native="$router.push('/office-manage/template-manage')">
      </v-sub-nav>
      <v-sub-nav title="分类文档" @click.native="$router.push('/office-manage/classify-file-mange')">
        </v-sub-nav>
    </v-nav>
    <!-- E 导航 -->

    <!-- S 内容区 -->
    <router-view ></router-view>
    <!-- E 内容区 -->
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'office-manage',
    components: {

    },
    props: {

    },
    data: function() {
      return {

      }
    },
    computed: {

    },
    watch: {

    },
    created: function() {

    },
    mounted: function() {

    },
    destoryed: function() {

    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  
  

</style>
