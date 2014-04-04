App.directionsService = new google.maps.DirectionsService();
App.directionsDisplay = new google.maps.DirectionsRenderer();

App.getDirections = function(){
  var start  = $('#start').val();
  var end    = $('#end').val();
  var waypts = [];
  var request;

  waypts.push({
        location:"Central Park",
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
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

$(function(){
  // initialize map
  var new_york = new google.maps.LatLng(40.7284186, -73.98713956);
  var mapOptions = {
    zoom: 14,
    center: new_york
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  App.directionsDisplay.setMap(map);
  App.directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  // add event listener to form submission
  $('#get-directions-form').on('submit', function(e){
    $('.adp').remove();
    e.preventDefault();
    App.getDirections();
  });
});



function latLongOfAddress() {
  var geocoder = new google.maps.Geocoder();
  var address = "Yankee Stadium";
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results[0].geometry.location.lat());
      console.log(results[0].geometry.location.lng());
      console.log(results);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
