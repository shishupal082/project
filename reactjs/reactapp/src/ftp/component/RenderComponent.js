import React from 'react';
import Api from "../../common/Api";

class RenderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    render() {
        var self = this;
        var renderField = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el, i);
        });
        return(<div>{renderField}</div>);
    }
}

export default RenderComponent;
