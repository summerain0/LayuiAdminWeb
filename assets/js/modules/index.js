layui.extend({
    globalConfig: "config"
}).define(['globalConfig'], function (exports) {
    const globalConfig = layui.globalConfig;
    const element = layui.element;
    const $ = layui.jquery;
    const util = layui.util;
    const globalData = layui.data('global');
    const isKeepAliveMode = globalData.keepAlive === undefined ? globalConfig.keepAlive : globalData.keepAlive;

    // 标签过滤名
    const tabFilterName = 'admin-layout-tabs';
    // 窗口主体
    const container = $('#adminContainer');
    // 标签列表主体
    const tabTitle = $('.layui-tab-title');
    // 抽屉控制按钮
    const flexibleBtn = $('[admin-header-event=flexible]');
    // 抽屉主体
    const navContainer = $('ul[lay-filter=admin-nav]');
    // 主体iframe容器
    const iframeGroupContainer = $('.admin-tabsbody-item.layui-show');
    // 遮罩层
    const shapeBody = $('.admin-body-shade')

    // 是否处于展开状态
    const isSpreadDrawer = function () {
        return !container.hasClass('admin-side-shrink');
    }

    // 展开抽屉
    const spreadDrawer = function () {
        const width = $(window).width();
        if (width < 994) {
            container.addClass('admin-side-spread-sm');
            flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
        } else {
            container.removeClass('admin-side-shrink');
            flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
        }
    };

    // 收起抽屉
    const shrinkDrawer = function () {
        const width = $(window).width();
        if (width < 994) {
            container.removeClass('admin-side-spread-sm');
            flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
        } else {
            container.addClass('admin-side-shrink');
            flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
        }
    };

    // 添加页面
    const addPage = function (viewPath) {
        const url = viewPath + '?t=' + Math.random();
        const iframeHTML = '<iframe src="' + url + '" class="admin-iframe" style="display: block;"></iframe>';
        if (isKeepAliveMode) {
            // 重复性检验
            const iframeGroup = iframeGroupContainer.find('iframe');
            let sameTemp = false;
            iframeGroup.each(function () {
                const src = $(this).attr('src');
                if (src.startsWith(viewPath)) sameTemp = true;
            });
            if (!sameTemp) iframeGroupContainer.append(iframeHTML);
        }
        jumpToPage(viewPath);
    };

    // 跳转到指定页面
    const jumpToPage = function (viewPath) {
        if (isKeepAliveMode) {
            const items = iframeGroupContainer.find('iframe');
            items.each(function () {
                const self = $(this);
                const src = self.attr('src');
                if (!src.startsWith(viewPath)) self.css('display', 'none');
                else self.css('display', 'block');
            });
        } else {
            const currentIframe = getCurrentIframe();
            const src = currentIframe.attr('src');
            if (!src.startsWith(viewPath)) {
                const url = viewPath + '?t=' + Math.random();
                const iframeHTML = '<iframe src="' + url + '" class="admin-iframe" style="display: block;"></iframe>';
                iframeGroupContainer.empty();
                iframeGroupContainer.append(iframeHTML);
            }
        }
    };

    // 标签容器翻页
    const tabScrollPage = function (isLeft) {
        const tabTitle = $('.admin-pagetabs .layui-tab-title');
        const tabTitleWidth = tabTitle.width();
        const tabTitleLeftPadding = -parseFloat(tabTitle.css('left').replace('px', ''));
        if (isLeft) {
            if (tabTitleLeftPadding > 0) {
                let padding = tabTitleWidth / 4 * 3;
                if (tabTitleLeftPadding < padding) padding = tabTitleLeftPadding;
                tabTitle.css('left', '+=' + padding + 'px');
            }
        } else {
            const lastTab = tabTitle.find('li:last');
            const maxLeftPadding = lastTab.position().left;
            if (tabTitleLeftPadding < maxLeftPadding) {
                let padding = tabTitleWidth / 4 * 3;
                if (maxLeftPadding - tabTitleLeftPadding < padding) padding = maxLeftPadding - tabTitleLeftPadding;
                tabTitle.css('left', '-=' + padding + 'px');
            }
        }
    }

    // 跳到指定标签位置
    const tabScrollTo = function (id) {
        const tabTitle = $('.admin-pagetabs .layui-tab-title');
        const targetTab = tabTitle.find('li[lay-id="' + id + '"]');
        const tabTitleWidth = tabTitle.width() - 120; // 父布局的120px内边距
        const targetTabWidth = targetTab.width() + 31; // 31的内边距
        // 获取位置
        const targetTabLeftPadding = targetTab.position().left;
        const tabTitleLeftPadding = -parseFloat(tabTitle.css('left').replace('px', ''));
        if (
            !(tabTitleLeftPadding < targetTabLeftPadding && tabTitleLeftPadding + tabTitleWidth > targetTabLeftPadding + targetTabWidth)
        ) {
            let padding = -targetTabLeftPadding + tabTitleWidth * 0.4;
            tabTitle.css('left', padding > 0 ? 0 : padding + 'px');
        }
    }

    // 添加标签
    const addTab = function (viewPath, title) {
        const tabHTML = '<li lay-id="' + viewPath + '"><span>' + title + '</span></li>';
        const sameTab = tabTitle.find('li[lay-id="' + viewPath + '"]');
        if (sameTab.length === 0) {
            tabTitle.append(tabHTML);
            element.render('tab');
        }
        element.tabChange(tabFilterName, viewPath);
    }

    // 获取当前iframe
    const getCurrentIframe = function () {
        if (isKeepAliveMode) {
            return iframeGroupContainer.find('iframe[style="display: block;"]');
        } else {
            return $('.admin-iframe');
        }
    };

    // 更新iframe
    const updateIframe = function (url) {
        if (isKeepAliveMode) {
            const items = iframeGroupContainer.find('iframe');
            items.each(function () {
                const self = $(this);
                const style = self.attr('style');
                if (style === 'display: block;') {
                    self.remove();
                    // 添加新的iframe
                    const newUrl = url.substr(0, url.indexOf('?')) + '?t=' + Math.random();
                    iframeGroupContainer.html('<iframe src="' + newUrl + '" class="admin-iframe" style="display: block;"></iframe>');
                    setIframeLayHref();
                }
            });
        } else {
            const iframeParent = $('.admin-tabsbody-item.layui-show');
            // 清空元素
            iframeParent.empty();
            // 添加新的iframe
            iframeParent.html('<iframe src="' + url + '" class="admin-iframe" style="display: block;"></iframe>');
            setIframeLayHref();
        }
    };

    // 为iframe内部元素响应点击事件
    const setIframeLayHref = function () {
        $(".admin-iframe").on("load", function (event) {
            $("*[admin-href]", this.contentDocument).click(function () {
                const self = $(this);
                const attr = self.attr('admin-href');
                const title = self.html();
                addTab(attr, title);
                addPage(attr);
            });
        });
    };

    // 如果不是电脑，则需要对抽屉控制按钮做一下处理
    if ($(window).width() < 994) {
        flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
    }

    // 监听admin-href
    container.on('click', '*[admin-href]', function () {
        const self = $(this);
        const attr = self.attr('admin-href');
        const title = self.html();
        addTab(attr, title);
        addPage(attr);

        if (isSpreadDrawer() && $(window).width() < 994) shrinkDrawer();
    });

    //头部事件
    util.event('admin-header-event', {
        flexible: function (event) {
            const windowWidth = $(window).width();
            if (windowWidth >= 994) {
                if (!isSpreadDrawer()) {
                    spreadDrawer();
                } else {
                    shrinkDrawer();
                }
            } else { // 中小屏幕
                spreadDrawer();
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
        },
        refresh: function () {
            updateIframe(getCurrentIframe().attr('src'));
        }
    });

    // 遮罩层响应
    shapeBody.click(function () {
        shrinkDrawer();
    });

    // 抽屉二级目录自动收起/展开
    navContainer.on('click', 'li.layui-nav-item', function () {
        const self = $(this);
        // 收起时展开抽屉
        if (!isSpreadDrawer()) spreadDrawer();

        // 收起无用的二级目录
        const name = self.find('a cite').html();
        const itemGroup = navContainer.find('li.layui-nav-item');
        itemGroup.each(function () {
            const item = $(this);
            const itemName = item.find('a cite').html();
            if (itemName !== name && item.hasClass('layui-nav-itemed')) item.removeClass('layui-nav-itemed');
        })
    });

    // 监听标签右侧菜单
    element.on("nav(admin-pagetabs-nav)", function (elem) {
        // 关闭窗口
        const parent = elem.parent();
        parent.removeClass('layui-this');
        parent.parent().removeClass('layui-show');
        //
        const elementName = $(elem).text();
        const tabTitleDiv = $('.layui-tab-title');
        const currentItem = tabTitleDiv.find('.layui-this');
        const homeTabItemId = tabTitleDiv.find('li:first').attr('lay-id');
        if (elementName === '关闭当前标签页') {
            if (currentItem.attr('lay-id') !== homeTabItemId) {
                const prevItem = $(currentItem.prev());
                element.tabDelete(tabFilterName, currentItem.attr('lay-id'));
                element.tabChange(tabFilterName, prevItem.attr('lay-id'));
                tabScrollTo(prevItem.attr('lay-id'))
            }
        } else if (elementName === '关闭其它标签页') {
            const currentItemId = currentItem.attr('lay-id');
            tabTitleDiv.find('li').each(function () {
                const id = $(this).attr('lay-id');
                if (id !== currentItemId && id !== homeTabItemId) {
                    element.tabDelete(tabFilterName, id);
                }
            });
            tabScrollTo(currentItemId)
        } else if (elementName === '关闭全部标签页') {
            tabTitleDiv.find('li').each(function () {
                const id = $(this).attr('lay-id');
                if (id !== homeTabItemId) {
                    element.tabDelete(tabFilterName, id);
                }
            });
            element.tabChange(tabFilterName, homeTabItemId);
            tabScrollTo(homeTabItemId)
        }
    });

    // 监听标签
    element.on('tab(' + tabFilterName + ')', function (data) {
        const self = $(this);
        const url = self.attr('lay-id');
        if (!getCurrentIframe().attr('src').startsWith(url)) {
            navContainer.find('a[admin-href]').each(function () {
                const href = $(this).attr('admin-href');
                const parent = $($(this).parent());
                if (href === url) parent.addClass('layui-this');
                else parent.removeClass('layui-this');
            });
            jumpToPage(url);
            tabScrollTo(url)
        }
    });

    element.on('tabDelete(' + tabFilterName + ')', function (data) {
        if (!isKeepAliveMode) return; // 不保持状态不响应
        const iframeGroup = iframeGroupContainer.find('iframe');
        iframeGroup.each(function () {
            const iframe = $(this);
            const src = iframe.attr('src');
            const viewPath = src.substr(0, src.indexOf('?'));
            const tab = tabTitle.find('li[lay-id="' + viewPath + '"]');
            if (tab.length === 0) iframe.remove();
        });
    });

    // 监听标签左右翻页控制
    $('.admin-pagetabs .layui-icon-prev').click(function () {
        tabScrollPage(true);
    });
    $('.admin-pagetabs .layui-icon-next').click(function () {
        tabScrollPage(false);
    });

    // 监听屏幕宽度
    $(window).resize(function () {
        const windowWidth = $(window).width();
        if (windowWidth < 994) {
            if (container.hasClass('admin-side-shrink')) container.removeClass('admin-side-shrink');
            flexibleBtn.html('<i class="layui-icon layui-icon-spread-left"></i>');
        } else {
            container.removeClass('admin-side-spread-sm');
            flexibleBtn.html('<i class="layui-icon layui-icon-shrink-right"></i>');
        }
    });

    exports('index');
});