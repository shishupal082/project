import React from 'react';
import Header from "./partial/Header";
import Errors from "./partial/Errors";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class JournalByDate extends React.Component {
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
        var journalByDate = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el, i);
        });
        return (<div className="container">
                    <Header data={this.props.data} history={this.props.history} heading={this.props.heading} methods={this.props.methods}/>
                    <Errors data={this.props.data}/>
                    <div className="row"><div className="col">{journalByDate}</div></div>
            </div>);
    }
}

export default JournalByDate;

