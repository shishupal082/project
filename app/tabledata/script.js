$(document).ready(function() {

var filename = "2020-03-27";

var apiUrl = "";

apiUrl = "/app/tabledata/data/"+filename+".json";

function createHtml(response) {
    var tableHtml = "";
    var table = $S.getTable(response, "dashboard");
    tableHtml += table.getHtml();

    $("#tableHtml").html(tableHtml);
    $("#tableHtml table").addClass("table table-bordered table-striped");
}
apiUrl += "?"+$S.getRequestId();

$S.loadJsonData($, [apiUrl], function(response) {
    var data = [];
    var bst = $S.getBST();
    for (var key in response) {
        var currentNode = bst.insertData(bst, response[key]);
        currentNode.item = {key: key, value: response[key]};
    }
    var bstArr = bst.getInOrder(bst, []);
    var totalCount = 0;
    var index = 1;
    data.push(["Index","<b>State/UT</b>", filename]);
    for (var i = bstArr.length-1; i >= 0; i--) {
        if (bstArr[i].item) {
            data.push([index++, bstArr[i].item.key, bstArr[i].item.value]);
            totalCount += bstArr[i].item.value;
        }
    }
    data.push(["", "<b>Total:</b>", totalCount]);
    createHtml(data);
});

});