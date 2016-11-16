var cool = require('cool-ascii-faces');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var validator = require('validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI;
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	if(error) {
		console.log("Error in connecting: ", error);
	}
	db = databaseConnection;
});

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
  response.set('Content-Type', 'text/html');
  var indexPage = '';
  db.collection('scores', function(err, collection) {
  	collection.find().sort( {score: -1} ).toArray(function(err, cursor) {
  	if(!err) {
  		indexPage +="<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head><body><h1>2048 Game Center</h1>";
  		indexPage +="<table><tr> <th>User</th> <th>Score</th> <th>Timestamp</th></tr>";
  		for(var i = 0; i < cursor.length; i++) {
  			indexPage += "<tr><td>" + cursor[i].username + "</td><td>" + cursor[i].score + "</td><td>" + cursor[i].created_at + "</td></tr>";
  		}
  		indexPage += "</table></body></html>";
  		response.send(indexPage);
  	} else {
  		indexPage +="<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head><body><h1>Bad</h1></body></html>";
  		response.send(indexPage);
  	}
  });
  });
});

app.get('/scores.json', function(request, response) {
  var indexPage =  "<!DOCTYPE HTML><html><head><title>2048 Game Center</title>";
  var queryString = request.query.username;
  indexPage += "<!DOCTYPE HTML><html><head><title>2048 Game Center</title></head><body>";
  db.collection('scores', function(err, collection) {
	collection.find({username: queryString}).sort( {score: -1} ).toArray(function(err, cursor) {
		if(!err) {
			indexPage += "<body>" + JSON.stringify(cursor) + "</body></html>";
			response.send(indexPage);
		}
	});
  });
});

app.post('/submit.json', function(request, response) {
  var username = request.body.username;
  var score = request.body.score;
  var grid = request.body.grid;

  if(username != undefined && score != undefined && grid != undefined) {
  	var curTime = new Date();
  	var newEntry = {
  		"username": username,
  		"score": score,
  		"grid": grid,
  		"created_at": curTime
  	};

  	db.collection('scores', function(error, call) {
  		if(error) {
  			console.log("Error in scores:", error);
  		}
  		call.insert(newEntry, function(error, saved) {
  			if(error) {
  				console.log("Error in insert for scores: ", error);
  				response.send(500);
  			} else {
  				response.send(200);
  			}
  		});
  	});
  }
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

