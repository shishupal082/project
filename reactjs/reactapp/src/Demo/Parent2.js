import React from 'react';
import Child2 from './Child2';
class Parent2 extends React.Component {
    constructor(props) {
        super(props);
        this.renderCount = 1; //chnage in this will not count re render
        this.state = {
            btnStatus: false
        };
        this.onParentBtnClick = this.onParentBtnClick.bind(this);
        this.ToggleBtnStatus = this.ToggleBtnStatus.bind(this);
    }
    ToggleBtnStatus() {
        this.setState({
            btnStatus: !this.state.btnStatus
        });
    }
    receiveExposedMethod(ChildExposedMethod) {
        this.ChildExposedMethod = ChildExposedMethod;
    }
    onParentBtnClick(e) {
        console.log("Parent2 ParentClick");
        this.ToggleBtnStatus();
        this.ChildExposedMethod();
    }
    render() {
        console.log("Parent2 Parent Render: " + this.renderCount++);
        var className = "btn ";
        className += this.state.btnStatus ? "btn-primary" : "btn-success";
        var getChildExposedMethod = this.receiveExposedMethod.bind(this);
        return (<div>
            <button className={className} onClick={this.onParentBtnClick}>Parent Button</button>
            <Child2 btnStatus={true} onChildBtnClick={this.ToggleBtnStatus}
            getChildExposedMethod={getChildExposedMethod}/>
        </div>);
    }
}

export default Parent2;
