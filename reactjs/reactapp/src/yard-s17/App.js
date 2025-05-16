import React from 'react';
import YardContainer from './component/YardContainer';
import YardControl from './component/YardControl';
import ChangeValueLog from './component/ChangeValueLog';
import $$ from './common/global';
import Api from './common/Api';
import $S from "../interface/stack.js";
import $M from "../interface/model.js";
import $YApiModel from "../interface/yardApiModel.js";

var baseapi = $$.baseapi;
var UICommonPath = $$.UICommonPath;

var appHeading = $$.appHeading;
var appInfo = $$.appInfo;
var requiredContent = $$.requiredContent;

$M.changeSetValueCountLimit($$.UISetValueCountLimit);

// $M.disableChangeLogValueStatus();
$M.enableChangeValueDataLogging();

if ($S.isBooleanTrue($$.onSetValueRecheckAll)) {
    $M.extend({
        "setValueChangedCallback": function(name, oldValue, newValue) {
            return $M.reCheckAllValues();
        }
    });
}

for (var key in UICommonPath) {
    for (var i = 0; i < UICommonPath[key].length; i++) {
        UICommonPath[key][i] = baseapi + UICommonPath[key][i];
    }
}

$YApiModel.setApisPath(UICommonPath);
$YApiModel.setAjaxApiCall(Api.getAjaxApiCallMethod());

var logData = [];

function clearLogData() {
    var changeValueData = $M.getAllChangeValueData();
    if (changeValueData["all"].length > 0) {
        logData.push($M.getAllChangeValueData());
    }
    $M.resetChangeValueData();
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            yardControlData: [],
            dominoDisplayEnable: false,
            yardTableContent: null,
            key: null
        };
        this.onTprClick = this.onTprClick.bind(this);
        this.onControlClick = this.onControlClick.bind(this);
        this.toggleDisplayDomino = this.toggleDisplayDomino.bind(this);
    }
    handleControlClick(value) {
        var self = this;
        var valueArr = value.split(",");
        var finalValue = {};
        var temp;
        for (var i = 0; i < valueArr.length; i++) {
            var valItem = valueArr[i].split("=");
            if (valItem.length === 2) {
                finalValue[valItem[0]] = valItem[1];
            }
        }
        var timerCount = 0;
        function activateTimers(key) {
            timerCount++;
            // checkUIStyle();
            setTimeout(function() {
                timerCount--;
                $M.setValue(key, 0);
                self.setState({key: key});
                // checkUIStyle();
                if (timerCount === 0) {
                    // $YApiModel.displayChangeValueData();
                }
            }, 1000);
        }
        for(var key in finalValue) {
            temp = finalValue[key];
            if (!$S.isStringV2(key)) {
                continue;
            }
            if (temp === "toggle") {
                $M.toggleValue(key, function() {

                });
            } else {
                $M.setValue(key, finalValue[key]);
                activateTimers(key);
            }
            this.setState({key: key});
            // checkUIStyle();
            //Activate timer for signal+route button press and manual point operation
            // if (currentTarget.hasClass("signal_route_btn") || currentTarget.hasClass("point-change-request")) {
            // }
        }
        clearLogData();
    }
    onControlClick(e) {
        clearLogData();
        var value = e.target.value;
        this.handleControlClick(value);
        console.log("Click event completed: " + $M.getSetValueCount());
    }
    onTprClick(e) {
        clearLogData();
        var key = "";
        if (e.target.tagName === "SPAN") {
            key = e.target.parentNode.value;
        } else {
            key = e.target.value;
        }
        // Fix for point change request
        if ($S.getTextFilter()(key).includes(",")) {
            this.handleControlClick(key);
        } else {
            $M.toggleValue(key);
            this.setState({key: key});
        }
        console.log("Click event completed: " + $M.getSetValueCount());
    }
    toggleDisplayDomino(e) {
        $YApiModel.toggleDisplayYardDominoBoundary();
        this.setState({dominoDisplayEnable: $YApiModel.getDisplayYardDominoBoundary()});
    }
    componentDidMount() {
        var self = this;
        this.setState({dominoDisplayEnable: $YApiModel.getDisplayYardDominoBoundary()});
        $YApiModel.loadYardControlData(function(response){
            self.setState({
                isLoaded: true,
                yardControlData: response
            });
        });
        $YApiModel.loadYardData(function(response){
            self.setState({
                isLoaded: true,
                yardTableContent: $YApiModel.getYardTableContentV2(response, requiredContent)
            });
        });
        $YApiModel.documentLoaded(function() {
            if ($S.isBooleanTrue($$.onSetValueRecheckAll)) {
                $M.reCheckAllValues();
            } else {
                $M.setVariableDependencies();
                $M.addInMStack($M.getPossibleValues());
                $M.reCheckAllValuesV2();
            }
            $M.resetChangeValueData();
            // console.log("Dataload complete.");
            self.setState({
                isLoaded: true
            });
            // console.log("set state complete.");
            return true;
        });
        $M.addCallbackSetValueCountLimitExceed(function() {
            if (self.state.yardControlData[1][2] && self.state.yardControlData[1][2]["text"]) {
                if ($S.isString(self.state.yardControlData[1][2]["text"]["text"])) {
                    self.state.yardControlData[1][2]["text"]["text"] =  "Limit Exceeds.";
                } else {
                    self.state.yardControlData[1][2]["text"] =  "Limit Exceeds.";
                }
            }
            self.setState({yardControlData: self.state.yardControlData});
        });
    }
    render() {
        var helpContentVisibleClass = "help ";
        helpContentVisibleClass += this.state.isLoaded ? "" : "hide";
        return (
<div className="container">
<div><center><h2>{appHeading}</h2></center></div>
<YardControl onClick={this.onControlClick} yardTableContent={this.state.yardControlData}/>
<YardContainer
    onClick={this.onTprClick}
    state={this.state}
/>
<ChangeValueLog logData={logData} changeValueData={$M.getAllChangeValueData()} />
<div>
    <div id="timerCount"></div>
    <div id="currentValues"></div>
    <div id="help" className={helpContentVisibleClass}>
        <div>
            <ul>
                <li>{appInfo}</li>
                <li><button id="toggleDisplayDomino" onClick={this.toggleDisplayDomino}>Toggle Display Domino</button></li>
            </ul>
        </div>
    </div>
</div>
</div>);
}
}
export default App;



