<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Server extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Server";
	}
	public function index(){
		phpinfo();
	}
}