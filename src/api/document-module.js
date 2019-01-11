/**
 * @Desc 文档模块相关api
 */
import requester from 'config/requester'
import qs from 'qs'

/*
 * 获取查询分类列表
 */
export function requestGetTypeList(paramType, meth, urlName) {
  const url = urlName || '/api/v2/file/category'
  const method = meth || 'get'
  const params = paramType
  return requester.request( { url, params, method })
  .then( res => {
    return Promise.resolve(res.data)
  })
}

/** 
 * 根据条件查询文档的列表
 * const params = {
    categoryId: obj.categoryId ? obj.categoryId : null,
    queryCriteria: obj.queryCriteria ? obj.queryCriteria : null,
    queryTime: obj.queryTime ? obj.queryTime : null,
    fileStatus: obj.fileStatus ? obj.fileStatus : null,
  }
 * 
 */
export function requestGetDocumentList(obj) {
  const url = '/api/v2/file/station'
  const params = obj
  return requester.request( { url, params}).then( res => {
    return Promise.resolve(res.data)
  })
}


/* 
 *文档的相关接口
*/
export function  requestGetFileInfo(paramType, meth, urlName){
  const url = urlName ? '/api/v2/file/station/'+ urlName : '/api/v2/file/station'
  const method = meth || 'get'
  const data = qs.stringify(paramType) 
  const headers = {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
  return requester.request( { url, data, method, headers}).then( res => {
    return Promise.resolve(res.data)
  })
}

/* 
 * 模板的请求接口
*/
export function requestGetTemplateInfo(paramType, meth, urlName){
  const url = urlName ? '/api/v2/file/template/'+ urlName : '/api/v2/file/template'
  const method = meth || 'get'
  const data = qs.stringify(paramType) 
  const headers = {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
  return requester.request( { url, data, method, headers})
  .then( res => {
    return Promise.resolve(res.data)
  })
}


/** 
 * 获取模版的数据 
 */ 
export function requestGetTemplateList(obj) {
  const url = '/api/v2/file/template'
  const params = {
    categoryId: obj.categoryId ? obj.categoryId : null,
    queryCriteria: obj.queryCriteria ? obj.queryCriteria : null,
    queryTime: obj.queryTime ? obj.queryTime : null,
    fileStatus: obj.fileStatus ? obj.fileStatus : null
  }
  return requester.request( { url, params })
    .then( res => {
      return Promise.resolve(res.data)
    })
} 

/** 
 * 对文档操作的api接口
*/
export function _handleFile(urlName, paramType, methodType = 'get' ) {
  const url = urlName
  const method = methodType
  const params = paramType
  return requester.request( { url, params, method })
    .then( res => {
      return Promise.resolve(res.data)
    })
}

/** 
 * 对模版的操作api接口
*/
export function _handleTemplate(urlName, paramType, methodType = 'get') {
  const url = urlName
  const method = methodType
  const params = paramType
  return requester.request( { url, params, method })
    .then( res => {
      return Promise.resolve(res.data)
    })
}

/** 
 * 对分类顺序的操作
*/
export function _handleType(urlName, paramsData, methodType = 'get') {
  const url = urlName
  const method = methodType
  const params = paramsData
  return requester.request( { url, params, method })
    .then( res => {
      return Promise.resolve(res.data)
    })
}

/** 
 * 对文档和模板的下载操作
*/
export function _download(param) {
  const url = '/api/v2/file/down'
  const method = 'post'
  const params = param
  const responseType = 'blob'
  const headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
  return requester.request({ method, url, params, headers, responseType })
		.then(res => {
      const content = res.data
      const blob = new Blob([content])
      // 设置文件的名称
      Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + "_" + this.getHours() + "-" + this.getMinutes() + "-" + this.getSeconds()
      }
      const fileName = `${new Date().toLocaleString()}.zip`
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
		})
		.catch(err => {
			return Promise.reject(err)
		})
}


