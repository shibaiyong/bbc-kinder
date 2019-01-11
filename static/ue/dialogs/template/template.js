/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-8-8
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */
(function () {
  var me = editor,
    preview = $G( "preview" ),
    preitem = $G( "preitem" ),
    currentTmp,
    tmps

    getTemplate(function(con){
      tmps = con
      initPre()
      window.pre = pre
      pre(1)
    })
           
    var initPre = function () {
      var str = ""
      for ( var i = 0, tmp; tmp = tmps[i++]; ) {
        str += '<div class="preitem" onclick="pre(' + i + ')"><span title="'+tmp.title+'">'+tmp.title+'</span></div>'
      }
      preitem.innerHTML = str
    }

    var pre = function ( n ) {
      ajax({
        url:'/api/v2/file/template/'+ tmps[n-1].templateId,
        data:{
          templateid:tmps[n-1].templateId
        },
        token: getCookie('ktoken'),
        success: function(res){
          if(res.code == 200 && res.data){
            tmps[n-1].preHtml = res.data.content
            tmps[n-1].html = res.data.content
            var tmp = tmps[n - 1]
            currentTmp = tmp
            clearItem()
            domUtils.setStyles( preitem.childNodes[n - 1], {
              "background-color":"#c9efd9",
              "border":"#c9efd9 1px solid"
            })
            preview.innerHTML = tmp.preHtml ? tmp.preHtml : ""
          }
        }
      })     
    }
    var clearItem = function () {
      var items = preitem.children
      for ( var i = 0, item; item = items[i++]; ) {
        domUtils.setStyles( item, {
          "background-color": "",
          "border": "white 1px solid"
        })
      }
    }

    dialog.onok = function () {
      if ( !$G( "issave" ).checked ){
        me.execCommand( "cleardoc" )
      }
      var obj = {
        html:currentTmp && currentTmp.html
      }
      me.execCommand( "template", obj )
    }
})()