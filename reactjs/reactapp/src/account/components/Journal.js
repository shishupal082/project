import React from 'react';
import Header from "./partial/Header";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class Journal extends React.Component {
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
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading} methods={this.props.methods}/>
                    <div className="row">
                        <table className="table2 table-bordered table-striped"><tbody>
                            {JournalTableTr}
                        </tbody></table>
                    </div>
            </div>);
    }
}

export default Journal;

