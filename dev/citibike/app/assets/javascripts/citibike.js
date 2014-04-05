App.directionsService = new google.maps.DirectionsService();
App.directionsDisplay = new google.maps.DirectionsRenderer();



App.getStations = function(){
  $.getJSON('/stations', function(data){ 
    stations = data; 
    console.log(stations)
  });
}

function latLong(location, callback) {
    var geocoder = new google.maps.Geocoder();
    var address = location;
    var longitude;
    var latitude;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            callback(latitude, longitude);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

setStation = function() {
  var start = $('#start').val();
  var startStationLat;
  var startStationLon;
  var startStation;           

  latLong(start, function(lat, lon) {
    station = findNearestStation(lat, lon);
    startStationLat = station['latitude']
    startStationLon = station['longitude']
  });
}

App.getDirections = function(start, startStationLat, startStationLon){
  var start = start;
  var startStation = new google.maps.LatLng(startStationLat, startStationLon);

  request = {
    origin:start,
    destination:startStation,
    travelMode: google.maps.TravelMode.BICYCLING
  };
  App.directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      App.directionsDisplay.setDirections(result);
    }
  });
}

App.getCurrentLocation = function(){
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(pos)
    });
  } else {
    handleNoGeolocation(false);
  }
}

$(function(){
  // initialize map
  var new_york = new google.maps.LatLng(40.7284186, -73.98713956);
  var mapOptions = {
    zoom: 12,
    center: new_york
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  App.directionsDisplay.setMap(map);
  App.directionsDisplay.setPanel(document.getElementById("directionsPanel"));
  // load Stations
  App.getStations();

  // add event listener to form submission
  $('#get-directions-form').on('submit', function(e){
    $('.adp').remove();
    e.preventDefault();
    App.getDirections();
  });
});
