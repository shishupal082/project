<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// include_once "php/libs/helper/DbHelper.php";
class TodoModel{
	protected $_name = "TodoModel";
	private $table = "todo";
	private $isConnected = FALSE;
	public function __construct($params = null){}
	private function connectDb($self){
		if($this->isConnected){
			return TRUE;
		}
		$self->ci->load->database();
		$this->isConnected = TRUE;
	}
	public function get($self, $filter = array()){
		$data = array();
		$this->connectDb($self);
		$self->ci->db->select('*');
		if(isset($filter["user"])){
			$self->ci->db->where('user', $filter["user"]);
		}
		if(isset($filter["deleted"])){
			$self->ci->db->where('deleted', $filter["deleted"]);
		}
		if(isset($filter["todo_id"])){
			$self->ci->db->where('todo_id', $filter["todo_id"]);
		}
		if(isset($filter["status"])){
			$self->ci->db->where('status', $filter["status"]);
		}
		if(isset($filter["limit"])){
			$self->ci->db->limit('limit', $filter["limit"]);
		}
		$data = $self->ci->db->get($this->table)->result_array();
		log_message_prod("$this->_name : get : last_query : ".$self->ci->db->last_query()." : response : ".json_encode($data));
		return $data;
	}
	private function getNextTodoId($db){
		$maxTododId = 1;
		$db->select_max("todo_id");
		$result = $db->get($this->table)->result_array();
		log_message_prod("$this->_name : getNextTodoId : last_query : ".$db->last_query()." : response : ".json_encode($result));
		if(count($result)){
			$maxTododId = intval($result[0]["todo_id"])+1;
		}
		return $maxTododId;
	}
	private function insertIntoDb($self, $params = array()){
		$status = "FAILURE";
		$this->connectDb($self);
		$db = $self->ci->db;
		$data = array();
		foreach ($params as $key => $value) {
			if(in_array($key, array("todo_id", "todo_name", "user", "deleted", "status"))){
				$data[$key] = $value;
			}
		}
		$insertStatus = $db->insert($this->table, $data);
		if($insertStatus){
			$status = "SUCCESS";
		}
		log_message_prod("$this->_name : insertIntoDb : last_query : ".$db->last_query());
		return $status;
	}
	public function insert($self, $params = array()){
		$status = "FAILURE";
		$this->connectDb($self);
		$db = $self->ci->db;
		$data["todo_id"] = $this->getNextTodoId($db);
		foreach ($params as $key => $value) {
			if(in_array($key, array("todo_name", "user", "deleted", "status"))){
				$data[$key] = $value;
			}
		}
		$insertStatus = $this->insertIntoDb($self, $data);
		if($insertStatus){
			$status = "SUCCESS";
		}
		return $status;
	}
	private function getLatestTransaction($db, $params = array()){
		$sql = "select * from todo where todo_id=".$params["todo_id"]." order by created_at desc limit 1";
		$result = $db->query($sql)->result_array();
		log_message_prod("$this->_name : getLatestTransaction : last_query : ".$db->last_query()." : ".json_encode($result));
		return $result;
	}
	public function update($self, $params = array()){
		$status = "FAILURE";
		$this->connectDb($self);
		$db = $self->ci->db;
		$currentTodoData = $this->getLatestTransaction($db, array("todo_id" => $params["todo_id"]));
		if(!count($currentTodoData)){
			log_message_prod("$this->_name : update : todo not found to update.");
			return $status;
		}
		$db->where('todo_id', $params["todo_id"]);
		$db->update($this->table, array("deleted" => 1));
		log_message_prod("$this->_name : update : last_query : ".$db->last_query());
		foreach ($params as $key => $value) {
			if(!in_array($key, array("created_at", "updated_at"))){
				if(is_string($value) || is_numeric($value)){
					$currentTodoData[0][$key] = $value;
				}
			}
		}
		$insertStatus = $this->insertIntoDb($self, $currentTodoData[0]);
		if($insertStatus){
			$status = "SUCCESS";
		}
		return $status;
	}
}