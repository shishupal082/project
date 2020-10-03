<!DOCTYPE html>
<html ng-app="app">
<head>
	<meta charset="utf-8">
	<base href="<?php echo base_url();?>">
	<meta name="environment" content="<?php echo ENVIRONMENT; ?>">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>404 Page not found</title>
<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>
<style type="text/css">
* {
	font-family: sans-serif;
}
</style>
</head>
<body>
	<center>
		<div><h1>PHP Apps</h1></div>
		<div><a href="/">404 Page not found</a></div>
	</center>
</body>
</html>
