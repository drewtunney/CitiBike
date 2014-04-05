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

App.getDirections = function(){
  var start         = $('#start').val();
  var end           = $('#end').val();
  var waypts        = [];
  var request;
  var startLat;
  var startLon;
  var endLat;
  var endLon;
  var startStation;
  var endStation;

  latLong(start, function(lat, lon) {
    startLat = lat;
    startLon = lon;
  });

  latLong(end, function(lat, lon) {
    endLat = lat;
    endLon = lon;
  });

  startStation = findNearestStation(startLat, startLon);
  console.log(startStation)

  waypts.push({
        location: "Central Park, NYC",
        stopover:true
  });

  request = {
    origin:start,
    destination:end,
    waypoints: waypts,
    optimizeWaypoints: true,
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
