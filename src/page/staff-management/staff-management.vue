/** 
 * @Desc: 职工管理
 */
<template>
  <div class="staff-management">
    <v-header></v-header>
    <!-- 侧边栏数据 -->
    <v-nav>
      <!-- 职工信息 -->
      <v-sub-nav title="职工信息" :open="$route.meta.mark === 'staff-detail-manage'">
        <v-nav-item @click.native="$router.push('/staff-management/staff-details')">
          职工明细
        </v-nav-item>
      </v-sub-nav>
      <!-- 职工考勤 -->
      <v-sub-nav title="职工考勤" :open="$route.meta.mark === 'staff-attendance-manage'">
        <v-nav-item 
          :active="navItem.path === $route.path"
          v-for="navItem in staffChilds"
          :key="navItem.path"
          @click.native="$router.push(navItem.path)">
          {{ navItem.title }}
        </v-nav-item>
      </v-sub-nav>
    </v-nav>

    <!-- 路由 -->
    <content-box>
      <router-view></router-view>
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'StaffManagement',
    data: function() {
      return {
        // 职工考勤子导航
        staffChilds: [
          {
            title: '今日考勤',
            path: '/staff-management/today-attendance'
          },
          {
            title: '月度报表',
            path: '/staff-management/month-report'
          },
          {
            title: '考勤明细',
            path: '/staff-management/attendance-detail'
          }
        ]
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .staff-management
    position relative
    width 100%
    height 100%
    
</style>
