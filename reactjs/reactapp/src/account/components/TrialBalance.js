import React from 'react';
import Header from "./partial/Header";
import Errors from "./partial/Errors";

import Api from "../../common/Api";

class NotUsedTrialBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var trialBalanceTr = Api.generateFields(this.props, this.props.state.trialBalanceFields);
        return (<div className="container">
                    <Header state={this.props.state} data={this.props.data} heading={this.props.heading} methods={this.props.methods}/>
                    <Errors data={this.props.data}/>
                    <table className="table table-bordered table-striped"><tbody>{trialBalanceTr}</tbody></table>
            </div>);
    }
}

export default NotUsedTrialBalance;

