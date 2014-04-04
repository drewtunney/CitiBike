$(document).ready(function(){
  $('#get-directions-form').on('submit', function(e){
    e.preventDefault();
    getDirections();
  });
})


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
  }

  function calcRoute() {
    var start = $('#start').val();
    var end = $('#end').val();
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
}
  







// $(document).ready(function() {
//   function initializeMap() {
//   var directionsDisplay;
//   var directionsService = new google.maps.DirectionsService();
//   var map
//   var directionsDisplay = new google.maps.DirectionsRenderer();
//   var new_york = new google.maps.LatLng(40.7284186, -73.98713956);
//   var mapOptions = {
//     zoom: 14,
//     center: new_york
//   }
//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//   directionsDisplay.setMap(map);
// }

// function calcRoute() {
//   var directionsDisplay;
//   var directionsService = new google.maps.DirectionsService();
//   var map
//   var start = "Yankee Stadium";
//   var end = "Elizabeth and Houston, NY";
//   var request = {
//     origin:start,
//     destination:end,
//     travelMode: google.maps.TravelMode.BICYCLING
//   };
//   directionsService.route(request, function(result, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(result);
//     }
//   });
// } 

// initializeMap();
// calcRoute();
// });





