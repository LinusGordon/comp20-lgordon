var stations = [{"stop_name": "South Station", "stop_lat": 42.352271 , "stop_lon":-71.05524200000001},
{"stop_name": "Andrew", "stop_lat": 42.330154 , "stop_lon":-71.057655},
{"stop_name": "Porter Square", "stop_lat": 42.3884 , "stop_lon":-71.11914899999999},
{"stop_name": "Harvard Square", "stop_lat": 42.373362 , "stop_lon":-71.118956},
{"stop_name": "JFK/UMass", "stop_lat": 42.320685 , "stop_lon":-71.052391},
{"stop_name": "Savin Hill", "stop_lat": 42.31129 , "stop_lon":-71.053331},
{"stop_name": "Park Street", "stop_lat": 42.35639457 , "stop_lon":-71.0624242},
{"stop_name": "Broadway", "stop_lat": 42.342622 , "stop_lon":-71.056967},
{"stop_name": "North Quincy", "stop_lat": 42.275275 , "stop_lon":-71.029583},
{"stop_name": "Shawmut", "stop_lat": 42.29312583 , "stop_lon":-71.06573796000001},
{"stop_name": "Davis", "stop_lat": 42.39674 , "stop_lon":-71.121815},
{"stop_name": "Alewife", "stop_lat": 42.395428 , "stop_lon":-71.142483},
{"stop_name": "Kendall/MIT", "stop_lat": 42.36249079 , "stop_lon":-71.08617653},
{"stop_name": "Charles/MGH", "stop_lat": 42.361166 , "stop_lon":-71.070628},
{"stop_name": "Downtown Crossing", "stop_lat": 42.355518 , "stop_lon":-71.060225},
{"stop_name": "Quincy Center", "stop_lat": 42.251809 , "stop_lon":-71.005409},
{"stop_name": "Quincy Adams", "stop_lat": 42.233391 , "stop_lon":-71.007153},
{"stop_name": "Ashmont", "stop_lat": 42.284652 , "stop_lon":-71.06448899999999},
{"stop_name": "Wollaston", "stop_lat": 42.2665139 , "stop_lon":-71.0203369},
{"stop_name": "Fields Corner", "stop_lat": 42.300093 , "stop_lon":-71.061667},
{"stop_name": "Central Square", "stop_lat": 42.365486 , "stop_lon":-71.103802},
{"stop_name": "Braintree", "stop_lat": 42.2078543 , "stop_lon":-71.0011385}]

var polylineAshmont = [
{lat: 42.395428 , lng:-71.142483}, // Alewife
{lat: 42.39674 , lng:-71.121815}, // Davis
{lat: 42.3884 , lng:-71.11914899999999}, // Porter
{lat: 42.373362 , lng:-71.118956}, // Harvard
{lat: 42.365486 , lng:-71.103802}, //Central
{lat: 42.36249079 , lng:-71.08617653}, // Kendall
{lat: 42.361166 , lng:-71.070628}, // Charles
{lat: 42.35639457 , lng:-71.0624242}, // Park
{lat: 42.355518 , lng:-71.060225}, // Downtown
{lat: 42.352271 , lng:-71.05524200000001}, // South
{lat: 42.342622 , lng:-71.056967}, // Broadway
{lat: 42.330154 , lng:-71.057655}, // Andrew
{lat: 42.320685 , lng:-71.052391}, //JFK
{lat: 42.31129 , lng:-71.053331}, // Savin Hill
{lat: 42.300093 , lng:-71.061667}, // Fields Corner
{lat: 42.29312583 , lng:-71.06573796000001}, //Shawmut
{lat: 42.284652 , lng:-71.06448899999999}, //Ashmont
];

var polylineBraintree = [
{lat: 42.320685 , lng:-71.052391}, //JFK
{lat: 42.275275 , lng:-71.029583}, // N Quincy
{lat: 42.2665139 , lng:-71.0203369}, // Wollaston
{lat: 42.251809 , lng:-71.005409}, // Quincy Center
{lat: 42.233391 , lng:-71.007153}, // Quincy Adams
{lat: 42.2078543 , lng:-71.0011385}]; // Braintree

var currentLat = 0;
var currentLong = 0;
var request = new XMLHttpRequest();
var currentLocation = new google.maps.LatLng(currentLat, currentLong);
var myOptions = {
          zoom: 13, // The larger the zoom number, the bigger the zoom
          center: currentLocation,
          mapTypeId: google.maps.MapTypeId.ROADMAP
};

var schedule;
scheduleRequest = new XMLHttpRequest();
scheduleRequest.open("get", "https://rocky-taiga-26352.herokuapp.com/redline.json", true);
scheduleRequest.onreadystatechange = setInfoWindows;
scheduleRequest.send();


var map;


function myLocation() {
	var location = navigator.geolocation;
	if (location) {
        	location.getCurrentPosition(function(position) {
	        	currentLat = position.coords.latitude;
	        	currentLong = position.coords.longitude;
	        	renderMap();
    		});
    	}
    	else {
  		alert("Geolocation not supported.");
        }
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    myLocation();
    setMarker();
}
      

function renderMap() {

      currentLocation = new google.maps.LatLng(currentLat, currentLong);
      
      //Focus on my location
      map.panTo(currentLocation);
      
      var minDistance = Number.MAX_VALUE;
      var minStation;
      for(var i = 0; i < stations.length; i++) {
      	      var curStation = [stations[i]["stop_lat"], stations[i]["stop_lon"]];
              var curDistance = haversineDistance([currentLat, currentLong], curStation, true);
      	      if(curDistance < minDistance) {
      	             minDistance = curDistance;
      	             minStation = stations[i]["stop_name"];
      	      }
      }
      minDistance = minDistance.toFixed(2);

      // Create a marker
      var marker = new google.maps.Marker({
	      position: currentLocation,
	      title: "<h1>Current Location</h1>" + "<p>" + minStation + " is " + minDistance + " miles away.</p>"
      });
      marker.setMap(map);
      
      var infowindow = new google.maps.InfoWindow();

      // Open info window on click of marker
      google.maps.event.addListener(marker, 'click', function() {
	      infowindow.setContent(marker.title);
	      infowindow.open(map, marker);
      });

      renderPolylines();
}

function setMarker() {

	infoWindow = new google.maps.InfoWindow();

	for(var i = 0; i < stations.length; i++) {
		var stationLocation = new google.maps.LatLng(stations[i]["stop_lat"], stations[i]["stop_lon"]);

		var marker = new google.maps.Marker({
			position: stationLocation,
			title: stations[i]["stop_name"],
			icon: 'icon.png'
		});

		marker.setMap(map);

		createInfoWindow(marker);
	}
}

function createInfoWindow(marker) {
	google.maps.event.addListener(marker, 'click', function () {
	    var content = "<h1>" + marker.title + "</h1>";
	    var trips = schedule["TripList"]["Trips"];
	    for(var i = 0; i < trips.length; i++) {
	    	for(var j = 0; j < trips[i]["Predictions"].length; j++) {
		    	if(trips[i]["Predictions"][j]["Stop"] == marker.title) {
		    		var prediction = trips[i]["Predictions"][j]["Seconds"];
		    		var minutes = Math.floor(prediction / 60);
		    		var seconds = prediction - minutes * 60;
		    		if(seconds < 10) { 
		    			seconds = "0" + seconds;
		    		}
		    		if(minutes >= 0) {
		    			content += "<p> Arriving in " + minutes + " minutes and " + seconds + " seconds" + "</p>";
		    		}
		    	}
		}
	    }
            infoWindow.setContent(content);
            infoWindow.open(map, this);
        });
}

function setInfoWindows() {
	if(scheduleRequest.readyState == 4 && scheduleRequest.status == 200) {
		var data = scheduleRequest.responseText;
		schedule = JSON.parse(data);
	}
}

function renderPolylines() {
    var ashmontPath = new google.maps.Polyline( {
    	path:polylineAshmont,
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
    });
    ashmontPath.setMap(map);

    var braintreePath = new google.maps.Polyline( {
    	path:polylineBraintree,
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2
    });
    braintreePath.setMap(map);
}

// From Stack Overflow: http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}

