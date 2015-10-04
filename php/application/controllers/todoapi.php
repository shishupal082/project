<?php
class Todoapi extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Todoapi";
		$this->load->library("todolibs");
	}
	public function index() {
		$data = array("method" => "uknown");
		echo json_encode($data);
	}
	public function get(){
		log_message_prod($this->_name." : GET call start : ".json_encode($_GET));
		$data = $this->todolibs->get($_GET);
		log_message_prod($this->_name." : GET call end : ".json_encode($data));
		echo json_encode($data);
	}
	public function insert(){
		log_message_prod($this->_name." : INSERT call start : ".json_encode($_GET));
		$data = $this->todolibs->insert($_GET);
		log_message_prod($this->_name." : INSERT call end : ".json_encode($data));
		echo json_encode($data);
	}
	public function update(){
		log_message_prod($this->_name." : UPDATE call start : ".json_encode($_GET));
		$data = $this->todolibs->update($_GET);
		log_message_prod($this->_name." : UPDATE call end : ".json_encode($data));
		echo json_encode($data);
	}
}