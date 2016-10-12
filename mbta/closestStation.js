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

var currentLat = 0;
var currentLong = 0;
var request = new XMLHttpRequest();
var currentLocation = new google.maps.LatLng(currentLat, currentLong);
var myOptions = {
          zoom: 13, // The larger the zoom number, the bigger the zoom
          center: currentLocation,
          mapTypeId: google.maps.MapTypeId.ROADMAP
};

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
      
      // Create a marker
      var marker = new google.maps.Marker({
	      position: currentLocation,
	      title: "Current Location"
      });
      marker.setMap(map);
      
      var infowindow = new google.maps.InfoWindow();

      // Open info window on click of marker
      google.maps.event.addListener(marker, 'click', function() {
	      infowindow.setContent(marker.title);
	      infowindow.open(map, marker);
      });
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
            infoWindow.setContent(marker.title);
            infoWindow.open(map, this);
        });
}


