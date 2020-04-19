<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v3.1.1.css">
    <title>Pdf Dashboard</title>
</head>
<body>
    <div class="container">
        <div><center><h2 id="pageTitle">PDF Dashboard</h2></center></div>
        <hr></hr>
        <div id="tableHtml"></div>
    </div>
<script type="text/javascript" src="/assets/static/js/stack.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>

<script type="text/javascript">
$(document).ready(function() {

function generateResponse(response, res) {
    if ($S.isObject(response) && response.resultType == "FOLDER") {
        return generateResponse(response.scanResults, res);
    } else if ($S.isObject(response) && response.resultType == "FILE") {
        return res.push([response.name, '<a href="/read/' + response.name + '">' + response.name + '</a>']);
    } else if ($S.isArray(response)) {
        for (var i=0; i<response.length; i++) {
            generateResponse(response[i], res);
        }
    }
    return res;
}

var dataUrl = "/scan/pdf-dir?"+$S.getRequestId();
$S.loadJsonData($, [dataUrl], function(response) {
    var res = [];
    generateResponse(response, res);
    response = res;
    var tableHtml = "";
    var table = $S.getTable(response, "dashboard");
    table.addColIndex(1);
    table.addRowIndex(0);
    table.updateTableContent(0,0,"");
    tableHtml += table.getHtml();

    $("#tableHtml").html(tableHtml);
    $("#tableHtml table").addClass("table table-bordered");
});


});
</script>
</body>
</html>
