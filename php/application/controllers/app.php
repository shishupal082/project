<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class App extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Api";
	}
	public function login() {
		$this->load->view("app/login");
	}
	public function loginV2() {
		$this->load->view("app/login_v2");
	}
	public function loginUser() {
		$obj = $_POST;
		log_message_prod("Submit login details : ".json_encode($obj));
		if(isset($obj["username"]) && $obj["username"] == EMAIL){
			$this->load->view("app/login_success");
			return;
		}
		if(!isset($obj["username"]) || !isset($obj["password"])){
			redirect("http://php.dev/app/login");
			return;
		}
		$this->load->view("app/login_failure");
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
	public function post() {
		log_message_prod("Post request: ".json_encode($_POST));
		echo(json_encode($_POST));
	}
	public function accounts() {
		$this->load->view("app/account.php");
	}
	public function accountsv2() {
		$this->load->view("app/accountv2.php");
	}
	public function monitorv2() {
		$this->load->view("app/monitor.php");
	}
}
