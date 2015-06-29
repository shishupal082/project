<?php

Class Request {
	
	const FORMAT_JSON 	= 'JSON';
	const FORMAT_XML 	= 'XML';

    public function __construct() {
        $this->ci =& get_instance();
        $this->_name = "Request";
    }
    
    public function post($url, $arguments = array(), $header = array(), $format = self::FORMAT_JSON) {
	    	$log_string =  "{$this->_name} : POST : ".$url." arguments: ";
	    	if(is_string($arguments)){
	    		$log_string = $log_string.$arguments;
	    	}else{
	    		$log_string = $log_string.json_encode($arguments);
	    	}
	    	$log_string = $log_string." header: ".json_encode($header);
	    	log_message("INFO", $log_string);
	    	$ch = curl_init();
	    	curl_setopt($ch, CURLOPT_URL, $url);
	    	curl_setopt($ch, CURLOPT_POST, count($arguments));
	    	curl_setopt($ch, CURLOPT_POSTFIELDS, $arguments);
	    	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	    	$result_str = curl_exec($ch);
	    	curl_close($ch);
	    	log_message("INFO", "{$this->_name} : POST call RESULT: ".$result_str);
	    	return json_decode($result_str, true);
    }
    
	public function get($url, $header= array(), $format = self::FORMAT_JSON) {
        log_message("INFO", "{$this->_name} : GET : ".$url." header : ".json_encode($header));
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch,CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        $result_str = curl_exec($ch);
        curl_close($ch);
        log_message("INFO", "{$this->_name} : GET call RESULT : ".$result_str);
        return json_decode($result_str, true);
    }
}
