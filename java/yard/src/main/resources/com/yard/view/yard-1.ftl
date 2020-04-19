<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v3.1.1.css">
    <link rel="stylesheet" type="text/css" href="/assets/s17/css/style.css">
    <title>Yard 1</title>
</head>
<body>
    <div class="container yard">
        <center><h2>Yard 1</h2></center>
        <table>
            <tr>
                <td>
                    <div>
                        <button value="S1-GNR=1,MT-UNR=1" class="evt signal_route_btn">S1-MT</button>
                        <button value="S1-GNR=1,LT-UNR=1" class="evt signal_route_btn">S1-LT</button>
                        <button value="S1-GNR=1,LAT-UNR=1" class="evt signal_route_btn">S1-LAT</button>
                        <button value="S2-GNR=1,9-UNR=1" class="evt signal_route_btn">S2-9</button>
                        <button value="S3-GNR=1,9-UNR=1" class="evt signal_route_btn">S3-9</button>
                        <button value="S4-GNR=1,4-UNR=1" class="evt signal_route_btn">S4-4</button>
                    </div><div>
                        <button value="S13-GNR=1,MT-UNR=1" class="evt signal_route_btn">S13-MT</button>
                        <button value="S13-GNR=1,LT-UNR=1" class="evt signal_route_btn">S13-LT</button>
                        <button value="S13-GNR=1,LAT-UNR=1" class="evt signal_route_btn">S13-LAT</button>
                        <button value="S14-GNR=1,8-UNR=1" class="evt signal_route_btn">S14-8</button>
                        <button value="S15-GNR=1,8-UNR=1" class="evt signal_route_btn">S15-8</button>
                        <button value="S16-GNR=1,16-UNR=1" class="evt signal_route_btn">S16-16</button>
                    </div>
                </td>
                <td><div><span class="alert-danger badge" id="alarm"></span></div></td>
            </tr>
        </table>
        <hr></hr>
        <div id="tableHtml"></div>
        <div id="changeValueData"></div>
        <div id="timerCount"></div>
        <div id="currentValues"></div>
        <div id="help" class="help hide">
            <div>
                <ul>
                    <li>Single line, 2 road, 12 route station</li>
                    <li><button id="toggleDisplayDomino">Toggle Display Domino</button></li>
                </ul>
            </div>
            <div class="hide">
                <ul>
                    <li>No concept of OVSR</li>
                </ul>
            </div>
        </div>
    </div>

<script type="text/javascript">
var UISetValueCountLimit = 800000;
var UIYardUrl = "/assets/yard1/json/yard.json";
</script>



<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>

<script type="text/javascript" src="/assets/static/js/stack.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/js/model.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/js/yardApiModel.js?v=${appVersion}"></script>

<script type="text/javascript" src="/assets/yard1/js/yard1ComponentModel.js"></script>
<script type="text/javascript" src="/assets/yard1/js/yard1PointModel.js"></script>
<script type="text/javascript" src="/assets/yard1/js/yard1Controller.js"></script>
<script type="text/javascript" src="/assets/yard1/js/yard1Script.js"></script>


</body>
</html>
