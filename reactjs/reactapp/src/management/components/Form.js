import React from 'react';
import FormFields from './FormFields';
import $S from "../../interface/stack.js";

var TextFilter = $S.getTextFilter();

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick(e) {
        var fieldName = e.target.name;
        var value = e.target.value;
        var fieldRow = e.target.parentElement.parentElement;
        var rowClassName = fieldRow.className;
        if (fieldName === "addNewRow") {
            this.props.addNewRow(value);
            return false;
        }
        if (TextFilter(rowClassName).hasClass("form-row")) {
            var formRowId = value;
            if ($S.isString(formRowId)) {
                formRowId = formRowId.split("-")[0] * 1;
                if (!$S.isNumber(formRowId)) {
                    formRowId = null;
                }
            }
            this.props.removeRow(formRowId);
            return false;
        }

    }
    handleChange(e) {
        console.log(e.target.name);
    }
    render () {
        var formActionData = this.props.formData["formAction"];
        var formUserData = this.props.formData["userDetails"];
        // var formTemplate1 = this.props.formData["formTemplate1"];
        // var formTemplate2 = this.props.formData["formTemplate2"];
        var formRowFields = this.props.state.formRowFields;
        var formFields = "", self = this;
        if ($S.isArray(formRowFields)) {
            formFields = formRowFields.map(function(item, index, arr) {
                var formRowId = index + "-formRow";
                return <div key={index} id={formRowId} className= 'form-row text-center font-weight-bold'>
                        <hr className="form-control-range"/>
                        <FormFields fieldData={item} onChange={self.handleChange} onClick={self.handleClick}/>
                    </div>
            });
        }
        return (
            <div>
                <form method='POST' action='trial.php'>
                    <hr className="form-control-range border-top-0"/>
                    <div className="form-row justify-content-center form-heading">
                        <a href = "/"><h2>{this.props.formHeading}</h2></a>
                    </div>
                    <hr className="form-control-range"/>
                    <div className= 'form-row text-center font-weight-bold form-user'>
                        <FormFields fieldData={formUserData} onChange={this.handleChange} onClick={this.handleClick}/>
                    </div>
                    {formFields}
                    <div className="row justify-content-center form-action">
                        <FormFields fieldData={formActionData} onChange={this.handleChange} onClick={this.handleClick}/>
                    </div>
                    <hr className="form-control-range"/>
                </form>
            </div>
        );
    }
}
export default Form;
