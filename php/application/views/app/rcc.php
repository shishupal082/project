<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="theme-color" content="#000000"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="Data Entry Description"/>
    <meta name="keywords" content="Data Entry Keywords"/>
    <meta name="author" content="Data Entry Author"/>

    <title>RCC App</title>
    <!-- It will use nodejs to load static file -->

    <link rel="stylesheet" type="text/css" href="/static/libs/bootstrap-v4.4.1.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/react-app.css"/>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

</head>
<body class="theme-grey">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"><center>Loading...</center></div>

<script type="text/javascript" src="/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript">
var GLOBAL = {
    baseApi: "",
    basepathname: "/app/rccv2",
    loginUserDetailsApi: "/api/login_user_details.json",
    forceLogin: true,
    projectHeading: "App Heading"
};
GLOBAL.JQ = $;
GLOBAL.isSinglePageApp = false;
GLOBAL.appControlApi = "/app/rcc/data/appControlData.json";
GLOBAL.loginUserDetailsApi = "/api/login_user_details.json";
// GLOBAL.udpServicePostApi = "/api/udp_service_response.json";
// GLOBAL.udpServicePostApi = "/api/call_tcp";

GLOBAL.gtag = gtag;
GLOBAL.appVersion = "v1.0.0";
window.GLOBAL = GLOBAL;
</script>
<script type="text/javascript" src="/reactjs/reactapp/dist-react-base-1.0.0/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-rcc-app/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-rcc-app/script3.js"></script>
</body>
</html>
