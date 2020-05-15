import React from 'react';
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
        return (
            <div>
                <FormFields fieldData={printHeading}/>
                {bodyTag}
                <FormFields fieldData={printFooter}/>
            </div>
        );
    }
}
export default PrintDisplay;
