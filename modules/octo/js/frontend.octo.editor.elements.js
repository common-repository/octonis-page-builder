/**
 * Destroy current element
 */
octElementBase.prototype.destroy = function(clb) {
	if(this._$) {
		var childElements = this._getChildElements();
		if(childElements) {
			for(var i = 0; i < childElements.length; i++) {
				childElements[ i ]._remove();
			}
		}
		var self = this;
		this._$.slideUp(this._animationSpeed, function(){
			self._remove();
			if(clb && typeof(clb) === 'function') {
				clb();
			}
			_octSaveCanvas();
		});
	}
};
octElementBase.prototype._remove = function() {
	this._destroyMenu();
	this._$.remove();
	this._$ = null;
	this._afterDestroy();
	this._block.removeElementByIterNum( this.getIterNum() );
};
octElementBase.prototype._getChildElements = function() {
	var allFoundHtml = this._$.find('.octEl');
	if(allFoundHtml && allFoundHtml.size()) {
		var foundElements = []
		,	selfBlock = this.getBlock();
		allFoundHtml.each(function(){
			var element = selfBlock.getElementByIterNum( jQuery(this).data('iter-num') );
			if(element) {
				foundElements.push( element );
			}
		});
		return foundElements.length ? foundElements : false;
	}
	return false;
};
octElementBase.prototype._afterDestroy = function() {
	
};
octElementBase.prototype.beforeSave = function() {
	this._destroyMenu();
};
octElementBase.prototype.afterSave = function() {
	this._initMenu();
};
octElementBase.prototype._initMenu = function() {
	if(this._menuOriginalId && this._menuOriginalId != '') {
		this._initMenuClbs();
		this._menu = new window[ this._menuClass ]( this._menuOriginalId, this, this._menuClbs );
		if(!this._initedComplete) {
			var self = this
			,	$menu = this._menu._$
			,	$element = this._$
			,	isHideOnClickOutsideMenu = function () {
					return $menu.hasClass('hideOnClickOutsideMenu');
				};

			jQuery(document).mouseup(function (e) {
			    if (! isHideOnClickOutsideMenu()) return;

			    if ($menu.has(e.target).length === 0 && $element.has(e.target).length === 0){
			        jQuery(this).data('hide-menu-timeout', setTimeout(function(){
						self.hideMenu();
					}, 1000));	// Let it be visible 1 second more
			    }
			});

			this._$.hover(function(){
				clearTimeout(jQuery(this).data('hide-menu-timeout'));
				self.showMenu();
			}, function(){
				if (! isHideOnClickOutsideMenu())
					jQuery(this).data('hide-menu-timeout', setTimeout(function(){
						self.hideMenu();
					}, 1000));	// Let it be visible 1 second more
			});
		}
	}
};
octElementBase.prototype._initMenuClbs = function() {
	var self = this;
	this._menuClbs['.octRemoveElBtn'] = function() {
		self.destroy();
	};
	if(this._changeable) {
		this._menuClbs['.octTypeTxtBtn'] = function() {
			self.getBlock().replaceElement(self, 'txt_item_html', 'txt');
		};
		this._menuClbs['.octTypeImgBtn'] = function() {
			self.getBlock().replaceElement(self, 'img_item_html', 'img');
		};
		this._menuClbs['.octTypeIconBtn'] = function() {
			self.getBlock().replaceElement(self, 'icon_item_html', 'icon');
		};
		this._menuClbs['.octTypeButtonBtn'] = function() {
			self.getBlock().replaceElement(self, 'btn_item_html', 'btn');
		};
	}
};
octElementBase.prototype._afterFullContentLoad = function() {
	this.repositeMenu();
};
octElementBase.prototype._destroyMenu = function() {
	if(this._menu) {
		this._menu.destroy();
		this._menu = null;
	}
};
octElementBase.prototype.showMenu = function() {
	if(this._menu) {
		this._menu.show();
	}
};
octElementBase.prototype.hideMenu = function() {
	if(this._menu) {
		this._menu.hide();
	}
};
octElementBase.prototype.repositeMenu = function() {
	if(this._menu) {
		this._menu.reposite();
	}
};
/**
 * Text element
 */
function octElement_txt(jqueryHtml, block) {
	this._elId = null;
	this._editorElement = null;
	this._editor = null;
	this._editorToolbarBtns = [
		['octo_fontselect'], ['octo_fontsizeselect'], ['bold', 'italic', 'strikethrough'], ['octo_link'], ['forecolor']
	];
	this._changeable = true;
	this._typeBtns = {
		oct_el_menu_type_txt: {
			text: toeLangOct('Text')
		,	type: 'txt'
		,	checked: true
		}
	,	oct_el_menu_type_img: {
			text: toeLangOct('Image / Video')
		,	type: 'img'
		}
	,	oct_el_menu_type_icon: {
			text: toeLangOct('Icon')
		,	type: 'icon'
		}
	,	oct_el_menu_type_btn: {
			text: toeLangOct('Button')
		,	type: 'btn'
		}
	};
	octElement_txt.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_txt, octElementBase);
octElement_txt.prototype._init = function() {
	octElement_txt.superclass._init.apply(this, arguments);
	var id = this._$.attr('id')
	,	self = this;
	if(!id || id == '') {
		this._$.attr('id', 'octTxt_'+ mtRand(1, 99999));
	}
	var toolbarBtns = [];
	for(var i = 0; i < this._editorToolbarBtns.length; i++) {
		toolbarBtns.push( typeof(this._editorToolbarBtns[i]) === 'string' ? this._editorToolbarBtns[i] : this._editorToolbarBtns[i].join(' ') );
	}
	this._editorElement = this._$.tinymce({
		inline: true
	// ' |  | ' is panel buttons delimiter
	,	toolbar: toolbarBtns.join(' |  | ')//'octo_fontselect |  | octo_fontsizeselect |  | bold italic strikethrough |  | octo_link |  | forecolor'
	,	menubar: false
	,	plugins: 'octo_textcolor octo_link octo_fontselect octo_fontsizeselect'
	,	fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 64pt 72pt'
	,	convert_urls: false
	,	skin : 'octo'
	,	setup: function(ed) {
			this._editor = ed;
			ed.on('blur', function(e) {
				if(e.target._octChanged) {
					e.target._octChanged = false;
					_octSaveCanvas();
				}
				jQuery('.mce-container.mce-panel.mce-floatpanel.mce-menu:visible').css('display', 'none');
			});
			ed.on('change', function(e) {
				e.target._octChanged = true;
			});
			ed.on('keyup', function(e) {
				var selectionCoords = getSelectionCoords();
				octMceMoveToolbar( self._editorElement.tinymce(), selectionCoords.x );
			});
			ed.on('click', function(e) {
				octMceMoveToolbar( self._editorElement.tinymce(), e.clientX );
			});
			ed.on('focus', function(e) {
				//console.log('editor focus');
			});
			if(self._afterEditorInit) {
				self._afterEditorInit( ed );
			}
		}
	});
	this._$.removeClass('mce-edit-focus');
	// Do not allow drop anything it text element outside content area
	this._$.bind('dragover drop', function(event){
		event.preventDefault();
	});
};
octElement_txt.prototype._beforeInit = function() {
	var btnsPack = [];
	for(var btnKey in this._typeBtns) {
		btnsPack.push( btnKey );
	}
	btnsPack.push( 'remove' );
	this._editorToolbarBtns.push( btnsPack );
};
octElement_txt.prototype._afterEditorInit = function(editor) {
	var self = this;
	var onclickClb = function() {
		
		var $btn = jQuery('#'+ this._id).find('button:first')
		,	$btnsGroupShell = $btn.parents('.mce-container.mce-btn-group:first')
		,	$radio = $btn.find('input[type=radio]')
		,	type = $radio.val();
		
		if(type === 'txt') return;
		
		$btnsGroupShell.find('input[type=radio]').removeAttr('checked');
		$radio.attr('checked') 
			? $radio.removeAttr('checked')
			: $radio.attr('checked', 'checked');
		octCheckUpdateArea( $btnsGroupShell );
		// And now - let's make element change
		var element = this.settings._octElement;

		element.getBlock().replaceElement(element, type+ '_item_html', type);
	},	onPostRenderClb = function(type, checked) {
		
		var $btnShell = jQuery('#'+ this._id)
		,	$btn = $btnShell.find('button:first')
		,	txt = $btn.html()
		,	$radioHtml = jQuery('<label><input type="radio" name="type" value="'+ type+ '" '+ (checked ? 'checked' : '')+' />'+ txt+ '</label>');
		
		$btn.html('').append( $radioHtml );
		$radioHtml.find('input').change( jQuery.proxy(onclickClb, this) );
		octInitCustomCheckRadio( $btn );
	};
	for(var btnKey in this._typeBtns) {
		editor.addButton(btnKey, {
			text: this._typeBtns[ btnKey ].text
		,	_octType: this._typeBtns[ btnKey ].type
		,	_octChecked: this._typeBtns[ btnKey ].checked
		,	_octElement: this
		,	classes: 'btn'
		,	onclick: function() {	// see onPostRenderClb() - $radioHtml.find('input').change()
				jQuery.proxy(onclickClb, this)();
			}
		,	onpostrender: function(e) {
				jQuery.proxy(onPostRenderClb, this)(this.settings._octType, this.settings._octChecked);
			}
		});
	}

	editor.addButton('remove', {
			_ptsElement: this
		,	icon: 'remove fa fa-trash-o'
		,	classes: 'btn'
		,	onclick: function() {
				self.destroy();
			}
		});
};
octElement_txt.prototype.getEditorElement = function() {
	return this._editorElement;
};
octElement_txt.prototype.getEditor = function() {
	return this._editor;
};
octElement_txt.prototype.beforeSave = function() {
	octElement_txt.superclass.beforeSave.apply(this, arguments);
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	this._elId = this._$.attr('id');
	this._$
		.removeAttr('id')
		.removeAttr('contenteditable')
		.removeAttr('spellcheck')
		.removeClass('mce-content-body mce-edit-focus');
};
octElement_txt.prototype.afterSave = function() {
	octElement_txt.superclass.afterSave.apply(this, arguments);
	if(this._elId) {
		this._$
			.attr('id', this._elId)
			.attr('contenteditable', 'true')
			.attr('spellcheck', 'false')
			.addClass('mce-content-body');;
	}
};
/**
 * Image element
 */
function octElement_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuImgExl';
	}
	this._menuClass = 'octElementMenu_img';
	this._changeable = true;
	octElement_img.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_img, octElementBase);
octElement_img.prototype._init = function() {
	octElement_img.superclass._init.apply(this, arguments);
};
octElement_img.prototype._beforeImgChange = function(opts, attach, imgUrl, imgToChange) {
	
};
octElement_img.prototype._afterImgChange = function(opts, attach, imgUrl, imgToChange) {
	
};
octElement_img.prototype._initMenuClbs = function() {
	octElement_img.superclass._initMenuClbs.apply(this, arguments);
	var self = this;
	this._menuClbs['.octImgChangeBtn'] = function() {
		self.set('type', 'img');
		self._getImg().show();
		self._getVideoFrame().remove();
		octCallWpMedia({
			id: self._$.attr('id')
		,	clb: function(opts, attach, imgUrl) {
				var imgToChange = self._$.find('img:first');
				self._block.beforeSave();
				self._innerImgsLoaded = 0;
				self._beforeImgChange( opts, attach, imgUrl, imgToChange );
				imgToChange.attr('src', imgUrl);
				self._afterImgChange( opts, attach, imgUrl, imgToChange );
				self._block.afterSave();
				_octSaveCanvas();
			}
		});
	};
	this._menuClbs['.octImgVideoSetBtn'] = function() {
		self.set('type', 'video');
		self._buildVideo( self._menu.$().find('[name=video_link]').val() );
	};
};
octElement_img.prototype._buildVideo = function(url) {
	url = url ? jQuery.trim( url ) : false;
	if(url) {
		var $editArea = this._getEditArea()
		,	$videoFrame = this._getVideoFrame( $editArea )
		,	$img = this._getImg( $editArea )
		,	src = octUtils.urlToVideoSrc( url );
		$videoFrame.attr({
			'src': src
		,	'width': $img.width()
		,	'height': $img.height()
		}).show();
		$img.hide();
	}
};
octElement_img.prototype._getVideoFrame = function( editArea ) {
	editArea = editArea ? editArea : this._getEditArea();
	var videoFrame = editArea.find('iframe.octVideo');
	if(!videoFrame.size()) {
		videoFrame = jQuery('<iframe class="octVideo" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />').appendTo( editArea );
	}
	return videoFrame;
};
octElement_img.prototype._getImg = function(editArea) {
	editArea = editArea ? editArea : this._getEditArea();
	return editArea.find('img');
};
octElement_img.prototype._initMenu = function() {
	octElement_img.superclass._initMenu.apply(this, arguments);
	var self = this;
	this._menu.$().find('[name=video_link]').change(function(){
		self._buildVideo( jQuery(this).val() );
	}).keyup(function(e){
		if(e.keyCode == 13) {	// Enter
			self._buildVideo( jQuery(this).val() );
		}
	});
};
octElement_img.prototype._getLink = function() {
	var $link = this._$.find('a.octLink');
	return $link.size() ? $link : false;
};
octElement_img.prototype._setLinkAttr = function(attr, val) {
	switch(attr) {
		case 'href':
			if(val) {
				var $link = this._createLink();
				$link.attr(attr, val);
			} else
				this._removeLink();
			break;
		case 'title':
			var $link = this._createLink();
			$link.attr(attr, val);
			break;
		case 'target':
			var $link = this._createLink();
			val ? $link.attr('target', '_blank') : $link.removeAttr('target');
			break;
	}
};
octElement_img.prototype._createLink = function() {
	var $link = this._getLink();
	if(!$link) {
		$link = jQuery('<a class="octLink" />').append( this._$.find('img') ).appendTo( this._$ );
		$link.click(function(e){
			e.preventDefault();
		});
	}
	return $link;
};
octElement_img.prototype._removeLink = function() {
	var $link = this._getLink();
	if($link) {
		this._$.append( $link.find('.octInputShell') );
		$link.remove();
	}
};
/**
 * Gallery image element
 */
function octElement_gal_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuGalItemExl';
	}
	octElement_gal_img.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_gal_img, octElement_img);
octElement_gal_img.prototype._afterDestroy = function() {
	octElement_gal_img.superclass._afterDestroy.apply(this, arguments);
	this._block.recalcRows();
};
octElement_gal_img.prototype._afterImgChange = function(opts, attach, imgUrl, imgToChange) {
	octElement_gal_img.superclass._afterImgChange.apply(this, arguments);
	imgToChange.attr('data-full-img', attach.url);
	imgToChange.parents('.octGalLink:first').attr('href', attach.url);
};
octElement_gal_img.prototype._initMenu = function(){
	octElement_gal_img.superclass._initMenu.apply(this, arguments);
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	/*var self = this
	,	linkHtml = this._$.find('.octGalLink');
	this._$menu.find('.octImgLinkBtn').click(function(){
		// TODO: Move all this functionality - to separate class (element menu or something like that)
		var subPanelShow = jQuery(this).data('sub-panel-show')
		,	subPanel = self._$menu.find('.octElMenuSubPanel[data-sub-panel="'+ subPanelShow+ '"]')
		,	menuPos = self._$menu.position()
		,	subPanelHeight = subPanel.outerHeight()
		,	menuAtBottom = self._$menu.hasClass('octElMenuBottom');
		
		if(subPanel.is(':visible')) {
			subPanel.slideUp(self._animationSpeed, function(){
				self._$menu.removeClass('octMenuSubOpened');
				_octSaveCanvas();
			});
			if(!menuAtBottom) {
				self._$menu.animate({
					'top': self._$menu.data('prev-top')
				}, self._animationSpeed);
			}
		} else {
			subPanel.slideDown( self._animationSpeed );
			if(!menuAtBottom) {
				self._$menu.data('prev-top', menuPos.top).animate({
					'top': menuPos.top - subPanelHeight
				}, self._animationSpeed);
			}
			self._$menu.addClass('octMenuSubOpened')
		}
		return false;
	});
	var menuItemLink = this._$menu.find('[name=gal_item_link]')
	,	menuItemLinkNewWnd = this._$menu.find('[name=gal_item_link_new_wnd]');
	menuItemLink.change(function(){
		self._updateLink();
	}).val( linkHtml.data('link') );
	menuItemLinkNewWnd.change(function(){
		self._updateLink();
	});
	linkHtml.data('new-wnd') ? menuItemLinkNewWnd.attr('checked', 'checked') : menuItemLinkNewWnd.removeAttr('checked');
	octCheckUpdate( menuItemLinkNewWnd );*/
};
octElement_gal_img.prototype._updateLink = function() {
	var newLink = jQuery.trim( this._menu.$().find('[name=gal_item_link]').val() )
	,	linkHtml = this._$.find('.octGalLink');
	if(newLink && newLink != '') {
		newLink = octUtils.converUrl( newLink );
		linkHtml.attr('href', newLink);
		var newWnd = this._menu.$().find('[name=gal_item_link_new_wnd]').attr('checked');
		newWnd ? linkHtml.attr('target', '_blank') : linkHtml.removeAttr('target');
		linkHtml.addClass('octGalLinkOut').attr('data-link', newLink).attr('data-new-wnd', newWnd ? 1 : 0);
		this._block._initLightbox();
	} else {
		linkHtml
			.attr('href', this._$.find('img').data('full-img'))
			.removeAttr('target data-link data-new-wnd')
			.removeClass('octGalLinkOut');
	}
};
/**
 * Menu item element
 */
function octElement_menu_item(jqueryHtml, block) {
	/*if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuGalItemExl';
	}*/
	octElement_menu_item.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_menu_item, octElement_txt);
octElement_menu_item.prototype._afterEditorInit = function(editor) {
	var self = this;
	editor.addButton('octo_remove', {
		title: 'Remove'
	,	onclick: function(e) {
			self.destroy();
		}
	});
};
octElement_menu_item.prototype._beforeInit = function() {
	this._editorToolbarBtns.push('octo_remove');
};
/**
 * Menu item image
 */
function octElement_menu_item_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuMenuItemImgExl';
	}
	octElement_menu_item_img.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_menu_item_img, octElement_img);
/**
 * Input item
 */
function octElement_input(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuInputExl';
	}
	octElement_input.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_input, octElementBase);
octElement_input.prototype._init = function() {
	octElement_input.superclass._init.apply(this, arguments);
	var saveClb = function(element) {
		jQuery(element).attr('placeholder', jQuery(element).val());
		jQuery(element).val('');
		_octSaveCanvasDelay();
	};
	this._getInput().focus(function(){
		jQuery(this).val(jQuery(this).attr('placeholder'));
	}).blur(function(){
		if(jQuery(this).data('saved')) {
			jQuery(this).data('saved', 0);
			return;
		}
		saveClb(this)
	}).keyup(function(e){
		if(e.keyCode == 13) {	// Enter
			saveClb(this);
			jQuery(this).data('saved', 1).trigger('blur');	// We must blur from element after each save in any case
		}
	});
};
octElement_input.prototype._getInput = function() {
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	// TODO: Modify this to return all fields types
	return this._$.find('input');
};
octElement_input.prototype._initMenu = function(){
	octElement_input.superclass._initMenu.apply(this, arguments);
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	var self = this
	,	menuReqCheck = this._menu.$().find('[name="input_required"]');
	menuReqCheck.change(function(){
		var helperChecked = ! self._menu.$().find('.icheckbox_minimal').hasClass('checked');
		if(helperChecked) {
			self._getInput().attr('required', '1');
		} else {
			self._getInput().removeAttr('required');
		}
		self._block.setFieldRequired(self._getInput().get(0).name, (helperChecked ? 1 : 0));
		_octSaveCanvasDelay();
	});
	self._getInput().attr('required')
		? menuReqCheck.attr('checked', 'checked')
		: menuReqCheck.removeAttr('checked');
	octCheckUpdate( menuReqCheck );
};
octElement_input.prototype.destroy = function() {
	// Remove field from block fields list at first
	var name = this._getInput().attr('name');
	this._block.removeField( name );
	octElement_input.superclass.destroy.apply(this, arguments);
};
/**
 * Input button item
 */
function octElement_input_btn(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuInputBtnExl';
	}
	this._menuClass = 'octElementMenu_input_btn';
	this._haveAdditionBgEl = null;
	octElement_input_btn.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_input_btn, octElementBase);
octElement_input_btn.prototype._getInput = function() {
	// TODO: Modify this to return all fields types
	return this._$.find('input');
};
octElement_input_btn.prototype._init = function() {
	octElement_input_btn.superclass._init.apply(this, arguments);
	var saveClb = function(element) {
		jQuery(element).attr('type', 'submit');
		_octSaveCanvasDelay();
	};
	this._getInput().click(function(){
		return false;
	}).focus(function(){
		var value = jQuery(this).val();
		jQuery(this).attr('type', 'text').val( value );
	}).blur(function(){
		if(jQuery(this).data('saved')) {
			jQuery(this).data('saved', 0);
			return;
		}
		saveClb(this);
	}).keyup(function(e){
		if(e.keyCode == 13) {	// Enter
			saveClb(this);
			jQuery(this).data('saved', 1).trigger('blur');	// We must blur from element after each save in any case
		}
	});
};

octElement_input_btn.prototype._setColor = function(color) {
	this.set('bgcolor', color);
	var bgElements = this.get('bgcolor-elements');
	if(bgElements)
		bgElements = this._$.find(bgElements);
	else
		bgElements = this._$;
	switch(this.get('bgcolor-to')) {
		case 'border':	// Change only borders color
			bgElements.css({
				'border-color': color
			});
			break;
		case 'bg':
		default:
			bgElements.css({
				'background-color': color
			});
			break;
	}
	if(this._haveAdditionBgEl === null) {
		this._haveAdditionBgEl = this._$.find('.octAddBgEl');
		if(!this._haveAdditionBgEl.size()) {
			this._haveAdditionBgEl = false;
		}
	}
	if(this._haveAdditionBgEl) {
		this._haveAdditionBgEl.css({
			'background-color': color
		});
	}
	if(this.get('bgcolor-clb')) {
		var clbName = this.get('bgcolor-clb');
		if(typeof(this[clbName]) === 'function') {
			this[clbName]( color );
		}
	}
};
/**
 * Standart button item
 */
octElement_btn.prototype.beforeSave = function() {
	octElement_btn.superclass.beforeSave.apply(this, arguments);
	this._getEditArea().removeAttr('contenteditable');
};
octElement_btn.prototype.afterSave = function() {
	octElement_btn.superclass.afterSave.apply(this, arguments);
	this._getEditArea().attr('contenteditable', true);
};
octElement_btn.prototype._init = function() {
	octElement_btn.superclass._init.apply(this, arguments);
	this._getEditArea().attr('contenteditable', true).blur(function(){
		_octSaveCanvasDelay();
	}).keypress(function(e){
		if(e.keyCode == 13 && window.getSelection) {	// Enter
			document.execCommand('insertHTML', false, '<br>');
			if (typeof e.preventDefault != "undefined") {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
		}
	});
	if(this.get('customhover-clb')) {
		var self = this;
	}
};
octElement_btn.prototype._setColor = function(color) {
	this.set('bgcolor', color);
	var bgElements = this.get('bgcolor-elements');
	if(bgElements)
		bgElements = this._$.find(bgElements);
	else
		bgElements = this._$;
	switch(this.get('bgcolor-to')) {
		case 'border':	// Change only borders color
			bgElements.css({
				'border-color': color
			});
			break;
		case 'bg':
		default:
			bgElements.css({
				'background-color': color
			});
			break;
	}
	if(this._haveAdditionBgEl === null) {
		this._haveAdditionBgEl = this._$.find('.octAddBgEl');
		if(!this._haveAdditionBgEl.size()) {
			this._haveAdditionBgEl = false;
		}
	}
	if(this._haveAdditionBgEl) {
		this._haveAdditionBgEl.css({
			'background-color': color
		});
	}
	if(this.get('bgcolor-clb')) {
		var clbName = this.get('bgcolor-clb');
		if(typeof(this[clbName]) === 'function') {
			this[clbName]( color );
		}
	}
};
/**
 * Icon item
 */
function octElement_icon(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuIconExl';
	}
	this._menuClass = 'octElementMenu_icon';
	this._changeable = true;
	octElement_icon.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_icon, octElementBase);
octElement_icon.prototype._setColor = function(color) {
	this.set('color', color);
	this._getEditArea().css('color', color);
};
octElement_icon.prototype._getLink = function() {
	var $link = this._$.find('a.octLink');
	return $link.size() ? $link : false;
};
octElement_icon.prototype._setLinkAttr = function(attr, val) {
	switch(attr) {
		case 'href':
			if(val) {
				var $link = this._createLink();
				$link.attr(attr, val);
			} else
				this._removeLink();
			break;
		case 'title':
			var $link = this._createLink();
			$link.attr(attr, val);
			break;
		case 'target':
			var $link = this._createLink();
			val ? $link.attr('target', '_blank') : $link.removeAttr('target');
			break;
	}
};
octElement_icon.prototype._createLink = function() {
	var $link = this._getLink();
	if(!$link) {
		$link = jQuery('<a class="octLink" />').append( this._$.find('.octInputShell') ).appendTo( this._$ );
		$link.click(function(e){
			e.preventDefault();
		});
	}
	return $link;
};
octElement_icon.prototype._removeLink = function() {
	var $link = this._getLink();
	if($link) {
		this._$.append( $link.find('.octInputShell') );
		$link.remove();
	}
};
/**
 * Grid column element
 */
function octElement_grid_col(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'octElMenuGridColExl';
	}
	this._menuClass = 'octElementMenu_grid_col';
	octElement_grid_col.superclass.constructor.apply(this, arguments);
}
extendOct(octElement_grid_col, octElementBase);
octElement_grid_col.prototype._setColor = function(color) {
	if(color) {
		this.set('color', color);
	} else {
		color = this.get('color');
	}
	var enbColor = parseInt(this.get('enb-color'));
	if(enbColor) {
		this._getOverlay().css({
			'background-color': color
		,	'display': 'block'
		});
	} else {
		this._getOverlay().css({
			'display': 'none'
		});
	}
	//_octSaveCanvas();
};
octElement_grid_col.prototype._setImg = function(imgUrl) {
	if(imgUrl) {
		this.set('bg-img', imgUrl);
	} else {
		imgUrl = this.get('bg-img');
	}
	var enbBgImg = parseInt(this.get('enb-bg-img'));
	if(enbBgImg) {
		this._getEditArea().css({
			'background-image': 'url("'+ imgUrl+ '")'
		});
	} else {
		this._getEditArea().css({
			'background-image': 'url("")'
		});
	}
	_octSaveCanvas();
};
octElement_grid_col.prototype._initMenuClbs = function() {
	octElement_grid_col.superclass._initMenuClbs.apply(this, arguments);
	var self = this;
	this._menuClbs['.octImgChangeBtn'] = function() {
		octCallWpMedia({
			id: self._$.attr('id')
		,	clb: function(opts, attach, imgUrl) {
				self._setImg( imgUrl );
			}
		});
	};
};
octElement_grid_col.prototype._afterDestroy = function() {
	this.getBlock()._recalcColsClasses();
};

