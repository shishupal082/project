<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/assets/static/libs/bootstrap-v3.1.1.css">
    <title></title>
</head>
<body>
    <div class="container">
        <div><center><h2 id="title">Loading ...</h2></center></div>
        <div style="display:none"><input type="text" name="index-page-re-route" value="${indexPageReRoute}"/></div>
        <hr></hr>
        <div id="tableHtml"></div>
    </div>
<script type="text/javascript" src="/assets/static/js/stack.js?v=${appVersion}"></script>
<script type="text/javascript" src="/assets/static/libs/jquery-2.1.3.js"></script>

<script type="text/javascript">
$(document).ready(function() {
var indexPageReRoute = $("input[name=index-page-re-route]").val();
if (indexPageReRoute && indexPageReRoute.trim().length > 0) {
    $("title").html("Loading...");
    window.location.href = indexPageReRoute.trim();
} else {
    $("title").html("App Dashboard");
    $("#pageTitle").html("App Dashboard");
    var dataUrl = "/assets/data/available_resources.json?"+$S.getRequestId();
    $S.loadJsonData($, [dataUrl], function(response) {
        var tableHtml = "";
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
