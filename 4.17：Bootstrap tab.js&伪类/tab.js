(function($)
{
  'use strict';
  
  // 标签的定义
  // ========
  
  var Tab = function(element)
  {
    this.element = $(element);
  }
  
  Tab.transition = 150;
  
  Tab.prototype.show = function()
  {
    // 对象
    var $this  = this.element,
    // closest() 与 parent() 类似
      $ul      = $this.closest('ul:not(".dropdown-menu")'),
      selector = $this.data('target');
    
    // 对a 的href 做处理
    if(!selector)
    {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');//在一行中最后 一个 ＃号开始的非空字符串前面的内容。如 123#abc，匹配：#abc。123#abc#def，匹配：123#abc
    };
    
    // 点击同一个 调出循环
    if($this.parent('li').hasClass('active')) return;
    
    // 突出的li
    var $previous = $ul.find('.active:last a'),
      hideEvent = $.Event('hide.bs.tab', {
        relatedTarget: $this[0]
      }),
      
      showEvent = $.Event('show.bs.tab', {
        relatedTarget: $previous[0]
      });
    
    $previous.trigger(hideEvent);
    $this.trigger(showEvent);
    
    if(showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;
    
    // href 里面#home 字段
    var $target = $(selector);
    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function()
    {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
    
    
  }/*show [结束]*/
  
  Tab.prototype.activate = function(element, container, callback)
  {
    var $active    = container.find('> .active'),
      transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next()
    {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false);
      
      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true);
      
      if(transition)
      {
        element[0].offsetWidth;// 回调函数的过渡
        element.addClass('in');
      }
      else
      {
        element.removeClass('fade');
      }
      
      
      if(element.parent('.dropdown-menu').length)
      {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true);
      }
      
      callback && callback();
    };
    
    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.transition) : 
      next();
      
    $active.removeClass('in');
    
  }/*activate [结束]*/
  
  
  // 标签插件定义
  // ==========
  function Plugin(option)
  {
    return this.each(function()
    {
      var base = $(this),
        data = base.data('bs.tab');
        
      if(!data) base.data('bs.tab', (data = new Tab(this)));
      if(typeof option === 'string') data[option]();
    });
  }
  
  var old = $.fn.tab;
  
  $.fn.tab          = Plugin;
  $.fn.tab.constructor = Tab;
  
  
  // 标签没有冲突
  // ==========
  $.fn.tab.noConflict = function()
  {
    $.fn.tab = old;
    return this;
  }
  
  // 标签 data-api
  // ============
  var clickHandler = function(e)
  {
    e.preventDefault();
    Plugin.call($(this), 'show');
  }
  
  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);

  function log(c){ console.log(c) };
})(jQuery);