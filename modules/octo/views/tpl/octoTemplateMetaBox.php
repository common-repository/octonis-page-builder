<?php if (is_array($this->templates) && count($this->templates)): ?>
<div class="supsystic-plugin">
    <div class="temlplate-list">
        <!-- Start Template Clear Project -->
            <div class="temlplate-list-item preset <?php if ($this->preset == -1) echo 'active'; ?>" data-id="-1">
                <a data-id="-1" data-post="<?php echo $this->postId; ?>" href="#" class="button template-list-main-select">
                    <?php _e('Select', OCT_LANG_CODE);?>
                </a>
                <img data-id="-1" data-post="<?php echo $this->postId; ?>"  src="<?php echo OCT_IMG_PATH . 'empty-project.jpg'; ?>" class="ppsTplPrevImg" />
                <div class="preset-overlay">
                    <h3>
                        <span class="ppsTplLabel">Empty Project</span>
                    </h3>
                    <h4 style="margin-top: 60px;">
                        <a data-id="-1" data-post="<?php echo $this->postId; ?>" href="<?php echo frameOct::_()->getModule('octo')->getEditLink( $this->postId );?>" target="_blank" class="button button-primary preset-select-btn edit-link"><?php _e('Edit Template', OCT_LANG_CODE)?></a>
                    </h4>
                </div>
            </div>
        <!-- End Template Clear Project -->

        <?php foreach($this->templates as $tpl) { ?>
            <?php $isPromo = isset($tpl['promo']) && $tpl['promo'];?>
            <?php $promoClass = $isPromo ? 'sup-promo' : '';?>
            <div class="temlplate-list-item preset <?php echo $promoClass;?> <?php if ($this->preset == $tpl['id']) echo 'active'; ?>" data-id="<?php echo $isPromo ? 0 : $tpl['id']?>">
                <a data-id="<?php echo $isPromo ? 0 : $tpl['id']?>" data-post="<?php echo $this->postId; ?>" href="<?php echo ($isPromo ? $tpl['promo_link'] : '#')?>" <?php echo ($isPromo ? 'target="_blank"' : '')?> class="button template-list-main-select">
                    <?php $isPromo ? _e('Available in PRO', OCT_LANG_CODE) : _e('Select', OCT_LANG_CODE);?>
                </a>
                <img data-id="<?php echo $isPromo ? 0 : $tpl['id']?>" data-post="<?php echo $this->postId; ?>" src="<?php echo $this->imageRepository . $tpl['img']?>" class="ppsTplPrevImg" />
                <div class="preset-overlay">
                    <h3>
                        <span class="ppsTplLabel"><?php echo $tpl['label']?></span>
                    </h3>
                    <h4 style="margin-top: 60px;">
                        <?php if($isPromo) { ?>
                            <a href="<?php echo $tpl['promo_link']?>" target="_blank" class="button button-primary preset-select-btn <?php echo $promoClass;?>"><?php _e('Get in PRO', OCT_LANG_CODE)?></a>
                        <?php } else { ?>
                            <a  data-id="<?php echo $isPromo ? 0 : $tpl['id']?>" data-post="<?php echo $this->postId; ?>" href="<?php echo frameOct::_()->getModule('octo')->getEditLink( $this->postId );?>" class="button button-primary preset-select-btn edit-link"><?php _e('Edit Template', OCT_LANG_CODE)?></a>
                        <?php }?>
                    </h4>
                </div>
            </div>
        <?php }?>
        <div style="clear: both;"></div>
    </div>
</div>
<?php endif; ?>
