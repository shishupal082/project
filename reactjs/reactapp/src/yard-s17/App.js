import React from 'react';
import YardContainer from './component/YardContainer';
import AppConstant from './common/AppConstant';
import $S from "../libs/stack.js";

var yardApi = AppConstant.baseapi + AppConstant.yardApi + "?"+ $S.getRequestId();

class App extends React.Component {

    render() {
        return (
<div className="container">
<div>
    <center><h2>Yard S17</h2></center>
    <table><tbody>
        <tr>
            <td>
                <div className="">
                    <button value="S1-GN=1,ML-UN=1" className="evt signal_route_btn">S1-ML</button>
                    <button value="S1-GN=1,LL-UN=1" className="evt signal_route_btn">S1-LL</button>
                    <button value="S2-GN=1,2/3-UN=1" className="evt signal_route_btn">S2-2/3</button>
                    <button value="S3-GN=1,2/3-UN=1" className="evt signal_route_btn">S3-2/3</button>
                    <button value="S13-GN=1,DN-UN=1" className="evt signal_route_btn">S13-DN</button>
                    <button value="SH7-GN=1,SDG-UN=1" className="evt signal_route_btn">SH7-SDG</button>
                </div><div className="">
                    <button value="S12-GN=1,ML-UN=1" className="evt signal_route_btn">S12-ML</button>
                    <button value="S12-GN=1,LL-UN=1" className="evt signal_route_btn">S12-LL</button>
                    <button value="S10-GN=1,10/11-UN=1" className="evt signal_route_btn">S10-10/11</button>
                    <button value="S11-GN=1,10/11-UN=1" className="evt signal_route_btn">S11-10/11</button>
                    <button value="S9-GN=1,UP-UN=1" className="evt signal_route_btn">S9-UP</button>
                    <button value="SH8-GN=1,LL-UN=1" className="evt signal_route_btn">SH8-LL</button>
                </div>
            </td>
            <td>
                <div>
                    <button value="EUYN=1,4-WN=1" className="evt signal_route_btn">EUYN-4WN</button>
                    <button value="EUYN=1,5-WN=1" className="evt signal_route_btn">EUYN-5WN</button>
                    <button value="EUYN=1,2/3-UN=1" className="evt signal_route_btn">EUYN-2/3UN</button>
                    <button value="EUYN=1,10/11-UN=1" className="evt signal_route_btn">EUYN-10/11UN</button>
                </div>
                <div>
                    <button value="OYN=1,ML-UN=1" className="evt signal_route_btn">OYN-ML</button>
                    <button value="OYN=1,LL-UN=1" className="evt signal_route_btn">OYN-LL</button>
                </div>
            </td>
            <td><div><span className="alert-danger badge" id="alarm"></span></div></td>
        </tr>
    </tbody></table>
    <hr></hr>
</div>
<YardContainer yardApi={yardApi}/>
<div>
    <div id="changeValueData"></div>
</div>
<div>
    <div id="timerCount"></div>
    <div id="currentValues"></div>
    <div id="help" className="help hide">
        <div>
            <ul>
                <li>Single line, 2 road, 14 route station</li>
                <li><button id="toggleDisplayDomino">Toggle Display Domino</button></li>
            </ul>
        </div>
    </div>
</div>
</div>);
}
}
export default App;
