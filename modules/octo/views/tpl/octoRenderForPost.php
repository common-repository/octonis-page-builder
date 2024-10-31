<?php
	$mainCanvasStylesArr = array();

	if (isset($this->octo['params']['font_family']) && !empty($this->octo['params']['font_family'])) {
		$mainCanvasStylesArr['font-family'] = $this->octo['params']['font_family'];
	}

	if(isset($this->octo['params']['bg_color']) && !empty($this->octo['params']['bg_color'])) {
		$mainCanvasStylesArr['background-color'] = $this->octo['params']['bg_color'];
	}
	if(isset($this->octo['params']['bg_img']) && !empty($this->octo['params']['bg_img'])) {
		$mainCanvasStylesArr['background-image'] = 'url("'. $this->octo['params']['bg_img']. '")';
		if(isset($this->octo['params']['bg_img_pos']) && !empty($this->octo['params']['bg_img_pos'])) {
			switch( $this->octo['params']['bg_img_pos'] ) {
				case 'stretch':
					$mainCanvasStylesArr['background-position'] = 'center center';
					$mainCanvasStylesArr['background-repeat'] = 'no-repeat';
					$mainCanvasStylesArr['background-attachment'] = 'fixed';
					$mainCanvasStylesArr['-webkit-background-size'] = 'cover';
					$mainCanvasStylesArr['-moz-background-size'] = 'cover';
					$mainCanvasStylesArr['-o-background-size'] = 'cover';
					$mainCanvasStylesArr['background-size'] = 'cover';
					break;
				case 'center':
					$mainCanvasStylesArr['background-position'] = 'center center';
					$mainCanvasStylesArr['background-repeat'] = 'no-repeat';
					$mainCanvasStylesArr['background-attachment'] = 'scroll';
					$mainCanvasStylesArr['-webkit-background-size'] = 'auto';
					$mainCanvasStylesArr['-moz-background-size'] = 'auto';
					$mainCanvasStylesArr['-o-background-size'] = 'auto';
					$mainCanvasStylesArr['background-size'] = 'auto';
					break;
				case 'tile':
					$mainCanvasStylesArr['background-position'] = 'left top';
					$mainCanvasStylesArr['background-repeat'] = 'repeat';
					$mainCanvasStylesArr['background-attachment'] = 'scroll';
					$mainCanvasStylesArr['-webkit-background-size'] = 'auto';
					$mainCanvasStylesArr['-moz-background-size'] = 'auto';
					$mainCanvasStylesArr['-o-background-size'] = 'auto';
					$mainCanvasStylesArr['background-size'] = 'auto';
					break;
			}
		}
	}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<title><?php echo $this->post->post_title; ?></title>
	<?php echo $this->stylesScriptsHtml;?>
	<style type="text/css">
		#octCanvas {
			<?php if(!empty($mainCanvasStylesArr)) {?>
			<?php echo utilsOct::arrToCss($mainCanvasStylesArr)?>
			<?php }?>
		}
	</style>
	<?php if(isset($this->octo['params']['fav_img']) && !empty($this->octo['params']['fav_img'])) { ?>
		<link rel="shortcut icon" href="<?php echo $this->octo['params']['fav_img'];?>" type="image/x-icon">
	<?php }?>
	<?php if(isset($this->octo['params']['keywords']) && !empty($this->octo['params']['keywords'])) { ?>
		<meta name="keywords" content="<?php echo htmlspecialchars($this->octo['params']['keywords']);?>">
	<?php }?>
	<?php if(isset($this->octo['params']['description']) && !empty($this->octo['params']['description'])) { ?>
		<meta name="description" content="<?php echo htmlspecialchars($this->octo['params']['description']);?>">
	<?php }?>
</head>
<body>
	<?php if($this->isEditMode) { ?>
		<div id="octMainLoder"></div>
		<div class="octMainBarHandle">
			<i class="octo-icon icon-blus-b"></i>
		</div>
		<form action="" id="octMainOctoForm">
		<div class="octMainTopBar supsystic-plugin" id="octMainTopBar">
			<div class="octMainTopBarLeft">
				<a href="<?php echo $this->allPagesUrl?>" class="octMainTopBarBtn">
					<i class="octo-icon icon-back"></i>
					<?php _e('WP Admin', OCT_LANG_CODE)?>
				</a>
			</div>
			<div class="octMainTopBarCenter">
					<div class="octMainOctoOpt">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Your Octo page title.', OCT_LANG_CODE)?>"></i>
							<?php _e('Page Title')?>
							<?php echo htmloct::text('label', array('value' => $this->post->post_title)); ?>
						</label>
					</div>
					<div class="octMainOctoOpt">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Font family for your page. You can always change font for any text element using text editor tool.', OCT_LANG_CODE)?>"></i>
							<?php _e('Font', OCT_LANG_CODE)?>
							<?php echo htmloct::fontsList('params[font_family]', array(
								'value' => @$this->octo['params']['font_family'],
								'attrs' => 'id="octFontFamilySelect" class="chosen"',
							))?>
						</label>
					</div>
					<div class="octMainOctoOpt">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Background color of your page. You can also set background for any block on page.', OCT_LANG_CODE)?>"></i>
							<?php _e('Background Color', OCT_LANG_CODE)?>
							<div class="octColorpickerInputShell octOctoBgColor">
								<?php echo htmloct::text('params[bg_color]', array(
									'attrs' => 'class="octColorpickerInput"',
									'value' => isset($this->octo['params']['bg_color']) ? $this->octo['params']['bg_color'] : '#fff',
								));?>
							</div>
						</label>
					</div>
					<div class="octMainOctoOpt octMainBgImgOptShell">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Set image as background. If it is set - it can overlap your Background Color option. Just click on the image from the right to change Background Image source.', OCT_LANG_CODE)?>"></i>
							<?php _e('Background Image', OCT_LANG_CODE)?>
							<?php
								$bgImgUrl = isset($this->octo['params']['bg_img']) ? $this->octo['params']['bg_img'] : '';
							?>
							<a class="octOctoBgImgBtn" href="#">
								<img class="octOctoBgImg" data-noimg-url="<?php echo $this->noImgUrl;?> "src="<?php echo $bgImgUrl ? $bgImgUrl : $this->noImgUrl;?>" />
							</a>
							<a 
								href="#" 
								class="octOctoBgImgRemove octMainTopBarBtn"
								<?php if(!$bgImgUrl) { ?>
									style="display: none;"
								<?php }?>
							>
								<i class="fa fa-times"></i>
							</a>
							<?php echo htmloct::hidden('params[bg_img]', array(
								'value' => $bgImgUrl,
							))?>
						</label>
					</div>
					<div class="octMainOctoOpt">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Background Image Position will define how we should show image on your background. Will work only if you will select Background Image.', OCT_LANG_CODE)?>"></i>
							<?php _e('Background Image Position', OCT_LANG_CODE)?>
							<?php echo htmloct::selectbox('params[bg_img_pos]', array(
								'options' => array('stretch' => __('Stretch', OCT_LANG_CODE), 'center' => __('Center', OCT_LANG_CODE), 'tile' => __('Tile', OCT_LANG_CODE)),
								'value' => isset($this->octo['params']['bg_img_pos']) ? $this->octo['params']['bg_img_pos'] : '',
								'attrs' => 'class="chosen" style="width: 100px;"',
							))?>
						</label>
					</div>
					<div class="octMainOctoOpt">
						<label>
							<span class="octTxtTop">
								<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Keywords meta tag for your page.', OCT_LANG_CODE)?>"></i>
								<?php _e('Page Keywords')?>
							</span>
							<?php echo htmloct::textarea('params[keywords]', array(
								'value' => isset($this->octo['params']['keywords']) ? $this->octo['params']['keywords'] : '',
							))?>
						</label>
					</div>
					<div class="octMainOctoOpt">
						<label>
							<span class="octTxtTop">
								<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Description meta tag for your page.', OCT_LANG_CODE)?>"></i>
								<?php _e('Page Description')?>
							</span>
							<?php echo htmloct::textarea('params[description]', array(
								'value' => isset($this->octo['params']['description']) ? $this->octo['params']['description'] : '',
							))?>
						</label>
					</div>

					<div class="octMainOctoOpt octMainFavImgOptShell">
						<label>
							<i class="fa fa-question supsystic-tooltip" title="<?php echo _e('Set image as favicon for your Coming Soon page. Just click on the image from the right to change Favicon Image source.', OCT_LANG_CODE)?>"></i>
							<?php _e('Favicon Image', OCT_LANG_CODE)?>
							<?php
								$favImgUrl = isset($this->octo['params']['fav_img']) ? $this->octo['params']['fav_img'] : '';
							?>
							<a class="octOctoFavImgBtn" href="#">
								<img class="octOctoFavImg" data-noimg-url="<?php echo $this->noImgUrl;?> "src="<?php echo $favImgUrl ? $favImgUrl : $this->noImgUrl;?>" />
							</a>
							<a 
								href="#" 
								class="octOctoFavImgRemove octMainTopBarBtn"
								<?php if(!$favImgUrl) { ?>
									style="display: none;"
								<?php }?>
							>
								<i class="fa fa-times"></i>
							</a>
							<?php echo htmloct::hidden('params[fav_img]', array(
								'value' => $favImgUrl,
							))?>
						</label>
					</div>
					<div id="octMainOctoOptMore" class="octMainOctoOpt">
						<a href="#" id="octMainOctoOptMoreBtn" class="octMainTopBarBtn">
							<?php _e('More', OCT_LANG_CODE)?><br />
							<i class="fa fa-caret-down"></i>
						</a>
					</div>
				</div>
			<div class="octMainTopBarRight">
				<a href="http://octonis.com/" target="_blank" class="octMainTopBarBtn octMainTopBarDimBtn"><?php _e('About Octonis', OCT_LANG_CODE)?></a>
				<?php /*?><a href="" target="_blank" class="octMainTopBarBtn octMainTopBarDimBtn"><?php _e('More products', OCT_LANG_CODE)?></a><?php */?>
				<a href="<?php echo $this->previewPageUrl?>" target="_blank" class="octMainTopBarBtn"><?php _e('PREVIEW', OCT_LANG_CODE)?></a>
				<button class="button-primary octMainSaveBtn" style="margin-top: 5px; margin-right: 5px;" data-txt="<?php _e('Save Project', OCT_LANG_CODE)?>">
					<div class="octo-icon octo-icon-2x icon-save-progress glyphicon-spin octMainSaveBtnLoader"></div>
					<span class="octMainSaveBtnTxt"><?php _e('Save Project', OCT_LANG_CODE)?></span>
				</button>
			</div>
		</div>
			<div id="octMainTopSubBar" class="octMainTopSubBar supsystic-plugin"></div>
		</form>
		<?php foreach($this->originalBlocksByCategories as $cat) { ?>
		<div class="navmenu navmenu-default navmenu-fixed-left offcanvas in canvas-slid octBlocksBar" data-cid="<?php echo $cat['id']?>">
			<ul class="nav navmenu-nav octBlocksList">
				<?php foreach($cat['blocks'] as $block) { ?>
					<li class="octBlockElement" data-id="<?php echo $block['id']?>">
						<img src="<?php echo $block['img_url']?>" class="octBlockElementImg" />
					</li>
				<?php }?>
			</ul>
		</div>
		<?php }?>
		<div class="navmenu navmenu-default navmenu-fixed-left offcanvas in canvas-slid octMainBar">
			<i class="octo-icon icon-genie octo-icon-5x octMainIcon"></i>
			<ul class="nav navmenu-nav">
				<?php foreach($this->originalBlocksByCategories as $cat) { ?>
					<li class="octCatElement" data-id="<?php echo $cat['id']?>">
						<a href="#">
							<?php /*?><div class="octCatElementIcon" style="background-image: url(<?php echo $cat['icon_url']?>)"></div><?php */?>
							<?php echo $cat['label']?>
						</a>
					</li>
				<?php }?>
			</ul>
		</div>
		<script type="text/javascript">
			var g_octBlocksById = {};
			<?php foreach($this->originalBlocksByCategories as $cat) { ?>
				<?php foreach($cat['blocks'] as $block) { ?>
					g_octBlocksById[ <?php echo $block['id']?> ] = <?php echo utilsOct::jsonEncode($block)?>;
				<?php }?>
			<?php }?>
		</script>
	<?php }?>
	<div id="octCanvas" <?php if (isset($this->octo['params']['font_family'])) echo 'data-octfonts="' . htmlentities( $this->octo['params']['font_family'] ) . '"';  ?>>
		<?php if(!empty($this->octo['blocks'])) {?>
			<?php foreach($this->octo['blocks'] as $block) { ?>
				<?php echo $block['rendered_html']?>
			<?php }?>
		<?php }?>
	</div>
	<?php echo $this->commonFooter;?>
	<?php if($this->isEditMode) {
		echo $this->editorFooter;
	} else {
		echo $this->footer;
	}?>
</body>
</html>