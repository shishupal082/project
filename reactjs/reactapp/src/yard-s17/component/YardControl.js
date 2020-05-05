import React from 'react';
import YardTable from './YardTable';

class YardControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            yardTable: []
        };
    }
    render() {
        var yardTableComp = <YardTable onClick={this.props.onClick} yardTableContent={this.props.yardTableContent}
                    id="yardControl"/>;
        return (
            <div>
                {yardTableComp}
                <hr></hr>
            </div>
        );
    }
}
export default YardControl;
