<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Monitoring Application</title>
    <link rel="stylesheet" type="text/css" href="/static/libs/bootstrap-v4.4.1.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="/app/account/static/css/react-app.css"/>
    <link rel="stylesheet" type="text/css" href="/app/monitor/static/css/monitor-style.css"/>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

</head>
<body class="theme-grey">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div class="d-none" style="display: none;">
      <input type="hidden" style="display: none;" name="headingJson" id="headingJson" value='[{"tag":"span","text":"Login as: "},{"tag":"span.b","name":"pageHeading.username","text":""},{"tag":"span","text":" |  "},{"tag":"span","text":{"tag":"a","name":"pageHeading.dashboardLink","href":"/dashboard","text":"Dashboard"}},{"tag":"span","text":" |  "},{"tag":"span","text":{"tag":"a","name":"pageHeading.dataDisplayLink","href":"/app/data-display","text":"Data Display"}},{"tag":"span","text":" |  "},{"tag":"span","text":{"tag":"a","name":"pageHeading.logoutLink","href":"/logout","text":"Logout"}}]'/>
      <input type="hidden" style="display: none;" name="uploadFileInstruction" id="uploadFileInstruction"
        value="(Supported type: pdf,jpeg,jpg,png,csv and txt, max size < 10MB)"/>
      <input type="hidden" style="display: none;" name="uploadTextInstruction" id="uploadTextInstruction" value=""/>
    </div>
    <div id="root"><center>Loading...</center></div>
<script type="text/javascript" src="/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript">

var GLOBAL = {
    baseApi: "",
    basepathname: "/app/monitorv2",
    loginUserDetailsApi: "/api/get_login_user_details",
    usernamesApi: "/api/get_related_users_data_v2",
    appControlDataPath: "/app/monitor/static/data/",
    forceLogin: false
};



GLOBAL.validAppControl = ["appControlDataTeam01",
              "appControlDataTeam02","appControlDataTeam03",
              "appControlDataTeam04","appControlDataTeam05"];

GLOBAL.appControlApi = "/pvt/app-data/monitor/appControlData01.json";

GLOBAL.addTextFilenamePattern = "YYYY/-/MM/-/DD/-/hh/-/mm/-device-report.csv";
GLOBAL.headingPattern = "device";

GLOBAL.validTeamAppControl = ["appControlDataTeam01",
              "appControlDataTeam02","appControlDataTeam03",
              "appControlDataTeam04","appControlDataTeam05","appControlDataTeam06"];


GLOBAL.headingJson = document.getElementById("headingJson").value;
GLOBAL.uploadFileInstruction = document.getElementById("uploadFileInstruction").value;
GLOBAL.uploadTextInstruction = document.getElementById("uploadTextInstruction").value;


GLOBAL.gtag = gtag;
GLOBAL.appVersion = "1.0.1";
GLOBAL.JQ = $;
window.GLOBAL = GLOBAL;

</script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoringv2-app/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoringv2-app/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoringv2-app/script3.js"></script>
</body>
</html>
