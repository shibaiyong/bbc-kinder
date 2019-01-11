/*
 * @Desc: 学生管理页面api
 */
import requester from 'config/requester'

/**
 * 修改年级
 * @param {Object} param 
 */
export function requestPatchGrade(param) {
  const method = 'patch'
  const url = '/api/v2/grade'
  const params = {
    name: param.gradeName,
    id: param.gradeId
  }
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 添加班级
 * @param {Object} param 参数
 */
export function requestAddClass(param) {
  const method = 'post'
  const url = '/api/v2/class'
  const params = {
    className: param.className,
    gradeId: param.gradeId
  }
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 修改班级
 * @param {Object} param 参数
 */
export function requestPatchClass(param) {
  const method = 'patch'
  const url = '/api/v2/class'
  const params = {
    gradeId: param.gradeId,
    classId: param.classId,
    className: param.className
  }
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 删除班级
 * @param {Number} classId 班级id
 */
export function requestDeleteClass(classId) {
  const method = 'delete'
  const url = `/api/v2/class/${ classId }`
  return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 查询班级学生
 * @param {Number} classId 班级id
 */
export function requestGetStudents(classId) {
  const url = `/api/v2/class/${ classId }/student`
  return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 添加学生
 * @param {Object} param 参数
 */
export function requestAddStudent(param) {
  const method = 'post'
  const url = '/api/v2/student'
  
  var parents = {};
  for (var key in param.protectMen) {
    parents[key] = param.protectMen[key];
  }

  const params = {
    name: param.name,
    gender: param.gender,
    gradeId: param.gradeId,
    classId: param.classId,
    brithday: param.birthday,
    parents: parents
  }
  console.log(param.protectMen)
  console.log(params)
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 修改学生
 * @param {Object} param 参数
 */
export function requestPatchStudent(param) {
  console.log(param)
  const method = 'post'
  const url = '/api/v2/update/student'

  var parents = {};
  for (var key in param.protectMen) {
    parents[key] = param.protectMen[key];
  }

  const params =  {
    id: param.id,
    name: param.name,
    gender: param.gender,
    gradeId: param.gradeId,
    classId: param.classId,
    brithday: param.birthday,
    parents: parents
  }
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 删除学生
 * @param {Number} studentId 学生id
 */
export function requestDeleteStudent(studentId) {
  const method = 'delete'
  const url = `/api/v2/student/${ studentId }`
  return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 删除监护人
 * @param {Number} param 学生id
 */
export function requestDeleteProtectMan(param) {
  console.log(param)
  console.log(param.studentId)
  console.log(param.parentId)
  const method = 'delete'
  const url = `/api/v2/student/${ param.studentId }/${ param.parentId }`
  return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

