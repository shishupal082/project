<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once 'php/libs/DirectoryLibs.php';
class Dir extends CI_Controller {
	private $_name = "Dir";
	public function __construct() {
		parent::__construct();
		$this->directory = new DirectoryLibs();
	}
	public function index(){
		echo "Dir Controller";
	}
	public function img(){
		$dir = $this->directory->dirToArray(DOCUMENT_ROOT."/static/img/");
		echo json_encode($dir);
	}
	public function imgUrl(){
		$urlArray = $this->directory->dirToUrlArray(DOCUMENT_ROOT."/static/img/", "/static/img/");
		echo json_encode($urlArray);
	}
	public function imgLink(){
		$urlArray = $this->directory->dirToUrlArray(DOCUMENT_ROOT."/static/img/", "/static/img/");
		$link = "";
		foreach ($urlArray as $index => $value) {
			$link .= '<a href="'.$value.'">'.$value.'</a><br>';
		}
		echo $link;
	}
}
