import React from 'react';
import Api from '../common/Api';
import YardHelper from '../common/YardHelper';
import $S from '../../libs/stack';
import YardTable from './YardTable';

var yardComponent = {};
var tableContent = [];

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
            yardTable: []
        };
    }
    componentDidMount() {
        var self = this;
        Api.loadJsonData([this.props.yardApi], function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
        }, function() {
            tableContent = YardHelper.getYardTableContent(yardComponent, requiredContent);
            var table = $S.getTable(tableContent, "yard");
            self.setState({
                isLoaded: true,
                yardTable: table.getContent()
            });
        });
    }
    render() {
        var YardTableComponent = <center>Loading...</center>;
        if (this.state.isLoaded) {
            YardTableComponent = <YardTable yardTableContent={this.state.yardTable}
                                id="yard" className=""/>;
        }
        return (
            <div id="tableHtml" className="table-html display-domino">
                {YardTableComponent}
            </div>
        );
    }
}
export default YardContainer;
