import React from 'react';
import Child from './Child';
class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.renderCount = 1; //chnage in this will not count re render
        this.state = {
            btnStatus: false,
            checkboxStatus: false
        };
        this.handleParentClick = this.handleParentClick.bind(this);
        this.ToggleBtnStatus = this.ToggleBtnStatus.bind(this);
        this.checkboxClick = this.checkboxClick.bind(this);
        /*To modify child state or calling child method */
        this.childRef = React.createRef();
    }
    ToggleBtnStatus() {
        this.setState({
            btnStatus: !this.state.btnStatus
        });
    }
    handleParentClick(e) {
        console.log("ParentClick");
        this.ToggleBtnStatus();
        if (!this.state.checkboxStatus) {
            this.childRef.current.ToggleBtnStatus();
        }
    }
    checkboxClick() {
        this.setState({
            checkboxStatus: !this.state.checkboxStatus
        });
    }
    render() {
        console.log("Parent Render: " + this.renderCount++);
        var className = "btn ";
        className += this.state.btnStatus ? "btn-primary" : "btn-success";
        return (<div>
            <button className={className} onClick={this.handleParentClick}>Parent Button</button>
            <label> Decouple </label><input type="checkbox" onClick={this.checkboxClick}/>
            <Child ref={this.childRef} btnStatus={false} onBtnClick={this.ToggleBtnStatus}/>
        </div>);
    }
}

export default Parent;
