

/* 
 @param 回调函数 必须传递 为了获取 templates
*/

/* 
获取cookie的方法
*/
function getCookie(key){
  var name = key + "="
  var ca = document.cookie.split(';')
  for(var i=0; i<ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name)==0) return c.substring(name.length, c.length)
  }
  return ""
}

/* 
  获取本地存储里的categoryId
*/
function getCategory(){
  let id = JSON.parse(sessionStorage.getItem('templateCateId'))
  if (id === '') id = 1
  return id  
}
/* 
  封装的ajax
*/
function ajax(options){
  var baseUrl = "http://192.168.0.158:8081"
  $.ajax({ 
    type: options.type || 'get',
    dataType: options.type || 'json',
    url: baseUrl+options.url,
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', 'bearer ' + options.token)
    },
    data:options.data,
    success:options.success,
    error:options.error
  })
}

/* 
  获取数据      
*/
function getTemplate(callback){
  var cid = getCategory()
  cid = Number (cid)
  ajax({
    url:'/api/v2/file/template',
    data:{
      'categoryId': cid
    },
    token:getCookie('ktoken'),
    success:function(response){
      if(response.code == 200 && response.data && response.data.length>0){
        ajax({
          url:'/api/v2/file/template/'+ response.data[0].templateId,
          data:{
            templateid: response.data[0].templateId
          },
          token: getCookie('ktoken'),
          success:function(res){
            if(res.code === 200 && res.data ){
              var templateObj = []
              response.data[0].preHtml = res.data.content
              response.data[0].html = res.data.content
              //调整response.data的数据结构
              response.data.forEach((item)=>{
                templateObj.push({
                  'templateId': item.templateId || '',
                  'title':item.title || '',
                  'preHtml':item.preHtml || '',
                  'html':item.html || ''
                })
              })
              callback(templateObj)
            }
          }
        })
      } else {
        callback([{
          'templateId':'',
          'title': '暂无',
          'preHtml': '<h1>暂无</h1>',
          'html': '<h1>暂无</h1>'
       }])
      }
    },
    error: function(error){
      callback()
    }
  })
}
      
