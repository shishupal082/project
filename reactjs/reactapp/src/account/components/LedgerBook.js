import React from 'react';
import Header from "./partial/Header";
import LedgerBookRow from "./partial/LedgerBookRow";
import Errors from "./partial/Errors";

import DataHandler from "../common/DataHandler";
import $S from "../../interface/stack.js";
// import Api from "../../common/Api";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isValidPage: false
        };
    }
    componentDidMount() {
        $S.log("LedgerBook:componentDidMount");
        DataHandler.PageComponentMount(this.props.methods.appStateCallback,
            this.props.methods.appDataCallback, this.props.currentPageName);
        this.props.methods.addTab(this.props.currentPageName);
    }
    render() {
        // if (this.state.isValidPage) {
        //     renderFieldRow = this.props.renderFieldRow;
        //     LedgerBookByCompany = renderFieldRow.map(function(el, i, arr) {
        //         return <LedgerBookRow key={i} accountName={el.accountName} accountDisplayName={el.accountDisplayName} fields={el.fields}/>;
        //     });
        // } else {
        //     pageHeading = null;
        //     renderFieldRow = this.props.methods.getTemplate("noPageFound", []);
        //     LedgerBookByCompany = Api.generateFields(this.props, renderFieldRow);
        // }
        var LedgerBookByCompany = this.props.renderFieldRow.map(function(el, i, arr) {
            return <LedgerBookRow key={i} accountName={el.accountName} accountDisplayName={el.accountDisplayName} fields={el.fields}/>;
        });
        return (<div className="container LEDGER-BOOK">
                    <Header data={this.props.data} methods={this.props.methods}
                            currentPageName={this.props.currentPageName} history={this.props.history}
                    />
                    <Errors data={this.props.data}/>
                    {LedgerBookByCompany}
            </div>);
    }
}

export default LedgerBook;

