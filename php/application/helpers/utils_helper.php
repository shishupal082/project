<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
function log_message_prod($str = ""){
	if(is_string($str)){
		log_message("ERROR", RequestId." : ".$str);
	}else{
		log_message("ERROR", RequestId." : Invalid params trying to log.".json_encode($str));
	}
}