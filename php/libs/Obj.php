<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once "php/libs/utils/JsonUtils.php";
abstract class Obj{
	private $staticFilesJsonData = array();
	private $staticFilesJsonDataLoaded = FALSE;
	protected $_name = "Obj";
	public function __construct() {}
	private function loadStaticFilesJsonData(){
		$this->staticFilesJsonData = JsonUtils::getJsonFile(DATAPATH."static_files.json");
		$this->staticFilesJsonDataLoaded = TRUE;
		return TRUE;
	}
	public function getCssFilePath($name = ""){
		if(!is_string($name)){
			return "";
		}
		if(!$this->staticFilesJsonDataLoaded){
			$this->loadStaticFilesJsonData();
		}
        $cssFiles = isset($this->staticFilesJsonData["css"]) ? $this->staticFilesJsonData["css"] : array();
        return isset($cssFiles[$name]) ? $cssFiles[$name] : "";
	}
}