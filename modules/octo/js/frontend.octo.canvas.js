function octCanvas(octoData) {
	this._data = octoData;
	this._$ = jQuery('#octCanvas');
	
	this.fontList = [];
	
	this.googleFonts = [];

	for (var i in octOcto.fonts.google)
		this.googleFonts.push(
			octOcto.fonts.google[i].toUpperCase()
		);

	this.fontIgnor = [];

	for (var i in octOcto.fonts.standard)
		this.fontIgnor.push(
			octOcto.fonts.standard[i].toUpperCase()
		);

	this.fontList = this.scanAllFonts();

	this.loadFonts(this.fontList);
}
octCanvas.prototype.scanAllFonts = function () {
	var self = this
	,	fontList = []
	,	fontDecoder = function (font) {
		font = jQuery.trim(font);

		if (font.charAt(0) == "'" || font.charAt(0) == "\"")
			font = font.substr(1);

		if (font.charAt(font.length - 1) == "'" || font.charAt(font.length - 1) == "\"")
			font = font.substr(0, font.length - 1);

		return font;
	};

	if (this._$.attr('data-octfonts')) {
		var elementFonts = this._$.attr('data-octfonts').split(',');

		for (var i in elementFonts) {
			var nf = elementFonts[i];

			fontList.push(fontDecoder(nf));
		}
	}

	this._$.find('[data-el]').each(function () {
		var $this = jQuery(this)
		,	elementFonts = [];

		if ($this.attr('data-octfonts'))
			elementFonts = $this.attr('data-octfonts').split(',');
		else
			$this.find('*').each(function () {
				var $this = jQuery(this),
					fonts = $this.css('font-family');

					if (fonts.indexOf(',') != -1) {
						var fonts = fonts.split(',');

						for (var i in fonts) {
							elementFonts.push(
								fontDecoder(
									fonts[i]
								)
							);
						}
					} else
						elementFonts.push(
							fontDecoder(
								fonts
							)
						);
			});

		fontList = fontList.concat(elementFonts);
	});


	fontList = fontList.filter(function(item, pos, self) {
		return self.indexOf(item) == pos;
	});

	fontList = fontList.filter(function(item, pos) {
		return self.googleFonts.indexOf(item.toUpperCase()) != -1;
	});

	return fontList;
};
octCanvas.prototype.loadFonts = function (fontList) {
	var fonts = [];

	for (var i in fontList) {
		if (this.fontIgnor.indexOf(fontList[i].toUpperCase()) == -1)
			fonts.push(
				encodeURIComponent(fontList[i])
			);
	}

	this._setFont(fonts.join('|'));
};
octCanvas.prototype._setFont = function(fontFamily) {
	if (! fontFamily) return;

	var $fontLink = this._getFontLink();
	
	this._getFontLink().attr({
		'href': 'https://fonts.googleapis.com/css?family='+ fontFamily
	,	'data-font-family': fontFamily
	});
	this._$.css({
		'font-family': fontFamily
	});
	this.setParam('font_family', fontFamily);
};
octCanvas.prototype._getFontLink = function() {
	var $link = this._$.find('link.octFont');
	if(!$link.size()) {
		$link = jQuery('<link class="octFont" rel="stylesheet" type="text/css" href="" />').appendTo( this._$ );
	}
	return $link;
};
octCanvas.prototype.get = function(key) {
	return this._data[ key ];
};
octCanvas.prototype.getParam = function(key) {
	return (this._data.params && this._data.params[ key ]) 
		? this._data.params[ key ] 
		: false;
};
octCanvas.prototype.setParam = function(key, value) {
	if(!this._data.params)
		return;
	this._data.params[ key ] = value;
};
octCanvas.prototype.getRaw = function() {
	return this._$;
};
octCanvas.prototype.setDefaultFont = function (font) {
	this._$.attr('data-octfonts', font);

	this._$.css('font-family', font);

	this.fontList = this.scanAllFonts();

	this.loadFonts(this.fontList);
};
octCanvas.prototype._setFillColor = function( color ) {
	if(typeof(color) === 'undefined') {
		color = this.getParam('bg_color');
	} else {
		this.setParam('bg_color', color);
	}
	this._$.css({
		'background-color': color
	});
};
octCanvas.prototype._updateFillColorFromColorpicker = function( tinyColor ) {
	this._setFillColor( tinyColor.toRgbString() );
};
octCanvas.prototype._setBgImg = function( url ) {
	if(typeof(url) === 'undefined') {
		url = this.getParam('bg_img');
	} else {
		this.setParam('bg_img', url);
	}
	if(url) {
		this._$.css({
			'background-image': 'url("'+ url+ '")'
		});
	} else {
		this._$.css({
			'background-image': 'url("")'
		});
	}
};
octCanvas.prototype._setBgImgPos = function( pos ) {
	if(typeof(pos) === 'undefined') {
		pos = this.getParam('bg_img_pos');
	} else {
		this.setParam('bg_img_pos', pos);
	}
	switch(pos) {
		case 'stretch':
			this._$.css({
				'background-position': 'center center'
			,	'background-repeat': 'no-repeat'
			,	'background-attachment': 'fixed'
			,	'-webkit-background-size': 'cover'
			,	'-moz-background-size': 'cover'
			,	'-o-background-size': 'cover'
			,	'background-size': 'cover'
			});
			break;
		case 'center':
			this._$.css({
				'background-position': 'center center'
			,	'background-repeat': 'no-repeat'
			,	'background-attachment': 'scroll'
			,	'-webkit-background-size': 'auto'
			,	'-moz-background-size': 'auto'
			,	'-o-background-size': 'auto'
			,	'background-size': 'auto'
			});
			break;
		case 'tile':
			this._$.css({
				'background-position': 'left top'
			,	'background-repeat': 'repeat'
			,	'background-attachment': 'scroll'
			,	'-webkit-background-size': 'auto'
			,	'-moz-background-size': 'auto'
			,	'-o-background-size': 'auto'
			,	'background-size': 'auto'
			});
			break;
	}
};
octCanvas.prototype._setBgType = function(type) {
	switch(type) {
		case 'color':
			this._setFillColor();
			break;
		case 'img':
			this._setBgImg();
			this._setBgImgPos();
			break;
	}
};
octCanvas.prototype._getFaviconTag = function() {
	var $fav = jQuery('link[rel="shortcut icon"]');
	if(!$fav || !$fav.size()) {
		$fav = jQuery('<link rel="shortcut icon" href="" type="image/x-icon">').appendTo('head');
	}
	return $fav;
};
octCanvas.prototype._setFavImg = function( url ) {
	if(typeof(url) === 'undefined') {
		url = this.getParam('fav_img');
	} else {
		this.setParam('fav_img', url);
	}
	if(url) {
		this._getFaviconTag().attr('href', url);
	} else {
		// We can't just remove it here - favicon wil be still there, because browser desided to do it in this way, sorry ;)
		// So, we just put it 1px transparent img.
		this._getFaviconTag().attr('href', OCT_DATA.onePxImg);
	}
};
octCanvas.prototype.setKeywords = function(data) {
	this.setParam('keywords', data);
	this._getKeywordsTag().attr('content', data);
};
octCanvas.prototype.setDescription = function(data) {
	this.setParam('description', data);
	this._getDescriptionTag().attr('content', data);
};
octCanvas.prototype._getKeywordsTag = function() {
	var $tag = jQuery('meta[name="keywords"]');
	if(!$tag.size()) {
		$tag = jQuery('<meta name="keywords">').appendTo('head');
	}
	return $tag;
};
octCanvas.prototype._getDescriptionTag = function() {
	var $tag = jQuery('meta[name="description"]');
	if(!$tag.size()) {
		$tag = jQuery('<meta name="description">').appendTo('head');
	}
	return $tag;
};