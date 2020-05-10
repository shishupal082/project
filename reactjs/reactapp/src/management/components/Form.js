import React from 'react';
import FormFields from './FormFields';

function Form(props) {
    var formData = props.formData;
    var formActionData = props.formData["formAction"];
    var formUserData = props.formData["userDetails"];
    var formTemplate1 = props.formData["formTemplate1"];
    var formTemplate2 = props.formData["formTemplate2"];
    return (
        <div>
            <form method='POST' target='_blank' action='trial.php'>
                <hr className="form-control-range border-top-0"/>
                <div className="form-row justify-content-center form-heading">
                    <a href = "/"><h2>{props.formHeading}</h2></a>
                </div>
                <hr className="form-control-range"/>
                <div className= 'form-row text-center font-weight-bold form-user'>
                    <FormFields fieldData={formUserData}/>
                </div>
                <hr className="form-control-range"/>
                <div className="form-row">
                    <FormFields fieldData={formTemplate1}/>
                </div>
                <div className="form-row">
                    <FormFields fieldData={formTemplate2}/>
                </div>
                <div className="row justify-content-center form-action">
                    <FormFields fieldData={formActionData}/>
                </div>
                <hr className="form-control-range"/>
            </form>
        </div>
    );
}
export default Form;
