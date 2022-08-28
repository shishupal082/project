<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Accounting Application V3</title>
    <link rel="stylesheet" type="text/css" href="/static/libs/bootstrap-v4.4.1.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/react-app.css"/>
    <link rel="stylesheet" type="text/css" href="/app/auth/auth-style.css"/>
    <link rel="stylesheet" type="text/css" href="/app/account/static/css/account.css"/>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

</head>
<body class="theme-grey">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
<script type="text/javascript">
var GLOBAL = {
    baseApi: "",
    basepathname: "/app/accountsv3",
    projectHeading: "Accounting",
    appControlDataPath: "/project-tracking/json/",
    forceLogin: false,
    enabledPages: ["all"]
};

GLOBAL.appControlDataApi = "/pvt/app-data/account/userControlV3.json";
GLOBAL.loginUserDetailsApi = "/api/login_user_details.json";
GLOBAL.validAppControl = [];
GLOBAL.gtag = gtag;
GLOBAL.appVersion = "v1.0.1";
window.GLOBAL = GLOBAL;
</script>
<script type="text/javascript" src="/reactjs/reactapp/dist-react-base-1.0.0/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-account-app-2021-oct/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-account-app-2021-oct/script3.js"></script>
</body>
</html>
