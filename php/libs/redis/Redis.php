<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
include_once "php/libs/redis/predis/src/Autoloader.php";
class Redis {
	private $_name;
	public function __construct(){
		$this->_name = "Redis";
		Predis\Autoloader::register();
	}
	private function getClient(){
		$client = new Predis\Client();
		return $client;
	}
	public function get($key){
		if(!is_string($key) || $key == ""){
			log_message_prod($this->_name." : get : invalid key.");
			return FALSE;
		}
		$client = $this->getClient();
		return $client->get($key);
	}
	public function set($key, $value){
		$client = $this->getClient();
		return $client->set($key, $value);
	}
}