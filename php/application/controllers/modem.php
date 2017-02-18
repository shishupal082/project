<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Modem extends CI_Controller {
    public function __construct() {
        parent::__construct();
    }
    public function index() {
        $ip =   "192.168.1.1";
        $command = "ping -t 2 $ip";
        exec($command, $output, $status);
        log_message("INFO", $command);
        log_message("INFO", json_encode($output));
        echo json_encode($output);
    }
}