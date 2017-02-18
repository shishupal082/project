<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Page extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Page";
	}
	public function index(){
		$data = array();
		$this->load->view("reactView", array("data" => $data));
	}
	public function home(){
		$data = array();
		$this->load->view("reactView", array("data" => $data));
	}
	public function about(){
		$data = array();
		$this->load->view("reactView", array("data" => $data));
	}
	public function contact(){
		$data = array();
		$this->load->view("reactView", array("data" => $data));
	}
}