<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
// include_once "php/libs/helper/DbHelper.php";
class TodoModel{
    protected $_name = "TodoModel";
    private $table = "todo";
    private $history_table = "todo_history";
    private $isConnected = FALSE;
    private $enabledUpdateField = array("todo_name", "user", "status", "type");
    private $selectField = "id, todo_name, user, status, type";
    public function __construct($params = null){}
    private function connectDb($self){
        if($this->isConnected){
            return TRUE;
        }
        $self->ci->load->database();
        $this->isConnected = TRUE;
    }
    private function connectDbV2($controller){
        if($this->isConnected){
            return TRUE;
        }
        $controller->load->database();
        $this->isConnected = TRUE;
    }
    public function get($self, $filter = array()){
        $data = array();
        $this->connectDbV2($self->ci);
        $self->ci->db->select($this->selectField);
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
    // private function getNextTodoId($db){
    //     $maxTododId = 1;
    //     $db->select_max("todo_id");
    //     $result = $db->get($this->table)->result_array();
    //     log_message_prod("$this->_name : getNextTodoId : last_query : ".$db->last_query()." : response : ".json_encode($result));
    //     if(count($result)){
    //         $maxTododId = intval($result[0]["todo_id"])+1;
    //     }
    //     return $maxTododId;
    // }
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
    // public function update($self, $params = array()){
    //     $status = "FAILURE";
    //     $this->connectDb($self);
    //     $db = $self->ci->db;
    //     $currentTodoData = $this->getLatestTransaction($db, array("todo_id" => $params["todo_id"]));
    //     if(!count($currentTodoData)){
    //         log_message_prod("$this->_name : update : todo not found to update.");
    //         return $status;
    //     }
    //     $db->where('todo_id', $params["todo_id"]);
    //     $db->update($this->table, array("deleted" => 1));
    //     log_message_prod("$this->_name : update : last_query : ".$db->last_query());
    //     foreach ($params as $key => $value) {
    //         if(!in_array($key, array("created_at", "updated_at"))){
    //             if(is_string($value) || is_numeric($value)){
    //                 $currentTodoData[0][$key] = $value;
    //             }
    //         }
    //     }
    //     $insertStatus = $this->insertIntoDb($self, $currentTodoData[0]);
    //     if($insertStatus){
    //         $status = "SUCCESS";
    //     }
    //     return $status;
    // }
    // private function storeHistory($db, $todo_id, $oldData = array(), $newData = array()){
    //     if(count($oldData)){
    //         $oldData = $oldData[0];
    //         foreach ($newData as $key => $value) {
    //             if(in_array($key, $this->enabledUpdateField)){
    //                 if(is_string($value) || is_numeric($value)){
    //                     $old_value = isset($oldData[$key]) ? $oldData[$key] : "";
    //                     if($old_value == $value){
    //                         continue;
    //                     }
    //                     $data = array(
    //                         'todo_id' => $todo_id,
    //                         'field_name' => $key,
    //                         'old_value' => $old_value,
    //                         'new_value' => $value
    //                     );
    //                     $db->insert('todo_history', $data);
    //                 }
    //             }
    //         }
    //         return TRUE;
    //     }
    //     return FALSE;
    // }
    // public function updateV2($self, $params = array()){
    //     $todo_id = $params["todo_id"];
    //     $this->connectDb($self);
    //     $db = $self->ci->db;
    //     $data = array();

    //     foreach ($params as $key => $value) {
    //         if(in_array($key, $this->enabledUpdateField)){
    //             if(is_string($value) || is_numeric($value)){
    //                 $data[$key] = $value;
    //             }
    //         }
    //     }

    //     if(count($data)){
    //         $db->select($this->selectField);
    //         $db->where('todo_id', $todo_id);
    //         $query = $db->get($this->table);
    //         $this->storeHistory($db, $todo_id, $query->result_array(), $data);
    //     }

    //     $db->where('todo_id', $todo_id);
    //     $updateStatus = $db->update($this->table, $data);
    //     $status = $updateStatus ? "SUCCESS" : "FAILURE";;
    //     return $status;
    // }
    private function insertIntoHistory($controller, $params = array()){
        $logStr = "$this->_name : insertIntoHistory";
        $logStr .= " : data to update : ".json_encode($params);
        $data = array("todo_id", "todo_name", "user", "status", "type", "deleted");
        $insertData = array();
        foreach ($data as $index => $key) {
            if(isset($params[$key])){
                $insertData[$key] = $params[$key];
            }
        }
        $logStr .= " : insertData : ".json_encode($insertData);
        if(!count($insertData)){
            $logStr .= " : invalid data for insert into history_table";
            log_message_prod($logStr);
            return FALSE;
        }
        $this->connectDbV2($controller);
        $db = $controller->db;
        $insertStatus = $db->insert($this->history_table, $insertData);
        $logStr .= " : last_query : ".$db->last_query();
        $logStr .= " : insertStatus : ".json_encode($insertStatus);
        if($insertStatus){
            $logStr .= " : row_id : ".(string)$db->insert_id();
        }
        log_message_prod($logStr);
        return $insertStatus;
    }
    public function updateV3($controller, $params = array()){
        $logStr = "$this->_name : updateV3";
        $todo_id = isset($params["id"]) ? $params["id"] : "0";
        $this->connectDbV2($controller);
        $db = $controller->db;
        $data = array();
        $logStr .= " : request for update : ".json_encode($params);
        foreach ($params as $key => $value) {
            if(in_array($key, $this->enabledUpdateField)){
                if(is_string($value) || is_numeric($value)){
                    $data[$key] = $value;
                }
            }
        }
        $logStr .= " : data to be update : ".json_encode($data). " for todo_id : ".$todo_id;
        log_message_prod($logStr);
        if(count($data)){
            $db->select($this->selectField);
            $db->where('id', $todo_id);
            $query = $db->get($this->table);
            $oldData = $query->result_array();
            if(count($oldData)){
                $oldData[0]["todo_id"] = $todo_id;
                $this->insertIntoHistory($controller, $oldData[0]);
            }else{
                $logStr .= " : invalid oldData : ".json_encode($oldData);
                $status = "FAILURE";
                return $status;
            }
        }
        $db->where('id', $todo_id);
        $updateStatus = $db->update($this->table, $data);
        $status = $updateStatus ? "SUCCESS" : "FAILURE";
        return $status;
    }
}