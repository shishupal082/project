import React from 'react';
import Header from "./partial/Header";
import LedgerBookRow from "./partial/LedgerBookRow";

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
        var LedgerBookByCompany = this.props.state.ledgerDataFields.map(function(el, i, arr) {
            return <LedgerBookRow key={i} accountName={el.accountName} fields={el.fields}/>;
        });
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    {LedgerBookByCompany}
            </div>);
    }
}

export default LedgerBook;

