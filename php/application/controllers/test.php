<?php
include_once "php/libs/test/TestObj.php";
class Test extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Test";
	}
	public function index(){
	    include_once("links.html");
	}
	public function id($id = ""){
		$Test = new TestObj($this, $id);
		$this->load->view("globalView", array("Test" => $Test));
	}
}