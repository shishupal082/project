<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v3.1.1.css">
    <title>FTP App</title>
</head>
<body>
    <div class="container">
        <div><center><h2 id="pageTitle">Loading ...</h2></center></div>
        <div style="display:none"><input type="text" name="index-page-re-route" value="${indexPageReRoute}"/></div>
        <hr></hr>
        <div id="tableHtml"></div>
    </div>
<script type="text/javascript" src="/assets/static/js/stack.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>

<script type="text/javascript">
$(document).ready(function() {
function formateData(response) {
    var res = [], item = [];
    if ($S.isArray(response)) {
        for (var i=0; i<response.length; i++) {
            item = [];
            if (response[i].length >= 2) {
                item.push(response[i][1]);
                item.push('<a href="' + response[i][0] + '">'+response[i][1]+'</a>');
                item.push(response[i][0]);
            }
            res.push(item);
        }
    }
    return res;
}
function isValidUrl(configReRoutePath) {
    if (typeof configReRoutePath === "string") {
        configReRoutePath = configReRoutePath.trim();
        if (configReRoutePath === "/") {
            return false;
        }
        if (configReRoutePath.length > 0 && configReRoutePath.match("//") === null) {
            return true;
        }
    }
    return false;
}

var indexPageReRoute = $("input[name=index-page-re-route]").val();
if (isValidUrl(indexPageReRoute)) {
    window.location.href = indexPageReRoute.trim();
} else {
    $("title").html("FTP App Dashboard");
    $("#pageTitle").html("FTP App Dashboard");
    var dataUrl = "/assets/data/available_resource.json?"+$S.getRequestId();
    $S.loadJsonData($, [dataUrl], function(response) {
        var tableHtml = "";
        response = formateData(response);
        var table = $S.getTable(response, "dashboard");
        table.addColIndex(1);
        table.addRowIndex(0);
        table.updateTableContent(0,0,"");
        tableHtml += table.getHtml();

        $("#tableHtml").html(tableHtml);
        $("#tableHtml table").addClass("table table-bordered");
    });
}

});
</script>
</body>
</html>
