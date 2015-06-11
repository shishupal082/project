<?php

define('ENVIRONMENT', $_SERVER['ENVIRONMENT']);
switch (ENVIRONMENT){
	case 'development':
		error_reporting(E_ALL^E_DEPRECATED);
	break;
	case 'testing':
	case 'production':
		error_reporting(0);
	break;
	default:
		exit('The application environment is not set correctly.');
	break;
}

$system_path = 'php/system';
$application_folder = 'php/application';

// Set the current directory correctly for CLI requests
if (defined('STDIN')){
	chdir(dirname(__FILE__));
}

if (realpath($system_path) !== FALSE){
	$system_path = realpath($system_path).'/';
}

// ensure there's a trailing slash
$system_path = rtrim($system_path, '/').'/';

// Is the system path correct?
if (!is_dir($system_path))
{
	exit("Your system folder path does not appear to be set correctly. Please open the following file and correct this: ".pathinfo(__FILE__, PATHINFO_BASENAME));
}
// The name of THIS file
define('SELF', pathinfo(__FILE__, PATHINFO_BASENAME));

// The PHP file extension
// this global constant is deprecated.
define('EXT', '.php');

// Path to the system folder
define('BASEPATH', str_replace("\\", "/", $system_path));

// Path to the front controller (this file)
define('FCPATH', str_replace(SELF, '', __FILE__));

// Name of the "system folder"
define('SYSDIR', trim(strrchr(trim(BASEPATH, '/'), '/'), '/'));


// The path to the "application" folder
if (!is_dir($application_folder)){
	exit("Your system folder path does not appear to be set correctly. Please open the following file and correct this: ".pathinfo(__FILE__, PATHINFO_BASENAME));
}
define('APPPATH', $application_folder.'/');

$template_folder = 'templates';
$templates_folder = 'templates';
$static_folder = '/static';
$php_path = 'php';

$data_folder = 'data';
$pvt_folder = 'pvt';

define('PHPPATH', $php_path.'/');
define('TEMPLATEPATH', $template_folder.'/');
define('TEMPLATESPATH', $templates_folder.'/');
define('STATICPATH', $static_folder.'/');
define('DATAPATH',$data_folder.'/');
define('PVTPATH',$pvt_folder.'/');

require_once BASEPATH.'core/CodeIgniter.php';

/* End of file index.php */
/* Location: ./index.php */