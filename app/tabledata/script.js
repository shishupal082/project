$(document).ready(function() {

var myChart;

var apiName = "", changeValueIndex = "";

function createChart(config) {
    if (myChart) {
        myChart.destroy();
    }
    var type = config.type ? config.type : "bar";
    var label = config.label ? config.label : "Bar Chart";
    var convasId = config.convasId ? config.convasId : "Bar Chart";
    var data = config.data ? config.data : [12, 19, 3, 5, 2, 3];
    var labels = config.labels ? config.labels : ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

    var backgroundColor = [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ];
    var borderColor = [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ];
    for (var i = 6; i < data.length; i++) {
        backgroundColor.push(backgroundColor[i%6]);
        borderColor.push(borderColor[i%6]);
    }
    var ctx = document.getElementById(convasId).getContext('2d');
    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function handleChange() {
    var currentData = $TDM.getDataByIndex(changeValueIndex, apiName);
    if (currentData.label) {
        $("#convasDiv").removeClass("hide");
        var config = {};
        config.type = "bar";
        config.label = currentData.label;
        config.convasId = "barChart";
        config.data = currentData.data;
        config.labels = currentData.labels;
        createChart(config);
        return 1;
    } else {
        if (myChart) {
            myChart.destroy();
        }
        $("#convasDiv").addClass("hide");
    }
    return 0;
}

function createHtml(tableData) {
    var tableHtml = "";
    var table = $S.getTable(tableData, "dashboard");
    table.addRowIndex(0);
    table.updateTableContent(0,0,"<b>S.No.</b>");
    table.updateTableContent(table.getContent().length-1,0,"");
    tableHtml += table.getHtml();
    $("#tableHtml").html(tableHtml);
    $("#tableHtml table").addClass("table table-bordered table-striped");
    return 1;
}

function displayDropDown() {
    if (changeValueIndex == "all") {
        $("#selectItems2").removeClass("hide");
    } else {
        $("#selectItems2").addClass("hide");
    }
}

function renderDropDown() {
    var selectHtml = "", attr = "";
    selectHtml = selectHtml + "<option value='-1'>Select ...</option>";
    var tableIndexData = $TDM.getTableIndexData();
    for (var i = 0; i < tableIndexData.length; i++) {
        selectHtml = selectHtml + "<option value='"+i+"' "+ attr +">" + tableIndexData[i] + "</option>";
    }

    selectHtml = selectHtml + "<option value='all'>All States</option>";
    $("#selectItems").html(selectHtml);

    $("#selectItems").on("change", function(e) {
        changeValueIndex = $(e.currentTarget).val();
        if ($S.isNumeric(changeValueIndex)) {
            changeValueIndex = changeValueIndex*1;
        }
        displayDropDown();
        handleChange();
    });

    var apiNames = $TDM.getApiNames();
    selectHtml = "";
    for (var i = 0; i < apiNames.length; i++) {
        if (apiName == apiNames[i]) {
            attr = "selected='selected'";
        } else {
            attr = "";
        }
        selectHtml = selectHtml + "<option value='"+apiNames[i]+"' "+ attr +">" + apiNames[i] + "</option>";
    }
    $("#selectItems2").html(selectHtml);
    $("#selectItems2").on("change", function(e) {
        apiName = $(e.currentTarget).val();
        handleChange();
    });
    return 1;
}

$TDM.documentLoaded(function() {
    var tableData = $TDM.getRenderTableData();
    createHtml(tableData);
    renderDropDown();
    displayDropDown();
    var apiNames = $TDM.getApiNames();
    apiName = apiNames.length ? apiNames[0] : "";
    $("#selectItems").removeClass("hide");
    $(".links").removeClass("hide");
    $(".switch").removeClass("hide");
});

});
