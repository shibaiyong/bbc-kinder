import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'router'
import 'router/interceptor'
import store from 'store'
import viewshare from 'viewshare'
import 'viewshare/dist/styles/viewshare.css'
import 'filter'
import 'base'
import 'component'
import 'lib/viewbox.js'
import 'style/index.styl'
import FastClick from 'fastclick'
import 'element-ui/lib/theme-chalk/index.css';

import ElementUI from 'element-ui';

// import Mock from './mock'

// let NODE_ENV = process.env.NODE_ENV
// //开发环境环境
// if(NODE_ENV === 'development'){
//   Mock.mockData() //制造假数据
// }

FastClick.attach(document.body)

Vue.config.productionTip = false

// Vue.prototype.$appName = '0'
Vue.use(viewshare)

Vue.use(ElementUI);

// 设置请求报错弹窗的标识符
window.infoFlag = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


