(function($, window, document, undefined)
{
	
	var pluginName = 'jqueryAccordionMenu',
	
	// 插件构造函数
	// ==========
	Plugin = function(el, options)
	{
		// 指向 Plugin 类
		var base = this;
		
		// 对象
		base.$el = $(el);
		
		// 混入
		base.opts = $.extend({}, Plugin.defaultOptions, options);
		
		// 方法
		base.init();
	}
	
	
	
	Plugin.prototype.init = function()
	{
		// 指向 Plugin 类
		var base = this;
		
		// 方法()
		base.openSubmenu();
		base.submenuIndicators();
		base.addClickEffect();
		base.filterMenu(base.opts.head, base.opts.list);
		
		
		
	}/* [init] End */
	
	
	
	
	// 打开二级菜单
	Plugin.prototype.openSubmenu = function()
	{
		// 指向 Plugin 类
		var base = this;
		
		base.$el.children('ul').on('click touchstart', 'li', function(e)
		{
			var o = $(this).children('.submenu');
			
			// 阻止冒泡 
			e.stopImmediatePropagation();
			
			if (o[0])
			{
				// 清除默认事件
				e.preventDefault();
				
				if(o.css('display') === 'none')
				{
					o.delay(base.opts.showDelay).slideDown(base.opts.speed)
					.end()// Li
					.children('a').addClass('submenu_indicator__minus');// 为a 添加样式
					
					if (base.opts.singleOpen)
					{
						var mm = $(this).siblings().find('.submenu').slideUp(base.opts.speed)
						.end()// Li
						.find('a').removeClass('submenu_indicator__minus');
					}

					// return false;//（配合 window.location.href）
				}
				else
				{
					o.delay(base.opts.hideDelay).slideUp(base.opts.speed)
					.end()// Li
					.children('a').removeClass('submenu_indicator__minus');// 去除a 的样式

					// return false;//（配合 window.location.href）
				};
			}

			// 如果子集没有 ul.submenu 就跳转链接（方法二）
			// window.location.href = $(this).children('a').attr('href');
		});


		// 突出效果的 转移
		base.$el.children('ul').children('li').on('click touchstart', function()
		{
			base.$el.children('ul').children('li.on').removeClass('on')
			$(this).addClass('on');
		});
		
	}/* [openSubmenu] End  */
	
	
	
	// 二级菜单上的图标 + 号
	Plugin.prototype.submenuIndicators = function()
	{
		var subs = this.$el.find('.submenu');
		if (subs.length > 0)subs.prev('a').append('<span class="submenu_indicator">+</span>');
	}/* [submenuIndicators] End */
	
	
	
	// 触感效果
	Plugin.prototype.addClickEffect = function()
	{
		var ink, d, x, y, offset, _touch,
			base = this;


		base.$el.children('ul').on('click', 'a', function(e)
		{
			$this = $(this);
			base.$el.find('.ink').remove();
			if ($this.children('.ink').length === 0) $(this).prepend('<span class="ink"></span>');

			ink = $this.find('.ink');
			ink.removeClass('animate_ink');

			d = Math.max( $this.outerWidth(), $this.outerHeight() );
			ink.css({
				height: d,
				width: d
			});
			
			offset = $this.offset();
			xDesk = e.pageX;
			yDesk = e.pageY;
			// 移动 touch 事件获取坐标
			if (!xDesk) _touch = e.originalEvent.changedTouches[0];
			x = (xDesk || _touch.pageX) - offset.left - (d / 2);// 鼠标坐标 - a 的offsetLeft
			y = (yDesk|| _touch.pageY) - offset.top - (d / 2);
			ink.css({
				top: y,
				left: x
			}).addClass('animate_ink');
		});


	}/* [addClickEffect] End */
	
	
	// 帅选菜单
	Plugin.prototype.filterMenu = function(head, list)
	{
		// 创建一个搜索表单（jQuery创建的方式）
		var cform = $('<form>').attr({
			class: 'filterform',
			action: '#'
		}), input = $('<input>').attr({
			class: 'filterinput',
			type: 'text'
		});

		// 表单对象中,追加 input 对象, 在添加到 base.opts.head 中
		$(form).append(input).appendTo(head);

		// input 对象输入内容 就进行筛选
		$(input).change(function()// 这个change()是改变内容, 并失去焦点才执行
		{
			var filter = $(this).val();
			if(filter)
			{
				$matches = list.find('a:Contains(' + filter + ')').parent();// closest('li')
				list.children('li').not($matches).slideUp();
				$matches.slideDown();
			}
			else
			{
				list.find('li').slideDown();
			}
		}).keyup(function() {
			$(this).change();
		});

	}/* [filterMenu] End */
	

	// 筛选 filter
	$.expr[':'].Contains = function(e, i, m)// (e: element) (i: index) (m: match)
	{
		// console.log(e.innerHTML+'==='+i+'---【'+m[3]+'】('+m[1]+')['+m[0]+']'); // 去过滤每个 a
		return (e.textContent || e.innerText || '').toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	}
	
	
	
	
	// 自有属性
	// =======
	Plugin.defaultOptions = {
		speed: 300,
		head: $('#form'),// 头部 放搜索框的位置
		list: $('#list'),// 列表对象
		showDelay: 0,// 显示延迟
		hideDelay: 0,// 隐藏延迟
		singleOpen: true,// (true: 打开2级菜单前 会先将所有菜单隐藏)
		clickEffect: true // (true: 开启触感)
	}
	
	
	
	
	// 标签插件的定义
	// ============
	$.fn[pluginName] = function(options)
	{
		var base = this;
		return base.each(function()
		{
			if(!$.data(base, 'plugin_' + pluginName))// $.data()
			{
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}
	
})(jQuery, window, document);










































