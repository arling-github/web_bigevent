$(function () {
    // 导入layer
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ':' + hh + ':' + mm + ':' + ss
    }
    // 定义补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询参数对象，用来请求参数的时候提交到服务器
    var q = {
        pagenum: 1, //页码
        pagesize: 2, //每页的数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章获取失败！')
                }
                // 成功就渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPae(res.total)
            }
        });
    }

    initCate()
    // 初始化文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 渲染数据回去
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域
                form.render()
            }
        });
    }

    // 为筛选表单绑定一个submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q对应赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPae(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //默认被选中的页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 4, 5, 10],
            // 分页切换回调函数
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q获取最新的数据渲染表格
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 删除绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        layer.confirm('是否删除数据？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            var len = $('.data-id').length
            var id = $(this).attr('data-id')
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (response) {
                    if (response.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 数据删除后，要判断还有这页有数据没有，没有就页码减一，再调用
                    if (len === 1) {
                        // 页码最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        });
    })
})