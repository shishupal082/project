<?php
class Error extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->_name = "Error";
    }
    public function index(){
        $this->show_404();
    }
    public function show_404() {
        $this->load->view("page_404");
    }
}
