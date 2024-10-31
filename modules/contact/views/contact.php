<?php
class contactViewOct extends viewOct {
	public function generateFormStart_contact($block, $key = '') {
		return '<!--contact_form_start_open--><form class="octContactForm'. (empty($key) ? '' : ' octContactForm_'. $key).'" action="'. OCT_SITE_URL. '" method="post"><!--contact_form_start_close-->';
	}

	public function generateFormEnd_contact($block) {
		$res = '<!--contact_form_end_open-->';
		$res .= htmlOct::hidden('mod', array('value' => 'contact'));
		$res .= htmlOct::hidden('action', array('value' => 'addContact'));
		$res .= htmlOct::hidden('id', array('value' => $block['id']));
		$res .= htmlOct::hidden('_wpnonce', array('value' => wp_create_nonce('contact-'. $block['id'])));
		$res .= '<div class="octContactMsg"></div>';
		$res .= '</form>';
		$res .= '<!--contact_form_end_close-->';
		return $res;
	}
}
