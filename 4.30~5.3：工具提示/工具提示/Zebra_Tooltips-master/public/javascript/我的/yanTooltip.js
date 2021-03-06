(function($)
{
    var Plugin = function(el, options) {

        var base = this;

        base.opts = $.extend({}, Plugin.defaults, options);

        this._init(el);
    }
    
    
    Plugin.prototype._init = function(el)
    {
        var base = this,

            $element = $(el);
        
        $element.data('Tooltip', {
            tooltip: null,
            show_timeout: null,
            hide_timeout: null
        });

        base._event($element);
    }


    Plugin.prototype._event = function($element)
    {
        var base = this;

        $element.on('mouseenter mouseleave', function (e)
        {
            var tooltip_info = $element.data('Tooltip');

            if (e.type === 'mouseenter') 
            {
                if (!tooltip_info.tooltip) 
                {
                    var
                        offset = $element.offset(),
                        ctop = offset.top,
                        cleft = offset.left;

                    tooltip = jQuery('<div>', {
                        'class': 'ty_Tip',
                        'css': {
                            'position': 'absolute',
                            'display': 'none'
                        }

                    }).html(base.opts.content).appendTo('body');

                    if (base.opts.onShowOnce && typeof base.opts.onShowOnce == 'function')
                        base.opts.onShowOnce.call($element, tooltip);

                    tooltip.css({
                        top: ctop + 20,
                        left: cleft - (275/2 - $element.outerWidth()/2)
                    });

                    tooltip_info.tooltip = tooltip;

                        tooltip.mouseenter(function()
                        {
                            base._show($element);
                        });
                        
                        tooltip.mouseleave(function()
                        {
                            base._hide($element);
                        });
                };

                base._show($element);
            }

            else if (e.type == 'mouseleave') 
            {
                base._hide($element);
            }
            
        });
    }


    Plugin.prototype._hide = function($element)
    {
        var tooltip_info = $element.data('Tooltip');

        clearTimeout(tooltip_info.hide_timeout);

        tooltip_info.hide_timeout = setTimeout(function()
        {
            tooltip_info.tooltip.hide();

        },100);

    }


    Plugin.prototype._show = function($element)
    {
        var tooltip_info = $element.data('Tooltip');

        clearTimeout(tooltip_info.hide_timeout);

        tooltip_info.tooltip.show();

    }

    Plugin.defaults = {
        content: false,
        onShowOnce: null
    }
    
    
    $.fn.yanTooltip = function(options){
        return this.each(function()
        {
            new Plugin(this, options);
        });
    }
})(jQuery);