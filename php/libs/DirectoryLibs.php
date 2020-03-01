<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
include_once 'php/libs/Libs.php';
class DirectoryLibs extends Libs{
	public function __construct() {
		parent::__construct();
		$this->urlArray = array();
		$this->recRes = array();
	}
	public function dirToArray($dir, $recursive = TRUE) { 
		$result = array();
		// if(!file_exists($dir)){
		// 	return $result;
		// }
		if (!is_dir($dir)) {
			log_message_prod("Given path is not directory : ".$dir);
			return $result;
		}
		$cdir = scandir($dir);
		log_message_prod("Scandir : ".$dir);
		foreach ($cdir as $index => $value) {
			if (!in_array($value,array(".",".."))) {
				if (is_dir($dir.DIRECTORY_SEPARATOR.$value)) {
					if ($recursive === TRUE) {
						$result[$value] = $this->dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
					} else {
						$result[] = $value;
					}
				} else {
					$result[] = $value;
				}
			}
		}
		log_message_prod($result); // Intentionally not using json_encode
		return $result;
	}
	private function getFolderSize($dir) {
		$size = 0;
	    foreach (glob(rtrim($dir, '/').'/*', GLOB_NOSORT) as $each) {
	        $size += is_file($each) ? filesize($each) : $this->getFolderSize($each);
	    }
	    return $size;
	}
	public function dirToArrayV2($dir) {
		$result = array();
		if(!file_exists($dir)){
			return $result;
		}
		$cdir = scandir($dir);
		log_message_prod("Scandir : ".$dir);
		foreach ($cdir as $index => $value) {
			if (!in_array($value, array(".","..",".DS_Store"))) {
				$tempValue = array("unit" => "bytes");
				if (is_dir($dir.DIRECTORY_SEPARATOR.$value)) {
					$tempValue["size"] = $this->getFolderSize($dir.$value);
					$tempValue["type"] = "directory";
				} else {
					$tempValue["size"] = filesize($dir.$value);
					$tempValue["type"] = "file";
				}
				if ($tempValue["size"] > 1000*1000) {
					$tempValue["size"] = (($tempValue["size"]/1000)/1000);
					$tempValue["unit"] = "mb";
				} else if($tempValue["size"] > 1000) {
					$tempValue["size"] = ($tempValue["size"]/1000);
					$tempValue["unit"] = "kb";
				}
				$tempValue["name"] = $value;
				array_push($result, $tempValue);
			}
		}
		return $result;
	}
	private function getUrl($currentPath, $recursive) {
		if ($recursive) {
			return $currentPath;
		}
		$url = "/dir/pathLink?recursive=false&path=".$currentPath;
		return $url;
	}
	private function getUrlV2($currentPath, $recursive) {
		$currentPath = str_replace(" ","\ ",$currentPath);
		if ($recursive) {
			return $currentPath;
		}
		$url = "/dir/pathLink?recursive=false&path=".$currentPath;
		return $url;
	}
	private function createUrlArray($dirToArray, $dir, $recursive = FALSE){
		if(!is_array($dirToArray)){
			if(is_string($dirToArray)){
				array_push($this->urlArray, $this->getUrl($dir.$dirToArray, $recursive));
			}
			return TRUE;
		}
		foreach ($dirToArray as $key => $value) {
			if(is_string($value)){
				array_push($this->urlArray, $this->getUrl($dir.$value, $recursive));
			}else{
				$this->createUrlArray($value, $dir.$key."/", $recursive);
			}
		}
		return TRUE;
	}
	public function dirToUrlArray($dir, $relativePath, $recursive = TRUE) {
		if ($recursive) {
			$dirToArray = $this->dirToArray($dir, $recursive);
			$this->createUrlArray($dirToArray, $relativePath, $recursive);
			return $this->urlArray;
		}
		$urlArray = array();
		$dirToArrayV2 = $this->dirToArrayV2($dir, $recursive);
		foreach ($dirToArrayV2 as $index => $value) {
			if ($value["type"] == "file") {
				array_push($urlArray, $relativePath.$value["name"]);
			} else {
				array_push($urlArray, $this->getUrl($relativePath.$value["name"]."/", $recursive));
			}
		}
		return $urlArray;
	}
	private function createPathArray($fileNameArray, $dDir, $sDir, $recursive = FALSE){
		if(!is_array($fileNameArray)){
			if(is_string($fileNameArray)){
				array_push($this->urlArray, 
					$this->getUrlV2($dDir.$fileNameArray, $recursive));
			}
			return TRUE;
		}
		foreach ($fileNameArray as $key => $value) {
			if(is_string($value)){
				array_push($this->urlArray, $this->getUrlV2($dDir.$value, $recursive));
			} else {
				if (gettype($key) == "integer") {
					$this->createPathArray($value, $dDir, $sDir, $recursive);
				} else {
					$this->createPathArray($value, $dDir.$key."/", $sDir, $recursive);
				}
			}
		}
		return TRUE;
	}
	private function generateResult($sourceFiles, $destinFiles) {
		foreach ($sourceFiles as $key => $value) {
			if (is_string($value)) {
				if(in_array($value, $destinFiles)) {
				} else {
					$this->recRes[$key] = $value;
				}
			} else {
				$this->recRes[$key] = $value;
			}
		}
		return $this->recRes;
	}
	public function duplicateFileV2() {
		$sourceDir = "/pvt/org";
		$destinationDir = "/pvt/recovered";
		$sourceFiles = $this->dirToArray(DOCUMENT_ROOT.$sourceDir, TRUE);
		$destinFiles = $this->dirToArray(DOCUMENT_ROOT.$destinationDir, TRUE);
		log_message_prod("sourceFiles:");
		log_message_prod($sourceFiles);
		log_message_prod("destinFiles:");
		log_message_prod($destinFiles);
		$fileNotInDestination = $this->generateResult($sourceFiles, $destinFiles);
		log_message_prod("fileNotInDestination:");
		log_message_prod($fileNotInDestination);
		$this->createPathArray($fileNotInDestination, $destinationDir."/", $sourceDir."/", TRUE);
		return $this->urlArray;
	}
	public function duplicateFile() {
		$sourceDir = "/pvt/org";
		$destinationDir = "/pvt/recovered";
		$sourceFiles = $this->dirToArray(DOCUMENT_ROOT.$sourceDir, FALSE);
		$destinFiles = $this->dirToArray(DOCUMENT_ROOT.$destinationDir, FALSE);
		$fileNotInDestination = array();
		foreach ($sourceFiles as $key => $value) {
			if(in_array($value, $destinFiles)) {
			} else {
				array_push($fileNotInDestination, $value);
			}
		}
		$this->createUrlArray($fileNotInDestination, $destinationDir."/", TRUE);
		return $this->urlArray;
	}
}
