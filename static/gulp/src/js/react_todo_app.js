var React = require("react");

var Header = require("../../../../app/react_workshop/src/js/component/header.js");
var AllTask = require("../../../../app/react_workshop/src/js/component/alltask.js");
var ShowTodo = require("../../../../app/react_workshop/src/js/component/showtodo.js");
var TodoList = require("../../../../app/react_workshop/src/js/component/todolist.js");
var TodoItem = require("../../../../app/react_workshop/src/js/component/todoitem.js");

React.render(<Header/>, document.getElementById('header_container'));

var contextPath = "/app/react_workshop/todo-app.html";
Test.TODOLIST = [];
Test.selectedTodo = {};

TestObj.prototype.renderBody = function() {
	console.log(Test.TODOLIST);
	React.render(<AllTask todoList={Test.TODOLIST}/>, document.getElementById('body_container'));
	return true;
}
var callback = [];
page.base(contextPath);
page('/', function(ctx, next){
	callback.push(function(){
		console.log(Test.TODOLIST);
		React.render(<AllTask todoList={Test.TODOLIST}/>, document.getElementById('body_container'));
		return true;
	});
	next();
});
page('/show/:todo_id', function(ctx, next){
	callback.push(function(){
		console.log("render show todo");
		var todo_id = null;
		if(ctx && ctx.params && ctx.params.todo_id){
			todo_id = ctx.params.todo_id;
		}
		React.render(<ShowTodo todo_id={todo_id}/>, document.getElementById('body_container'));
		return true;
	});
	next();
});
page('*', function(ctx, next){
	console.log("renderAll");
	Test.renderAll();
});
TestObj.prototype.renderAll =  function(newData){
	callback.map(function(el, index, arr){
		el();
	});
	callback = [];
}
page({hashbang:true});
page();