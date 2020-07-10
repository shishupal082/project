import React from 'react';
import Header from "./partial/Header";
import LedgerBookRow from "./partial/LedgerBookRow";
import Errors from "./partial/Errors";

import Api from "../../common/Api";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isValidPage: false
        };
    }
    componentDidMount() {
        if (this.props.methods.isValidCurrentPage(this.props.currentPageName)) {
            this.setState({isValidPage: true});
            this.props.methods.trackPage(this.props.currentPageName);
        } else {
            this.props.methods.trackPage("noMatch");
        }
    }
    render() {
        var renderFieldRow, LedgerBookByCompany;
        var pageHeading = this.props.heading;
        if (this.state.isValidPage) {
            renderFieldRow = this.props.renderFieldRow;
            LedgerBookByCompany = renderFieldRow.map(function(el, i, arr) {
                return <LedgerBookRow key={i} accountName={el.accountName} accountDisplayName={el.accountDisplayName} fields={el.fields}/>;
            });
        } else {
            pageHeading = null;
            renderFieldRow = this.props.methods.getTemplate("noPageFound", []);
            LedgerBookByCompany = Api.generateFields(this.props, renderFieldRow);
        }
        return (<div className="container">
                    <Header state={this.props.state} data={this.props.data} history={this.props.history}
                            heading={pageHeading} methods={this.props.methods}
                            currentPageName={this.props.currentPageName}
                    />
                    <Errors data={this.props.data}/>
                    {LedgerBookByCompany}
            </div>);
    }
}

export default LedgerBook;

