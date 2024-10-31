

<?php
class octoModelOct extends modelOct {
	private $_simpleGet = false;
	private $_linksReplacement = array();
	public function __construct() {
		$this->_setTbl('octo');
	}
	/*protected function _escTplData($data) {
		$data['html'] = dbOct::escape($data['html']);
		$data['css'] = dbOct::escape($data['css']);
		return $data;
	}*/
	private function _afterDbParams($params) {
		if(empty($params)) return $params;
		if(is_array($params)) {
			foreach($params as $k => $v) {
				$params[ $k ] = $this->_afterDbParams($v);
			}
			return $params;
		} else
			return stripslashes ($params);
	}
	protected function _afterDbReplace($data) {
		static $replaceFrom, $replaceTo;
		if(is_array($data)) {
			foreach($data as $k => $v) {
				$data[ $k ] = $this->_afterDbReplace($v);
			}
		} else {
			if(!$replaceFrom) {
				$this->_getLinksReplacement();
				/*Tmp fix - for quick replace all mode URL to assets URL*/
				$replaceFrom[] = '['. $this->_linksReplacement['modUrl']['key']. ']';
				$replaceTo[] = '['. $this->_linksReplacement['assetsUrl']['key']. ']';
				$replaceFrom[] = $this->_linksReplacement['oldAssets']['url'];
				$replaceTo[] = $this->_linksReplacement['assetsUrl']['url'];
				/*****/
				foreach($this->_linksReplacement as $k => $rData) {
					$replaceFrom[] = '['. $rData['key']. ']';
					$replaceTo[] = $rData['url'];
				}
			}
			$data = str_replace($replaceFrom, $replaceTo, $data);
		}
		return $data;
	}
	protected function _afterGetFromTbl($row) {
		$row = parent::_afterGetFromTbl($row);
		static $imgsPath = false;
		if(!$imgsPath) {
			$imgsPath = $this->getModule()->getAssetsUrl(). 'img/preset/';
		}
		if(isset($row['img'])) {
			$row['img_preview_url'] = $imgsPath. $row['img'];
		}
		if(isset($row['params'])) {
			$row['params'] = empty($row['params']) ? array() : utilsOct::unserialize(base64_decode($row['params']), true);
			$row['params'] = $this->_afterDbReplace($this->_afterDbParams( $row['params'] ));
		}
		return $row;
	}
	public function remove($id) {
		$id = (int) $id;
		if($id) {
			if(frameOct::_()->getTable( $this->_tbl )->delete(array('pid' => $id))) {
				return true;
			} else
				$this->pushError (__('Database error detected', OCT_LANG_CODE));
		} else
			$this->pushError(__('Invalid ID', OCT_LANG_CODE));
		return false;
	}
	/**
	 * Do not remove pre-set templates
	 */
	public function clear() {
		if(frameOct::_()->getTable( $this->_tbl )->delete(array('additionalCondition' => 'original_id != 0'))) {
			return true;
		} else 
			$this->pushError (__('Database error detected', OCT_LANG_CODE));
		return false;
	}
	public function switchActive($d = array()) {
		$d['active'] = isset($d['active']) ? (int)$d['active'] : 0;
		$d['id'] = isset($d['id']) ? (int) $d['id'] : 0;
		if(!empty($d['id'])) {
			$tbl = $this->getTbl();
			return frameOct::_()->getTable($tbl)->update(array(
				'active' => $d['active'],
			), array(
				'id' => $d['id'],
			));
		} else
			$this->pushError (__('Invalid ID', OCT_LANG_CODE));
		return false;
	}
	public function isPostConverted($pid) {
		return frameOct::_()->getTable( $this->getTbl() )->exists($pid, 'pid');
	}
	public function getForPost($pid) {
		$octo = $this->setWhere(array('pid' => $pid))->getFromTbl(array('return' => 'row'));
		if($octo) {
			$octo['blocks'] = $this->getBlocksForOcto($octo['id']);
			return $octo;
		}
		return false;
	}
	public function getBlocksForOcto($oid) {
		$blocksModel = $this->getModule()->getModel('octo_blocks');

		return $blocksModel->addWhere(array('oid' => $oid))->getFromTbl();
	}
	public function convertToOcto($d = array()) {
		$pid = isset($d['pid']) ? (int) $d['pid'] : 0;
		if($pid) {
			if($this->exists($pid, 'pid')) {
				$this->update(array(
					'active' => 1,
				),array(
					'pid' => $pid,
				));
			} else {
				$this->insert(array(
					'pid' => $pid,
					'active' => 1
				));
			}
		} else
			$this->pushError(__('Invalid Post ID', OCT_LANG_CODE));
		return false;
	}
	public function returnFromOcto($d = array()) {
		$pid = isset($d['pid']) ? (int) $d['pid'] : 0;
		if($pid) {
			return $this->delete(array(
				'pid' => $pid
			));
		} else
			$this->pushError(__('Invalid Post ID', OCT_LANG_CODE));
		return false;
	}
	protected function _retrieveData($params = array()) {
		if($this->_simpleGet) {
			$this->_simpleGet = false;
			return parent::_retrieveData($params);
		}
		add_filter('posts_join_request', array($this, 'joinOctoTableToPosts'));
		add_filter('posts_where_request', array($this, 'whereOctoTableToPosts'));
		add_filter('posts_fields_request', array($this, 'fieldsOctoTableToPosts'));
		$res = array();
		$getPostsArgs = array(
			'posts_per_page'   => 5,
			'offset'           => 0,
			'orderby'          => 'post_date',
			'order'            => 'DESC',
			'post_type'        => 'any',
			'post_status'      => 'any',
			'suppress_filters' => false 
		);
		if(!empty($this->_orderBy)) {
			$getPostsArgs['orderby'] = $this->_orderBy;
			if(!empty($this->_sortOrder)) {
				$getPostsArgs['order'] = strtoupper($this->_sortOrder);
			}
		}
		if(!empty($this->_limit)) {
			$limitStartLimit = array_map('trim', explode(',', $this->_limit));
			if(isset($limitStartLimit[1])) {
				$getPostsArgs['offset'] = $limitStartLimit[0];
				$getPostsArgs['posts_per_page'] = $limitStartLimit[1];
			} else
				$getPostsArgs['posts_per_page'] = $limitStartLimit[0];
		}
		$postsArray = get_posts( $getPostsArgs );
		if($postsArray) {
			$return = isset($params['return']) ? $params['return'] : 'all';
			$i = 0;
			foreach($postsArray as $p) {
				$res[ $i ] = toeObjectToArray( $p );
				$i++;
			}
			if($return == 'row') {
				$res = array_shift( $res );
			}
		}
		remove_filter('posts_fields_request', array($this, 'fieldsOctoTableToPosts'));
		remove_filter('posts_where_request', array($this, 'whereOctoTableToPosts'));
		remove_filter('posts_join_request', array($this, 'joinOctoTableToPosts'));
		return $res;
	}
	public function joinOctoTableToPosts($join) {
		global $wpdb;
		$join .= dbOct::prepareQuery(" INNER JOIN @__octo ON $wpdb->posts.ID = @__octo.pid");
        return $join;
	}
	public function whereOctoTableToPosts($where) {
		$where .= dbOct::prepareQuery(" AND @__octo.`active` = 1 ");
		if(!empty($this->_where)) {
			if(is_array($this->_where)) {
				foreach($this->_where as $k => $v) {
					$where .= dbOct::prepareQuery(" AND @__octo.`$k` = '$v'");
				}
			} else {
				$where .= dbOct::prepareQuery(" AND $this->_where");
			}
		}
		return $where;
	}
	public function fieldsOctoTableToPosts($fields) {
		$addFields = array_map(array('dbOct', 'prepareQuery'), array('@__octo.id'));
		$fields .= ','. implode(',', $addFields);
		return $fields;
	}
	private function _getLinksReplacement() {
		if(empty($this->_linksReplacement)) {
			$this->_linksReplacement = array(
				'modUrl' => array('url' => $this->getModule()->getModPath(), 'key' => 'OCT_MOD_URL'),
				'siteUrl' => array('url' => OCT_SITE_URL, 'key' => 'OCT_SITE_URL'),
				'assetsUrl' => array('url' => $this->getModule()->getAssetsUrl(), 'key' => 'OCT_ASSETS_URL'),
				'oldAssets' => array('url' => $this->getModule()->getOldAssetsUrl(), 'key' => 'OCT_OLD_ASSETS_URL'),
			);
		}
		return $this->_linksReplacement;
	}
	protected function _beforeDbReplace($data) {
		static $replaceFrom, $replaceTo;
		if(is_array($data)) {
			foreach($data as $k => $v) {
				$data[ $k ] = $this->_beforeDbReplace($v);
			}
		} else {
			if(!$replaceFrom) {
				$this->_getLinksReplacement();
				foreach($this->_linksReplacement as $k => $rData) {
					if($k == 'oldAssets') {	// Replace old assets urls - to new one
						$replaceFrom[] = $rData['url'];
						$replaceTo[] = '['. $this->_linksReplacement['assetsUrl']['key']. ']';
					} else {
						$replaceFrom[] = $rData['url'];
						$replaceTo[] = '['. $rData['key']. ']';
					}
				}
			}
			$data = str_replace($replaceFrom, $replaceTo, $data);
		}
		return $data;
	}
	protected function _dataSave($data, $update = false) {
		$data = $this->_beforeDbReplace($data);
		if(isset($data['params'])) {
			$data['params'] = base64_encode(utilsOct::serialize($data['params']));
		}
		return $data;
	}
	public function save($data = array()) {
		$oid = isset($data['id']) ? (int) $data['id'] : 0;
		if($oid) {
			if(isset($data['octo'])) {
				if(!$this->updateById($data['octo'], $oid)) {
					return false;
				} else {
					if (isset($data['octo']['label']) && isset($data['id']) && strlen($data['octo']['label'])) {
						$this->_simpleGet = true;

						$currentOcto = $this->setSelectFields('pid')
									   ->setWhere(array('id' => $data['id']))
									   ->getFromTbl(array('return' => 'row'));

						if (isset($currentOcto['pid'])) {
							wp_update_post(array(
								'ID' => $currentOcto['pid'],
								'post_title' => $data['octo']['label']
							));
						}
					}
				}
			}

			// TODO: Add remove blocks here
			$blocksModel = $this->getModule()->getModel('octo_blocks');
			$currentBlockIds = array();
			$idSortArr = $blocksModel->getIdSortData($oid);
			if(!empty($idSortArr)) {
				foreach($idSortArr as $idSortData) {
					$currentBlockIds[ $idSortData['id'] ] = 1;
				}
			}
			if(isset($data['blocks']) && !empty($data['blocks'])) {
				foreach($data['blocks'] as $b) {
					if(!$blocksModel->save($b, $oid)) {
						$this->pushError( $blocksModel->getErrors() );
						return false;
					} else {
						if(isset($b['id']) && $b['id'] && isset($currentBlockIds[ $b['id'] ])) {
							unset( $currentBlockIds[ $b['id'] ] );
						}
					}
				}
			}
			if(!empty($currentBlockIds)) {
				$blocksModel->removeGroup(array_keys( $currentBlockIds ));
			}
			return true;
		} else
			$this->pushError (__('Invalid Octo ID', OCT_LANG_CODE));
		return false;
	}
	public function getUsedBlocksNumForPost($pid) {
		return (int) dbOct::get('SELECT COUNT(*) AS total FROM @__octo, @__octo_blocks WHERE @__octo.id = @__octo_blocks.oid AND @__octo.pid = '. (int)$pid, 'one');
	}
	public function getPresetByPost($pid) {
		$this->_simpleGet = true;
		$currentOcto =  $this
			->setSelectFields('*')
			->setWhere(array( 'pid' => $pid, 'active' => 1 ))
			->getFromTbl(array( 'return' => 'row' ));

		if (is_array($currentOcto) && (int) $currentOcto['original_id'] == 0)
			return -1;

		return dbOct::get(
			str_replace(
				'{1}',
				(int) $pid,
				'SELECT
 					*
 				 FROM
 				 	@__octo
 				 WHERE
 				 	is_base = 1
 				  AND
 				  	unique_id = (
 				  		SELECT
 				  			unique_id
 				  		FROM
 				  			@__octo
 				  		WHERE
 				  			pid = {1}
 				  		  AND
 				  		  	active = 1
 				  	)
 			'),
			'row'
		);
	}
	public function getPresetById($id) {
		$this->_simpleGet = true;
		return $this
			->setSelectFields('*')
			->setWhere(array( 'id' => $id, 'is_base' => 1 ))
			->setLimit('1')
			->getFromTbl(array( 'return' => 'row' ));
	}
	public function getAllPresetByPost($postID) {
		$this->_simpleGet = true;
		return $this
			->setSelectFields('*')
			->setWhere(array( 'pid' => $postID ))
			->getFromTbl();
	}
	public function applyPresetToPost($presetID, $postID) {
		$allPresetByPost = $this->getAllPresetByPost($postID);
		$flagCreate = true;

		foreach ($allPresetByPost as $preset) {
			if ($preset['original_id'] == $presetID) {
				$flagCreate = false;
				break;
			}
		}

		$this->_simpleGet = true;
		$this->update(array( 'active' => '0' ), array( 'pid' => $postID ));

		if ($flagCreate)
			$this->createPresetToPost(
				$presetID,
				$postID,
				false
			);
		else {
			$this->_simpleGet = true;
			$this->update(array( 'active' => '1' ), array( 'pid' => $postID, 'original_id' => $presetID ));
		}
	}
	public function copy($originalId, $data = array()) {
		$this->_simpleGet = true;
		$original = $this
			->setSelectFields('*')
			->setWhere(array( 'id' => $originalId ))
			->getFromTbl(array( 'return' => 'row' ));

		if ($original == false)
			return false;

		unset($original['id']);
		unset($original['date_created']);

		$original['is_base'] = 0;
		$original['original_id'] = $originalId;

		if(!empty($data)) {
			if(isset($data['params']))
				$data['params'] = array_merge($original['params'], $data['params']);
		}
		
		$original = array_merge($original, $data);

		$oid = $this->insert( $original );

		if($oid) {
			$originalBlocks = $this->getBlocksForOcto( $originalId );

			if(!empty($originalBlocks)) {
				$blocksModel = $this->getModule()->getModel('octo_blocks');

				foreach($originalBlocks as $block)
					$blocksModel->save(array(
						'original_id' => $block['id'],
						'params' => $block['params'],
						'html' => dbOct::escape($block['html'])),
						$oid
					);
			}

			return $oid;
		}

		return false;
	}
	public function clearPresetToPost($postID) {
		dbOct::query('UPDATE @__octo SET `active` = IF(original_id = 0, 1, 0) WHERE `pid` = ' . (int) $postID);
	}
	public function createPresetToPost($presetID, $postID, $updateActive = true) {
		if ($updateActive) {
			$this->_simpleGet = true;
			$this->update(array( 'active' => 0 ), array( 'pid' => $postID ));
		}

		$this->copy(
			$presetID,
			array(
				'pid' => $postID,
				'active' => 1
			)
		);
	}
	public function getAllTemplates() {
		$this->_simpleGet = true;
		return $this
			->setSelectFields('id, label, img')
			->setWhere(array('is_base' => 1, 'original_id' => 0))
			->getFromTbl();
	}
	public function getFullById($id) {
		$this->_simpleGet = true;

		$octo = $this
			->setSelectFields('*')
			->setWhere(array('pid' => $id, 'active' => '1'))
			->getFromTbl(array('return' => 'row'));

		if($octo) {
			$octo['blocks'] = $this->getBlocksForOcto($octo['id']);
		
			return $octo;
		}

		
		return false;
	}
}
