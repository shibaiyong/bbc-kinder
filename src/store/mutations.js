import cookie from 'js-cookie'
import { sessionStorageUtil } from  'lib/util'

const mutations = {
  // 保存用户信息
  setUserInfo: (state, userInfo) => {
    state.orgName = userInfo.org.orgName
    state.userName = userInfo.admin.nickName
    state.userPhone = userInfo.admin.phone
    state.logged = true
  },

  // 保存所有的机构数据 
  setAllOrg: (state, orgList) => {
    state.orgList = orgList
  },

  // 保存班级年级
  setGradeList: (state, gradesList) => {
    state.gradeList = gradesList
  },
  
  // 登出
  logout: (state) => { 
    state.logged = false
    cookie.get('ktoken') && cookie.remove('ktoken')
    sessionStorageUtil.remove('activeOrgName')
    sessionStorageUtil.remove('activeOrgId')
    sessionStorageUtil.remove('temp_phone')
    sessionStorageUtil.get('current_Ids') && sessionStorageUtil.remove('current_Ids')
    sessionStorageUtil.get('current_template_Ids') && sessionStorageUtil.remove('current_template_Ids')
  },
}

export default mutations