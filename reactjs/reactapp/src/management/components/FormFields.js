import React from 'react';
import Api from '../../common/Api';
class FormFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    render() {
        var fieldData = this.props.fieldData;
        var fields = Api.generateFields(this.props, fieldData);
        return (fields);
    }
}
export default FormFields;
