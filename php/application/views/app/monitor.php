<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Monitoring Application</title>
    <link rel="stylesheet" type="text/css" href="/static/libs/bootstrap-v4.4.1.css"/>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css"/>
    <link rel="stylesheet" type="text/css" href="/app/account/static/css/react-app.css">
    <link rel="stylesheet" type="text/css" href="/app/monitoring/static/css/style.css"/>

<?php echo $this->load->view("analytics_tracking_php.dev.php", true);?>

</head>
<body class="theme-grey">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
<script type="text/javascript">
var GLOBAL = {
    baseapi: "",
    basepathname: "/app/monitor",
    appControlApi: ["/app/monitoring/static/data/appControlData.json"]
};
GLOBAL.gtag = gtag;
GLOBAL.appVersion = "1.0.0";
window.GLOBAL = GLOBAL;
</script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoring-app/script1.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoring-app/script2.js"></script>
<script type="text/javascript" src="/reactjs/reactapp/dist-monitoring-app/script3.js"></script>
</body>
</html>
