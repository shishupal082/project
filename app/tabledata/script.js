$(document).ready(function() {

var myChart;

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

function handleChange(changeValueIndex) {
    var currentData = $TDM.getDataByIndex(changeValueIndex);
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
    tableHtml += table.getHtml();
    $("#tableHtml").html(tableHtml);
    $("#tableHtml table").addClass("table table-bordered table-striped");
    return 1;
}

function renderDropDown() {
    var selectHtml = "";
    selectHtml = selectHtml + "<option value='-1'>Select ...</option>";
    var tableIndexData = $TDM.getTableIndexData();
    for (var i = 0; i < tableIndexData.length; i++) {
        selectHtml = selectHtml + "<option value='"+i+"'>" + tableIndexData[i] + "</option>";
    }
    $("#selectItems").html(selectHtml);
    return 1;
}

function registerEvt() {
    $("#selectItems").on("change", function(e) {
        var changeValueIndex = $(e.currentTarget).val();
        if ($S.isNumeric(changeValueIndex)) {
            changeValueIndex = changeValueIndex*1;
            handleChange(changeValueIndex);
        }
    });
}
$TDM.documentLoaded(function() {
    var tableData = $TDM.getRenderTableData();
    createHtml(tableData);
    renderDropDown();
    registerEvt();
    $(".links").removeClass("hide");
});

});
