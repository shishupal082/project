<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper(array('form', 'url'));
    }
    public function index() {
        echo '<a href="/test/id/325">Click here for submit.</a>';
    }
    public function save_data() {
        $postRequest = array();
        if (isset($_POST["data"]) && is_string($_POST["data"])) {
            $postRequest["data"] = json_decode($_POST["data"]);
        } else {
            $postRequest["data"] = "null";
        }
        log_message("INFO", "Request Post: ".json_encode($postRequest));
        $fileName = "";
        $response = array("status" => "SUCCESS");
        echo json_encode($response);
    }
    public function is_file_exist() {
        log_message("INFO", "Request Post: ".json_encode($_POST));
        $relativePath = "uploaded_files/";
        $uploadPath   = DOCUMENT_ROOT."/".$relativePath;
        $response = array("status" => "FAILURE");
        if (isset($_POST["name"])) {
            $response["file_name"] = "/".$relativePath.$_POST["name"];
            if (file_exists($uploadPath.$_POST["name"])) {
                list($width, $height) = getimagesize($uploadPath.$_POST["name"]);
                $response["size"] = array($width, $height);
                $response["status"] = "SUCCESS";
            }
        }
        log_message("INFO", "Response: ".json_encode($response));
        echo json_encode($response);
    }
    public function do_upload() {
        $relativePath = "uploaded_files/";
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
