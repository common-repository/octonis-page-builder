var g_octPostConverted = false;
jQuery(document).ready(function(){
	jQuery('#octTemplateMetaBox').hide();

	// Append our branding icon to the meta box
	jQuery('#octMainMetaBox .hndle').prepend('<i class="octo-icon icon-genie octMetaBoxHeadIcon"></i>');
	if(jQuery('.octPostSettingsShell').is(':visible')) {
		g_octPostConverted = true;
		jQuery('#octTemplateMetaBox').show();
	}
	if(g_octPostConverted) {
		octSwitchPostConvertedBoxes( true );
	}
	jQuery('.octActivatePostBtn').click(function(){
		jQuery.sendFormOct({
			btn: this
		,	data: {mod: 'octo', action: 'convertToOcto', pid: jQuery(this).data('pid')}
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('.octActivateForPostShell').slideUp( g_octAnimationSpeed );
					jQuery('.octPostSettingsShell').slideDown( g_octAnimationSpeed );
					octSwitchPostConvertedBoxes( true );
					jQuery('#octTemplateMetaBox').show();
				}
			}
		});
		return false;
	});
	jQuery('.octReturnPostFromOcto').click(function(){
		if(confirm(toeLangOct('Are you sure want back to usual view from Octonis?'))) {
			jQuery.sendFormOct({
				btn: this
			,	data: {mod: 'octo', action: 'returnFromOcto', pid: jQuery(this).data('pid')}
			,	onSuccess: function(res) {
					if(!res.error) {
						jQuery('.octActivateForPostShell').slideDown( g_octAnimationSpeed );
						jQuery('.octPostSettingsShell').slideUp( g_octAnimationSpeed );
						octSwitchPostConvertedBoxes( false );
						jQuery('#octTemplateMetaBox').hide();
					}
				}
			});
		}
		return false;
	});
	jQuery('.octEditTplBtn').click(function(){
		octSetEditBtnLink();	// Do this each click - as user can change link after edit post start
	});
	octSetEditBtnLink();
	octInitChangeTpl();
	jQuery('.template-list-main-select, .temlplate-list-item .ppsTplPrevImg').click(function(e){
		if(!jQuery(this).parents('.temlplate-list-item:first').hasClass('sup-promo')) {
			var $this = jQuery(this);

			if ($this.attr('data-id') == 0)
				return;

			if (!$this.attr('data-post') || !$this.attr('data-id')) return;
			e.preventDefault();

			var dataToServer = {
				mod		 : 'octo'
			,	action	 : 'setPresetOcto'
			,	postID	 : $this.attr('data-post')
			,	presetID : $this.attr('data-id')
			};

			jQuery('.temlplate-list-item.preset').removeClass('active');
			$this.parent('.temlplate-list-item.preset').addClass('active');

			jQuery.sendFormOct({
				btn: $this
				,	data: dataToServer
				,	onSuccess: function(res) {}
			});
		}
	});
	jQuery('.temlplate-list-item .button.edit-link').click(function (e) {
		var $this = jQuery(this);

		if (!$this.attr('data-post') || !$this.attr('data-id')) return;
		e.preventDefault();

		var dataToServer = {
			mod		 : 'octo'
		,	action	 : 'setPresetOcto'
		,	postID	 : $this.attr('data-post')
		,	presetID : $this.attr('data-id')
		};

		jQuery('.temlplate-list-item.preset').removeClass('active');
		$this.parent('.temlplate-list-item.preset').addClass('active');

		jQuery.sendFormOct({
			btn: $this
			,	data: dataToServer
			,	onSuccess: function(res) {
				if (!res.error && res.hasOwnProperty('action')) {
					var action = res.action;

					if (action == 'RedirectToEdit')
						window.open($this.attr('href'));
				}

			}
		});
	});

});
function octInitChangeTpl() {
	jQuery('.temlplate-list-item').click(function(){
		jQuery('.temlplate-list-item').removeClass('active');
		jQuery(this).addClass('active');
	});
}
function octSetEditBtnLink() {
	var $viewLink = jQuery('#view-post-btn a:first');
	if(!$viewLink || !$viewLink.size()) {
		$viewLink = jQuery('#sample-permalink a:first');
	}
	if (!$viewLink || !$viewLink.size())
		$viewLink = jQuery('.temlplate-list-item.preset .edit-link');

	if($viewLink.size()) {
		var postViewUrl = $viewLink.attr('href');
		postViewUrl += (postViewUrl.indexOf('?') > 0 ? '&' : '?')+ 'octo_edit=1';
		jQuery('.octEditTplBtn').attr('href', postViewUrl);
	}
}
function octSwitchPostConvertedBoxes(enable) {
	enable
		? jQuery('#postdivrich').slideUp( g_octAnimationSpeed )
		: jQuery('#postdivrich').slideDown( g_octAnimationSpeed );
	jQuery('#postbox-container-1 .postbox').each(function(){
		if(toeInArray(jQuery(this).attr('id'), ['formatdiv', 'postimagediv']) != -1) {
			enable
				? jQuery( this ).slideUp( g_octAnimationSpeed )
				: jQuery( this ).slideDown( g_octAnimationSpeed );
		}
	});
	jQuery('#postbox-container-2 .postbox').each(function(){
		if(toeInArray(jQuery(this).attr('id'), ['authordiv', 'octTemplateMetaBox']) == -1) {
			enable
				? jQuery( this ).slideUp( g_octAnimationSpeed )
				: jQuery( this ).slideDown( g_octAnimationSpeed );
		}
	});
}