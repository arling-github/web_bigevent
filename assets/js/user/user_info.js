$(function () {
    var form = layui.form
    var layer = layui.layer

    // 创建自己的验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6之间！'
            }
        }
    })

    initUserInfo()

    // 初始化用户基本信息

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: "/my/userinfo",
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取用户失败！')
                }
                console.log(response)
                // 给表单赋值
                form.val('formUserInfo',response.data)
            }
        });
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e){
        // 阻止表单默认行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        // 发送请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo/",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !==0) {
                    return layer.msg('更新用户失败！')
                }
                layer.msg('更新用户成功！')
                // 调用父页面，重新渲染信息 ,通过window可以调用父页面函数名
                window.parent.getUserInfo()
            }
        });
    })
})