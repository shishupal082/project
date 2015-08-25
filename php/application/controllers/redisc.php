<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

include_once "php/libs/redis/Redis.php";

class Redisc extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->_name = "Redis";
	}
	public function index() {
		$data = array("key" => "value");
		$redis = new Redis();
		// $client->set('foo', 'bar');
		// $value = $client->get('foo');
		$data["key"] = $redis->get("foo");
		echo json_encode($data);
	}
}