/** 
 * @Desc: axios实例
 */
import axios from 'axios'
import router from '@/router'
import store from 'store'
import { baseURL } from 'config/config'
import cookie from 'js-cookie'

// 创建实例
let instance = axios.create({
	baseURL,
	timeout: 30000
})

// 请求拦截器
instance.interceptors.request.use(
	config => {
		// token有效
		if (cookie.get('ktoken')) {
			config.headers.Authorization = `bearer ${cookie.get('ktoken')}`
			// config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		}
		return config
	},
	err => {
		return Promise.reject(err)
	}
)


// 响应拦截器
instance.interceptors.response.use(
	response => {
		// const err = new Error(response.data.description)
		// console.log('respone这里:', err)
		// err.data = data
		// err.response = response
		// throw err
		return response
	},
	error => {
		// console.log('error这里:', error.response.status)
		// && err.response.status === 401
		if (!infoFlag) {
			infoFlag = true
			if (confirm('连接超时，为您跳转到登陆页面？')) {
				return router.replace('/login')
			}
		}
		return Promise.reject(err)
	}
)

export default instance