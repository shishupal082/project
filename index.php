<?php
define('CONFIG_FILE', $_SERVER['ENVIRONMENT_FILE']);
define('ENVIRONMENT', $_SERVER['ENVIRONMENT']);
define('DOCUMENT_ROOT', $_SERVER['DOCUMENT_ROOT']);
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

$env_config = parse_ini_file(CONFIG_FILE, true);
define('EMAIL',$env_config['USER']['email']);
define('PASSWORD',$env_config['USER']['password']);
define('PHONE',$env_config['USER']['phone']);
define('LOG_PATH', $env_config['USER']['log_path']);
define('DB_HOST_NAME', $env_config['DB']["hostname"]);
define('DB_USER_NAME', $env_config['DB']["username"]);
define('DB_PASSWORD', $env_config['DB']["password"]);
define('DB_DATABASE', $env_config['DB']["database"]);
define('RECAPTCHA_SITE_KEY', $env_config['RECAPTCHA']["site_key"]);
define('RECAPTCHA_SECRET_KEY', $env_config['RECAPTCHA']["secret_key"]);
define('PASSWORDENCYPTIONKEY', $env_config['PASSWORD']["key"]);
define('PASSWORDENCYPTIONBIT', $env_config['PASSWORD']["bit"]);

define('FACEBOOKAPPID', $env_config['FACEBOOKAPI']["app_id"]);
define('FACEBOOKSECRETKEY', $env_config['FACEBOOKAPI']["secret_key"]);
define('FACEBOOKAPIVERSION', $env_config['FACEBOOKAPI']["api_version"]);

define('MONGO_HOST_PORT', $env_config['MONGODB']["host_port"]);
define('MONGO_DATABASE', $env_config['MONGODB']["database"]);

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