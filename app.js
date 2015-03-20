/*
 * BASE SETUP
 */
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var routes = require('./routes');
var messages = require('./routes/messages');

var app = express();

/*
 * CONFIGURATIONS
 */
app.set('view engine', 'ejs');                          // set the view engine for express as ejs
app.use(bodyParser.urlencoded({ extended: false }));     // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                               // parse application/json
app.use(express.static(__dirname + '/public')); 		// set the static files location for resources needed

var env = process.env.NODE_ENV;
if ('development' == env) {
	app.use(errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
}

if ('production' == app.get('env')) {
	app.use(errorHandler());
}

/*
 * ROUTES
 */
app.get('/', routes.index);
app.get('/messages', messages.list);
app.post('/messages', messages.send);

/*
 * START THE SERVER
 */
app.listen(3000);
app.listen(3001);
console.log('Magic happens on port 3000 and 3001...');
