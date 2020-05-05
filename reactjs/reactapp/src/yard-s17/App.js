import React from 'react';
import YardContainer from './component/YardContainer';
import AppConstant from './common/AppConstant';
import Api from './common/Api';
import $S from "../libs/stack.js";
import YardTable from './component/YardTable';

var baseapi = AppConstant.baseapi;
var yardApi = baseapi + AppConstant.yardApi + "?"+ $S.getRequestId();
var yardControlApi = baseapi + AppConstant.yardControlApi + "?"+ $S.getRequestId();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            yardControlData: []
        };
    }
    onControlClick(e) {
        console.log(e.target.value);
    }
    onTprClick(e) {
        console.log(e.target.value);
    }
    toggleDisplayDomino(e) {
        console.log("toggleDisplayDomino");
    }
    componentDidMount() {
        var self = this;
        Api.loadJsonData([yardControlApi], function(response) {
            if (response) {
                self.setState({
                    isLoaded: true,
                    yardControlData: response
                });
            }
        });
    }
    render() {
        var helpContentVisibleClass = "help ";
        helpContentVisibleClass += this.state.isLoaded ? "" : "hide";
        return (
<div className="container yard">
<div>
    <center><h2>Yard S17</h2></center>
    <YardTable onClick={this.onControlClick} id="yardControl" yardTableContent={this.state.yardControlData}/>
    <hr></hr>
</div>
<YardContainer onClick={this.onTprClick} yardApi={yardApi}/>
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
