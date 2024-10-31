/**
 * Base block object - for extending
 * @param {object} blockData all block data from database (block database row)
 */
function octBlockBase(blockData) {
	this._data = blockData;
	this._$ = null;
	this._original$ = null;
	this._id = 0;
	this._iter = 0;
	this._elements = [];
	this._animationSpeed = 300;
	//this._oneTimeElementsInited = false;
}
octBlockBase.prototype.get = function(key) {
	return this._data[ key ];
};
octBlockBase.prototype.getParam = function(key) {
	return this._data.params[ key ] ? this._data.params[ key ].val : false;
};
octBlockBase.prototype.getRaw = function() {
	return this._$;
};
octBlockBase.prototype.setRaw = function(jqueryHtml) {
	this._$ = jqueryHtml;
	//if(g_octEdit) {
		this._resetElements();
	//}
	this._initHtml();
};
octBlockBase.prototype._initElements = function() {
	this._initElementsForArea( this._$ );
};
octBlockBase.prototype._initElementsForArea = function(area) {
	var block = this
	,	addedElements = [];
	var initElement = function(htmlEl) {
		var elementCode = jQuery(htmlEl).data('el')
		,	elementClass = window[ 'octElement_'+ elementCode ];
		if(elementClass) {
			var newElement = new elementClass(jQuery(htmlEl), block);
			newElement._setCode(elementCode);
			var newIterNum = block._elements.push( newElement );
			addedElements.push( newElement );
			newElement.setIterNum( newIterNum - 1 );	// newIterNum == new length of _elements array, iterator number for element - is new length - 1
		} else {
			if(g_octEdit)
				console.log('Undefined Element ['+ elementCode+ '] !!!');
		}
	};
	jQuery( area ).find('.octEl').each(function(){
		initElement(this);
	});
	if(jQuery( area ).hasClass('octEl')) {
		initElement( area );
	}
	this._afterInitElements();
	return addedElements;
};
octBlockBase.prototype._afterInitElements = function() {
	
};
octBlockBase.prototype._resetElements = function() {
	this._clearElements();
	this._initElements();
};
octBlockBase.prototype._clearElements = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].destroy();
		}
		this._elements = [];
	}
};
octBlockBase.prototype.getElements = function() {
	return this._elements;
};
octBlockBase.prototype._initHtml = function() {
	//this._oneTimeInitElements();
};
/*octBlockBase.prototype._oneTimeInitElements = function() {
	if(!this._oneTimeElementsInited) {
		//this._$.find();
		this._oneTimeElementsInited = true;
	}
};*/
/**
 * ID number in list of canvas elements
 * @param {numeric} iter Iterator - number in all blocks array - for this element
 */
octBlockBase.prototype.setIter = function(iter) {
	this._iter = iter;
};
octBlockBase.prototype.showLoader = function(txt) {
	var loaderHtml = jQuery('#octBlockLoader');
	txt = txt ? txt : loaderHtml.data('base-txt');
	loaderHtml.find('.octBlockLoaderTxt').html( txt );
	loaderHtml.css({
		'height': this._$.height()
	,	'top': this._$.offset().top
	}).addClass('active');
};
octBlockBase.prototype.hideLoader = function() {
	var loaderHtml = jQuery('#octBlockLoader');
	loaderHtml.removeClass('active');
	/*setTimeout(function(){
		loaderHtml.appendTo('body');
	}, 1000);*/
};
/**
 * Covers block base class
 */
function octBlock_covers(blockData) {
	octBlock_covers.superclass.constructor.apply(this, arguments);

	//this._resizeBinded = false;
	this._bindResize();
}
extendOct(octBlock_covers, octBlockBase);
octBlock_covers.prototype._initHtml = function() {
	octBlock_covers.superclass._initHtml.apply(this, arguments);
	this._onResize();
};
octBlock_covers.prototype._bindResize = function() {
	jQuery(window).resize(jQuery.proxy(function(){
		this._onResize();
	}, this));
};
octBlock_covers.prototype._onResize = function() {
	var wndHeight = jQuery(window).height();
	this._$.height( wndHeight );
};
/**
 * Sliders block base class
 */
function octBlock_sliders(blockData) {
	octBlock_sliders.superclass.constructor.apply(this, arguments);
	this._slider = null;
	this._slides = null;
	this._currentSlide = 0;
}
extendOct(octBlock_sliders, octBlockBase);
octBlock_sliders.prototype._initHtml = function() {
	octBlock_sliders.superclass._initHtml.apply(this, arguments);
	this._initSlider();
};
octBlock_sliders.prototype._initSlider = function() {
	var sliderElId = this._$.find('.bxslider').attr('id');
	var options = {}
	,	$bx = jQuery('#'+ sliderElId);

	if ($bx.attr('data-bx-min-slider'))
		options.minSlides = $bx.attr('data-bx-min-slider');

	if ($bx.attr('data-bx-max-slider'))
		options.maxSlides = $bx.attr('data-bx-max-slider');

	if ($bx.attr('data-bx-slide-width'))
		options.slideWidth = $bx.attr('data-bx-slide-width');

	this._slider = $bx.bxSlider(options);
	if(this._currentSlide) {
		this._slider.goToSlide( this._currentSlide );
	}
};
/**
 * Galleries block base class
 */
function octBlock_galleries(blockData) {
	octBlock_galleries.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_galleries, octBlockBase);
octBlock_galleries.prototype._initHtml = function() {
	octBlock_galleries.superclass._initHtml.apply(this, arguments);
	this._initLightbox();
};
octBlock_galleries.prototype._initLightbox = function() {
	this._$.find('.octGalLink:not(.octGalLinkOut)').prettyPhoto({
		slideshow: 5000
	,	social_tools: false
	,	deeplinking: false	// For now - let avoid placing hash in browser URL, maybe enable this latter
	});
};
/**
 * Banner block base class
 */
function octBlock_banners(blockData) {
	octBlock_banners.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_banners, octBlockBase);
/**
 * Banner block base class
 */
function octBlock_footers(blockData) {
	octBlock_footers.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_footers, octBlockBase);
/**
 * Menu block base class
 */
function octBlock_menus(blockData) {
	octBlock_menus.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_menus, octBlockBase);
/**
 * Subscribe block base class
 */
function octBlock_subscribes(blockData) {
	this._fields = null;
	octBlock_subscribes.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_subscribes, octBlockBase);
octBlock_subscribes.prototype._initHtml = function() {
	octBlock_subscribes.superclass._initHtml.apply(this, arguments);
	this._initForm();
};
octBlock_subscribes.prototype._getForm = function() {
	return this._$.find('.octSubscribeForm');
};
octBlock_subscribes.prototype._getFormShell = function() {
	return this._$.find('.octFormShell');
};
octBlock_subscribes.prototype._initForm = function() {
	var form = this._getForm()
	,	self = this;
	form.submit(function(){
		var msgEl = jQuery(this).find('.octSubMsg')
		,	form = jQuery(this);
		jQuery(this).sendFormOct({
			msgElID: msgEl
		,	msgCloseBtn: true
		,	hideLoader: true
		,	errorClass: 'alert alert-danger alert-dismissible'
		,	successClass: 'alert alert-success alert-dismissible'
		,	onBeforeSend: function() {
				self.showLoader();
			}
		,	onSuccess: function(res) {
				self.hideLoader();
				/*Add msg close btn*/
				
				msgEl.append();
				if(!res.error) {
					msgEl.appendTo( self._getFormShell() );
					form.slideUp(self._animationSpeed, function(){
						form.remove();
					});
					/*setTimeout(function(){
						
					}, 2000);*/
				}
			}
		});
		return false;
	});
};
/**
 * Grid block base class
 */
function octBlock_grids(blockData) {
	octBlock_grids.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_grids, octBlockBase);

/**
 * Contact form block base class
 */
function octBlock_contacts(blockData) {
	this._fields = null;
	octBlock_contacts.superclass.constructor.apply(this, arguments);
}
extendOct(octBlock_contacts, octBlockBase);
octBlock_contacts.prototype._initHtml = function() {
	octBlock_subscribes.superclass._initHtml.apply(this, arguments);
	this._initForm();
};
octBlock_contacts.prototype._getForm = function() {
	return this._$.find('.octContactForm');
};
octBlock_contacts.prototype._getFormShell = function() {
	return this._$.find('.octFormShell');
};
octBlock_contacts.prototype._initForm = function() {
	var form = this._getForm()
		,	self = this;
	form.submit(function(e){
		var msgEl = jQuery(this).find('.octSubMsg')
			,	form = jQuery(this);

		jQuery(this).sendFormOct({
			msgElID: msgEl
			,	msgCloseBtn: true
			,	hideLoader: true
			,	errorClass: 'alert alert-danger alert-dismissible'
			,	successClass: 'alert alert-success alert-dismissible'
			,	onBeforeSend: function() {
				self.showLoader();
			}
			,	onSuccess: function(res) {
				self.hideLoader();
				/*Add msg close btn*/

				msgEl.append();
				if(!res.error) {
					msgEl.appendTo( self._getFormShell() );
					
					jQuery('#octBlockLoader').slideUp(self._animationSpeed);

					form.slideUp(self._animationSpeed, function(){
						form.remove();
					});

					if (res.data.hasOwnProperty('redirect'))
						window.location.href = res.data['redirect'];
				}
			}
		});
		return false;
	});
};
/**
 * Google map block base class
 */
function octBlock_gmap(blockData) {
	octBlock_gmap.superclass.constructor.apply(this, arguments);
	this.currentMap = null;
	this.mapElement = null;
	this.mapElementSelector = '.octGmap';
}
extendOct(octBlock_gmap, octBlockBase);
octBlock_gmap.prototype.afterGenerate = function () {};
octBlock_gmap.prototype.generate = function () {
	// Search for an item to insert map
	if (!this._$.find(this.mapElementSelector).size()) return;

	var params = this._data.params
	,	mapOptions = {}
	,	self = this;

	// Setting the default options
	if (params.gmap_lat != undefined && params.gmap_lat && typeof params.gmap_lon != "undefined" && params.gmap_lon)
		mapOptions.center = new google.maps.LatLng(params.gmap_lat.val, params.gmap_lon.val);
	else if (params.gmap_lat != undefined && params.gmap_lat) {
		mapOptions.center = new google.maps.LatLng(params.gmap_lat.val, '-73.9514422416687');
		this.setParam('gmap_lon', '-73.9514422416687');
	} else if (params.gmap_lon != undefined && params.gmap_lon) {
		mapOptions.center = new google.maps.LatLng('40.69847032728747', params.gmap_lon.val);
		this.setParam('gmap_lat', '40.69847032728747');
	} else {
		this.setParam('gmap_lon', '-73.9514422416687');
		this.setParam('gmap_lat', '40.69847032728747');
	}


	if (params.gmap_zoom != undefined && params.gmap_zoom)
		mapOptions.zoom = params.gmap_zoom.val;
	else
		this.setParam('gmap_zoom', '8');
	
	mapOptions.scrollwheel = false;

	this.mapElement = this._$.find(this.mapElementSelector).get(0);
	this.currentMap = new octGoogleMap(this.mapElement, mapOptions);

	// If there are markers, then add them to the map
	if (params.gmap_markers != undefined && params.gmap_markers) {
		var markers = JSON.parse(params.gmap_markers.val);

		if (Array.isArray(markers)) {
			for (var i = 0; i < markers.length; i++) {
				var marker = this.currentMap.addMarker(markers[i]);

				marker.setTitle(markers[i].title, true);
				marker.setDescription(markers[i].description);

				marker.setIcon(octOcto.gmap.markerIcon);
			}

			this.currentMap.markersRefresh();
		}
	}

	this.afterGenerate();
};
octBlock_gmap.prototype.loadedLibCallback = [];
octBlock_gmap.prototype._afterInitElements = function() {
	octBlock_gmap.superclass._afterInitElements.apply(this, arguments);

	var self = this
	,	gmapLibID = 'gmap-lib'
	,	gmapLibTag = jQuery('#' + gmapLibID);

	if (! gmapLibTag.size()) {
		var scriptTag = document.createElement('script');

		scriptTag.addEventListener('load', function () {
			for (var i in self.loadedLibCallback)
				self.loadedLibCallback[i]();

			jQuery(scriptTag).attr('loaded', true);
			self.generate();
		}, true);

		scriptTag.id = gmapLibID;
		scriptTag.src = octOcto.gmap.libURL;

		document.body.appendChild(scriptTag);
	} else if (! gmapLibTag.attr('loaded')) {
		this.loadedLibCallback.push(function () {
			self.generate();
		});
	} else {
		this.generate();
	}
};