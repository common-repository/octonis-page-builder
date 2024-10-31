<?php
class contactControllerOct extends controllerOct {
	public function addContact() {
		$res = new responseOct();
		$data = reqOct::get('post');
		$id = isset($data['id']) ? (int) $data['id'] : 0;

		if(!wp_verify_nonce($_REQUEST['_wpnonce'], 'contact-'. $id))
			die('Some error with your request.........');

		if ($this->getModel()->addContact(reqOct::get('post'))) {
			$block = $this->getModel()->getLastBlock();
			$redirectUrl = isset($block['params']['contact_redirect_url'])
				&& !empty($block['params']['contact_redirect_url']['val'])
				?  $block['params']['contact_redirect_url']['val']
				:  false;

			if($redirectUrl)
				$res->addData('redirect', uriOct::normal($redirectUrl));
		} else
			$res->pushError ($this->getModel()->getErrors());

		return $res->ajaxExec();
	}
}

