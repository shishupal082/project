import React from 'react';
import {Link} from 'react-router-dom';
import FormFields from './FormFields';

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
        var printHeading = printData["printHeading"];
        var printFooter = printData["printFooter"];
        var fieldRow = printData["fieldRow"];
        var bodyTag = "";
        if (fieldRow && fieldRow.length > 0) {
            bodyTag = <div className="print-body">
                    <table className="table"><tbody>
                        <FormFields fieldData={fieldRow}/>
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
