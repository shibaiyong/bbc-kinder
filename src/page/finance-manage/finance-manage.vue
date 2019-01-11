/** 
 * @Desc: 财务管理
 */
<template>
  <div>
    <v-header></v-header>
    <!-- S 导航 -->
    <v-nav>
      <v-sub-nav title="收费管理" :open="$route.meta.mark === 'finance-income-manage'">
        </v-nav-item>
        <v-nav-item 
          :active="navItem.path === $route.path"
          v-for="navItem in chargeChilds"
          :key="navItem.path"
          @click.native="$router.push(navItem.path)">
          {{ navItem.title }}
        </v-nav-item>
      </v-sub-nav>
      <v-sub-nav title="退费管理" :open="$route.meta.mark === 'finance-refund-manage'">
        <v-nav-item 
          :active="navItem.path === $route.path"
          v-for="navItem in refundChilds"
          :key="navItem.path"
          @click.native="$router.push(navItem.path)">
          {{ navItem.title }}
        </v-nav-item>
      </v-sub-nav>
        
      <v-sub-nav title="报表统计" :open="$route.meta.mark === 'finance-report-manage'">
        <v-nav-item 
          :active="navItem.path === $route.path"
          v-for="navItem in reportformsChilds"
          :key="navItem.path"
          @click.native="$router.push(navItem.path)">
          {{ navItem.title }}
        </v-nav-item>
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
    name: 'finance-manage',
    components: {

    },
    props: {

    },
    data: function() {
      return {
        // 财务子导航
        chargeChilds: [  // 收费管理
          {
            title: '计划',
            path: '/finance-manage/charge-plan'
          },
          {
            title: '收费',
            path: '/finance-manage/charge-in'
          },
          {
            title: '设置',
            path: '/finance-manage/charge-setting'
          }
        ],
        refundChilds: [ // 资金退还
          {
            title: '退费',
            path: '/finance-manage/refund-in'
          },
          {
            title: '请假结算',
            path: '/finance-manage/refund-leave'
          },
          {
            title: '设置',
            path: '/finance-manage/refund-setting'
          }
        ],
        reportformsChilds: [ // 报表统计
          {
            title: '收入',
            path: '/finance-manage/reportforms-income'
          },
          {
            title: '支出',
            path: '/finance-manage/reportforms-expenses'
          }
        ],

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
