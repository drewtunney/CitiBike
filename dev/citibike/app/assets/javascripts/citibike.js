$(document).ready(function(){
  $('#get-directions-form').on('submit', function(e){
    $('.adp').remove();
    e.preventDefault();
    getDirections();
  });
});


function getDirections(){
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
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
  }

  function calcRoute() {
    var start = $('#start').val();
    var end = $('#end').val();
    var waypts = []
    waypts.push({
          location:"Central Park",
          stopover:true
      });
    var request = {
      origin:start,
      destination:end,
      waypoints: waypts,
      optimizeWaypoints: true,
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
}