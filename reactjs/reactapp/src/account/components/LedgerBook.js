import React from 'react';

import Heading from "../../common/app/components/Heading";
import SelectFilter from "../../common/app/components/SelectFilter";
import Errors from "../../common/app/components/Errors";
import PageTab from "../../common/app/components/PageTab";
import Footer from "../../common/app/components/Footer";
import LedgerBookRow from "./partial/LedgerBookRow";

import $S from "../../interface/stack.js";
// import Api from "../../common/Api";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("LedgerBook:componentDidMount");
    }
    render() {
        var LedgerBookByCompany = this.props.renderFieldRow.map(function(el, i, arr) {
            return <LedgerBookRow key={i} accountName={el.accountName} accountDisplayName={el.accountDisplayName} fields={el.fields}/>;
        });
        return (<div className="container LEDGER-BOOK">
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <PageTab data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <div>{LedgerBookByCompany}</div>
                    <Footer data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
            </div>);
    }
}

export default LedgerBook;

