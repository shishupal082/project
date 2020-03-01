<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once 'php/libs/DirectoryLibs.php';
class Dir extends CI_Controller {
	private $_name = "Dir";
	private $basePath = DOCUMENT_ROOT;
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
			$basePath = isset($_GET["base_path"]) ? $_GET["base_path"] : $this->basePath;
			$dirArray = $this->directory->dirToArray($basePath.$path);
			echo json_encode($dirArray);
		}else{
			echo("undefined input params");
		}
	}
	public function path_size(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$basePath = isset($_GET["base_path"]) ? $_GET["base_path"] : $this->basePath;
			$dirArray = $this->directory->dirToArrayV2($basePath.$path);
			echo json_encode($dirArray);
		}else{
			echo("undefined input params");
		}
	}
	public function pathUrl(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$basePath = isset($_GET["base_path"]) ? $_GET["base_path"] : $this->basePath;
			$urlArray = $this->directory->dirToUrlArray($basePath.$path, $path);
			echo json_encode($urlArray);
		}else{
			echo("undefined input params");
		}
	}
	public function pathLink(){
		if(isset($_GET["path"]) && is_string($_GET["path"]) && strlen($_GET["path"])){
			$path = $_GET["path"];
			$basePath = isset($_GET["base_path"]) ? $_GET["base_path"] : $this->basePath;
			$isRecursive = isset($_GET["recursive"]) && $_GET["recursive"] == "false" ? FALSE : TRUE;
			$urlArray = $this->directory->dirToUrlArray($basePath.$path, $path, $isRecursive);
			$link = "";
			foreach ($urlArray as $index => $value) {
				$link .= '<a href="'.$value.'">'.$value.'</a><br>';
			}
			echo count($urlArray) ? $link : "undefined directory";
		}else{
			echo("undefined input params");
		}
	}
	public function duplicate(){
		$urlArray = $this->directory->duplicateFileV2();
		$link = "";
		foreach ($urlArray as $index => $value) {
			$link .= '<a href="'.$value.'">'.$value.'</a><br>';
		}
		echo count($urlArray) ? $link : "undefined directory";
	}
}
