$(function () {
    getUserInfo()
    var layer = layui.layer
    // 退出按键
    $('#btnLogout').on('click', function () {
        // 提出消息框   
        layer.confirm('确认是否退出？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 清空本地缓存 token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'
            // 关闭询问框，layui自带
            layer.close(index)
        })
        
    })
})

// 获取用户的基本信息

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 请求头配置对象 ,带字段才能访问
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户失败！')
            }
            // 调用 reanderAvatar 渲染用户的的头像
            reanderAvatar(res.data)
        },
        // 不论成功还是失败 都要调用complete,挂载到bastAPI里面了

        // complete:function(res){
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 强制清除本地 token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        //     // console.log(res)
        // }
    });
}
// 渲染用户的的头像
function reanderAvatar(user) {
    // 昵称和用户名二选一
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avater').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}