var directionsDisplay;
var map;


$(document).ready(function() {

var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var new_york = new google.maps.LatLng(40.7284186, -73.98713956);
  var mapOptions = {
    zoom: 14,
    center: new_york
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = "Elizabeth and Houston, New York, NY";
  var end = "21st and Broadway";
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.BICYCLING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
} 
initialize();
calcRoute();

});