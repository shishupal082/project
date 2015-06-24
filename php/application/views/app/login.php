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
<body>
	<div><center>Welcome!</center></div>
	<div class="container" ng-app="app">
		<h2>Login Page</h2>
		<div ng-controller="LoginController">
			<form novalidate action="/app/loginUser" method="POST" name="form"  ng-submit="Login($event)">
				<table>
					<tr>
						<td>Username :</td>
						<td><input type="text" ng-model="user.username" name="username" value="" /></td>
						<td class="error">{{errors.username}}</td>
					</tr>
					<tr>
						<td>Password :</td>
						<td><input type="password" ng-model="user.password" autocomplete="off" name="password" /></td>
						<td class="error">{{errors.password}}</td>
					</tr>
					<tr>
						<td></td>
						<td>
							<input type="checkbox" id="remember_me" name="remember_me" />
							<label for="remember_me">Remember me</label></td>
						<td></td>
					</tr>
					<tr>
						<td></td>
						<td><input type="submit" value="Login" /></td>
						<td></td>
					</tr>
				</table>
			</form>
		</div>
	</div>
	<script type="text/javascript" src="/static/libs/angular/angular_1.3.14.js"></script>
	<script src="/app/login_app/app.js"></script>
</body>
</html>