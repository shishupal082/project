//Header.js
var Header = React.createClass({
	getName : function(){
		return "Dear";
	},
	getGreeting : function(time){
		if(parseInt(time) > 12){
			return "Good evening";
		}else{
			return "Good morning";
		}
	},
	alertMsg : function(){
		alert("HI");
	},
	render : function(){
		var x = 3;
		return (<center><div>
				{this.props.children}
				<div>{x > 2 ? "HI" : "hi"} : {this.getName()} : {this.getGreeting(this.props.time)}</div>
				<div><button onClick={this.alertMsg}>Click Me</button></div>
			</div></center>);
	}
});
//components/counter.js
var Counter = React.createClass({
	getInitialState : function(){
		return {count : 0};
	},
	incrementCount : function(){
		var newValue = this.state.count + 1;
		this.setState({count : newValue});
	},
	decrementCount : function(){
		var newValue = this.state.count - 1;
		this.setState({count : newValue});
	},
	render : function(){
		return (<center><div><h1>{this.state.count}</h1></div>
			<div>
				<button onClick={this.incrementCount}>Increment</button>
				<button onClick={this.decrementCount}>Decrement</button>
			</div>
			</center>);
	}
});
//App.js
React.render(<Header time="13">
	<h3>Header</h3>
	</Header>,
document.getElementById('example'));

React.render(<Counter></Counter>,
document.getElementById('counter'));




