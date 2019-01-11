/**
 * @Desc 职工相关api
 */
import requester from 'config/requester'
import qs from 'qs'

/** 
 * 获取所有的职工列表 
 */
export function requestGetStaffs() {
  const url = '/api/v2/emp'
  return requester.request({ url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 添加职工 
 gradeId: data.gradeId,
 classId: data.classId,
 */
export function requestAddStaff(data) {
  const method = 'post'
  const url = '/api/v2/emp'
  const params =  {
    classes: data.classIds,
    empName: data.empName,
    empHead: data.empHead,
    gander: data.gender,
    phone: data.phone,
    remarks: data.remarks,
    isSend: data.isSend,
    hireDate: data.hireDate
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 修改职工 
 */
export function requestPatchStaff(data) {
  const method = 'patch'
  const url = '/api/v2/emp'
  const params = {
    classes: data.classIds,
    employeeId: data.employeeId,
    empName: data.empName,
    empHead: data.empHead,
    gander: data.gender,
    phone: data.phone,
    remarks: data.remarks,
    sta: data.status,
    sendId: data.sendId,
    isSend: 0,
    hireDate: data.hireDate,
    termDate: data.leaveDate
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 删除职工 
*/
export function requestDeleteStaff(phone) {
  const method = 'delete'
  const url = '/api/v2/emp'
  const params = {
    phone
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 发送短信 
 */
export function requestSendMessage(data) {
  const method = 'post'
  const url = '/api/v2/emp/sendMsg'
  const params = {
    phone: data.phone,
    sendId: data.sendId
  }
  return requester.request({ method, url, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 职工考勤的get请求(多种请求合一写法，参数不同)
*/
export function _getHandle(urlName, paramsData) {

  const url = urlName
  const params = paramsData
  return requester.request({ url, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 考勤状态修改
 */
export function requestChangeStatus(data) {
  const method = 'patch'
  const url = '/api/v2/' + data.leaveType + '/modifyAttendance/' + data.employeeId + '?date=' + data.date
  return requester.request({ method, url })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 调用api,修改当前日历的状态数据
 * @param {object} item
 * @param {String} empId
*/
export function _setCalendarStatus(item, empId) {
  const method = 'patch'
  const url = '/api/v2/' + item['leaveType'] + '/modifyAttendance/' + empId + '?date=' + item['attendanceTime']
  return requester.request({ method, url })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
  }

  
/**
* 下载
*/
export function _download(urlName, param, excelName) {
  const url = urlName
  const params = param
  const method = 'get'
  const headers = { 'Content-Type' : 'application/x-www-form-urlencoded'}
  const responseType = 'blob'
  return requester.request({ method, url, params, headers, responseType })
		.then(res => {
      const content = res.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = excelName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, excelName)
      }
		})
		.catch(err => {
			return Promise.reject(err)
		})
}