<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v3.1.1.css">
    <link rel="stylesheet" type="text/css" href="/assets/s17/css/style.css">
    <title>Yard-S17</title>
</head>
<body>
    <div class="container yard">
        <center><h2>Yard S17</h2></center>
        <table>
            <tr>
                <td>
                    <div class="">
                        <button value="S1-GN=1,ML-UN=1" class="evt signal_route_btn">S1-ML</button>
                        <button value="S1-GN=1,LL-UN=1" class="evt signal_route_btn">S1-LL</button>
                        <button value="S2-GN=1,2/3-UN=1" class="evt signal_route_btn">S2-2/3</button>
                        <button value="S3-GN=1,2/3-UN=1" class="evt signal_route_btn">S3-2/3</button>
                        <button value="S13-GN=1,DN-UN=1" class="evt signal_route_btn">S13-DN</button>
                        <button value="SH7-GN=1,SDG-UN=1" class="evt signal_route_btn">SH7-SDG</button>
                    </div><div class="">
                        <button value="S12-GN=1,ML-UN=1" class="evt signal_route_btn">S12-ML</button>
                        <button value="S12-GN=1,LL-UN=1" class="evt signal_route_btn">S12-LL</button>
                        <button value="S10-GN=1,10/11-UN=1" class="evt signal_route_btn">S10-10/11</button>
                        <button value="S11-GN=1,10/11-UN=1" class="evt signal_route_btn">S11-10/11</button>
                        <button value="S9-GN=1,UP-UN=1" class="evt signal_route_btn">S9-UP</button>
                        <button value="SH8-GN=1,LL-UN=1" class="evt signal_route_btn">SH8-LL</button>
                    </div>
                </td>
                <td>
                    <div>
                        <button value="EUYN=1,4-WN=1" class="evt signal_route_btn">EUYN-4WN</button>
                        <button value="EUYN=1,5-WN=1" class="evt signal_route_btn">EUYN-5WN</button>
                        <button value="EUYN=1,2/3-UN=1" class="evt signal_route_btn">EUYN-2/3UN</button>
                        <button value="EUYN=1,10/11-UN=1" class="evt signal_route_btn">EUYN-10/11UN</button>
                    </div>
                    <div>
                        <button value="OYN=1,ML-UN=1" class="evt signal_route_btn">OYN-ML</button>
                        <button value="OYN=1,LL-UN=1" class="evt signal_route_btn">OYN-LL</button>
                    </div>
                </td>
            </tr>
        </table>
        <hr></hr>
        <div id="tableHtml"><center>Loading...</center></div>
    </div>
    <div>
        <div id="changeValueData"></div>
    </div>
    <div class="container">
        <div id="timerCount"></div>
        <div id="currentValues"></div>
        <div id="help" class="help hide">
            <div>
                <ul>
                    <li>Single line, 2 road, 14 route station</li>
                    <li><button id="toggleDisplayDomino">Toggle Display Domino</button></li>
                </ul>
            </div>
        </div>
    </div>

<script type="text/javascript">
var UISetValueCountLimit = 800000;
var UIcommonPath = {
       "async-data": ["/assets/s17/json/async-data.json"],
       "partial-expressions-value": ["/assets/s17/json/partial-exp.json"],
       "possible-value": ["/assets/s17/json/possible-values.json",
                           "/assets/s17/json/possible-values-sequence.json",
                           "/assets/s17/json/possible-values-group.json"],
       "initial-value": ["/assets/s17/json/initial-value.json"],
       "expressions": ["/assets/s17/json/expressions-evt.json",
                       "/assets/s17/json/expressions-common.json",
                       "/assets/s17/json/expressions-sequence-1.json",
                       "/assets/s17/json/expressions-sequence-2.json",
                       "/assets/s17/json/expressions-ov.json",
                       "/assets/s17/json/expressions-sub-routes.json",
                       "/assets/s17/json/expressions-points-common.json",
                       "/assets/s17/json/expressions-point-4.json",
                       "/assets/s17/json/expressions-point-5.json",
                       "/assets/s17/json/expressions-point-6.json",
                       "/assets/s17/json/expressions-timer.json",
                       "/assets/s17/json/expressions-glow.json"]
   };
var UIyardUrl = "/assets/s17/json/yard.json";
</script>


<script type="text/javascript" src="/assets/static/js/stack.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/js/model.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>
<script type="text/javascript" src="/assets/static/js/yardHelper.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/js/yardApiModel.js?v=${appVersion}"></script>

<script type="text/javascript" src="/assets/s17/js/s17Model.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/s17/js/s17View.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/s17/js/script.js?v=${appVersion}"></script>
</body>
</html>
