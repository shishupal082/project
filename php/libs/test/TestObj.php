<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once "php/libs/utils/JsonUtils.php";
include_once "php/libs/Obj.php";
class TestObj extends Obj{
    private $id = 0;
    public $html = "";
    public $isValidId = FALSE;
    public $htmlFilePath = "";
    public $jsFilesPath = array();
    public $cssFilesPath = array();
    public function __construct($controller, $id = 0) {
        $this->_name = "TestObj";
        $this->controller = $controller;
        $this->id = $id;
        $this->loadDependencies();
    }
    private function loadDependencies(){
        $allData = JsonUtils::getJsonFile(DATAPATH."test-pages.json");
        if(isset($allData[$this->id])){
            $data = $allData[$this->id];
            $this->htmlFilePath = isset($data["html"]) ? $data["html"] : "";
            $js = isset($data["js"]) ? $data["js"] : array();
            $css = isset($data["css"]) ? $data["css"] : array();
            $this->loadJsDependencies($js);
            $this->loadCssDependencies($css);
            $this->isValidId = TRUE;
            return TRUE;
        }
        return FALSE;
    }
    private function loadJsDependencies($js = array()){
        if(!is_array($js)){
            return FALSE;
        }
        $allData = JsonUtils::getJsonFile(DATAPATH."static_files.json");
        $jsFiles = $allData["js"];
        $onlineJsFiles = $allData["online_js"];
        $cssFiles = $allData["css"];
        foreach($js as $index => $value){
            if(!is_string($value)){
                continue;
            }
            $strFilePath = explode(" ", $value);
            if(count($strFilePath) > 1){
                if($strFilePath[0] == "online_js"){
                    if(isset($onlineJsFiles[$strFilePath[1]])){
                        array_push($this->jsFilesPath, $onlineJsFiles[$strFilePath[1]]);
                    }
                }
            }else if(isset($jsFiles[$strFilePath[0]])){
                array_push($this->jsFilesPath, STATICPATH.$jsFiles[$strFilePath[0]]);
            }else{
                continue;
            }
        }
        return TRUE;
    }
    private function loadCssDependencies($css = array()){
        if(!is_array($css)){
            return FALSE;
        }
        foreach($css as $index => $value){
            if(!is_string($value)){
                continue;
            }
            $cssFile = $this->getCssFilePath($value);
            if(strlen($cssFile)){
                array_push($this->cssFilesPath, $cssFile);
            }
        }
        return TRUE;
    }
    private function getTagResponseForTestIds(){
        $allData = JsonUtils::getJsonFile(DATAPATH."test-pages.json");
        $data = array();
        foreach ($allData as $testId => $object) {
            $url = "/test/id/".$testId;
            $title = isset($object["html"]) ? $object["html"] : "";
            $text = $testId;
            array_push($data, array("url" => $url, "title" => $title, "text" => $text));
        }
        return $data;
    }
    public function getDefaultHtml(){
        $html = '<div class="container"><ul class="nav nav-pills">';
        $data = $this->getTagResponseForTestIds();
        foreach ($data as $index => $anchor) {
            $html .= '<li role="presentation"><a href="'.$anchor["url"].'" title="'.$anchor["title"].'">'.$anchor["text"].'</a></li>';
        }
        $html .= '</ul></div>';
        return $html;
    }
}