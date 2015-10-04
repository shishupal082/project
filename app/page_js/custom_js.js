var contextPath = "/app/page_js/index.html";
var container = document.getElementById("container");

page.base(contextPath);
page('/new', '/');
page('/', index);
page('/about', about);
page('/contact', contact);
page('/contact/:contactName', contact);
page('/upcoming', upcoming);
page('*', notfound);
page({hashbang:true});
page();

function index() {
	container.innerHTML = 'viewing index';
}
function about() {
	container.innerHTML = 'viewing about';
}
function contact(ctx, next) {
	container.innerHTML = 'viewing contact ' + (ctx.params.contactName || '');
}
function upcoming(ctx, next) {
	next();
}
function notfound(){
	container.innerHTML = '404';
}