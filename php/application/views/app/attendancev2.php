<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="theme-color" content="#000000"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="Data Entry Description"/>
    <meta name="keywords" content="Data Entry Keywords"/>
    <meta name="author" content="Data Entry Author"/>

    <title>Attendance App</title>
    <!-- It will use nodejs to load static file -->
    <link rel="stylesheet" type="text/css" href="/static/libs/bootstrap-v4.4.1.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="/app/account/static/css/react-app.css"/>
    <link rel="stylesheet" type="text/css" href="/app/attendance/static/css/attendance-style.css"/>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

</head>
<body class="theme-grey">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div class="d-none"><input type="hidden" id="headingJson" name="headingJson" value='[{"tag":"span","text":"Login as: "},{"tag":"span.b","name":"pageHeading.username","text":""},{"tag":"span","text":" |  "},{"tag":"span","text":{"tag":"a","name":"pageHeading.monitoringLink","href":"/app/attendancev2","text":"View Data"}}]'></div>
    <div id="root"><center>Loading...</center></div>

<script type="text/javascript" src="/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript">

var GLOBAL = {
    baseApi: "",
    basepathname: "/app/attendancev2",
    loginUserDetailsApi: "/api/login_user_details.json",
    usernamesApi: "/api/get_related_users_data_v2",
    appControlDataPath: "/pvt/app-data/attendance/",
    forceLogin: true
};

GLOBAL.validAppControl = ["appControlTeam14"];

// GLOBAL.appControlApi = "/roleAttendanceUser/json/attendance/appControlData.json";

GLOBAL.headingJson = document.getElementById("headingJson").value;

GLOBAL.gtag = gtag;
GLOBAL.appVersion = "v1.0.1";
GLOBAL.JQ = $;
window.GLOBAL = GLOBAL;
</script>
<script type="text/javascript" src="/reactjs/reactapp/dist-react-base-1.0.0/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-attendance-app/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-react-base-1.0.0/script3.js"></script>
</body>

</html>
