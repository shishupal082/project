import React from 'react';

import Heading from "../../common/app/components/Heading";
import Errors from "../../common/app/components/Errors";
import LedgerBookRow from "./partial/LedgerBookRow";

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
        if ($S.isFunction(this.props.methods.registerChildAttribute)) {
            this.props.methods.registerChildAttribute("history", this.props.history);
        }
        if ($S.isFunction(this.props.methods.pageComponentDidMount)) {
            this.props.methods.pageComponentDidMount(this.props.currentPageName);
        }
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
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <div>{LedgerBookByCompany}</div>
            </div>);
    }
}

export default LedgerBook;

