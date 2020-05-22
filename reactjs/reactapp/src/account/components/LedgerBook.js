import React from 'react';
import Header from "./partial/Header";
import LedgerBookRow from "./partial/LedgerBookRow";

// import $S from "../../interface/stack.js";

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
        var LedgerBookByCompany = this.props.state.ledgerData.map(function(el, i, arr) {
            return <LedgerBookRow key={i} companyName={el.companyName} ledgerRowFields={el.ledgerRowFields}/>;
        });
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    {LedgerBookByCompany}
            </div>);
    }
}

export default LedgerBook;

