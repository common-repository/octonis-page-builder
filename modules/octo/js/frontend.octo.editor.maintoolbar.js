function _octMainToolbar() {
	this._$ = jQuery('#octMainTopBar');
	this._$subBar = jQuery('#octMainTopSubBar');
	this._$moreShell = jQuery('#octMainOctoOptMore');
	this._subBarVisible = false;
	this._init();
	if(window._octLoaded)
		this.refresh();
}
_octMainToolbar.prototype._init = function() {
	var self = this;
	this._$.find('.octMainTopBarCenter').show();	// it is hidden until whole page will be loaded because elements there is unsorted
	this._$.find('#octMainOctoOptMoreBtn').click(function(){
		if(self._subBarVisible) {
			self._hideSubBar();
		} else {
			self._showSubBar();
		}
		return false;
	});
};
_octMainToolbar.prototype._showSubBar = function() {
	if(!this._subBarVisible) {
		this._$subBar.removeClass('flipOutX').addClass('active animated flipInX');
		this._$.find('#octMainOctoOptMoreBtn').addClass('active');
		this._subBarVisible = true;
	}
};
_octMainToolbar.prototype._hideSubBar = function() {
	if(this._subBarVisible) {
		this._$subBar.removeClass('flipInX').addClass('flipOutX');
		this._$.find('#octMainOctoOptMoreBtn').removeClass('active');
		this._subBarVisible = false;
	}
};
_octMainToolbar.prototype.refresh = function(params) {
	params = params || {};
	var optsWidgetWidth = this._$.width() - this._$.find('.octMainTopBarLeft').outerWidth() - this._$.find('.octMainTopBarRight').outerWidth()
	,	optsTotalWidth = this._$.find('.octMainTopBarCenter').width()
	,	dMargin = 10;
	if(optsWidgetWidth < optsTotalWidth && !params.recursiveBackToMain) {	// Move main elements - to sub panel when in main panel there are no place for them
		var $lastElementInSet = this._$.find('.octMainOctoOpt:not(#octMainOctoOptMore):last');
		if($lastElementInSet && $lastElementInSet.size()) {
			$lastElementInSet.get(0)._octWidth = $lastElementInSet.width();	// remember it's width for case when we will need it - but element can be hidden
			$lastElementInSet.prependTo( this._$subBar );
			this._$moreShell.show();
			this.refresh({recursiveToSub: true});
		}
	} else {	// Check if we can move some elements - back to main panel
		var $firstOptInSub = this._$subBar.find('.octMainOctoOpt:first');
		if($firstOptInSub && $firstOptInSub.size()) {
			if(optsWidgetWidth > optsTotalWidth + $firstOptInSub.get(0)._octWidth + dMargin) {
				$firstOptInSub.insertBefore( this._$moreShell );
				this.refresh({recursiveBackToMain: true});
			}
		} else {
			this._$moreShell.hide();
			this._hideSubBar();
		}
	}
};
_octMainToolbar.prototype._getAllOptsShells = function() {
	var $shells = this._$.find('.octMainOctoOpt:not(#octMainOctoOptMore)');
	return $shells;
};