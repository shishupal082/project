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
        $config['allowed_types'] = 'gif|jpg|png|jpeg|pdf|iso|zip|rar';
        $config['max_size']      = 0; //In kb, 0 for no limit
        $config['max_width']     = 10240; // In pixel
        $config['max_height']    = 7680; // In pixel

        if (isset($_FILES['userfile'])) {
            log_message("INFO", "File upload start: ".json_encode($_FILES['userfile']));
        } else {
            log_message("INFO", "Invalid file upload attribute.");
            log_message("INFO", "Redirecting to --> ".base_url());
            redirect(base_url());
            return 0;
        }
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('userfile')) {
            log_message("INFO", "Unable to upload file.");
            $error = array('error' => $this->upload->display_errors());
            echo json_encode($error, TRUE);
        }
        else {
            log_message("INFO", "File upload complete.");
            $data = array('upload_data' => $this->upload->data());
            if (isset($data["upload_data"]["orig_name"])) {
                $redirectPath = base_url().$relativePath.$data["upload_data"]["orig_name"];
                log_message("INFO", "Redirecting to --> ".$redirectPath);
                redirect($redirectPath);
            } else {
                log_message("INFO", json_encode($data));
                echo json_encode($data);
            }
        }
    }
}