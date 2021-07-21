var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earthquakes = new L.LayerGroup();

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var earthquakes = new L.LayerGroup();

    var baseMaps = {
        "Street Maps": streetmap, 
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
    
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });
      streetmap.addTo(myMap)

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

      d3.json(queryUrl, function(data) {
        function styleinfo(feature) {
            return {
              opacity: 1,
              fillColor: getColor(feature.properties.mag),
              radius: getRadius(feature.properties.mag),
              color: "000000",
              stroke: true,
              weight: 0.5,
              fillOpacity: 1
            };
        }
        function getColor(magnitude) {
            switch (true) {
              case magnitude > 5:
                return "#ea2c2c";
              case magnitude > 4:
                return "#ea822c";
              case magnitude > 3:
                return "#ee9c00";
              case magnitude > 2:
                return "#eecc00";
              case magnitude > 1:
                return "#d4ee00";
              default:
                return "#98ee00";
              }
        }
        function getRadius(magnitude) {
            if (magnitude === 0) {
              return 1;
            }
            return magnitude *4 ;
        }
          
          // function createFeatures(earthquakeData) {
          L.geoJSON((data),{
            pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng);
            },
            style: styleinfo,
            onEachFeature: function(feature, layer) {
              layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
            }
        }).addTo(earthquakes);
        earthquakes.addTo(myMap);
    });