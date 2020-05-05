import React from 'react';
import YardContainer from './component/YardContainer';
import YardControl from './component/YardControl';
import AppConstant from './common/AppConstant';
import Api from './common/Api';
import $S from "../libs/stack.js";

var baseapi = AppConstant.baseapi;
var yardApi = baseapi + AppConstant.yardApi;
var yardControlApi = baseapi + AppConstant.yardControlApi;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnActive: true,
            isLoaded: false,
            yardControlData: [],
            yardTableData: []
        };
        this.onYardTableDataLoad = this.onYardTableDataLoad.bind(this);
        this.reloadDataClick = this.reloadDataClick.bind(this);
    }
    reloadDataClick(e) {
        this.setState({btnActive: !this.state.btnActive});
        this.YardContainerFetchData();
        this.fetchData();
    }
    receiveExposedMethod(YardContainerFetchData) {
        this.YardContainerFetchData = YardContainerFetchData;
    }
    onYardTableDataLoad(tableData) {
        this.setState({
            yardTableData: tableData
        });
    }
    fetchData() {
        var self = this;
        Api.loadJsonData([yardControlApi + "?"+ $S.getRequestId()], function(response) {
            if (response) {
                self.setState({
                    isLoaded: true,
                    yardControlData: response
                });
            }
        });
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
    }
    render() {
        var helpContentVisibleClass = "help ";
        helpContentVisibleClass += this.state.isLoaded ? "" : "hide";
        var btnClassName = this.state.btnActive ? "btn btn-primary" : "btn btn-success";
        var getYardContainerFetchData = this.receiveExposedMethod.bind(this);
        return (
<div className="container">
<div><center><h2>Yard S17 <button onClick={this.reloadDataClick} className={btnClassName}>Click to reload</button></h2></center></div>
<YardControl onClick={this.onControlClick} yardTableContent={this.state.yardControlData}/>
<YardContainer onClick={this.onTprClick} onYardTableDataLoad={this.onYardTableDataLoad}
            yardApi={yardApi} yardTableData={this.state.yardTableData}
            getYardContainerFetchData={getYardContainerFetchData}/>
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
