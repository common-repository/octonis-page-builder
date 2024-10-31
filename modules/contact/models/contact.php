<?php
class contactModelOct extends modelOct {
	private $_lastBlock = null;

	public function addContact($data = array()) {
		$id = isset($data['id']) ? $data['id'] : 0;

		if (!$id) {
			$this->pushError (__('Empty or invalid ID', OCT_LANG_CODE));
			return false;
		}

		$block = frameOct::_()->getModule('octo')->getModel('octo_blocks')->getById($id);

		if(!$block && $block['cat_code'] != 'contacts') {
			$this->pushError (__('Empty or invalid ID', OCT_LANG_CODE));
			return false;
		}

		$this->_lastBlock = $block;
		$data = dbOct::prepareHtmlIn($data);

		if($this->validateFields($data, $block))
			return $this->notifyMail($data, $block);

		return false;
	}

	public function validateFields($data, $block) {
		if(isset($block['params']['fields']) && !empty($block['params']['fields']['val'])) {
			$errors = array();

			foreach($block['params']['fields']['val'] as $f) {
				$k = $f['name'];

				if(isset($f['required']) && $f['required']) {
					$value = isset($data[ $k ]) ? trim($data[ $k ]) : false;

				if(empty($value)) {
					$errors[ $k ] = sprintf($f['html'] == 'selectbox' 
						? __('Please select %s', OCT_LANG_CODE)
						: __('Please enter %s', OCT_LANG_CODE)
						, $f['label']);
					}
				}
			}
			if(!empty($errors)) {
				$this->pushError($errors);
				return false;
			}
		}

		return true;
	}

	public function getLastBlock() {
		return $this->_lastBlock;
	}
	
	public function notifyMail($data, $block) {
		$notifyEmail = isset($block['params']['contact_admin_mail'])
			&& !empty($block['params']['contact_admin_mail'])
			?  $block['params']['contact_admin_mail']['val']
			:  get_bloginfo('admin_email');

		if (empty($notifyEmail)) {
			$this->pushError (__('Empty or invalid email', OCT_LANG_CODE), 'email');
			return false;
		}

		if (!is_email($notifyEmail)) {
			$this->pushError (__('Empty or invalid email', OCT_LANG_CODE), 'email');
			return false;
		}

		$mailText = isset($block['params']['contact_text_mail'])
				&& !empty($block['params']['contact_text_mail'])
				?  $block['params']['contact_text_mail']['val']
				:  __('User leave their contacts. </br> User email: [email] </br> Please contact him at a convenient time for you.', OCT_LANG_CODE);

		$mailSubject = isset($block['params']['contact_subject_mail'])
				&& !empty($block['params']['contact_subject_mail'])
				?  $block['params']['contact_subject_mail']['val']
				:  __('User leave their contacts on [site_url]', OCT_LANG_CODE);

		$messageParam = array(
			'keys' 	 => array(
				'[site_url]'
			),
			'values' => array(
				get_site_url()
			)
		);

		foreach ($data as $key => $values) {
			$messageParam['keys'][] = '[' . $key . ']';
			$messageParam['values'][] = $values;
		}

		$mailText = str_replace($messageParam['keys'], $messageParam['values'], $mailText);
		$mailSubject = str_replace($messageParam['keys'], $messageParam['values'], $mailSubject);
		$blogName = wp_specialchars_decode(get_bloginfo('name'));
		$adminEmail = isset($block['params']['contact_from_admin_mail'])
					? $block['params']['contact_from_admin_mail']['val']
					: get_bloginfo('admin_email');

		return frameOct::_()->getModule('mail')->send(
				$notifyEmail,
				$mailSubject,
				$mailText,
				$blogName,
				$adminEmail,
				$blogName,
				$adminEmail
		);
	}
}