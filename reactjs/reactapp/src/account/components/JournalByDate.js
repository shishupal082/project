import React from 'react';
import Header from "./partial/Header";

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
        var JournalTableTr = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el);
        });
        var journalByDate = JournalTableTr;
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading} methods={this.props.methods}/>
                    <div className="row"><div className="col">{journalByDate}</div></div>
            </div>);
    }
}

export default JournalByDate;

