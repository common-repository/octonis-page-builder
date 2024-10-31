<?php
class installerDbUpdaterOct {
	static public function runUpdate() {}

	static  public function updateDbFromFile($files) {
		if (is_array($files))
			foreach ($files as $file)
				dbOct::query(
					file_get_contents(OCT_UPDATE_DIR . $file)
				);
		else
			dbOct::query(
				file_get_contents(OCT_UPDATE_DIR . $files)
			);
	}
}