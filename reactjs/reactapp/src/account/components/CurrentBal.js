import React from 'react';
import Header from "./partial/Header";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class CurrentBal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var self = this;
        var CurrentBalEntry = this.props.state.currentBalanceFields.map(function(el, i, arr) {
            return Api.generateFields(self.props, el);
        });
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    {CurrentBalEntry}
            </div>);
    }
}

export default CurrentBal;

