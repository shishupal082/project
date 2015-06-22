<?php
class App extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Api";
	}
	public function login() {
		$this->load->view("app/header");
		$this->load->view("app/login");
		$this->load->view("app/footer");
	}
	public function loginGetUser() {
		$data = array("status" => "SUCCESS", "name" => "username", "data" => $_POST);
		echo json_encode($data);
	}
	public function feederV1() {
		$this->load->view("app/F1feeder/f1feeder");
	}
	public function feederV2() {
		$this->load->view("app/F1feeder/f1feederV2");
	}
	public function multiple_view() {
		$this->load->view("app/multiple_view");
	}
}