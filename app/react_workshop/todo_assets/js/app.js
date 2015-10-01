var TODOLIST = [
	{name : "Item 1", status : "done", isComplete : false},
	{name : "Item 2", status : "pending", isComplete : true}
];
React.render(<Header/>, document.getElementById('header_container'));
function renderBody () {
	React.render(<AllTask todoList={TODOLIST}/>, document.getElementById('body_container'));
	return true;
}
renderBody();