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
      <input type="hidden" style="display: none;" name="uploadFileInstruction" id="uploadFileInstruction"
        value="(Supported type: pdf,jpeg,jpg,png,csv and txt, max size < 10MB)"/>
      <input type="hidden" style="display: none;" name="uploadTextInstruction" id="uploadTextInstruction" value=""/>
    </div>
    <div id="root"><center>Loading...</center></div>
<script type="text/javascript" src="/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript">
var GLOBAL = {
    baseapi: "",
    appControlDataPath: "/app/monitor/static/data/appControlData_",
    basepathname: "/app/monitorv2",
    forceLogin: false
};

// GLOBAL.appControlApi = ["/app/monitor/static/data/appControlData.json"];

GLOBAL.appControlApi = ["/pvt/app-data/monitor/appControlData01.json"];

GLOBAL.addTextFilenamePattern = "YYYY/-/MM/-/DD/-/hh/-/mm/-device-report.csv";
GLOBAL.headingPattern = "device";

GLOBAL.validTeamAppControl = ["appControlDataTeam01",
              "appControlDataTeam02","appControlDataTeam03",
              "appControlDataTeam04","appControlDataTeam05","appControlDataTeam06"];


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
