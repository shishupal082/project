import React from 'react';
import Api from '../common/Api';
import $S from '../../interface/stack';
import $YApiModel from "../../interface/yardApiModel.js";
import YardTable from './YardTable';

var yardComponent = {};

var topLoopLineText = ["","","","","", "ll-text", "p-6-text"];
var topLoopLine = ["","","","","4B-tpr", "ll-tpr", "ll-tpr-sh", "sdg-tpr-0", "sdg-tpr"]
var topLoopPoint = ["","","","","4-point-mid","5-point-mid","5-point-mid-2"]
var mainLine = ["1A-tpr","1-tpr", "9-tpr", "10/11-tpr", "4A-tpr", "ml-tpr", "5A-tpr", "2/3-tpr", "13-tpr", "12-tpr", "12A-tpr"];

var requiredContent = [];
requiredContent.push(topLoopLineText);
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);


class YardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            yardTableData: []
        };
    }
    fetchData() {
        var self = this;
        $S.loadJsonData(null, [this.props.yardApi + "?"+ $S.getRequestId()], function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
        }, function() {
            var tableContent = $YApiModel.getYardTableContentV2(yardComponent, requiredContent);
            self.setState({
                isLoaded: true,
                yardTableData: tableContent
            });
        }, null, Api.getAjaxApiCallMethod());
    }
    componentDidMount() {
        this.fetchData();
    }
    render() {
        var YardTableComponent = <center>Loading...</center>;
        if (this.state.isLoaded) {
            YardTableComponent = <YardTable onClick={this.props.onClick} yardTableContent={this.state.yardTableData}
                                id="yard" state={this.props.state}/>;
        }
        return (
            <div className="yard"><div id="tableHtml" className="table-html display-domino">
                {YardTableComponent}
            </div></div>
        );
    }
}
export default YardContainer;
