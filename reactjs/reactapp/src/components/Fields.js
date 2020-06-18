import React from 'react';
import Api from "../common/Api";

class Fields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    render() {
        var self = this;
        var field = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el, i);
        });
        return (field);
    }
}

export default Fields;

