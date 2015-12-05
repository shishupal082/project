<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class JsonUtils{
	private $_name = "JsonUtils";
	public function __construct() {}
	public static function getJsonFile($file_path = ""){
        if(file_exists($file_path)){
            return json_decode(file_get_contents($file_path), TRUE);
        }
        return array();
    }
}