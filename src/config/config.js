/**
 * @Desc: 发版配置
 */

let NODE_ENV = process.env.NODE_ENV
let baseURL = ''
let FeVersion = "@BUILD.REVISION@"
let versionMessage = "@BUILD.REVISION.MESSAGE@" 

// 生产环境
if (NODE_ENV === 'production') {
  baseURL = 'http://192.168.0.158:8081'
}

// 开发环境
if (NODE_ENV === 'development') {
  baseURL = 'http://192.168.0.103:8081'
  //http://192.168.0.103:8081
  // baseURL = 'http://kinder.viewshare.net:8081'
}

// auth验证
const auth = {
  username: 'viewshare',
  password: 'kinder'
}

export {
  baseURL,
  auth,
  FeVersion,
  versionMessage
}