(function($)
{
    $.Zebra_Tooltips = function(elements, options)
    {
        var defaults = {
            animation_speed: 250,       // 速度(毫秒), 在动画显示/隐藏工具提示中使用
            animation_offset: 0,       // 滑动的位置. 设置为0无滑动
            background_color: '#000',   // 工具提示的背景颜色
            close_on_click: true,       // 默认情况下, 如果用户单击工具提示时, 工具提示将关闭
            color: '#fff',              // 工具提示的文本颜色
            content: false,             // 工具提示的内容
            default_potition: 'above',  // 位置, 可能的值是 'above' 和 'below'
            hide_delay: 100,            // 隐藏延迟
            keep_visible: true,
            max_width: 250,             // 工具提示的最大宽度
            opacity: '.95',             // 工具提示的透明度
            position: 'center',         // 工具提示的位置, 相对于触发元素. 'center', 'left' or 'right'
            prerender: false,           // 如果看到 2 个威胁, 工具提示会创造 在线文档的负载
            show_delay: 100,            // 显示延迟
            vertical_offset: 0,
            onBeforeShow: null,
            onShow: null,
            onBeforeHide: null,
            onHide: null
        },

        // 插件对象
            plugin = this,

        // 私人使用的脚本变量
            window_width, window_height, horizontal_scroll, vertical_scroll;

        plugin.settings = {};


        /**
         *  构造函数的方法
         *
         *  @return void
         *
         *  @access private
         */
        var _init = function()
        {
            // 混入
            plugin.settings = $.extend({}, defaults, options);

            var 
                // 当前元素
                $element = $(elements),
            
                // 元素的 title 属性
                title = $element.attr('title'),

                // 元素的 data-* 属性
                data_attribute = $element.data('zebra-tooltip');
                
            // 如果
            if (
                // 元素具有 title 属性, 而不是空的
                (title && title !== '') ||
                
                // 元素具有 data-* 属性, 而不是空的
                (data_attribute && data_attribute !== '') ||

                // 内容是通过 'content' 属性
                undefined !== plugin.settings.content
            ) {
                // 某些元素事件的处理程序
                $element.on({
                    // 当鼠标光标进入父元素时显示附加的工具提示
                    'mouseenter': function() { _show($element) },

                    // 鼠标光标离开父元素时
                    'mouseleave': function() { _hide($element) }
                });
            }

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

            // 阻止浏览器的行为表现出 'title' 属性的工具提示
            $element.attr('title', '');

            // 如果提示是两个预生, 现在引起
            if (plugin.settings.prerender) _create_tooltip($element);
            
            // 如果浏览器窗口的大小或移动的, 我们需要重新计算工具提示的位置
            $(window).on('scroll resize', function()
            {
                // 获取附加的工具提示及其组件的引用
                var tooltip_info = $element.data('Zebra_Tooltip');

                // 如果元素包含了工具提示及其组件的引用
                if (tooltip_info)
                {
                    // 如果窗口滚动, 设置一个标志
                    if (event.type === 'scroll') tooltip_info.window_scrolled = true;

                    // 如果窗口大小改变, 设置一个标志
                    else tooltip_info.window_resized = true;

                    // 更新的提示数据缓存
                    $element.data('Zebra_Tooltip', tooltip_info);
                }
            });
        };
        
        /**
         *  生成工具提示的 HTML 代码并将其插入到DOM中
         *  返回包含工具提示组件的引用的对象
         *  
         *  如果工具提示已经存在, 该方法只返回对象的引用的工具提示组件
         *
         *  @param jQuery elements      jQuery版本的DOM元素链接的提示
         *  
         *  @return Object              返回包含工具提示组件的引用的对象
         *
         *  @access private
         */
        var _create_tooltip = function($element)
        {
            // 获取工具提示及其组件的引用, 如果可用的话
            var tooltip_info = $element.data('Zebra_Tooltip');

            // 如果工具提示的 HTML 尚未创建
            if(!tooltip_info.tooltip)
            {
                var
                    // 创建工具提示的主要容器
                    tooltip = jQuery('<div>', {
                        'class': 'Zebra_Tooltip',
                        css: {
                            'opacity': 0,
                            'display': 'block'
                        }
                    }),
                    // 创建工具提示的消息容器
                    message = jQuery('<div>', {
                        'class': 'Zebra_Tooltip_Message',
                        css: {
                            'max-width':        plugin.settings.max_width,
                            'background-color': plugin.settings.background_color,
                            'color':            plugin.settings.color
                        }

                    // 添加使用消息作为参数实例化对象时, 工具提示的内容或信息包含在 'title' 父元素的属性
                    }).html(plugin.settings.content ? plugin.settings.content : tooltip_info.content)

                    // 将元素的附加到主容器
                    .appendTo(tooltip),

                    // 创建工具提示的箭头容器
                    arrow_container = jQuery('<div>', {
                        'class': 'Zebra_Tooltip_Arrow'

                    // 将元素附加到主容器
                    }).appendTo(tooltip),

                    // 创建实际箭头 并将其附加到箭头容器
                    arrow = jQuery('<div>').appendTo(arrow_container);

                // 如果鼠标光标在工具提示上时, 工具将被保留
                if (plugin.settings.keep_visible)
                {
                    // 当鼠标离开工具提示的表面 或 点击工具提示
                    tooltip.on('mouseleave' + (plugin.settings.close_on_click ? 'click' : ''), function()
                    {
                        // 隐藏工具提示
                        _hide($element);
                    });

                    // 当鼠标进入工具提示的表面
                    tooltip.on('mouseenter', function()
                    {
                        // 保持工具提示可见
                        _show($element);
                    });
                };

                // 向 Body 注入工具提示（这样我们就可以得到它的尺寸）
                tooltip.appendTo('body');

                var
                    // 获取工具提示的 width and height
                    tooltip_width = tooltip.outerWidth(),
                    tooltip_height = tooltip.outerHeight(),

                    // 获取箭头的 width and height
                    arrow_width = arrow.outerWidth(),
                    arrow_height = arrow.outerHeight(),

                    tmp_width = message.outerWidth(),
                    tmp_height = message.outerHeight();

                // 将所有数据分组
                tooltip_info = {
                    'tooltip':          tooltip,
                    'tooltip_width':    tooltip_width,
                    'tooltip_height':   tooltip_height + (arrow_height / 2),
                    'message':          message,
                    'arrow_container':  arrow_container,
                    'arrow_width':      arrow_width,
                    'arrow_height':     arrow_height,
                    'arrow':            arrow
                }
                
                // 硬编码的工具提示的宽度和高度, 所以它不会由于换行当工具提示太接近浏览器窗口的边缘破碎
                tooltip.css({
                    'width':    tooltip_info.tooltip_width,
                    'height':   tooltip_info.tooltip_height
                });

                // 调整, 如果需要的话, 代表的Tooltip宽度/高度值
                tooltip_info.tooltip_width = tooltip_info.tooltip_width + (message.outerWidth() - tmp_width);
                tooltip_info.tooltip_height = tooltip_info.tooltip_height + (message.outerHeight() - tmp_height);

                // 调整, 如果需要的话, 代表的Tooltip的宽度/高度, 然后藏起来
                tooltip.css({
                    'width':    tooltip_info.tooltip_width,
                    'height':   tooltip_info.tooltip_height,
                    'display':  'none'
                });

                // 合并新数据时工具提示数据创建实例化库
                tooltip_info = $.extend($element.data('Zebra_Tooltip'), tooltip_info);
                
                // 缓存更新工具提示数据
                $element.data('zebra-tooltip', tooltip_info);


            }
            // 如果浏览器窗口调整大小 或 滚动
            if (tooltip_info.window_resized || tooltip_info.window_scrolled)
            {
                // 参考浏览器窗口
                var browser_window = $(window);

                // 如果浏览器窗口调整大小
                if (tooltip_info.window_resized)
                {
                    // 获取浏览器 宽
                    window_width = browser_window.width();

                    // 获取浏览器 高
                    window_height = browser_window.height();

                    // 获取元素的位置, 相对于文档
                    var element_position = $element.offset();

                    $.extend(tooltip_info, {
                        'element_left':     element_position.left,
                        'element_top':      element_position.top,
                        'element_width':    $element.outerWidth(),
                        'element_height':   $element.outerHeight()
                    });
                }

                // 获取浏览器的水平和垂直滚动偏移
                vertical_scroll = browser_window.scrollTop();
                horizontal_scroll = browser_window.scrollLeft();

                // 计算工具提示和箭头位置
                var tooltip_left = plugin.settings.position === 'left' ? tooltip_info.element_left - tooltip_info.tooltip_width + tooltip_info.arrow_width : 
                                   (plugin.settings.position === 'right' ? tooltip_info.element_left + tooltip_info.element_width - tooltip_info.arrow_width : 
                                   (tooltip_info.element_left + (tooltip_info.element_width - tooltip_info.tooltip_width) / 2)),

                    tooltip_top = tooltip_info.element_top - tooltip_info.tooltip_height,

                    arrow_left = plugin.settings.position === 'left' ? tooltip_info.tooltip_width - tooltip_info.arrow_width - (tooltip_info.arrow_width / 2) : 
                                 (plugin.settings.position === 'right' ? (tooltip_info.arrow_width / 2) : 
                                 ((tooltip_info.tooltip_width - tooltip_info.arrow_width) / 2));

                // 如果工具提示的右边在浏览器窗口的可见部分之外
                if (tooltip_left + tooltip_info.tooltip_width > window_width + horizontal_scroll)
                {
                    // 调整箭头位置
                    arrow_left -= (window_width + horizontal_scroll) - (tooltip_left + tooltip_left + tooltip_info.tooltip_width) - 6;

                    // 调整工具提示的位置
                    tooltip_left = (window_width + horizontal_scroll) - tooltip_info.tooltip_width - 6;

                    // 如果调整后, 箭头仍需调整
                    if (arrow_left + tooltip_info.arrow_width > tooltip_info.tooltip_width - 6)
                        // 调整箭头位置
                        arrow_left = tooltip_info.tooltip_width - 6 - tooltip_info.arrow_width;

                    // 如果没有空间显示箭头, 隐藏它
                    if (tooltip_left + arrow_left + (tooltip_info.arrow_width / 2) < tooltip_info.element_left) arrow_left = -10000;
                }

                // 如果工具提示的右边在浏览器窗口的可见部分之外
                if (tooltip_left < horizontal_scroll)
                {
                    // 调整箭头位置
                    arrow_left -= horizontal_scroll - tooltip_left;

                    // 调整工具提示的位置
                    tooltip_left = horizontal_scroll + 2;

                    // 如果调整后, 箭头仍需调整
                    if (arrow_left < 0)
                        // 调整箭头位置
                        arrow_left = (tooltip_info.arrow_width / 2);

                    // 如果没有空间显示箭头, 隐藏它
                    if (tooltip_left + arrow_left + (tooltip_info.arrow_width / 2) > tooltip_info.element_left + tooltip_info.element_width) arrow_left = -10000;
                }

                // 默认情况下, 我们假定工具提示定位于元素上方, 因此箭头位于工具提示的底部
                // (我们删除了上一次迭代中可能设置的所有内容)
                tooltip_info.arrow_container.removeClass('Zebra_Tooltip_Arrow_Top');
                tooltip_info.arrow_container.addClass('Zebra_Tooltip_Arrow_Bottom');
                tooltip_info.message.css('margin-top', '');

                // 如果
                if (
                    // 工具提示的顶部位于浏览器窗口的可见部分之外
                    tooltip_top < vertical_scroll || 

                    // 工具提示将显示下面的元素, 并有足够的空间, 下面的元素显示工具提示
                    (plugin.settings.default_position === 'below' && tooltip_info.element_top + tooltip_info.element_height + plugin.settings.vertical_offset + tooltip_info.tooltip_height + tooltip_info.animation_offset < window_height + vertical_scroll)
                ) {
                    // 将工具提示置于元素下方, 而不是上面, 也解释偏移量
                    tooltip_top = tooltip_info.element_top + tooltip_info.element_height - plugin.settings.vertical_offset;

                    // 工具提示会向上滑动, 而不是向下
                    tooltip_info.animation_offset = Math.abs(tooltip_info.animation_offset);

                    // 工具提示的正文需要在底部垂直对齐
                    tooltip_info.message.css('margin-top', (tooltip_info.arrow_height / 2));

                    // 在这种情况下, 箭头需要指向上而不是向下
                    // 并放置在工具提示的上方, 而不是下面
                    tooltip_info.arrow_container.removeClass('Zebra_Tooltip_Arrow_Bottom');
                    tooltip_info.arrow_container.addClass('Zebra_Tooltip_Arrow_Top');

                    // 设置箭头的颜色（我们设置为不同的边, 如果它指向向上或向下）
                    tooltip_info.arrow.css('borderColor', 'transparent transparent ' + plugin.settings.background_color);

                // 如果工具提示的顶部位于浏览器窗口的可见部分内
                } else {
                    // 工具提示将向下滑动
                    tooltip_info.animation_offset = -Math.abs(tooltip_info.animation_offset);

                    // 抵销账户
                    tooltip_top += plugin.settings.vertical_offset;
                };

                // 将箭头的水平位置设置在工具提示中
                tooltip_info.arrow_container.css('left', arrow_left);

                // 设置工具提示的最终位置
                tooltip_info.tooltip.css({
                    'left': tooltip_left,
                    'top':  tooltip_top
                });

                // 数据更新提示
                $.extend(tooltip_info, {
                    'tooltip_left': tooltip_left,
                    'tooltip_top':  tooltip_top,
                    'arrow_left':   arrow_left
                });

                // 缓存更新工具提示数据
                $element.data('Zebra_Tooltip', tooltip_info);
            };

            // 返回带有工具提示数据的对象
            return tooltip_info;
        };


        /**
         *  隐藏附加到元素作为参数的工具提示。
         *
         *  @param jQuery $element  用于隐藏附加插件的DOM元素的jQuery版本
         *
         *  @return void
         *
         *  @access private
         */
        var _hide = function($element)
        {
            // 获取关于作为参数给出的元素的工具提示的信息
            var tooltip_info = $element.data('Zebra_Tooltip');

            // 如果有隐藏工具提示的超时, 请取消它
            clearTimeout(tooltip_info.hide_timeout);

            // 如果工具提示不黏（当它只能由用户关闭）
            if(!tooltip_info.sticky)
            {
                // 清除显示工具提示的超时（如果有的话）

                // 隐藏工具提示, 使用指定的延迟（如果有的话）
                tooltip_info.hide_timeout = setTimeout(function()
                {
                    // 如果元素上富有工具提示
                    // （作为一个可以称之为hide() 工具提示所示之前）
                    if(tooltip_info.tooltip)
                    {
                        // 如果在隐藏工具提示之前存在回调函数
                        if (plugin.settings.onBeforeHide && typeof plugin.settings.onBeforeHide === 'function')
                            // 执行回调函数
                            plugin.settings.onBeforeHide($element, tooltip_info.tooltip);

                        // 将此标志设置为false, 以便脚本知道它必须再次添加 'close' 按钮
                        // 如果使用API显示工具提示
                        tooltip_info.close = false;

                        // 如果工具提示需要被销毁一旦它淡出
                        if (tooltip_info.destroy)
                            // 现在设置此标志, 以便用户快速地在元素消失时, 不在显示工具提示
                            tooltip_info.muted = true;

                        // 缓存更新工具提示数据
                        $element.data('Zebra_Tooltip', tooltip_info);

                        // 删除 'close' 按钮
                        $('a.Zebra_Tooltip_Close', tooltip_info.tooltip).remove();

                        // 如果工具提示在动画中, 停止
                        tooltip_info.tooltip.stop();

                        // 工具提示的动画
                        tooltip_info.tooltip.animate({
                            'opacity':  0,
                            'top':      tooltip_info.tooltip_top + tooltip_info.animation_offset

                        // 使用指定的速度
                        }, plugin.settings.animation_speed, function()
                        {
                            // 设置工具提示 display: none
                            $(this).css('display', 'none');

                            // 如果隐藏工具提示后存在回调函数
                            if (plugin.settings.onHide && typeof plugin.settings.onHide === 'function')
                                // 执行回调函数
                                plugin.settings.onHide($element, tooltip_info.tooltip);
                        });
                    };


                // 延迟后隐藏插件
                }, plugin.settings.hide_delay);
            }
        };

        
        /**
         *  显示附加到元素作为参数的工具提示。
         *
         *  @param jQuery $element  用于显示附加插件的DOM元素的jQuery版本
         *
         *  @return void
         *
         *  @access private
         */
        var _show = function($element)
        {
            // 获取附加的工具提示及其组件的引用
            var tooltip_info = $element.data('Zebra_Tooltip');

            // 如果现实工具提示已经超时, 请取消它
            clearTimeout(tooltip_info.show_timeout);
            
            // 如果工具提示不是'muted' （只能用API显示的情况）
            if (!tooltip_info.muted)
            {
                // 清除超时隐藏工具提示（如果有的话）
                clearTimeout(tooltip_info.hide_timeout);

                // 使用指定的延迟显示工具提示（如果有的话）
                tooltip_info.show_timeout = setTimeout(function()
                {
                    // 如果在显示工具提示之前存在回调函数
                    if(plugin.settings.onBeforeShow && typeof plugin.settings.onBeforeShow === 'function')
                        // 执行回调函数
                        plugin.settings.onBeforeShow($element, tooltip_info.tooltip);

                    // 如果尚未创建, 请创建工具提示
                    tooltip_info = _create_tooltip($element);

                    // 如果工具提示未被动画化
                    if(tooltip_info.tooltip.css('display') != 'block')
                        // 设置工具提示的顶部, 这样我们就可以 'slide'
                        tooltip_info.tooltip.css({
                            'top': tooltip_info.tooltip_top + tooltip_info.animation
                        });

                    // 设置工具提示 display: block
                    tooltip_info.tooltip.css('display', 'block');

                    // 如果工具提示在动画中, 停止
                    tooltip_info.tooltip.stop();

                    // 工具提示的动画
                    tooltip_info.tooltip.animate({
                        'top':      tooltip_info.tooltip_top,
                        'opacity':  plugin.settings.opacity

                    // 使用指定的速度
                    }, plugin.settings.animation_speed, function()
                    {
                        // 如果在显示工具提示后运行回调函数
                        if (plugin.settings.onShow && typeof plugin.settings.onShow === 'function')
                        {
                            // 执行回调函数
                            plugin.settings.onShow($element, tooltip_info.tooltip);
                        }
                    });

                // 显示插件后的延迟
                }, plugin.settings.show_delay);
            }
        };

        _init();
    }





    $.fn.Zebra_Tooltips = function(options)
    {
        return this.each(function()
        {
            new $.Zebra_Tooltips(this, options);
        });
    }

})(jQuery);
































