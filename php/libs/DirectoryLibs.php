<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once 'php/libs/Libs.php';
class DirectoryLibs extends Libs{
	public function __construct() {
		parent::__construct();
		$this->urlArray = array();
	}
	public function dirToArray($dir) { 
		$result = array();
		if(!file_exists($dir)){
			return $result;
		}
		$cdir = scandir($dir);
		foreach ($cdir as $key => $value) {
			if (!in_array($value,array(".",".."))) {
				if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
					$result[$value] = $this->dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
				} else {
					$result[] = $value; 
				}
			}
		}
		return $result;
	}
	private function createUrlArray($dirToArray, $dir){
		if(!is_array($dirToArray)){
			if(is_string($dirToArray)){
				array_push($this->urlArray, $dir.$dirToArray);
			}
			return TRUE;
		}
		foreach ($dirToArray as $key => $value) {
			if(is_string($value)){
				array_push($this->urlArray, $dir.$value);
			}else{
				$this->createUrlArray($value, $dir.$key."/");
			}
		}
		return TRUE;
	}
	public function dirToUrlArray($dir, $relativePath) { 
		$dirToArray = $this->dirToArray($dir);
		$this->createUrlArray($dirToArray, $relativePath);
		return $this->urlArray;
	}
}