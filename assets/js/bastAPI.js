$.ajaxPrefilter(function (options) {
    // url连接
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 统一为有权限的设置请求头

    // 有my的才设置权限
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 统一挂载complete
    options.complete = function(res){
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 强制清除本地 token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
        // console.log(res)
    }
})