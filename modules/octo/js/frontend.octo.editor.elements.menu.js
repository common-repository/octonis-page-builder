function octElementMenu(menuOriginalId, element, btnsClb) {
	this._$ = null;;
	this._animationSpeed = g_octAnimationSpeed;
	this._menuOriginalId = menuOriginalId;
	this._element = element;
	this._btnsClb = btnsClb;
	this._visible = false;
	this.init();
}
octElementMenu.prototype._afterAppendToElement = function() {
	
};
octElementMenu.prototype.$ = function() {
	return this._$;
};
octElementMenu.prototype.init = function() {
	var self = this;
	this._$ = jQuery('#'+ this._menuOriginalId)
		.clone()
		.attr('id', 'octElMenu_'+ mtRand(1, 99999))
		.appendTo( this._element.$() );
	this._afterAppendToElement();
	octInitCustomCheckRadio( this._$ );
	this._fixClickOnRadio();
	this.reposite();
	if(this._btnsClb) {
		for(var selector in this._btnsClb) {
			if(this._$.find( selector ).size()) {
				this._$.find( selector ).click(function(){
					self._btnsClb[ jQuery(this).data('click-clb-selector') ]();
					return false;
				}).data('click-clb-selector', selector);
			}
		}
	}
	
	this._initSubMenus();
};
octElementMenu.prototype._fixClickOnRadio = function() {
	this._$.find('.octElMenuBtn').each(function(){
		if(jQuery(this).find('[type=radio]').size()) {
			jQuery(this).find('[type=radio]').click(function(){
				jQuery(this).parents('.octElMenuBtn:first').click();
			});
		}
	});
};
octElementMenu.prototype._hideSubMenus = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	var menuAtBottom = this._$.hasClass('octElMenuBottom')
	,	self = this;
	this._$.find('.octElMenuSubPanel[data-sub-panel]:visible').each(function(){
		jQuery(this).slideUp(self._animationSpeed);
	});
	this._$.removeClass('octMenuSubOpened');
	if(!menuAtBottom) {
		this._$.data('animation-in-process', 1).animate({
			'top': this._$.data('prev-top')
		}, this._animationSpeed, function(){
			self._$.data('animation-in-process', 0)
		});
	}
	this._$.trigger('hideSubMenu');
};
octElementMenu.prototype._initSubMenus = function() {
	var self = this;
	if(this._$.find('.octElMenuBtn[data-sub-panel-show]').size()) {
		this._$.find('.octElMenuBtn').click(function(){
			self._hideSubMenus();
		});
		this._$.find('.octElMenuBtn[data-sub-panel-show]').click(function(){
			var subPanelShow = jQuery(this).data('sub-panel-show')
			,	subPanel = self._$.find('.octElMenuSubPanel[data-sub-panel="'+ subPanelShow+ '"]')
			,	menuPos = self._$.position()
			,	subPanelHeight = subPanel.outerHeight()
			,	menuAtBottom = self._$.hasClass('octElMenuBottom')
			,	menuTop = self._$.data('animation-in-process') ? self._$.data('prev-top') : menuPos.top;

			if(!subPanel.is(':visible')) {
				subPanel.slideDown( self._animationSpeed );
				if(!menuAtBottom) {
					self._$.data('prev-top', menuTop).animate({
						'top': menuTop - subPanelHeight
					}, self._animationSpeed);
				}
				self._$.addClass('octMenuSubOpened');
				self._$.trigger('showSubMenu');
			}
			return false;
		});
	}
};
octElementMenu.prototype.reposite = function() {
	var elementOffset = this._element.$().offset();

	this._$.css({
		'left': ((this._element.$().width() - this._$.width()) / 2) + 'px'
	});

	this._menuOnBottom = elementOffset.top - this._$.outerHeight() <= g_octTopBarH || this._element.$().data('menu-to-bottom');

	if(this._menuOnBottom) {
		this._$.addClass('octElMenuBottom');
	}
};
octElementMenu.prototype.destroy = function() {
	if(this._$) {
		this._$.remove();
		this._$ = null;
	}
};
octElementMenu.prototype.show = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	if(!this._visible) {
		// Let's hide all other element menus in current block before show this one
		var blockElements = this.getElement().getBlock().getElements();
		for(var i = 0; i < blockElements.length; i++) {
			blockElements[ i ].hideMenu();
		}
		// And now - show current menu
		this._$.addClass('active');
		this._$.trigger('showMenu');
		this._visible = true;
	}
};
octElementMenu.prototype.hide = function() {
	if(!this._$) return;	// If menu was already destroyed, with destroy element for example
	if(this._visible) {
		this._hideSubMenus();
		this._$.removeClass('active');
		this._$.trigger('hideMenu');
		this._visible = false;
	}
};
octElementMenu.prototype.getElement = function() {
	return this._element;
};
octElementMenu.prototype._initColorpicker = function(params) {
	params = params || {};
	var self = this
	,	color = params.color ? params.color : this._element.get('color');

	var $input = params.colorInp ? params.colorInp : this._$.find('.octColorBtn .octColorpickerInput'),
		options = jQuery.extend({
    		convertCallback: function (colors) {
	    		var rgbaString = 'rgba(' + colors.webSmart.r + ',' + colors.webSmart.g + ',' + colors.webSmart.b + ',' + colors.alpha + ')';
	    		colors.tiny = new tinycolor( '#' + colors.HEX );
	    		colors.tiny.toRgbString = function () {
	    			return rgbaString;
	    		};

	    		self._element._setColor(rgbaString);

	    		$input.attr('value', rgbaString);
	    	}
    	},
    	g_octColorPickerOptions
    );

    $input.css('background-color', color);
    $input.attr('value', color);
    $input.colorPicker(options);
};
/**
 * Try to find color picker in menu, if find - init it
 * TODO: Make this work for all menus, that using colopickers
 */
/*octElementMenu.prototype._initColorPicker = function(){
	
};*/
function octElementMenu_btn(menuOriginalId, element, btnsClb) {
	octElementMenu_btn.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_btn, octElementMenu);
octElementMenu_btn.prototype._afterAppendToElement = function() {
	octElementMenu_btn.superclass._afterAppendToElement.apply(this, arguments);

	this.$().find('.octPostLinkDisabled')
		.removeClass('octPostLinkDisabled')
		.addClass('octPostLinkList');

	// Link settings
	var self = this
	,	btnLink = this._element._getEditArea()
	,	linkInp = this._$.find('[name=btn_item_link]')
	,	titleInp = this._$.find('[name=btn_item_title]')
	,	newWndInp = this._$.find('[name=btn_item_link_new_wnd]');

	linkInp.val( btnLink.attr('href') ).change(function(){
		btnLink.attr('href', jQuery(this).val());
	});

	linkInp.on('postlink.show:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	linkInp.on('postlink.hide:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	titleInp.val( btnLink.attr('title') ).change(function(){
		btnLink.attr('title', jQuery(this).val());
	});
	btnLink.attr('target') == '_blank' ? newWndInp.attr('checked', 'checked') : newWndInp.removeAttr('checked');
	newWndInp.change(function(){
		jQuery(this).attr('checked') ? btnLink.attr('target', '_blank') : btnLink.removeAttr('target');
	});
	// Color settings
	this._initColorpicker({
		color: this._element.get('bgcolor')
	});
};
function octElementMenu_input_btn(menuOriginalId, element, btnsClb) {
	octElementMenu_input_btn.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_input_btn, octElementMenu);
octElementMenu_input_btn.prototype._afterAppendToElement = function() {
	octElementMenu_input_btn.superclass._afterAppendToElement.apply(this, arguments);
	this.$().find('.octPostLinkDisabled')
		.removeClass('octPostLinkDisabled')
		.addClass('octPostLinkList');

	// Link settings
	var self = this
	,	btnLink = this._element._getEditArea()
	,	linkInp = this._$.find('[name=btn_item_link]')
	,	titleInp = this._$.find('[name=btn_item_title]')
	,	newWndInp = this._$.find('[name=btn_item_link_new_wnd]');

	linkInp.val( btnLink.attr('href') ).change(function(){
		btnLink.attr('href', jQuery(this).val());
	});

	linkInp.on('postlink.show:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	linkInp.on('postlink.hide:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	titleInp.val( btnLink.attr('title') ).change(function(){
		btnLink.attr('title', jQuery(this).val());
	});
	btnLink.attr('target') == '_blank' ? newWndInp.attr('checked', 'checked') : newWndInp.removeAttr('checked');
	newWndInp.change(function(){
		jQuery(this).attr('checked') ? btnLink.attr('target', '_blank') : btnLink.removeAttr('target');
	});

	var defaultColor = this._element.get('bgcolor')
	,	$element = this._element._$;

	if (! defaultColor) {
		if (this._element.get('bgcolor-to') == 'border' && $element.css('border-color'))
			defaultColor = $element.css('border-color');
		else if (this._element.get('bgcolor-to') == 'bg' && $element.css('background-color'))
			defaultColor = $element.css('background-color');
		else 
			defaultColor = '#000';
	}

	// Color settings
	this._initColorpicker({
		color: defaultColor
	});
};
function octElementMenu_icon(menuOriginalId, element, btnsClb) {
	octElementMenu_icon.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_icon, octElementMenu);
octElementMenu_icon.prototype._afterAppendToElement = function() {
	octElementMenu_icon.superclass._afterAppendToElement.apply(this, arguments);

	this._$.on('showSubMenu', function () {
		var $this = jQuery(this)
		,	$panelLink = $this.find('.octElMenuSubPanel[data-sub-panel="iconlink"]');
		
		if ($panelLink.is(':visible'))
			$this.addClass('hideOnClickOutsideMenu');
	});

	this._$.on('hideSubMenu', function () {
		var $this = jQuery(this);
		
		$this.removeClass('hideOnClickOutsideMenu');
	});

	var self = this
	,	iconSizeID = ['fa-lg', 'fa-2x', 'fa-3x', 'fa-4x', 'fa-5x']
	,	iconSize = {
		'fa-lg': '1.33333333em'
	,	'fa-2x': '2em'
	,	'fa-3x': '3em'
	,	'fa-4x': '4em'
	,	'fa-5x': '5em'
	}
	,	$icon = this._element._$.find('.fa').first();

	if ($icon.size()) {
		var	iconClasses = $icon.attr("class").split(' ').reverse()
		,	currentIconSize = undefined;
		
		for (var i in iconClasses) {
			if (iconSizeID.indexOf(iconClasses[i]) != -1) {
				currentIconSize = iconClasses[i];
				break;
			}
		}

		if (currentIconSize)
			this._$.find('[data-size="' + currentIconSize + '"]').addClass('active');
	}

	this._$.on('click', '[data-size]', function () {
		var classSize = jQuery(this).attr('data-size')
		,	$icon = self._element._$.find('.fa').first();

		if (! $icon.size() || ! classSize) return;

		$icon.removeClass(iconSizeID.join(' '));
		$icon.addClass(classSize);
		$icon.css('font-size', iconSize[classSize]);
		self._$.find('[data-size].active').removeClass('active');
		self._$.find('[data-size="' + classSize + '"]').addClass('active');
	});
	
	this.$().find('.octPostLinkDisabled')
			.removeClass('octPostLinkDisabled')
			.addClass('octPostLinkList');

	var btnLink = this._element._getLink()
	,	linkInp = this._$.find('[name=icon_item_link]')
	,	titleInp = this._$.find('[name=icon_item_title]')
	,	newWndInp = this._$.find('[name=icon_item_link_new_wnd]');

	if(btnLink) {
		linkInp.val( btnLink.attr('href') );
		titleInp.val( btnLink.attr('title') );
		btnLink.attr('target') == '_blank' ? newWndInp.attr('checked', 'checked') : newWndInp.removeAttr('checked');
		btnLink.click(function(e){
			e.preventDefault();
		});
	}

	linkInp.change(function(){
		self._element._setLinkAttr('href', jQuery(this).val());
	});

	linkInp.on('postlink.show:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	linkInp.on('postlink.hide:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	titleInp.change(function(){
		self._element._setLinkAttr('title', jQuery(this).val());
	});
	newWndInp.change(function(){
		self._element._setLinkAttr('target', jQuery(this).prop('checked') ? true : false);
	});

	// Open links library
	this._$.find('.octIconLibBtn').click(function(){
		octUtils.showIconsLibWnd( self._element );
		return false;
	});
	// Color settings
	this._initColorpicker();
};
function octElementMenu_grid_col(menuOriginalId, element, btnsClb) {
	octElementMenu_grid_col.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_grid_col, octElementMenu);
octElementMenu_grid_col.prototype._afterAppendToElement = function() {
	octElementMenu_grid_col.superclass._afterAppendToElement.apply(this, arguments);
	var self = this;
	// Enb/Dslb fill color
	var enbFillColorCheck = this._$.find('[name=enb_fill_color]');
	enbFillColorCheck.change(function(){
		self.getElement().set('enb-color', jQuery(this).attr('checked') ? 1 : 0);
		self.getElement()._setColor();	// Just update it from existing color
		return false;
	});
	parseInt(this.getElement().get('enb-color'))
		? enbFillColorCheck.attr('checked', 'checked')
		: enbFillColorCheck.removeAttr('checked');
	// Color settings
	this._initColorpicker();
	// Enb/Dslb bg img
	var enbBgImgCheck = this._$.find('[name=enb_bg_img]');
	enbBgImgCheck.change(function(){
		self.getElement().set('enb-bg-img', jQuery(this).attr('checked') ? 1 : 0);
		self.getElement()._setImg();	// Just update it from existing image
		return false;
	});
	parseInt(this.getElement().get('enb-bg-img'))
		? enbBgImgCheck.attr('checked', 'checked')
		: enbBgImgCheck.removeAttr('checked');
};
function octElementMenu_img(menuOriginalId, element, btnsClb) {
	octElementMenu_img.superclass.constructor.apply(this, arguments);
}
extendOct(octElementMenu_img, octElementMenu);
octElementMenu_img.prototype._afterAppendToElement = function() {
	octElementMenu_img.superclass._afterAppendToElement.apply(this, arguments);
	this.getElement().get('type') === 'video'
		? this.$().find('[name=type][value=video]').attr('checked', 'checked')
		: this.$().find('[name=type][value=img]').attr('checked', 'checked');

	this.$().find('.octPostLinkDisabled')
		.removeClass('octPostLinkDisabled')
		.addClass('octPostLinkList');

	this._$.on('showSubMenu', function () {
		var $this = jQuery(this)
		,	$panelLink = $this.find('.octElMenuSubPanel[data-sub-panel="imglink"]');
		
		if ($panelLink.is(':visible'))
			$this.addClass('hideOnClickOutsideMenu');
	});

	this._$.on('hideSubMenu', function () {
		var $this = jQuery(this);

		$this.removeClass('hideOnClickOutsideMenu');
	});

	var self = this;

	var btnLink = this._element._getLink()
	,	linkInp = this._$.find('[name=icon_item_link]')
	,	titleInp = this._$.find('[name=icon_item_title]')
	,	newWndInp = this._$.find('[name=icon_item_link_new_wnd]');

	if(btnLink) {
		linkInp.val( btnLink.attr('href') );
		titleInp.val( btnLink.attr('title') );
		btnLink.attr('target') == '_blank' ? newWndInp.attr('checked', 'checked') : newWndInp.removeAttr('checked');
		btnLink.click(function(e){
			e.preventDefault();
		});
	}

	linkInp.change(function(){
		self._element._setLinkAttr('href', jQuery(this).val());
	});

	linkInp.on('postlink.show:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	linkInp.on('postlink.hide:after', function () {
		self._$.css('top', '-' + (self._$.find('.octElMenuContent').height() + 5) + 'px');
	});

	titleInp.change(function(){
		self._element._setLinkAttr('title', jQuery(this).val());
	});
	newWndInp.change(function(){
		self._element._setLinkAttr('target', jQuery(this).prop('checked') ? true : false);
	});
};