<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
function log_message_prod($str = ""){
	if(is_string($str)){
		log_message("ERROR", RequestId." : ".$str);
	}else{
		log_message("ERROR", RequestId." : Invalid params trying to log.".json_encode($str));
	}
}
function get_host_name($source = ""){
	$host = "php.dev";
	if(isset($_SERVER["HTTP_HOST"])){
		$host = $_SERVER["HTTP_HOST"];
	}
	return $host;
}
function get_custom_base_url($protocol = true) {
	return "//".get_host_name();
}