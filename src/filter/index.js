/*
 * @Desc: 过滤器
 */

import Vue from 'vue'
import moment from 'moment'

/**
 * 文件大小
 */ 
Vue.filter('fileSize', function (value) {
  if (null == value || value == '') {
    return "0B"
  }
  var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  // 保留一个小数
  size = size.toFixed(1)
  // 小数为0则去除
  size =  size.toString().indexOf('.0') !== -1 ? parseInt(size) : size
  return size + unitArr[index]
})

/**
 * 时间格式化（2017-11-11 11:11）
 */
Vue.filter('date', function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm')
})

/**
 * 时间格式化（2017年11月11日（星期一））
 */
Vue.filter('dateZh', function (value) {
  moment.locale('zh-cn')
  return moment(value).format('LL') + '（' + moment(value).format('dddd') + '）'
})

/**
 * 年龄格式化（2 岁 1 个月）
 */
Vue.filter('age', function(value) {

  var reg = /-/g

  var birthday = new Date(value.replace(reg,'/'))
  var startTime = birthday.getTime()
  var endTime = new Date().getTime()

  //计算当前时间跟学生出生时间的时间差（单位：天）
  var changeToDays = Math.ceil((endTime - startTime)/1000/60/60/24)

  //岁数 不足一岁的学生不显示岁数; 月份 不足一个月的按一个月处理
  var year = Math.floor(changeToDays / 365) ? Math.floor(changeToDays / 365) : 0
  var month = Math.floor((changeToDays - year * 365)/30) ? Math.ceil((changeToDays - year * 365)/30) : 1

  return year ? (year + '岁' + month + '个月') : (month + '个月')
})

/** 
 * 班级名称转化为字符串
*/
Vue.filter('classNames', function (value) {
  let str = ''
  if(value.length > 0){
    let arr = []
    value.map(item => {
      arr.push(item.className)
    })
    // 截取最后一个逗号
    str = arr.join('，')
  } else {
    str = '--'
  }
  return str
})

/**
 * 将时间戳转为年月日
*/
Vue.filter('unixTimestampToYearString', function(value) {
  if (value) {
    // let str = ''
    // let time = parseInt(value)
    // Date.prototype.toLocaleString = function() {
    //   return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate()
    // }
    return moment(value).format("YYYY-MM-DD")
  }
  else {
    return ''
  }
})

/** 
 * 将时间戳转为时分秒
*/
Vue.filter('unixTimestampToTimeString', function(value) {
  if (value) {
    return moment(value).format("HH:mm:ss")
  }
  else {
    return ''
  }
})