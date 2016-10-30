var cool = require('cool-ascii-faces');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/redline.json', function(request, response) {
	var mbtaJson = new XMLHttpRequest();
	mbtaJson.open("get", "http://developer.mbta.com/lib/rthr/red.json", true);
	mbtaJson.onreadystatechange = function() {
		if(mbtaJson.readyState == 4 && mbtaJson.status == 200) {
			response.send(mbtaJson.responseText);
		} 
	}
	mbtaJson.send();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
