<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
|	example.com/class/method/id/
| 	URL normally follow this pattern:
|
| Please see the user guide for complete details:
|	http://codeigniter.com/user_guide/general/routing.html
|	
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|	$route['default_controller'] = 'welcome';
|	$route['404_override'] = 'errors/page_missing';
*/

$route['default_controller'] = "home";
$route['404_override'] = 'error';

$route['services/ip-address'] = "services/ip_address";
$route['services/ip'] = "services/ip_address";
$route['services/check-internet'] = "services/check_internet";
$route['services/internet'] = "services/check_internet";

/* End of file routes.php */
/* Location: ./application/config/routes.php */