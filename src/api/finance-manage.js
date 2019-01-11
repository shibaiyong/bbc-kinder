/**
 * @Desc 用户相关api
 */
import requester from 'config/requester'

/** 
 * 修改财务管理-收费-设置
 * @param {object} param: 收费方案
 */
//收费--设置    搜索接口
export function reqSearchChargeSet(param) {
  const method = 'patch'
  const url = '/api/v2/user'
  const params = {
    nickName: param.name,
    phone: param.phone
  }
  return requester.request({method, url, params})
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
//收费--设置    获取方案列表接口
export function reqListChargeSet(param) {
  const method = 'get'
  const url = '/api/v3/chargeSchema'
  let params = {
    title:param.title,
    pageNum:param.pagenum,
    pageSize:param.pagesize
  }

  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
// 收费--设置    添加方案接口
export function reqAddChargeSet(param) {
  const method = 'post'
  const url = '/api/v3/chargeSchema'
  let params = {
    title:param.title,
    type:param.type,
    description:param.description
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
//收费--设置    编辑接口
export function reqEditChargeSet(param) {
  const method = 'patch'
  const url = '/api/v3/chargeSchema'
  let params = {
    id:param.id,
    title:param.title,
    type:param.type,
    description:param.description,
    status:param.status
  }
  console.log(params)
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
//收费--设置    删除接口
export function reqDeleteChargeSet(id) {
  const method = 'delete'
  const url = `/api/v3/chargeSchema/${id}`
  
  return requester.request({ method, url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

//切换收费状态
export function reqChangeStatus(param) {
  const method = 'patch'
  const url = `/api/v3/chargeSchema/${param.id}/status/${param.status}`
  const params = {
    chargeSchemaId: param.id,
    status: param.status
  }
  return requester.request({method, url, params})
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

//收费--设置--明细   

//收费--设置    获取方案列表接口
export function reqListChargeSetDetail(id) {
  const method = 'get'
  const url = `/api/v3/chargeSchemaDetail/${id}`
  let params = {
    chargeSchemaId:id
  }

  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
// 收费--设置    添加方案接口
export function reqAddChargeSetDetail(param,id) {
  const method = 'post'
  const url = `/api/v3/chargeSchemaDetail/${id}`
  let params = {
    money:param.money*1,
    feeItemId:param.feeItemId,
    description:param.description,
    sortOrder:0
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
//收费--设置    编辑接口
export function reqEditChargeSetDetail(param) {
  let id = param.chargeSchemaId
  const method = 'patch'
  const url = `/api/v3/chargeSchemaDetail/${id}`
  let params = {
    money:param.money*1,
    feeItemId:param.feeItemId,
    description:param.description,
    sortOrder:0,
    id:param.id,
    chargeSchemaId:param.chargeSchemaId
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
//收费--设置    删除接口
export function reqDeleteChargeSetDetail(id) {
  const method = 'delete'
  const url = `/api/v3/chargeSchemaDetail/${id}`
  const params = {
    chargeSchemaDetailId:id
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

//收费--设置明细  收费项目名称
export function reqChargeName() {
  const method = 'get'
  const url = '/api/v3/chargeProjects'
  
  return requester.request({ method, url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}


