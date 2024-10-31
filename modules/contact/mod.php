<?php
class contactOct extends moduleOct {
	public function generateFormStart($block) {
		$view = $this->getView();
		$res = $view->generateFormStart_contact( $block );
		$res = dispatcherOct::applyFilters('contactFormStart', $res, $block);

		return $res;
	}
	public function generateFormEnd($block) {
		$view = $this->getView();
		$res = $view->generateFormEnd_contact( $block );
		$res = dispatcherOct::applyFilters('contactFormEnd', $res, $block);

		return $res;
	}
}

