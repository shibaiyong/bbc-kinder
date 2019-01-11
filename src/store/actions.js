import { requestGetUserInfo } from 'api/user'
import { requestGetGradeAndClss } from 'api/garden'

/**
 * 获取用户信息（同步）
 */
export async function getUserInfo({ commit }) {
  const res = await requestGetUserInfo()
  if (res.code === 200) {
    // console.log('requestGetUserInfo SUCCESS', res)
    commit('setUserInfo', res.data)
  }
  else {
    // console.log('requestGetUserInfo FAIL', res)
  }
}

/** 
 * 获取所有的机构信息（同步）
*/
export async function getAllOrg({ commit }) {
  // const res = await requestGetAllOrgs()
  // if (res.code === 200) {
  //   // console.log('requestGetAllOrgs SUCCESS', res)
  //   commit('setGradeList', res.data.gradesList)
  // }
  let arr = [{
    value: 'New York',
    label: 'New York'
  },
  {
    value: 'London',
    label: 'London'
  },
  {
    value: 'Sydney',
    label: 'Sydney'
  }]
  commit('setAllOrg', arr)
}


/**
 * 获取年级（包含班级）数据（同步）
 */
export async function getGradeAndClass({ commit }) {
  const res = await requestGetGradeAndClss()
  if (res.code === 200) {
    // console.log('requestGetGradeAndClss SUCCESS', res)
    commit('setGradeList', res.data.gradesList)
  }
  else {
    // console.log('requestGetGradeAndClss FAIL', res)
  }
}
