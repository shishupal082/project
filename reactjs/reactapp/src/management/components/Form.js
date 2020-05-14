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
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleClick(e) {
        var fieldName = e.target.name;
        if (fieldName === "addNewRow") {
            var value = e.target.value;
            this.props.addNewRow(value);
            return false;
        }
        if (fieldName === "delete") {
            var fieldRow = e.target.parentElement.parentElement;
            var rowClassName = fieldRow.className;
            if (TextFilter(rowClassName).hasClass("form-row")) {
                this.props.removeRow(fieldRow.id);
            } else {
                alert("Invalid row for delete.");
            }
            return false;
        }
        return false;
    }
    handleChange(e) {
        var fieldName = e.target.name;
        var value = e.target.value;
        var formRowId = e.target.parentElement.parentElement.id;
        this.props.handleChange(e, fieldName, value, formRowId);
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.handleFormSubmit();
        return false;
    }
    render () {
        var formActionData = this.props.formData["formAction"];
        var formRowFields = this.props.state.formRowFields;
        var formFields = "", self = this;
        if ($S.isArray(formRowFields)) {
            formFields = formRowFields.map(function(item, index, arr) {
                var row = <div key={index} id={item.formRowId} className='form-row text-center font-weight-bold'>
                        <hr className="form-control-range"/>
                        <FormFields fieldData={item.templateData} onChange={self.handleChange} onClick={self.handleClick}/>
                    </div>
                return row;
            });
        }
        return (
            <div>
                <form method='POST' onSubmit={this.onSubmit}>
                    <hr className="form-control-range border-top-0"/>
                    <div className="form-row justify-content-center form-heading">
                        <a href = "/"><h2>{this.props.formHeading}</h2></a>
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
