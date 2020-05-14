import React from 'react';
import FormFields from './FormFields';

function PrintDisplay(props) {
    var printData = props.printData;
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
export default PrintDisplay;
