<?php
	do_action( 'admin_footer' );
	//do_action( 'wp_footer');
	do_action( 'customize_controls_print_footer_scripts' );
?>
<style type="text/css">
	/*to leave some place at the top for admin bar*/
	#octCanvas {
		margin-top: 93px;
	}
	.octMainBar, .octBlocksBar {
		top: 93px;
	}
</style>
<!--Images selection button example-->
<div id="octChangeImgBtnExl" class="octChangeImgBtn">
	<div class="octChangeImgBtnTxt" style="">
		<?php _e('Select Image', OCT_LANG_CODE)?>
	</div>
	<i class="octo-icon octo-icon-lg icon-image octChangeImgBtnIcon"></i>
</div>
<!--Block menus example-->
<div id="octBlockMenuExl" class="octBlockMenu">
	<div class="octBlockMenuEl" data-menu="align">
		<div class="octBlockMenuElTitle octBlockMenuElAlignTitle">
			<?php _e('Content align', OCT_LANG_CODE)?>
		</div>
		<div class="octBlockMenuElAlignContent row">
			<div class="col-sm-4 octBlockMenuElElignBtn" data-align="left">
				<i class="octo-icon octo-icon-2x icon-aligne-left"></i>
			</div>
			<div class="col-sm-4 octBlockMenuElElignBtn" data-align="center">
				<i class="octo-icon octo-icon-2x icon-aligne-center"></i>
			</div>
			<div class="col-sm-4 octBlockMenuElElignBtn" data-align="right">
				<i class="octo-icon octo-icon-2x icon-aligne-right"></i>
			</div>
		</div>
		<?php echo htmlOct::hidden('params[align]')?>
	</div>
	<div class="octBlockMenuEl" data-menu="add_slide">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-image octChangeImgBtnIcon"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Slide', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="add_gal_item">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-image octChangeImgBtnIcon"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Image', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="add_menu_item">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-plus-s"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Menu Item', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="edit_slides">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-manage octChangeImgBtnIcon"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Manage Slides', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="fill_color">
		<div class="octBlockMenuElAct">
			<?php echo htmlOct::checkbox('params[fill_color_enb]')?>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Fill Color', OCT_LANG_CODE)?>
		</div>
		<div class="octBlockMenuElRightAct">
			<div class="octColorpickerInputShell">
				<?php echo htmlOct::text('params[fill_color]', array(
					'attrs' => 'class="octColorpickerInput"'
				));?>
			</div>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="bg_img">
		<div class="octBlockMenuElAct">
			<?php echo htmlOct::checkbox('params[bg_img_enb]')?>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Background Image...', OCT_LANG_CODE)?>
		</div>
		<div class="octBlockMenuElRightAct">
			<i class="octo-icon octo-icon-lg icon-image"></i>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="add_field">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-plus-s"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Field', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="sub_settings">
		<div class="octBlockMenuElAct">
			<i class="glyphicon glyphicon-send"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Subscribe Settings', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="contact_settings">
		<div class="octBlockMenuElAct">
			<i class="glyphicon glyphicon-send"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Contact Setting', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="map_setting">
		<div class="octBlockMenuElAct">
			<i class="glyphicon glyphicon-globe"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Map Setting', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="map_add_marker">
		<div class="octBlockMenuElAct">
			<i class="glyphicon glyphicon-map-marker"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Marker', OCT_LANG_CODE)?>
		</div>
	</div>
	<div class="octBlockMenuEl" data-menu="add_grid_item">
		<div class="octBlockMenuElAct">
			<i class="octo-icon octo-icon-lg icon-image"></i>
		</div>
		<div class="octBlockMenuElTitle">
			<?php _e('Add Column', OCT_LANG_CODE)?>
		</div>
	</div>
</div>
<!--Block toolbar example-->
<div id="octBlockToolbarEx" class="octBlockToolbar octToolbar">
	<div class="octToolItem octBlockSettings octo-icon icon-options"></div>
	<div class="octToolItem octBlockMove octo-icon icon-up-down"></div>
	<div class="octToolItem octBlockRemove octo-icon icon-trash"></div>
</div>
<!--Manage slides wnd-->
<div class="modal fade" id="octManageSlidesWnd" tabindex="-1" role="dialog" aria-labelledby="octManageSlidesWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('DRAG AND DROP SLIDES TO ORDER', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body">
				<div class="octSlidesListPrev">
					
				</div>
			</div>
			<div class="modal-footer">
				<a href="#" class="button octSlideManageAddBtn" style="float: left;">
					<i class="octo-icon octo-icon-lg icon-plus-s"></i>
					<?php _e('Add Slide', OCT_LANG_CODE)?>
				</a>
				<button type="button" class="button-primary octManageSlidesSaveBtn"><?php _e('Save', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Manage slides - slide example-->
<div id="octSlideManageItemExl" class="octSlideManageItem">
	<div class="octSlideManageItemToolbar octToolbar">
		<div class="octToolItem octSlideManageItemRemove octo-icon icon-trash"></div>
	</div>
	<img src="" />
</div>
<!--Manage gallery item menu-->
<div id="octElMenuGalItemExl" class="octElMenu" style="min-width: 140px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octImgChangeBtn">
				<i class="glyphicon glyphicon-picture"></i>
				<?php _e('Select image', OCT_LANG_CODE)?>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octImgLinkBtn" data-sub-panel-show="link">
				<i class="glyphicon glyphicon-link"></i>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octImgMoveBtn">
				<i class="glyphicon glyphicon-move"></i>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octRemoveElBtn">
				<i class="glyphicon glyphicon-trash"></i>
			</div>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="link">
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('gal_item_link')?>
			</label>
			<label class="octElMenuSubPanelRow">
				<?php echo htmlOct::checkbox('gal_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', OCT_LANG_CODE)?></span>
			</label>
		</div>
	</div>
</div>
<!--Image menu-->
<div id="octElMenuImgExl" class="octElMenu" style="min-width: 611px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octImgChangeBtn">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'img'))?>
					<?php _e('Select image', OCT_LANG_CODE)?>
					<i class="glyphicon glyphicon-picture"></i>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octImgVideoSetBtn" data-sub-panel-show="video">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'video'))?>
					<?php _e('Video', OCT_LANG_CODE)?>
					<i class="fa fa-video-camera"></i>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<!-- Select Type -->
			<div class="octElMenuBtn octTypeTxtBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'txt'))?>
					<?php _e('Text', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeIconBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'icon'))?>
					<?php _e('Icon', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeButtonBtn">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'btn'))?>
					<?php _e('Button', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octLinkBtn" data-sub-panel-show="imglink">
				<label>
					<i class="glyphicon glyphicon-link"></i>
					<?php _e('Link', OCT_LANG_CODE)?>
				</label>
			</div>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="imglink">
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('icon_item_link')?>
			</label>
			<div style="display: none;" class="octPostLinkDisabled" data-postlink-to=":parent label [name='icon_item_link']"></div>
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('icon_item_title')?>
			</label>
			<label class="octElMenuSubPanelRow">
				<?php echo htmlOct::checkbox('icon_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', OCT_LANG_CODE)?></span>
			</label>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="video">
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('video_link')?>
			</label>
		</div>
	</div>
</div>
<!--Menu image menu-->
<div id="octElMenuMenuItemImgExl" class="octElMenu" style="min-width: 175px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octImgChangeBtn">
				<i class="glyphicon glyphicon-picture"></i>
				<?php _e('Select image', OCT_LANG_CODE)?>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octRemoveElBtn">
				<i class="glyphicon glyphicon-trash"></i>
			</div>
		</div>
	</div>
</div>
<!--Add menu item wnd-->
<div class="modal fade" id="octAddMenuItemWnd" tabindex="-1" role="dialog" aria-labelledby="octAddMenuItemWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Menu Item Settings', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octElMenuSubPanel">
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('text', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('menu_item_text')?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('menu_item_link')?>
				</label>
				<label class="octElMenuSubPanelRow">
					<?php echo htmlOct::checkbox('menu_item_new_window')?>
					<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', OCT_LANG_CODE)?></span>
				</label>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octAddMenuItemSaveBtn"><?php _e('Save', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Input menu-->
<div id="octElMenuInputExl" class="octElMenu" style="min-width: 175px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn">
				<label>
					<?php _e('Required', OCT_LANG_CODE)?>
					<?php echo htmlOct::checkbox('input_required')?>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octImgMoveBtn">
				<i class="glyphicon glyphicon-move"></i>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octRemoveElBtn">
				<i class="glyphicon glyphicon-trash"></i>
			</div>
		</div>
	</div>
</div>
<!--Input Button menu-->
<div id="octElMenuInputBtnExl" class="octElMenu" style="min-width: 120px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octColorBtn" data-sub-panel-show="color">
				<label>
					<?php _e('Color', OCT_LANG_CODE)?>
					<div class="octColorpickerInputShell">
						<?php echo htmlOct::text('color', array(
							'attrs' => 'class="octColorpickerInput"'
						));?>
					</div>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octImgMoveBtn">
				<i class="glyphicon glyphicon-move"></i>
			</div>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="color"></div>
	</div>
</div>
<!--Standart Button menu-->
<div id="octElMenuBtnExl" class="octElMenu" style="min-width: 420px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octLinkBtn" data-sub-panel-show="link">
				<label>
					<i class="glyphicon glyphicon-link"></i>
					<?php _e('Link', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octColorBtn" data-sub-panel-show="color">
				<label>
					<?php _e('Color', OCT_LANG_CODE)?>
					<div class="octColorpickerInputShell">
						<?php echo htmlOct::text('color', array(
							'attrs' => 'class="octColorpickerInput"'
						));?>
					</div>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<!-- Select Type -->
			<div class="octElMenuBtn octTypeTxtBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'txt'))?>
					<?php _e('Text', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeImgBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'img'))?>
					<?php _e('Image / Video', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeIconBtn">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'icon'))?>
					<?php _e('Icon', OCT_LANG_CODE)?>
				</label>
			</div>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="link">
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('btn_item_link')?>
			</label>
			<div style="display: none;" class="octPostLinkDisabled" data-postlink-to=":parent label [name='btn_item_link']"></div>
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('btn_item_title')?>
			</label>
			<label class="octElMenuSubPanelRow">
				<?php echo htmlOct::checkbox('btn_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', OCT_LANG_CODE)?></span>
			</label>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="color"></div>
	</div>
</div>
<!--Grid Column menu-->
<div id="octElMenuGridColExl" class="octElMenu" style="min-width: 370px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn" style="">
				<?php echo htmlOct::checkbox('enb_fill_color')?>
			</div>
			<div class="octElMenuBtn octColorBtn" data-sub-panel-show="color">
				<label>
					<?php _e('Fill Color', OCT_LANG_CODE)?>
					<div class="octColorpickerInputShell">
						<?php echo htmlOct::text('color', array(
							'attrs' => 'class="octColorpickerInput"'
						));?>
					</div>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn" style="">
				<?php echo htmlOct::checkbox('enb_bg_img')?>
			</div>
			<div class="octElMenuBtn octImgChangeBtn">
				<label>
					<?php _e('Background Image', OCT_LANG_CODE)?>
					<i class="glyphicon glyphicon-picture"></i>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octRemoveElBtn">
				<i class="glyphicon glyphicon-trash"></i>
			</div>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="color"></div>
	</div>
</div>
<!---->
<div id="octElMenuIconExl" class="octElMenu" style="min-width: 659px;">
	<div class="octElMenuContent">
		<div class="octElMenuMainPanel">
			<div class="octElMenuBtn octIconLibBtn" data-sub-panel-show="link">
				<i class="fa fa-lg fa-pencil"></i>
				<?php _e('Change Icon', OCT_LANG_CODE)?>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn"  data-sub-panel-show="size">
				<i class="glyphicon glyphicons-resize-small"></i>
				<?php _e('Icon Size', OCT_LANG_CODE)?>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octColorBtn" data-sub-panel-show="color">
				<?php _e('Color', OCT_LANG_CODE)?>
				<div class="octColorpickerInputShell">
					<?php echo htmlOct::text('color', array(
						'attrs' => 'class="octColorpickerInput"'
					));?>
				</div>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<div class="octElMenuBtn octLinkBtn" data-sub-panel-show="iconlink">
				<label>
					<i class="glyphicon glyphicon-link"></i>
					<?php _e('Link', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtnDelimiter"></div>
			<!-- Select Type -->
			<div class="octElMenuBtn octTypeTxtBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'txt'))?>
					<?php _e('Text', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeImgBtn" style="padding-right: 5px;">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'img'))?>
					<?php _e('Image / Video', OCT_LANG_CODE)?>
				</label>
			</div>
			<div class="octElMenuBtn octTypeButtonBtn">
				<label>
					<?php echo htmlOct::radiobutton('type', array('value' => 'btn'))?>
					<?php _e('Button', OCT_LANG_CODE)?>
				</label>
			</div>
		</div>
		<div class="octElMenuSubPanel octElMenuSubPanelIconSize" data-sub-panel="size">
			<span data-size="fa-lg">lg</span>
			<span data-size="fa-2x">2x</span>
			<span data-size="fa-3x">3x</span>
			<span data-size="fa-4x">4x</span>
			<span data-size="fa-5x">5x</span>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="iconlink">
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('icon_item_link')?>
			</label>
			<div style="display: none;" class="octPostLinkDisabled" data-postlink-to=":parent label [name='icon_item_link']"></div>
			<label class="octElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', OCT_LANG_CODE)?></span>
				<?php echo htmlOct::text('icon_item_title')?>
			</label>
			<label class="octElMenuSubPanelRow">
				<?php echo htmlOct::checkbox('icon_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', OCT_LANG_CODE)?></span>
			</label>
		</div>
		<div class="octElMenuSubPanel" data-sub-panel="color"></div>
	</div>
</div>
<!--Add field wnd-->
<div class="modal fade" id="octAddFieldWnd" tabindex="-1" role="dialog" aria-labelledby="octAddFieldWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Field Settings', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octElMenuSubPanel">
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Name', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('new_field_name')?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Label', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('new_field_label')?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Type', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::selectbox('new_field_html', array('options' => array(
						'text' => __('Text', OCT_LANG_CODE),
						'email' => __('Email', OCT_LANG_CODE),
						'textarea' => __('Textarea', OCT_LANG_CODE)
					)))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<?php echo htmlOct::checkbox('new_field_reuired')?>
					<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('required', OCT_LANG_CODE)?></span>
				</label>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octAddFieldSaveBtn"><?php _e('Save', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Subscribe settings wnd-->
<div class="modal fade" id="octSubSettingsWnd" tabindex="-1" role="dialog" aria-labelledby="octSubSettingsWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Subscribe Settings', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octElMenuSubPanel octSettingFieldsShell">
				<div id="octSubSettingsWndTabs">
					<h3 class="nav-tab-wrapper" style="margin-bottom: 0px; margin-top: 12px;">
						<a class="nav-tab nav-tab-active" href="#octSubSetWndMainTab">
							<?php _e('Main Settings', OCT_LANG_CODE)?>
						</a>
						<a class="nav-tab" href="#octSubSetWndConfirmTab">
							<?php _e('Confirmation', OCT_LANG_CODE)?>
						</a>
						<a class="nav-tab" href="#octSubSetWndNewSubTab">
							<?php _e('New Subscriber', OCT_LANG_CODE)?>
						</a>
					</h3>
					<div id="octSubSetWndMainTab" class="octTabContent">
						<label class="octElMenuSubPanelRow">
							<?php echo htmlOct::checkbox('sub_ignore_confirm')?>
							<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('create Subscriber without confirmation', OCT_LANG_CODE)?></span>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('"confirmation sent" message', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_confirm_sent', array(
								'attrs' => 'data-default="'. esc_html(__('Confirmation link was sent to your email address. Check your email!', OCT_LANG_CODE)). '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('subscribe success message', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_success', array(
								'attrs' => 'data-default="'. esc_html(__('Thank you for subscribe!', OCT_LANG_CODE)). '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('email error message', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_invalid_email', array(
								'attrs' => 'data-default="'. esc_html(__('Empty or invalid email', OCT_LANG_CODE)). '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('redirect after subscription URL', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_redirect_url', array(
								'attrs' => 'data-default=""',
							))?>
						</label>
					</div>
					<div id="octSubSetWndConfirmTab" class="octTabContent">
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('confirmation email subject', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_confirm_mail_subject', array(
								'attrs' => 'data-default="'. esc_html(__('Confirm subscription on [sitename]', OCT_LANG_CODE)). '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('confirmation email From field', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_confirm_mail_from', array(
								'attrs' => 'data-default="'. $this->adminEmail. '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('confirmation email text', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::textarea('sub_txt_confirm_mail_message', array(
								'attrs' => 'data-default="'. esc_html(__('You subscribed on site <a href="[siteurl]">[sitename]</a>. Follow <a href="[confirm_link]">this link</a> to complete your subscription. If you did not subscribe here - just ignore this message.', OCT_LANG_CODE)). '"',
							))?>
						</label>
					</div>
					<div id="octSubSetWndNewSubTab" class="octTabContent">
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('new Subscriber email subject', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_subscriber_mail_subject', array(
								'attrs' => 'data-default="'. esc_html(__('[sitename] Your username and password', OCT_LANG_CODE)). '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('new Subscriber email From field', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('sub_txt_subscriber_mail_from', array(
								'attrs' => 'data-default="'. $this->adminEmail. '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('new Subscriber email text', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::textarea('sub_txt_subscriber_mail_message', array(
								'attrs' => 'data-default="'. esc_html(__('Username: [user_login]<br />Password: [password]<br />[login_url]', OCT_LANG_CODE)). '"',
							))?>
						</label>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octSubSettingsSaveBtn"><?php _e('Save', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Icons library wnd-->
<div class="modal fade" id="octIconsLibWnd" tabindex="-1" role="dialog" aria-labelledby="octIconsLibWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Icons Library', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octElMenuSubPanel">
				<div id="octSubSettingsWndTabs">
					<?php echo htmlOct::text('icon_search', array(
						'attrs' => 'class="octIconsLibSearchTxt" placeholder="'. esc_html(__('Search, for example - pencil, music, ...', OCT_LANG_CODE)). '"',
					))?>
					<div class="octIconsLibList row"></div>
					<div class="octIconsLibEmptySearch alert alert-info" style="display: none;"><?php _e('Nothing found for <span class="octNothingFoundKeys"></span>, maybe try to search something else?', OCT_LANG_CODE)?></div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octIconsLibSaveBtn"><?php _e('Close', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Contact form settings wnd-->
<div class="modal fade" id="octContactsWnd" tabindex="-1" role="dialog" aria-labelledby="octSubContactsWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Contact Form Settings', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octElMenuSubPanel octSettingFieldsShell">
					<div class="octTabContent">
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('mail to inform about a new contact', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('contact_admin_mail', array(
								'attrs' => 'data-default="'. $this->adminEmail . '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('mail from someone send a message', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('contact_from_admin_mail', array(
								'attrs' => 'data-default="'. $this->adminEmail . '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('subject message that is sent to mail', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('contact_subject_mail', array(
								'attrs' => 'data-default="'. esc_html(__('User leave their contacts on [site_url]', OCT_LANG_CODE)) . '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('text message that is sent to mail', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::textarea('contact_text_mail', array(
								'attrs' => 'data-default="'. esc_html(__('User leave their contacts. </br> User email: [email] </br> Please contact him at a convenient time for you.', OCT_LANG_CODE)) . '"',
							))?>
						</label>
						<label class="octElMenuSubPanelRow">
							<span class="mce-input-name-txt"><?php _e('redirect to the URL after send contact information', OCT_LANG_CODE)?></span>
							<?php echo htmlOct::text('contact_redirect_url', array(
								'attrs' => 'data-default=""',
							))?>
						</label>
					</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octContactSettingsSaveBtn"><?php _e('Save', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Google map settings wnd-->
<div class="modal fade" id="octGmapSettingWnd" tabindex="-1" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Google Map Settings', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octSettingFieldsShell">
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Lat', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('gmap_lat', array(
						'attrs' => 'data-default="40.69847032728747"',
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Lon', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('gmap_lon', array(
						'attrs' => 'data-default="-73.9514422416687"',
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Zoom', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::input('gmap_zoom', array(
						'attrs' => 'data-default="8"',
						'type' => 'number'
					))?>
				</label>
			</div>
		</div>
	</div>
</div>
<!--Google map add marker wnd-->
<div class="modal fade" id="octGmapAddMarkerWnd" tabindex="-1" role="dialog">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="octo-icon octo-icon-2x icon-close-s" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title octTitleAdd"><?php _e('Add Marker', OCT_LANG_CODE)?></h4>
				<h4 class="modal-title octTitleEdit"><?php _e('Edit Marker', OCT_LANG_CODE)?></h4>
			</div>
			<div class="modal-body octSettingFieldsShell">
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Label', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('label', array(
						'attrs' => 'placeholder="Label"',
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Description', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('description', array(
						'attrs' => 'placeholder="Description"',
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Address', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('address', array(
						'attrs' => 'placeholder="603 Park Avenue, Brooklyn, NY 11206, USA"',
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Lat', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('lat', array(
						'attrs' => 'placeholder="40.69847032728747" data-default="40.69847032728747" required="1"',
						'value' => "40.69847032728747"
					))?>
				</label>
				<label class="octElMenuSubPanelRow">
					<span class="mce-input-name-txt"><?php _e('Lon', OCT_LANG_CODE)?></span>
					<?php echo htmlOct::text('lon', array(
						'attrs' => 'placeholder="-73.9514422416687" data-default="-73.9514422416687" required="1"',
						'value' => "-73.9514422416687"
					))?>
				</label>
				<input type="hidden" name="icon" value="<?php echo $this->gmapIcon; ?>">
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary octSaveBtn" style="display: none;"><?php _e('Save', OCT_LANG_CODE)?></button>
				<button type="button" class="button-primary octAddBtn"><?php _e('Add', OCT_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<div id="gmapInfoWindowTemplate">
	<div class="controls">
		<button class="edit">
			<i class="fa fa-pencil"></i>
		</button>
		<button class="remove">
			<i class="fa fa-trash-o"></i>
		</button>
	</div>
	<div class="clear"></div>
	<p>[title]</p>
	<p>[description]</p>
</div>
<div id="octElementButtonDefaultTemplate" class="octElementTemplate octEl octActBtn octElInput" data-el="btn">
	<a target="_blank" href="https://supsystic.com/" class="octEditArea octInputShell">Text</a>
</div>
<div class="octElementTemplate" data-template-element="txt">
	<div class="octEl" data-type="txt">
		<p>
			<span style="font-size: 18pt;">Your Text</span>
		</p>
	</div>
</div>
<div class="octElementTemplate" data-template-element="icon">
	<div data-icon="fa-cog" data-color="#C81878" data-type="icon" class="octIcon octEl octElInput">
		<i class="fa fa-2x octInputShell fa-cog" style="color: #C81878;"></i>
	</div>
</div>
<div class="octElementTemplate" data-template-element="img">
	<div class="octEl octElImg octElWithArea" data-type="img">
		<div class="octElArea">
			<img src="http://cdn.supsystic.com/_assets/octo/img/example.jpg" />
		</div>
	</div>
</div>