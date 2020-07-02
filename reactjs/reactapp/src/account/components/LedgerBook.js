import React from 'react';
import Header from "./partial/Header";
import LedgerBookRow from "./partial/LedgerBookRow";
import Errors from "./partial/Errors";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var LedgerBookByCompany = this.props.renderFieldRow.map(function(el, i, arr) {
            return <LedgerBookRow key={i} accountName={el.accountName} accountDisplayName={el.accountDisplayName} fields={el.fields}/>;
        });
        return (<div className="container">
                    <Header data={this.props.data} history={this.props.history}
                            heading={this.props.heading} methods={this.props.methods}
                            currentPageName={this.props.currentPageName}
                    />
                    <Errors data={this.props.data}/>
                    {LedgerBookByCompany}
            </div>);
    }
}

export default LedgerBook;

