/**
 * @Desc 版本相关api
 */
import requester from 'config/requester'

/** 
 * 获取版本信息
 */
export function requestGetVersionData() {
  const url = 'version'
  return requester.request({ url })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err
    })
}