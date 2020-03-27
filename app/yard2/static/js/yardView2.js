(function($S, $YH) {
var YardInfo = [];
var CurrentYardComponent = {};
var CurrentYardInfo = {};
var CurrentYardId = "";
var md5sum = $S.getUniqueNumber();
var YardView = function(selector, context) {
    return new YardView.fn.init(selector, context);
};
YardView.fn = YardView.prototype = {
    constructor: YardView,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardView);

YardView.extend({
    getDisplayYardDominoBoundary: function() {
        return $YH.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YH.toggleDisplayYardDominoBoundary();
    }
});
var loadingStatus = {};
YardView.extend({
    checkDominoVerifyRequirement: function() {
        if (CurrentYardInfo && $S.isBooleanTrue(CurrentYardInfo["dominoVerify"], true)) {
            $YH.enableDomino();
        } else {
            $YH.disableDomino();
        }
        return false;
    },
    eachApiCallback: function(response, apiName) {
        switch(apiName) {
            case "yardData":
                if (response) {
                    for (var key in response) {
                        Object.assign(CurrentYardComponent, response[key]);
                    }
                }
            break;
        }
    },
    loadYardData: function(urls, callBack, apiName) {
        loadingStatus[apiName] = false;
        if (!$S.isArray(urls)) {
            urls = [];
        }
        for (var i = urls.length - 1; i >= 0; i--) {
            urls[i] = urls[i] + "?" + YardView.getMd5Sum(urls[i]);
        }
        $S.loadJsonData($, urls, YardView.eachApiCallback, function() {
            loadingStatus[apiName] = true;
            for (var key in loadingStatus) {
                if (loadingStatus[key]) {
                    continue;
                }
                return false;
            }
            callBack();
        }, apiName);
    }
});
function checkDominoDisplayStatus() {
    if (YardView.getDisplayYardDominoBoundary()) {
        $("#tableHtml").addClass("display-domino");
    } else {
        $("#tableHtml").removeClass("display-domino");
    }
    return true;
}
YardView.extend({
    getMd5Sum: function(filename) {
        return md5sum;
    }
});
YardView.extend({
    setYardsIds: function() {
        CurrentYardId = $YH.getUrlAttribute("id", "not-found");
        var yardIds = [], activeClass = "", url = "";
        yardIds.push([]);
        var yardIdOption = '<ul class="nav nav-tabs">';
        var validYardInfoCount = 0;
        for (var i = 0; i < YardInfo.length; i++) {
            var id = YardInfo[i]["yardId"];
            if (id == undefined) {
                continue;
            }
            if (CurrentYardId == "not-found") {
                if (validYardInfoCount==0) {
                    CurrentYardId = id;
                }
            }
            if (id == CurrentYardId) {
                activeClass = "active";
                url = "";
            } else {
                activeClass = "";
                url = 'href="/app/yard2/?id='+id+'"';
            }
            yardIdOption +=  '<li role="presentation" class="'+activeClass+'">';
            yardIdOption += '<a '+url+'>'+id+'</a></li>';
            validYardInfoCount++;
        }
        yardIdOption += '</ul>';
        $("#yardsIds").html(yardIdOption);
    }
});
YardView.extend({
    htmlLoadingComplete: function() {
        return;
        var containerStyle = "";
        switch(CurrentYardId) {
            case "yard":
                containerStyle = "width: 3290px;";
            break;
            case "yard-1":
                containerStyle = "width: 2790px;";
            break;
            case "yard-3":
                containerStyle = "width: 2780px;";
            break;
        }
        $(".container").attr("style", containerStyle);
        var tprNodeDefaultClass = ["evt", "btn", "tpr", "green", "red", "yellow", "blue", "circle", undefined, "pink", "slat"];
        tprNodeDefaultClass.push("open-point-left");
        tprNodeDefaultClass.push("open-point-right");
        $(".yard").addClass("debug");
        var allTpr = $(".tpr");
        for (var i = 0; i < allTpr.length; i++) {
            var tprNode = $(allTpr[i]);
            var tprParent = tprNode.parent();
            var tprNodeHtml = tprNode.val();
            var tprNodeCls = tprNode.attr("class").split(" ");
            for (var j = 0; j < tprNodeCls.length; j++) {
                if(tprNodeDefaultClass.indexOf(tprNodeCls[j]) < 0) {
                    tprNodeHtml += "<br>" + tprNodeCls[j];
                }
            }
            tprNode.html(tprNodeHtml);
            console.log("#"+tprNode.parent().attr("id") + "." + tprNode.attr("class") + ",val:" + tprNode.val());
        }
        var allSignal = $(".signal");
        for (var i = 0; i < allSignal.length; i++) {
            var signalNode = $(allSignal[i]);
            console.log("#"+signalNode.parent().attr("id") + "." + signalNode.attr("class") + ",id:" + signalNode.attr("id"));
        }
    }
});
YardView.extend({
    dataLoadedCallBack: function() {
        var requiredContentArr = CurrentYardInfo["requiredContent"];
        if (!$S.isArray(requiredContentArr)) {
            requiredContentArr = [];
        }
        var requiredContent = [];
        for (var i = 0; i < requiredContentArr.length; i++) {
            requiredContent.push(requiredContentArr[i]["value"]);
        }
        YardView.checkDominoVerifyRequirement();
        var tableContent = $YH.getYardTableContent(CurrentYardComponent, requiredContent);
        var table = $S.getTable(tableContent, CurrentYardId);
        // table.addColIndex(1);
        // table.addRowIndex(0);
        if (CurrentYardInfo.containerStyle) {
            $(".container").attr("style", CurrentYardInfo.containerStyle);
        } else {
            $(".container").removeAttr("style");
        }
        $("#tableHtml").addClass("table-html").html(table.getHtml());
        $("#help").removeClass("hide");
        checkDominoDisplayStatus();
        YardView.htmlLoadingComplete();
        return true;
    },
    loadYardById: function() {
        $("#tableHtml").html('<center>Loading...</center>');
        $("#help").addClass("hide");
        CurrentYardInfo = {};
        CurrentYardComponent = {};
        for (var i = 0; i < YardInfo.length; i++) {
            if (YardInfo[i]["yardId"] == CurrentYardId) {
                CurrentYardInfo = YardInfo[i];
                break;
            }
        }
        var urls = CurrentYardInfo["yardDetailsApis"];
        YardView.loadYardData(urls, YardView.dataLoadedCallBack, "yardData");
        return true;
    },
    documentLoaded: function() {
        var yardInfoUrl = "/app/yard2/static/json/yard-info.json"
        var urls = [yardInfoUrl+"?"+YardView.getMd5Sum(yardInfoUrl)];
        $S.loadJsonData($, urls, function(response) {
            YardInfo = response;
            YardView.setYardsIds();
            YardView.loadYardById();
        });
        $("#toggleDisplayDomino").on("click", function(e) {
            YardView.toggleDisplayYardDominoBoundary();
            checkDominoDisplayStatus();
        });
        return true;
    }
});

window.YardView = window.$YV = YardView;
})($S, $YH);
