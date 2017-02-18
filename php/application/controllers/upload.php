<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper(array('form', 'url'));
    }
    public function index() {
        echo '<a href="/test/id/325">Click here for submit.</a>';
    }
    public function do_upload() {
        $relativePath = "pvt/uploaded_files/";
        $config['upload_path']   = DOCUMENT_ROOT."/".$relativePath;
        $config['allowed_types'] = 'gif|jpg|png|jpeg|pdf';
        $config['max_size']      = 10000;
        $config['max_width']     = 10240;
        $config['max_height']    = 7680;
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('userfile')) {
            $error = array('error' => $this->upload->display_errors());
            echo json_encode($error, TRUE);
        }
        else {
            $data = array('upload_data' => $this->upload->data());
            if (isset($data["upload_data"]["orig_name"])) {
                redirect(base_url().$relativePath.$data["upload_data"]["orig_name"]);
            } else {
                echo json_encode($data);
            }
        }
    }
}