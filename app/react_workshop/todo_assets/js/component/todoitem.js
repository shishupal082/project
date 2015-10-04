var TodoItem = React.createClass({
	componentDidMount: function() {
		console.log("componentDidMount TodoItem");
	},
	getInitialState : function(){
		return {
			todo_id : this.props.todo.todo_id,
			todo_name : this.props.todo.todo_name,
			status : this.props.todo.status
		};
	},
	toggleAction : function(){
		this.props.todo.todo_id = this.props.todo.todo_id;
		this.props.todo.todo_name = this.props.todo.todo_name;
		this.props.todo.status = this.state.status == "completed" ? "pending" : "completed";
		this.setState(this.props.todo);
		Actions.updateTodo(this.props.todo);
		renderBody();
	},
	render : function(){
		var todoId = this.state.todo_id;
		var todoName = this.state.todo_name;
		var todoStatus = this.state.status;
		var className = "list-group-item ";
		var btnStatusClassName = "btn ";
		className = className + todoStatus;
		if(todoStatus == "completed"){
			btnStatusClassName = btnStatusClassName + "btn-success";
		}else{
			btnStatusClassName = btnStatusClassName + "btn-default";
		}
		return (
			<li className={className}>
				<button type="button" className={btnStatusClassName} onClick={this.toggleAction}>{todoStatus}</button>
				{todoId} {todoName}
			</li>
		);
	}
});