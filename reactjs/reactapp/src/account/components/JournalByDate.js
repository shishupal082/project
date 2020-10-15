import React from 'react';
import Header from "./partial/Header";
import Errors from "./partial/Errors";

import $S from "../../interface/stack.js";
import Api from "../../common/Api";
import DataHandler from "../common/DataHandler";
// import $S from "../../interface/stack.js";

class JournalByDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isValidPage: false
        };
    }
    componentDidMount() {
        $S.log("JournalByDate:componentDidMount");
        DataHandler.PageComponentMount(this.props.methods.appStateCallback,
            this.props.methods.appDataCallback, this.props.currentPageName);
        this.props.methods.addTab(this.props.currentPageName);
    }
    render() {
        var self = this;
        var journalByDate = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el, i);
        });
        return (<div className="container JOURNAL-BY-DATE">
                    <Header data={this.props.data} methods={this.props.methods}
                            currentPageName={this.props.currentPageName} history={this.props.history}
                    />
                    <Errors data={this.props.data}/>
                    <div className="row"><div className="col">{journalByDate}</div></div>
            </div>);
    }
}

export default JournalByDate;

