<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once "php/libs/todo/TodoModel.php";
class Todolibs {
	private $_name = "Todolibs";
	public function __construct($params=null){
		$this->ci =&get_instance();
		$this->todoModel = new TodoModel();
	}
	public function get($object = array()){
		$data = array();
		$filter = array();
		$object["user"] = EMAIL;
		if(isset($object["user"])){
			$filter["user"] = $object["user"];
		}else{
			log_message_prod("$this->_name : get : user not found.");
			return $data;
		}
		if(isset($object["todo_id"])){
			$filter["todo_id"] = $object["todo_id"];
		}
		if(isset($object["status"])){
			$filter["status"] = $object["status"];
		}
		if(isset($object["deleted"])){
			$filter["deleted"] = $object["deleted"] ? 1 : 0;
		}
		$filter["deleted"] = 0;
		$data = $this->todoModel->get($this, $filter);
		return $data;
	}
	public function insert($object = array()){
		$data = array("status" => "FAILURE");
		$params = array();
		$object["user"] = EMAIL;
		if(isset($object["user"])){
			$params["user"] = $object["user"];
		}else{
			log_message_prod("$this->_name : get : user not found.");
			return $data;
		}
		if(isset($object["todo_name"])){
			$params["todo_name"] = $object["todo_name"];
		}else{
			log_message_prod("$this->_name : get : todo_name not found.");
			return $data;
		}
		if(isset($object["status"])){
			$params["status"] = $object["status"];
		}else{
			$params["status"] = "pending";
		}
		if(isset($object["deleted"])){
			$params["deleted"] = $object["deleted"] ? 1 : 0;
		}
		$status = $this->todoModel->insert($this, $params);
		$data = array("status" => $status);
		return $data;
	}
	public function update($object = array()){
		$data = array("status" => "FAILURE");
		$params = array();
		$object["user"] = EMAIL;
		if(isset($object["user"])){
			$params["user"] = $object["user"];
		}else{
			log_message_prod("$this->_name : update : user not found.");
			return $data;
		}
		if(isset($object["todo_id"])){
			$params["todo_id"] = $object["todo_id"];
		}else{
			log_message_prod("$this->_name : update : todo_id not found.");
			return $data;
		}
		if(!isset($object["todo_name"]) && !isset($object["status"]) && !isset($object["deleted"])){
			log_message_prod("$this->_name : update : invalid value to update.");
			return $data;
		}
		if(isset($object["todo_name"])){
			$params["todo_name"] = $object["todo_name"];
		}
		if(isset($object["status"])){
			$params["status"] = $object["status"];
		}
		if(isset($object["deleted"])){
			$params["deleted"] = $object["deleted"] ? 1 : 0;
		}
		$status = $this->todoModel->updateV2($this, $params);
		$data = array("status" => $status);
		return $data;
	}
}