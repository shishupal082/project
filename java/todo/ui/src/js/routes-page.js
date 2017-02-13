var React = require('react');
var page = require('page');
var _ = require('underscore');
var store = require('./data');
var App = require('./components/App');

page({hashbang: false});



function renderAll() {
	React.render(<App />, document.getElementById("dashboard_app"));	
}

store.on('update', function (newData) {
    console.log("page refreshing due to global state reset", store.get());
    renderAll();
});
renderAll();