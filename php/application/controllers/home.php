<?php
class Home extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Home";
	}
	public function _remap() {
		$this->load->view("home.html");
	}
}