var apiKey = "pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ";

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: apiKey
})
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

graymap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
 
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "orange";
    case magnitude > 3:
      return "blue";
    case magnitude > 2:
      return "yellow";
    case magnitude > 1:
      return "brown";
    default:
      return "white";
    }
  }
  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  L.geoJson(data, {
    
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,
    
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);
  
  var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "red",
      "orange",
      "blue",
      "yellow",
      "brown",
      "white"
    ];
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'>&nbsp&nbsp&nbsp&nbsp</i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  
  legend.addTo(map);
});
