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
	public function path(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$dirArray = $this->directory->dirToArray(DOCUMENT_ROOT.$path);
			echo json_encode($dirArray);
		}else{
			echo("undefined input params");
		}
	}
	public function path_size(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$dirArray = $this->directory->dirToArrayV2(DOCUMENT_ROOT.$path);
			echo json_encode($dirArray);
		}else{
			echo("undefined input params");
		}
	}
	public function pathUrl(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$urlArray = $this->directory->dirToUrlArray(DOCUMENT_ROOT.$path, $path);
			echo json_encode($urlArray);
		}else{
			echo("undefined input params");
		}
	}
	public function pathLink(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$urlArray = $this->directory->dirToUrlArray(DOCUMENT_ROOT.$path, $path);
			$link = "";
			foreach ($urlArray as $index => $value) {
				$link .= '<a href="'.$value.'">'.$value.'</a><br>';
			}
			echo count($urlArray) ? $link : "undefined directory";
		}else{
			echo("undefined input params");
		}
	}
}
