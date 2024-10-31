<?php
class octoControllerOct extends controllerOct {
	private $_prevPopupId = 0;
	public function createFromTpl() {
		$res = new responseOct();
		if(($id = $this->getModel()->createFromTpl(reqOct::get('post'))) != false) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	protected function _prepareListForTbl($data) {
		if(!empty($data)) {
			foreach($data as $i => $v) {
				$data[ $i ]['post_title'] = '<a class="" href="'. get_edit_post_link($data[ $i ]['ID']). '">'. $data[ $i ]['post_title']. '&nbsp;<i class="fa fa-fw fa-pencil" style="margin-top: 2px;"></i></a>';
				$data[ $i ]['actions'] = '<a target="_blank" class="button" href="'. $this->getModule()->getEditLink($data[ $i ]['ID']). '"><i class="fa fa-fw fa-cog"></i></a>';
			}
		}
		return $data;
	}
	protected function _prepareTextLikeSearch($val) {
		$query = '(label LIKE "%'. $val. '%"';
		if(is_numeric($val)) {
			$query .= ' OR id LIKE "%'. (int) $val. '%"';
		}
		$query .= ')';
		return $query;
	}
	public function remove() {
		$res = new responseOct();
		if($this->getModel()->remove(reqOct::getVar('id', 'post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function save() {
		$res = new responseOct();
		$data = reqOct::getVar('data', 'post');
		if($this->getModel()->save( $data )) {
			$res->addData('id_sort_order_data', $this->getModel('octo_blocks')->getIdSortData( $data['id'] ));
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function exportForDb() {
		$forPro = (int) reqOct::getVar('for_pro', 'get');
		$tblsCols = array(
			'@__octo_blocks' => array('oid','cid','unique_id','label','original_id','params','html','css','img','sort_order','is_base','is_pro','date_created'),
			'@__octo' => array('unique_id','label','active','original_id','is_base','img','sort_order','params','is_pro','date_created'),
		);
		$tblsData = array();
		if($forPro) {
			foreach($tblsCols as $tbl => $cols) {
				$tblsData[] = $this->_makeExportQueriesLogicForPro($tbl, $cols);
			}
			echo 'db_install=>';
			echo implode('|', $tblsData);
			echo '=>bind_octo_to_tpls=>';
		} else {
			foreach($tblsCols as $tbl => $cols) {
				$tblsData[] = $this->_makeExportQueriesLogic($tbl, $cols);
			}
			echo implode(PHP_EOL. '---------------------------'. PHP_EOL, $tblsData);
		}
		echo $this->_getOctoToBlocksConnections( $forPro );
		exit();
	}
	private function _getOctoToBlocksConnections($forPro = false) {
		$eol = "\r\n";
		$octo = $this->_getExportData('@__octo', array('id','unique_id'), $forPro);
		$blocks = $this->_getExportData('@__octo_blocks', array('oid','unique_id'), $forPro);
		$octoToBlocks = array();
		foreach($octo as $o) {
			$octoToBlocks[ $o['unique_id'] ] = array('blocks' => array());
			foreach($blocks as $b) {
				if($b['oid'] == $o['id']) {
					$octoToBlocks[ $o['unique_id'] ]['blocks'][] = $b['unique_id'];
				}
			}
		}
		$out = '';
		if($forPro) {
			echo base64_encode( utilsOct::serialize($octoToBlocks) );
		} else {
			$out .= "\$octoToBlocks = array(". $eol;
			foreach($octoToBlocks as $oUid => $o) {
				$out .= "'$oUid' => array(". $eol;
				$out .= "'blocks' => array('". implode("', '", $o['blocks']). "'),". $eol;
				$out .= "),". $eol;
			}
			$out .= ");";
		}
		return $out;
	}
	private function _makeExportQueriesLogicForPro($table, $cols) {
		$octoList = $this->_getExportData($table, $cols, true);
		$res = array();
		foreach($octoList as $octo) {
			$uId = '';
			$rowData = array();
			foreach($octo as $k => $v) {
				if(!in_array($k, $cols)) continue;
				if($k == 'oid') {	// Flush Octo ID for export
					$v = 0;
				}
				$val = mysql_real_escape_string($v);
				if($k == 'unique_id') $uId = $val;
				$rowData[ $k ] = $val;

			}
			$res[ $uId ] = $rowData;
		}
		return str_replace(array('@__'), '', $table). '|'. base64_encode( utilsOct::serialize($res) );
	}
	private function _getExportData($table, $cols, $forPro = false) {
		return dbOct::get('SELECT '. implode(',', $cols). ' FROM '. $table. ' WHERE original_id = 0 and is_base = 1 and is_pro = '. ($forPro ? '1' : '0'));;
	}
	/**
	 * new usage
	 */
	private function _makeExportQueriesLogic($table, $cols) {
		$eol = "\r\n";
		$octoList = $this->_getExportData($table, $cols);
		$valuesArr = array();
		$allKeys = array();
		$uidIndx = 0;
		$i = 0;
		foreach($octoList as $octo) {
			$arr = array();
			$addToKeys = empty($allKeys);
			$i = 0;
			foreach($octo as $k => $v) {
				if(!in_array($k, $cols)) continue;
				if($addToKeys) {
					$allKeys[] = $k;
					if($k == 'unique_id') {
						$uidIndx = $i;
					}

				}
				if($k == 'oid') {	// Flush Octo ID for export
					$v = 0;
				}
				$arr[] = ''. mysql_real_escape_string($v). '';
				$i++;
			}
			$valuesArr[] = $arr;
		}
		$out = '';
		//$out .= "\$cols = array('". implode("','", $allKeys). "');". $eol;
		$out .= "\$data = array(". $eol;
		foreach($valuesArr as $row) {
			$uid = str_replace(array('"'), '', $row[ $uidIndx ]);
			$installData = array();
			foreach($row as $i => $v) {
				$installData[] = "'{$allKeys[ $i ]}' => '{$v}'";
			}
			$out .= "'$uid' => array(". implode(',', $installData). "),". $eol;
		}
		$out .= ");". $eol;
		return $out;
	}
	/**
	 * old usage
	 */
	private function _makeExportQueries($table, $cols) {
		$eol = "\r\n";
		$octoList = dbOct::get('SELECT '. implode(',', $cols). ' FROM '. $table. ' WHERE original_id = 0 and is_base = 1');
		$valuesArr = array();
		$allKeys = array();
		foreach($octoList as $octo) {
			$arr = array();
			$addToKeys = empty($allKeys);
			foreach($octo as $k => $v) {
				if(!in_array($k, $cols)) continue;
				if($addToKeys) {
					$allKeys[] = $k;
				}
				$arr[] = '"'. mysql_real_escape_string($v). '"';
			}
			$valuesArr[] = '('. implode(',', $arr). ')';
		}
		return 'INSERT INTO '. $table. ' ('. implode(',', $allKeys). ') VALUES '. $eol. implode(','. $eol, $valuesArr);
	}
	public function saveAsCopy() {
		$res = new responseOct();
		if(($id = $this->getModel()->saveAsCopy(reqOct::get('post'))) != false) {
			$res->addMessage(__('Done, redirecting to new PopUp...', OCT_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function switchActive() {
		$res = new responseOct();
		if($this->getModel()->switchActive(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function convertToOcto() {
		$res = new responseOct();
		if($this->getModel()->convertToOcto(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function returnFromOcto() {
		$res = new responseOct();
		if($this->getModel()->returnFromOcto(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function resetTpl() {
		$res = new responseOct();
		if($this->getModel()->resetTpl(reqOct::get('post'))) {
			$res->addMessage(__('Done', OCT_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			OCT_USERLEVELS => array(
				OCT_ADMIN => array('getListForTbl', 'remove', 'removeGroup', 'clear',
					'save', 'exportForDb', 'switchActive',
					'convertToOcto', 'returnFromOcto', 'resetTpl', 'setPresetOcto')
			),
		);
	}
	public function setPresetOcto() {
		$response = new responseOct();
		$model = $this->getModel();
		$params = array(
			'presetID'  => reqOct::getVar('presetID'),
			'postID' 	=> reqOct::getVar('postID')
		);

		// Checking that the parameters were not empty
		foreach ($params as $key => $value) {
			if (!$value) {
				$response->pushError(__('Params error'));
				return $response->ajaxExec();
			}
		}

		// Check exists a preset in table
		if ($params['presetID'] != -1 && $model->getPresetById($params['presetID']) == null) {
			$response->pushError(__('Preset nod found'));
			return $response->ajaxExec();
		}
		// Specify an empty preset default
		if ($params['presetID'] == -1) {
			$model->clearPresetToPost($params['postID']);
		} else {
			$currentPreset = $model->getPresetByPost($params['postID']);

			if ($currentPreset === null) {
				// If preset have not yet created for this post
				$model->createPresetToPost($params['presetID'], $params['postID']);
			} else if ($currentPreset == -1 || $currentPreset['id'] != $params['presetID']) {
				// Change the flag active preset
				$model->applyPresetToPost($params['presetID'], $params['postID']);
			}
		}

		// We speak to the client that you need to go to the edit page
		$response->action = 'RedirectToEdit';

		return $response->ajaxExec();
	}

}

