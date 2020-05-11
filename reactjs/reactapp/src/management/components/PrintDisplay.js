import React from 'react';
import FormFields from './FormFields';

function PrintDisplay(props) {
    var printData = props.printData;
    var printHeading = printData["printHeading"];
    var printFooter = printData["printFooter"];
    var printBodyUser = printData["printBodyUser"];
    return (
        <div>
            <FormFields fieldData={printHeading}/>
            <div className="print-body">
                <FormFields fieldData={printBodyUser}/>
            </div>
            <FormFields fieldData={printFooter}/>
        </div>
    );
}
export default PrintDisplay;
