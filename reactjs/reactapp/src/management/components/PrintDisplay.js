import React from 'react';
import {Link} from 'react-router-dom';
import FormFields from './FormFields';
import $S from "../../interface/stack.js";

class PrintDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render () {
        var printData = this.props.printData;
        var emptyRowTemplate = $S.clone(printData["type1RowTemplate"]);
        var printHeading = printData["printHeading"];
        var printFooter = printData["printFooter"];
        var fieldRow = printData["fieldRow"];
        var totalRow = printData["totalRow"];
        var emptyRow = [];
        if ($S.isArray(fieldRow)) {
            var emptyRowCount = 0;
            if (fieldRow.length < 5) {
                emptyRowCount = 30;
            } else if (fieldRow.length < 15) {
                emptyRowCount = 20;
            } else if (fieldRow.length < 30) {
                emptyRowCount = 5;
            } else {
                emptyRowCount = 2;
            }
            for(var i=0; i < emptyRowCount; i++) {
                emptyRow.push(emptyRowTemplate);
            }
        }
        var bodyTag = "";
        if (fieldRow && fieldRow.length > 0) {
            bodyTag = <div className="print-body">
                    <table className="table"><tbody>
                        <FormFields fieldData={fieldRow}/>
                        <FormFields fieldData={emptyRow}/>
                        <FormFields fieldData={totalRow}/>
                    </tbody></table>
                </div>;
        }
        var backIconStyle = {height: "20px", margin:"0px 5px 5px 0px"}
        var backIcon = <img style={backIconStyle} src={this.props.backIconUrl} alt="back"/>;
        return (
            <div>
                <table className="d-print-none"><tbody><tr><td>
                    <Link to="/form"><h2 className="d-inline-block">{backIcon}Edit</h2></Link>
                </td></tr></tbody></table>
                <FormFields fieldData={printHeading}/>
                {bodyTag}
                <FormFields fieldData={printFooter}/>
            </div>
        );
    }
}
export default PrintDisplay;
