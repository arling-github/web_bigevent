$(function () {
    // 登录注册a切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    // 点击“去注册账号”的链接
    /*  $('#link_reg').on('click', function () {
         $('.login-box').hide()
         $('.reg-box').show()
     })

     // 点击“去登录”的链接
     $('#link_login').on('click', function () {
         $('.login-box').show()
         $('.reg-box').hide()
     }) */

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到是否确认密码框中的内容，还需拿到密码框中的内容
            // 然后进行一次等于的判断，如果判断失败，则return一个提醒消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // 放一个表单数据接受对象
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功！')
            $('#link_login').click()
        })
        // 跳转到登录页面 ，调用点击去登录
        
    })

    // 监听登录事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速拿到表单数据
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功的token字符串保存在本地储存中
                localStorage.setItem('token',res.token)
                // console.log(res.token)
                location.href = '/index.html'
            }
        })
    })
})