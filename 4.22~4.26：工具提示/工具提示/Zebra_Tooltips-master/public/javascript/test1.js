(function($)
{
    $.Zebra_Tooltips = function(elements, options)
    {
        var defaults = {
            animation_speed: 250,           // 速度(毫秒), 在动画显示/隐藏工具提示中使用
            animation_offset: 20,           // 滑动的位置. 设置为0无滑动
            background_color: '#000',       // 工具提示的背景颜色
            close_on_click: true,           // 默认情况下, 如果用户单击工具提示时, 工具提示将关闭
            color: '#fff',                  // 工具提示的文本颜色
            content: false,                 // 工具提示的内容
            default_position: 'above',      // 位置, 可能的值是 'above' 和 'below'
            hide_delay: 100,                // 隐藏延迟
            keep_visible: true,
            max_width: 250,                 // 工具提示的最大宽度
            opacity: '.95',                 // 工具提示的透明度
            position: 'center',             // 工具提示的位置, 相对于触发元素. 可能是 'center', 'right' or 'right'
            prerender: false,               // 如果看到 2 个威胁, 工具提示会创造 在线文档的负载
            show_delay: 100,                // 显示延迟
            vertical_offset: 0,             
            onBeforeHide: null,
            onHide: null,
            onBeforeShow: null,
            onShow: null
        };

        // 插件对象
        plugin = this,

        // 私人使用的脚本变量
        window_width, window_height, horizontal_scroll, vertical_scroll;

        plugin.setting = {};
        
        // hide()
        plugin.hide = function(elements, destroy)
        {
            elements.each(function()
            {
                // 当前元素
                var $element = $(this),

                // 得到一个参考的附加工具及其配件
                    tooltip_info = $elements.data('Zebra_Tooltip');
                
                // 如果有一个附加的工具提示
                if(tooltip_info)
                {
                    // 这两个错误的旗帜上，所以我们可以隐藏的工具提示
                    tooltip_info.sticky = false;

                    // 看到一个标志，如果提示需要两个“muted”后隐藏的信息
                    if (destroy) tooltip_info.destroy = true;

                    // 更新的提示数据缓存
                    $element.data('Zebra_Tooltip', tooltip_info);

                    // 隐藏工具提示
                    _hide($element);
                }
            });
        };

        // show()
        plugin.show = function(elements, destroy)
        {
            elements.each(function()
            {
                // 当前元素
                var $element = $(this),

                // 得到一个参考的附加工具及其配件
                    tooltip_info = $elements.data('Zebra_Tooltip');

                // 如果有一个附加的工具提示
                if(tooltip_info)
                {
                    // 这两个错误的旗帜上，所以我们可以隐藏的工具提示
                    tooltip_info.sticky = true;

                    // 设置为false，以便我们可以显示工具提示
                    tooltip_info.muted = false;

                    // 看到一个标志，如果提示需要两个“muted”后隐藏的信息
                    if (destroy) tooltip_info.destroy = true;

                    // 更新的提示数据缓存
                    $element.data('Zebra_Tooltip', tooltip_info);

                    // 显示工具提示
                    _show($element);
                }
            });
        };


        /* 构造函数方法 */
        var _init = function()
        {

            // 混入
            plugin.settings = $.extend({}, defaults, options);

            // 遍历需要附加插件的元素
            elements.each(function()
            {
                // 当前元素
                var $element = $(this),

                // 元素的title 属性
                    title = $element.attr(title),

                // 元素的data-* 属性
                    data_attribute = $element.data('zebra-tooltip');

                if (
                    // 元素具有title 属性, 而不是空的
                    (title && title !== '') ||

                    // 元素具有data-* 属性, 而不是空的
                    (data_attribute && data_attribute !== '') ||

                    // 内容是通过 'content' 属性
                    undefined !== plugin.settings.content
                )
                {
                    // 某些元素事件的处理程序
                    $element.bind({
                        // 当鼠标光标进入父元素时显示附加的工具提示
                        'mouseenter': function() { _show($element); },

                        // 鼠标光标离开父元素时
                        'mouseleave': function() { _hide($element); }
                    });

                    // 初始化和数据缓存提示
                    $element.data('Zebra_Tooltip', {
                        'tooltip':              null,
                        'content':              data_attribute || title || '',
                        'window_resized':       true,
                        'window_scrolled':      true,
                        'show_timeout':         null,
                        'hide_timeout':         null,
                        'animation_offset':     plugin.settings.animation_offset,
                        'skicky':               false,
                        'destroy':              false,
                        'muted':                false
                    });

                    // 阻止浏览器的行为表现出“标题”属性的工具提示
                    $element.attr('title', '');

                    // 如果提示是预先生成的，生成了
                    if (plugin.settings.prerender) _create_tooltip($element);
                }
            });

            // 如果浏览器窗口的大小或移动的，我们需要重新计算工具提示的位置
            $(window).bind('scroll resize', function()
            {
                // 遍历，提示附加元素
                elements.each(function()
                {
                    // 获取附加的工具提示及其组件的引用
                    var tooltip_info = $(this).data('Zebra_Tooltip');

                    // 如果元素包含了工具提示（如果它没有 “title” 属性或属性为空）
                    if(tooltip_info)
                    {
                        // 如果窗口滚动, 设置一个标志
                        if (event.type === 'scroll') tooltip_info.window_scrolled = true;

                        // 如果窗口大小改变, 设置一个标志
                        else tooltip_info.window_resized = true;

                        // 更新的提示数据缓存
                        $(this).data('Zebra_Tooltip', tooltip_info);
                    }
                });
            });



        };

        _init();
    }

})(jQuery);
































