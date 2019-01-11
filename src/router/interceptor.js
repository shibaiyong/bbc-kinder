/**
 * @Desc: 路由拦截器
 */
import router from 'router'
import store from 'store'
import cookie from 'js-cookie'
import { sessionStorageUtil } from 'lib/util'

/**
 * 路由全局钩子
 */ 
router.beforeEach((to, from, next) => {
  // 设置页面title
  document.title = to.meta.title

  // 退出登录
  if (to.path === '/login') {
    store.commit('logout')
    return next() 
  } 

  // 框架权限校验
  if (!to.meta || !to.meta.requireAuth) { 
    return next()
  }
  
  // token失效则登陆
  if (to.meta && to.meta.requireAuth && !cookie.get('ktoken')) {
    return confirm('登陆过期，为您跳转到登陆页面？') ? next('/login') : next()
  } 

  // 已登陆状态
  if (store.state.logged) { 
    return routerRedirect(to.path, next)
  } 

  // store.state在刷新时候为空，所以会执行下面的函数，（未登录状态同时token存在）重新获取vuex数据
  return fetchData(to.path, next)
})

/**
 * 路由重定向
 * @param {String} path 路由路径
 * @param {Function} next 路由钩子
 */
function routerRedirect(path, next) {
  const gradeList = store.state.gradeList

  // 重定向到学生管理 第一个年级第一个班级
  if (path === '/student-manage') {
    let firstGrade = ''
    let firstClass = ''
    for (let grade of gradeList) {
      if (grade.classes.length) {
        firstGrade = grade.gradeId
        firstClass = grade.classes[0].classId
        break
      }
    } 
    if (!firstGrade) {
      firstGrade = gradeList[0].gradeId
      firstClass = 0
    }
    return next( `/student-manage/${ firstGrade }/${ firstClass }`)
  }

  // 重定向到教学管理 第一个年级
  if (path === '/teaching-manage') {
    const firstGrade = gradeList[0].gradeId
    return next(`/teaching-manage/course-table-manage/${ firstGrade }`)
  }

  return next()
}

/**
 * 同步拉数据
 * @param {Function} next 路由钩子
 */
async function fetchData(path, next) {
  await store.dispatch('getAllOrg')
  await store.dispatch('getGradeAndClass')
  await store.dispatch('getUserInfo')
  return routerRedirect(path, next)
}
