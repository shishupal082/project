<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="Web site created using create-react-app"/>
    <title>FTP Application</title>
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v4.4.1.css">
    <link rel="stylesheet" type="text/css" href="/app/ftp/css/style.css">
</head>
<body class="theme-grey">
<noscript>You need to enable JavaScript to run this app.</noscript>
<input type="hidden" style="display: none;" name="pageData" id="pageData"
       value="page=${pageName},,appVersion=${appVersion},is_login=${isLogin},username=${userName},is_login_user_admin=${isLoginUserAdmin}"/>
<div id="root"></div>
<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript">
var GLOBAL = {
    baseapi: "",
    basepathname: "",
    JQ: $,
    isReactEnv: false
};
GLOBAL.currentPageData = document.getElementById("pageData").value;
window.GLOBAL = GLOBAL;
</script>

<script type="text/javascript" src="/reactjs/reactapp/dist-ftp-app/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-ftp-app/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-ftp-app/script3.js"></script>
</body>
</html>
