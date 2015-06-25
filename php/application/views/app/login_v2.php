<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Angular app</title>
	<link rel="stylesheet" href="/static/libs/bootstrap/bootstrap-v3.1.1/css/bootstrap.css" />
<style type="text/css">
.error{
	color : #f00;
}
</style>
</head>
<body  ng-app="app">
	<div><center>Welcome!</center></div>
	<ng-view></ng-view>
	<script type="text/javascript" src="/static/libs/angular/angular_1.3.14.js"></script>
	<script type="text/javascript" src="/static/libs/angular/angular-route_1.4.2.js"></script>
	<script src="/app/login_app/app_v2.js"></script>
</body>
</html>