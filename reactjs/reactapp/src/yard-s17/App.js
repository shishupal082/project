import React from 'react';
import YardContainer from './component/YardContainer';
import YardControl from './component/YardControl';
import AppConstant from './common/AppConstant';
import Api from './common/Api';
import $S from "../interface/stack.js";
import $M from "../interface/model.js";
import $YApiModel from "../interface/yardApiModel.js";

var baseapi = AppConstant.baseapi;
var yardApi = baseapi + AppConstant.yardApi;
var yardControlApi = baseapi + AppConstant.yardControlApi;

var UICommonPath = {
    "async-data": ["/app/yard-s17/static/json/async-data.json"],
    "partial-expressions-value": ["/app/yard-s17/static/json/partial-exp.json"],
    "possible-value": ["/app/yard-s17/static/json/possible-values.json",
                        "/app/yard-s17/static/json/possible-values-sequence.json",
                        "/app/yard-s17/static/json/possible-values-group.json"],
    "initial-value": ["/app/yard-s17/static/json/initial-value.json"],
    "expressions": ["/app/yard-s17/static/json/expressions-evt.json",
                    "/app/yard-s17/static/json/expressions-common.json",
                    "/app/yard-s17/static/json/expressions-sequence-1.json",
                    "/app/yard-s17/static/json/expressions-sequence-2.json",
                    "/app/yard-s17/static/json/expressions-ov.json",
                    "/app/yard-s17/static/json/expressions-sub-routes.json",
                    "/app/yard-s17/static/json/expressions-points-common.json",
                    "/app/yard-s17/static/json/expressions-point-4.json",
                    "/app/yard-s17/static/json/expressions-point-5.json",
                    "/app/yard-s17/static/json/expressions-point-6.json",
                    "/app/yard-s17/static/json/expressions-timer.json",
                    "/app/yard-s17/static/json/expressions-glow.json"]
};

for (var key in UICommonPath) {
    for (var i = 0; i < UICommonPath[key].length; i++) {
        UICommonPath[key][i] = baseapi + UICommonPath[key][i];
    }
}

$YApiModel.setApisPath(UICommonPath);
$YApiModel.setAjaxApiCall(Api.getAjaxApiCallMethod());


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnActive: true,
            isLoaded: false,
            yardControlData: [],
            currentValues: {}
        };
        this.reloadDataClick = this.reloadDataClick.bind(this);
    }
    reloadDataClick(e) {
        console.log("reloadDataClick");
        this.setState({btnActive: !this.state.btnActive});
    }
    fetchData() {
        var self = this;
        $S.loadJsonData(null, [yardControlApi + "?"+ $S.getRequestId()], function(response) {
            if ($S.isArray(response)) {
                self.setState({
                    yardControlData: response
                });
            } else {
                $S.log("Invalid response (initialValue):" + response);
            }
        }, null, null, Api.getAjaxApiCallMethod());
    }
    onControlClick(e) {
        console.log("onControlClick: " + e.target.value);
    }
    onTprClick(e) {
        var value = "";
        if (e.target.tagName === "SPAN") {
            value = e.target.parentNode.value;
        } else {
            value = e.target.value;
        }
        console.log("onTprClick: " + value);
    }
    toggleDisplayDomino(e) {
        console.log("toggleDisplayDomino");
    }
    componentDidMount() {
        this.fetchData();
        var self = this;
        $YApiModel.documentLoaded(function() {
            $M.setVariableDependencies();
            $M.addInMStack($M.getPossibleValues());
            $M.reCheckAllValuesV2();
            // console.log("Dataload complete.");
            self.setState({
                isLoaded: true,
                currentValues: $M.getCurrentValues().currentValues
            });
            // console.log("set state complete.");
            return true;
        });
    }
    render() {
        // console.log("App Render");
        var helpContentVisibleClass = "help ";
        helpContentVisibleClass += this.state.isLoaded ? "" : "hide";
        var btnClassName = this.state.btnActive ? "btn btn-primary" : "btn btn-success";
        return (
<div className="container">
<div><center><h2>Yard S17 <button onClick={this.reloadDataClick} className={btnClassName}>Click to reload</button></h2></center></div>
<YardControl onClick={this.onControlClick} yardTableContent={this.state.yardControlData}/>
<YardContainer
    onClick={this.onTprClick}
    yardApi={yardApi}
    state={this.state}
/>
<div>
    <div id="changeValueData"></div>
</div>
<div>
    <div id="timerCount"></div>
    <div id="currentValues"></div>
    <div id="help" className={helpContentVisibleClass}>
        <div>
            <ul>
                <li>Single line, 2 road, 14 route station</li>
                <li><button id="toggleDisplayDomino" onClick={this.toggleDisplayDomino}>Toggle Display Domino</button></li>
            </ul>
        </div>
    </div>
</div>
</div>);
}
}
export default App;
