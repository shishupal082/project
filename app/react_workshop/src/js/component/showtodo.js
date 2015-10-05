var React = require("../../../../../static/gulp/src/js/react.js");
var Actions = require("../actions/actions.js");

var ShowTodo = React.createClass({
	componentDidMount:function(){
		Actions.loadTodo({"todo_id" : this.props.todo_id});
		console.log("ShowTodo componentDidMount");
	},
	render : function(){
		var selectedTodo = selectedTodo;
		var todo_id = null;
		if(selectedTodo && selectedTodo.todo_id){
			todo_id = selectedTodo.todo_id;
		}
		return (<div className="container">
			<div className="row">
				<div><h3>Current Todo</h3></div>
				<div><span>Name : {}</span></div>
			</div>
		</div>);
		// return (<div className="container"><div className="row">
		// 	<div className="col-md-6">
		// 		<div><h3>Current todo</h3></div>
		// 		<div><span></span></div>
		// 	</div>
		// </div>);
	}
});
module.exports = ShowTodo;