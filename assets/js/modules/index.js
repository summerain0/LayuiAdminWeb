layui.extend({
    globalConfig: "config"
}).define(['globalConfig'], function (exports) {
    const globalConfig = layui.globalConfig;
    const $ = layui.jquery;
    const util = layui.util;

    // 窗口主体
    const container = $('#adminContainer');
    // 抽屉控制按钮
    const flexibleBtn = $('[admin-header-event=flexible]');

    // 如果不是电脑，则需要对抽屉控制按钮做一下处理
    if ($(window).width() < 994) {
        flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
    }

    //头部事件
    util.event('admin-header-event', {
        flexible: function (event) {
            const windowWidth = $(window).width();
            if (windowWidth >= 994) {
                if (container.hasClass('admin-side-shrink')) {
                    container.removeClass('admin-side-shrink');
                    flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
                } else {
                    container.addClass('admin-side-shrink');
                    flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
                }
            } else { // 中小屏幕
                container.addClass('admin-side-spread-sm');
                flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
            }
        },
        fullScreen: function (event) { // 全屏
            const self = $(this);
            if (self.children('i').hasClass('layui-icon-screen-full')) {
                self.html('<i class="layui-icon layui-icon-screen-restore"></i>');
                let element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen()
                } else if (element.msRequestFullscreen) { // 兼容ie
                    element.msRequestFullscreen()
                } else if (element.mozRequestFullScreen) { // 兼容火狐
                    element.mozRequestFullScreen()
                } else if (element.webkitRequestFullscreen) { // 兼容chrome和safari
                    element.webkitRequestFullscreen()
                }
            } else {
                self.html('<i class="layui-icon layui-icon-screen-full"></i>');
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    });

    // 监听屏幕宽度
    $(window).resize(function () {
        const windowWidth = $(window).width();
        if (windowWidth < 994) {
            if (container.hasClass('admin-side-shrink')) container.removeClass('admin-side-shrink');
            flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
            // shapeBody.css('display', '');
        } else {
            // shapeBody.css('display', 'none');
            container.removeClass('admin-side-spread-sm');
            flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
        }
    });

    exports('index');
});