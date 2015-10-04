var contextPath = "/app/react_workshop/todo-app.html";
var TODOLIST = [];
React.render(<Header/>, document.getElementById('header_container'));

function renderBody () {
	console.log(TODOLIST);
	React.render(<AllTask todoList={TODOLIST}/>, document.getElementById('body_container'));
	return true;
}
page.base(contextPath);
page('/', function(ctx, next){
	next();
});
// page('/about', about);
// page('/contact', contact);
// page('/contact/:contactName', contact);
// page('/upcoming', upcoming);
page('*', function(ctx, next){
	renderBody();
});
page({hashbang:true});
page();