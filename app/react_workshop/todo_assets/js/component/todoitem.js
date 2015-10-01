var TodoItem = React.createClass({
	componentDidMount: function() {
		console.log("componentDidMount TodoItem");
	},
	getInitialState : function(){
		return {
			name : this.props.todo.name,
			isComplete : this.props.todo.isComplete,
			status : this.props.todo.isComplete ? "done" : "pending"
		};
	},
	todoAction : function(){
		this.props.todo.isComplete = !this.props.todo.isComplete;
		this.props.todo.status = this.state.isComplete ? "done" : "pending";
		this.setState(this.props.todo);
		renderBody();
	},
	render : function(){
		var todoName = this.state.name;
		var todoStatus = this.state.status;
		var className = "list-group-item ";
		className = className + todoStatus;
		return (
			<li className={className} onClick={this.todoAction}>{todoName} {todoStatus}</li>
		);
	}
});