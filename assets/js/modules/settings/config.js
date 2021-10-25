layui.extend({
    globalConfig: "config"
}).define(['globalConfig'], function (exports) {
    const form = layui.form;
    const $ = layui.jquery;
    const globalConfig = layui.globalConfig;
    const globalData = layui.data('global');
    const isKeepAliveMode = globalData.keepAlive === undefined ? globalConfig.keepAlive : globalData.keepAlive;

    if (isKeepAliveMode) $('input[name="keepAlive"]').attr('checked', 'checked');
    form.render();

    form.on('submit(ConfigFormSubmit)', function (data) {
        const fields = data.field;
        const keepAlive = fields.keepAlive || 0;

        layui.data('global', {
            key: 'keepAlive',
            value: keepAlive === "1"
        });

        parent.location.reload();
    });

    exports('settings/config');
});