var g_octMainMenu = null
,	g_octMainTollbar = null
,	g_octFileFrame = null	// File frame for wp media uploader
,	g_octEdit = true
,	g_octTopBarH = 93	// Height of the Top Editor Bar
,	g_octColorPickerOptions = {
	size: 2
,	mode: 'hsv-h'
};
jQuery(document).ready(function(){
	// Adding beforeStart event for sortable
	var oldMouseStart = jQuery.ui.sortable.prototype._mouseStart;
	jQuery.ui.sortable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
		this._trigger("beforeStart", event, this._uiHash());
		oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
	};
	/*jQuery('.octEl').mousedown(function(e){
		jQuery(this).data('_mouseDownTime', (new Date()).getTime());
		var editor = tinymce.get(jQuery(this).attr('id') || 'content');
		console.log(editor);
	});
	jQuery('.octEl').click(function(e){
		var clickTime = jQuery(this).data('_mouseDownTime')
		,	clickTimeDiff = (new Date()).getTime()- clickTime;
		if(clickTimeDiff <= 500) {
			e.stopPropagation();
			tinymce.init({
				selector: this
			,	inline: true
			,	toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
			,	menubar: false
			});
			//tinymce.get(jQuery(this).attr('id') || 'content').focus();
		}
	});*/
	// Prevent all default browser event - such as links redirecting, forms submit, etc.
	jQuery('#octCanvas').on('click', 'a', function(event){
		event.preventDefault();
	});
	_octInitMainMenu();
	_octInitDraggable();
	_octInitMainToolbar();
	
	_octFitCanvasToScreen();
	jQuery(window).resize(function(){
		_octFitCanvasToScreen();
		_octGetMainToolbar().refresh();
	}).load(function () {
		_octGetMainToolbar().refresh();
	});
	jQuery('.octMainSaveBtn').click(function(){
		_octSaveCanvas();
		return false;
	});
	_octInitOctoDataChange();
	// Transform al custom chosen selects
	jQuery('.chosen').chosen({
		disable_search_threshold: 5
	});
});
function _octInitMainMenu() {
	var mainDelay = 100;
	jQuery('.octBlocksBar').slimScroll({
		height: jQuery(window).height() - g_octTopBarH
	,	railVisible: true
	,	alwaysVisible: true
	,	allowPageScroll: true
	,	position: 'right'
	,	color: '#f72497'
	,	opacity: 1
	,	distance: 0
	,	borderRadius: '3px'
	,	wrapperPos: 'fixed'
	});
	jQuery('.octBlocksBar').each(function(){
		var classes = jQuery(this).attr('class');
		jQuery(this).attr('class', 'octBlockBarInner').parent().addClass(classes).attr('data-cid', jQuery(this).data('cid'));
	});
	jQuery('.octMainBar').slimScroll({
		height: jQuery(window).height() - g_octTopBarH
	,	railVisible: true
	,	alwaysVisible: true
	,	allowPageScroll: true
	,	color: '#f72497'
	,	opacity: 1
	,	distance: 0
	,	borderRadius: '3px'
	,	width: jQuery('.octMainBar').width()
	,	wrapperPos: 'fixed'
	,	position: 'left'
	});
	jQuery(window).resize(function () {
		jQuery('.octMainBar, .octMainBar .octMainBarInner').css('height', jQuery(window).height() - g_octTopBarH);
	});
	jQuery('.octMainBar').each(function(){
		var classes = jQuery(this).attr('class');
		jQuery(this).attr('class', 'octMainBarInner').parent().addClass(classes);
	});
	g_octMainMenu = new octCategoriesMainMenu('.octMainBar');
	jQuery('.octBlocksBar').each(function(){
		g_octMainMenu.addSubMenu(this);
	});
	jQuery('.octMainBarHandle').click(function(){
		if(g_octMainMenu.isVisible()) {
			g_octMainMenu.checkHide();
		} else {
			g_octMainMenu.checkShow();
		}
		return false;
	});
	jQuery('.octCatElement').mouseover(function(){
		var self = this;
		this._octMouseOver = true;
		var cid = jQuery(this).data('id');
		setTimeout(function(){
			if(self._octMouseOver)
				g_octMainMenu.showSubByCid( cid );
		}, mainDelay);
	}).mouseleave(function(e){
		this._octMouseOver = false;
		var cid = jQuery(this).data('id')
		,	movedTo = jQuery(e.relatedTarget)
		,	movedToBlockBar = false
		,	movedToCatBar = false;
		if(movedTo) {
			movedToBlockBar = movedTo.hasClass('octBlocksBar') || movedTo.parents('.octBlocksBar:first').size();
			if(!movedToBlockBar)	// Do not detect this each time - save processor time:)
				movedToCatBar = movedTo.hasClass('octCatElement') || movedTo.parents('.octMainBar').size();
		}
		if(movedTo && movedTo.size() 
			&& (movedToBlockBar || movedToCatBar)
		) {
			return;
		}
		g_octMainMenu.hideSubByCid( cid );
	});
	jQuery('.octBlocksBar').mouseleave(function(e){
		var cid = jQuery(this).data('cid');
		g_octMainMenu.hideSubByCid( cid );
		/*setTimeout(function(){
			g_octMainMenu.checkHide();
		}, mainDelay);*/
	});

	var PostLinkHandler = {
		selector: '.octPostLinkList',
		posts: octEditor.posts,
		tabStyle: {
			height: 120
		}
	};

	PostLinkHandler.escapeString = function  (str) {
	    return jQuery('<div/>').text(str).html();
	};

	PostLinkHandler.showPosts = function ($tab) {
		if (! $tab.find('ul').size())
			$tab.html('<ul></ul>');

		$tab.find('ul').html('');

		for (var i in this.posts)
			$tab.find('ul')
				.append(
					'<li data-value="' + this.escapeString(this.posts[i].url) + '">' +
						'<span>' + this.escapeString(this.posts[i].title) + '</span>' +
					'</li>'
				);
	};

	PostLinkHandler.onCreate = function () {
		if (! this.posts.length) return;

		var self = this;

		jQuery(this.selector + ':not([data-postlink])').each(function () {
			var $linkTab = jQuery(this),
				fieldSelector = $linkTab.attr('data-postlink-to'),
				$field = null;

			if (! fieldSelector.length) return;

			if (fieldSelector.indexOf(':parent') == 0) {
				fieldSelector = fieldSelector.substring(7, fieldSelector.length).trim();

				$field = $linkTab.parent().find(fieldSelector);
			} else
				$field = jQuery(fieldSelector);
			
			$linkTab.attr('data-postlink', '');

			if (! $field.size()) return;

			self.showPosts($linkTab);

			$linkTab.css(self.tabStyle);

			$linkTab.on('click', 'li', function () {
				var $item = jQuery(this),
					url = $item.attr('data-value');

				if (! url) return;

				$field.val(url);
				$field.change();
			});

			$linkTab.slimScroll({
				height: (self.tabStyle.hasOwnProperty('height') ? self.tabStyle.height : 120)
			,	railVisible: true
			,	alwaysVisible: true
			,	allowPageScroll: true
			,	color: '#f72497'
			,	opacity: 1
			,	distance: 0
			,	borderRadius: '3px'
			});

			$linkTab.parent('.slimScrollDiv').addClass('octPostLinkRoot').hide();
			
			var $rootTab = $linkTab.parent('.octPostLinkRoot');

			/** Hide and show handlers **/
			var ignoreHide = false,
				isFocus = false;

			$field.on('postlink.hide', function () {
				$rootTab.hide();
				$linkTab.hide();
				$field.trigger('postlink.hide:after');
			});

			$field.focus(function () {
				$field.trigger('postlink.show');
				$rootTab.show();
				$linkTab.show();
				isFocus = true;
				$field.trigger('postlink.show:after');
			});

			$rootTab.hover(function () {
				ignoreHide = true;
			}, function () {
				ignoreHide = false;
				
				if (! isFocus)
					$field.trigger('postlink.hide');
			});

			$field.blur(function () {
				isFocus = false;
					
				if (!ignoreHide)
					$field.trigger('postlink.hide');
			});
		});
	};

	var docChangeHandler = jQuery.proxy(function (e) {
		this.onCreate();
	}, PostLinkHandler);

	jQuery(function () {
		document.addEventListener('DOMNodeInserted', docChangeHandler, false);
		document.addEventListener('DOMSubtreeModified', docChangeHandler, false);
		docChangeHandler();
	});
}
function _octInitDraggable() {
	jQuery('#octCanvas').sortable({
		revert: true
	,	placeholder: 'ui-state-highlight'
	/*,	delay: 150
	,	distance: 5*/
	,	handle: '.octBlockMove'	// Use this setting to enable handler, or 2 setting above - to make sure it will not interupt other block/element clicking
	//,	tolerance: 'pointer'
	//,	cursorAt: { top:0, right: 0 }
	,	start: function(event, ui) {
			g_octBlockFabric.checkSortStart( ui );
			g_octMainMenu.checkHide();
		}
	,	stop: function(event, ui) {
			g_octBlockFabric.checkSortStop( ui );
			_octSaveCanvasDelay( 400 );
		}
    });
    jQuery('.octBlocksList .octBlockElement').draggable({
		connectToSortable: '#octCanvas'
	,	helper: 'clone'
	,	revert: 'invalid'
	,	stop: function(event, ui) {
			if(!ui.helper.parents('#octCanvas').size()) {	// Element dropped not in the canvas container
				ui.helper.remove();
				return;
			}
			g_octBlockFabric.addFromDrag( ui.helper, jQuery('#octCanvas').find('.ui-state-highlight') );
			g_octMainMenu.checkHide();
		}
    });
    jQuery('.octBlocksList, .octBlocksList li').disableSelection();
}
function _octFitCanvasToScreen() {
	var canvasHeight = jQuery('#octCanvas').height()
	,	wndHeight = jQuery(window).height();
	if(canvasHeight < wndHeight) {
		jQuery('#octCanvas').height( wndHeight );
	}
}
function _octShowMainLoader() {
	jQuery('.octMainSaveBtn').width( jQuery('.octMainSaveBtn').width() );
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnTxt').hide();
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnLoader').show();
	jQuery('.octMainSaveBtn')
		.attr('disabled', 'disabled')
		.addClass('active');
	//jQuery('#octMainLoder').slideDown( g_octAnimationSpeed );
}
function _octHideMainLoader() {
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnTxt').show();
	jQuery('.octMainSaveBtn').find('.octMainSaveBtnLoader').hide();
	jQuery('.octMainSaveBtn')
		.removeAttr('disabled')
		.removeClass('active');
	//jQuery('#octMainLoder').slideUp( g_octAnimationSpeed );
}
function _octSaveCanvasDelay(delay) {
	delay = delay ? delay : 200;
	setTimeout(_octSaveCanvas, delay);
}
function _octInitMainToolbar() {
	g_octMainTollbar = new _octMainToolbar();
}
function _octGetMainToolbar() {
	return g_octMainTollbar;
}
function _octSaveCanvas() {
	if(typeof(octOcto) === 'undefined' || !octOcto || !octOcto.id) {
		return;
	}
	_octShowMainLoader();
	//g_octBlockFabric.beforeSave();

	var saveData = {
		id: octOcto.id
	,	blocks: g_octBlockFabric.getDataForSave()
	,	octo: jQuery('#octMainOctoForm').serializeAssoc()
	};

	jQuery.sendFormOct({
		data: {mod: 'octo', action: 'save', data: saveData}
	,	onSuccess: function(res){
			_octHideMainLoader();
			if(!res.error) {
				if(res.data.id_sort_order_data) {
					var allBlocks = g_octBlockFabric.getBlocks();
					if(allBlocks.length) {
						for(var i = 0; i < res.data.id_sort_order_data.length; i++) {
							var sortOrderFind = parseInt(res.data.id_sort_order_data[ i ].sort_order);
							for(var j = 0; j < allBlocks.length; j++) {
								if(allBlocks[ j ].get('sort_order') == sortOrderFind && !allBlocks[ j ].get('id')) {
									allBlocks[ j ].set('id', parseInt(res.data.id_sort_order_data[ i ].id));
								}
							}
						}
					}
				}
				//g_octBlockFabric.afterSave();
			}
		}
	});
}
function _octInitOctoDataChange() {
	// Transform all custom checkbox / radiobuttons in admin bar
	octInitCustomCheckRadio('#octMainOctoForm');
	// Label setting - should be as title for page
	jQuery('#octMainOctoForm [name="label"]').change(function(){
		jQuery('head title').html( jQuery(this).val() );
	});
	// Font setting
	jQuery('#octMainOctoForm [name="params[font_family]"]').change(function(){
		_octGetCanvas().setDefaultFont( jQuery(this).val() );
	});
	// Bg type switch
	jQuery('#octMainOctoForm [name="params[bg_type]"]').change(function(){
		if(!jQuery(this).prop('checked')) return;
		_octGetCanvas()._setBgType( jQuery(this).val() );
	});

	// Bg color input init
	_octCreateColorPickerOpt('.octOctoBgColor',  _octGetCanvas().getParam('bg_color'), function(container, color){
		_octGetCanvas()._updateFillColorFromColorpicker( color.tiny );
	});

	// Bg img selection
	jQuery('#octMainOctoForm .octOctoBgImgBtn').click(function(e){
		e.preventDefault();
		octCallWpMedia({
			clb: function(opts, attach, imgUrl) {
				__octSetCanvasBgImgOpt( attach.url );
			}
		});
	});

	// Bg img clear
	jQuery('#octMainOctoForm .octOctoBgImgRemove').click(function(e){
		e.preventDefault();
		__octSetCanvasBgImgOpt('');
	});
	// Favicon img selection
	jQuery('#octMainOctoForm .octOctoFavImgBtn').click(function(e){
		e.preventDefault();
		octCallWpMedia({
			clb: function(opts, attach, imgUrl) {
				__octSetCanvasFavImgOpt( attach.url );
			}
		});
	});

	// Favicon img clear
	jQuery('#octMainOctoForm .octOctoFavImgRemove').click(function(e){
		e.preventDefault();
		__octSetCanvasFavImgOpt('');
	});
	// Bg img position options
	jQuery('#octMainOctoForm [name="params[bg_img_pos]"]').change(function(){
		_octGetCanvas()._setBgImgPos( jQuery(this).val() );
	});

	// Keywords meta tags manipulation
	jQuery('#octMainOctoForm [name="params[keywords]"]').change(function(){
		_octGetCanvas().setKeywords( jQuery(this).val() );
	});

	// Description meta tags manipulation
	jQuery('#octMainOctoForm [name="params[description]"]').change(function(){
		_octGetCanvas().setDescription( jQuery(this).val() );
	});

	// Reset template by default
	jQuery('#octMainOctoForm .octResetTplBtn').click(function(){
		if(confirm(toeLangoct('Are you sure want to reset template by default? This will remove all your changes in this template.'))) {
			jQuery.sendFormOct({
				btn: jQuery(this)
			,	data: {mod: 'octo', action: 'resetTpl', id: octOcto.id}
			,	onSuccess: function(res) {
					if(!res.error) {
						toeReload();
					}
				}
			});
		}
		return false;
	});
	//
	jQuery('#octBackToAdminBtn').click(function(){
		_octSaveCanvas();
	});
}
function __octSetCanvasBgImgOpt(url) {
	_octGetCanvas()._setBgImg( url );
	jQuery('#octMainOctoForm .octOctoBgImg').attr('src', url ? url : jQuery('#octMainOctoForm .octOctoBgImg').data('noimg-url'));
	jQuery('#octMainOctoForm input[name="params[bg_img]"]').val( url );
	url 
		? jQuery('#octMainOctoForm .octOctoBgImgRemove').show()
		: jQuery('#octMainOctoForm .octOctoBgImgRemove').hide();
	setTimeout(function(){
		_octGetMainToolbar().refresh();	// Image canb have different size - so we need to check toolbar settings after this
	}, 500);
}
function __octSetCanvasFavImgOpt(url) {
	_octGetCanvas()._setFavImg( url );

	jQuery('#octMainOctoForm .octOctoFavImg').attr('src', url ? url : jQuery('#octMainOctoForm .octOctoFavImg').data('noimg-url'));
	jQuery('#octMainOctoForm input[name="params[fav_img]"]').val( url );
	url 
		? jQuery('#octMainOctoForm .octOctoFavImgRemove').show()
		: jQuery('#octMainOctoForm .octOctoFavImgRemove').hide();
	setTimeout(function(){
		_octGetMainToolbar().refresh();	// Image canb have different size - so we need to check toolbar settings after this
	}, 500);
}
function _octCreateColorPickerOpt(selector, color, clb) {
    var $input = jQuery(selector).find('.octColorpickerInput'),
    	options = jQuery.extend({
    		convertCallback: function (colors) {
	    		var rgbaString = 'rgba(' + colors.webSmart.r + ',' + colors.webSmart.g + ',' + colors.webSmart.b + ',' + colors.alpha + ')';
	    		colors.tiny = new tinycolor( '#' + colors.HEX );
	    		colors.tiny.setAlpha( colors.alpha );
	    		colors.tiny.toRgbString = function () {
	    			return rgbaString;
	    		};

	    		if (clb) 
	    			clb($input, colors);

	    		$input.val(rgbaString);
	    	}
    	},
    	g_octColorPickerOptions
    );

    $input.css('background-color', color);

    $input.colorPicker(options);
}