$(function () {
    layer = layui.layer
    form = layui.form
    // 定义加载文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                // 调用模板引擎
                htmlStr = template('tpl-cate', response)
                $('[name=cate_id]').html(htmlStr)
                // 动态调用form.render()方法
                form.render()
            }
        });
    }

    // 初始化富文本编辑器
    initEditor()

    // 裁切区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面按键
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件。获取用户选择文件列表
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        // 判断是否选择
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file)

        // 重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 提交文章
    var art_stare = '已发布'

    // 为存为草稿按钮绑定事件
    $('#btnSave2').on('click', function () {
        art_stare = '草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建一个formdate对象 前几个参数
        var fd = new FormData($(this)[0])
        // 加入state
        fd.append('state', art_stare)

        // 将封面裁剪过后的图片输出为文件对象 加入封面对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 文件对象存到fd中
                fd.append('cover_img', blob)
                publistArticle(fd)
            })
    })

    function publistArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 提交formdate，要提交contentType，processData配置项
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('发表文章失败！')
                }
                layer.msg('发表成功！')
                // 跳转页面
                location.href = '/article/art_list.html'
            }
        });
    }
})