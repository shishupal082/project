<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class TestInfoObj{
	var $html = "";
}
class TestPageObj{}

class Staticlibs {
	public function __construct($params=null){
		date_default_timezone_set(TIME_ZONE);
		$this->ci =&get_instance();
		$this->ci->load->library('datalibs');

		$static = STATICPATH;
		$this->static = $static;

		$pvt_path = PVTPATH;

		$less["feo_test"] = $static.'css/feo_test.less';
		$less["index-less"] = $static.'css/index.less';
		$less["docs"] = $static.'css/feo_patman.less';

		$less["main"] = $static.'css/main/main.less';
		$less["13_login"] = $static.'css/main/13_login.less';
		$less["base"] = $static.'css/components/base.less';

		$this->mapper = array();
		$this->js = array(); //Available js files in static_files.json
		$this->css = array(); //Available css files in static_files.json
		$this->online_js = array(); //Available online link in static_files.json
		$this->js_files = array(); //Required js files from static_files.json
		$this->css_files = array(); //Required css files
		$this->init();
	}
	private function init(){
		$filename = DATAPATH."test-pages.json";
		$filedata = $this->ci->datalibs->get_file_data($filename);
		foreach ($filedata as $key => $value) {
    		$this->mapper[$key] = isset($value->html) ? $value->html : "";
    		$this->js_files[$key] = isset($value->js) ? $value->js : array();
    		$this->css_files[$key] = isset($value->css) ? $value->css : array();
    	}
		$filename = DATAPATH."static_files.json";
		$filedata = $this->ci->datalibs->get_file_data($filename);
		$js = $filedata->js;
		foreach ($js as $key => $value) {
			$this->js[$key] = $value;
		}
		$css = $filedata->css;
		foreach ($css as $key => $value) {
			$this->css[$key] = $value;
		}
		$online_js = $filedata->online_js;
		foreach ($online_js as $key => $value) {
			$this->online_js[$key] = $value;
		}
	}
	public function get_all_html_page(){
		return $this->mapper;
	}
    public function get_html_page($test_id){
    	$mapper = $this->mapper;    	
		if(!isset($mapper[$test_id])){
			return $mapper["not-found"];
		}
		return $mapper[$test_id];
    }
    public function get_file_link($test_id, $type){
    	$files = array();
    	switch ($type) {
    		case 'js':
    			$files = $this->js_files;
    		break;
    		case 'css':
    			$files = $this->css_files;
    		break;
    		default:
			break;
    	}
		if(!isset($files[$test_id])){
			return array();
		}
		return $files[$test_id];
    }
	public function get_js_file_v2($test_id){
		$js_files = $this->js_files;
		$js_files_path = array();
		if(!isset($js_files[$test_id])){
			return array();
		}
		foreach($js_files[$test_id] as $index => $value) {
			$req_file = explode(' ', $value);
			if(count($req_file) > 1){
				$value = $req_file[1];
				if($req_file[0] == "online_js"){
					array_push($js_files_path, $this->online_js[$value]);
				}
			}else{
				$value = $req_file[0];
				array_push($js_files_path, "/static/".$this->js[$value]);
			}
		}
		return $js_files_path;
    }
    public function get_css_file_v2($test_id){
		$css_files = $this->css_files;
		$css_files_path = array();
		if(!isset($css_files[$test_id])){
			return array();
		}
		foreach($css_files[$test_id] as $index => $value) {
			array_push($css_files_path, "/static/".$this->css[$value]);
		}
		return $css_files_path;
    }
    public function get_css_file($test_id){
    	$css = $this->css;

		$files["02"] = array($css["bootstrap"]);
		$files["303"] = array($css["bootstrap"]);
		$files["310"] = array($css["bootstrap-v3.1.1"]);
		$files["316"] = array($css["bootstrap"]);
		$files["317"] = array($css["jquery_ui_css"]);
		$files["338"] = array($css["bootstrap"]);
		$files["322"] = array($css["bootstrap"],
						$css["jquery-ui-22_css"],
						$css["jquery-ui-22_custom_css"]);
		$files["342"] = array($css["bootstrap"]);
		$files["332"] = array($css["jquery_ui_css_1.8.16"]);
		$files["348"] = array($css["jquery_timepicker_p"]);
		$files["352"] = array($css["bootstrap"]);
		$files["356"] = array($css["bootstrap"]);
		$files["359"] = array($css["bootstrap"]);
		$files["exams"] = array($css["bootstrap"]);
		if(!isset($files[$test_id])){
			return array();
		}
		return $files[$test_id];
    }
    public function get_file($file_name, $file_type){
		$file = "";
		switch ($file_type) {
			case 'js':
				$js = $this->js;
				$file = isset($js[$file_name]) ? $js[$file_name] : 'not-found';
			break;
			case 'css':
				$css = get_css(array($file_name));
				$file = $css[0];
			break;
			default:
			break;
		}
		return $file;
	}
	public function get_all_fileinfo(){
		header('Content-type: application/json');
		$testPage = new TestPageObj;
		foreach ($this->mapper as $key => $value) {
			$testInfo = new TestInfoObj;
			$testInfo->html = $value;
			if(count($this->get_file_link($key, "js"))){
				$testInfo->js = $this->get_file_link($key, "js");
			}
			if(count($this->get_file_link($key, "css"))){
				$testInfo->css = $this->get_file_link($key, "css");
			}
			$testPage->$key = $testInfo;
		}
		return $testPage;
	}
}
