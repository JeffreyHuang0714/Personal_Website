let map = L.map('mapId').setView([47.1164,-101.2996], 2);

function SitePopups(feature, layer){
  if(feature.properties){
    layer.bindPopup("US Army " + "<br>" + "Nike Missile " + feature.properties.name)
  }
}

function BSitePopups(feature, layer){
  if(feature.properties){
    layer.bindPopup("US Air Force" + "<br>" + feature.properties.name + "<br>" + feature.properties.operator)
  }
}

function BSiteIcon(feature, LatLng){
  let geojsonMarkerOptions = {
    radius: 4,
    fillColor: "gold",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  }
  let circleMarker = L.circleMarker(LatLng, geojsonMarkerOptions);
  return circleMarker;
}

function SiteIcon(feature, LatLng){
  let fillColorVar = "";
  if(feature.properties.name.includes("Launch Site")){
    fillColorVar = "red"
  }
  if(feature.properties.name.includes("Control Site")){
    fillColorVar = "blue"
  }
  let geojsonMarkerOptions = {
    radius: 4,
    fillColor: fillColorVar,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  };
  let circleMarker = L.circleMarker(LatLng, geojsonMarkerOptions);
  return circleMarker;
}

function getColor(d) {
    return d > 3000000 ? '#800026' :
           d > 2000000  ? '#BD0026' :
           d > 910000  ? '#E31A1C' :
           d > 500000  ? '#FC4E2A' :
           d > 200000   ? '#FD8D3C' :
           d > 66000   ? '#FEB24C' :
           d > 50000   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.POP_TOTAL),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.5
    };
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50000, 66000, 200000, 500000, 910000, 2000000, 3000000],
        labels = [];

    div.innerHTML = '<h4>Population in 1960</h4>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

function backgroundLayer(feature, layer) {
    layer.on({
      'add': function(){
        layer.bringToBack()
        }
      }
    )
  }


var mapboxmap = L.tileLayer('https://api.mapbox.com/styles/v1/mingruihuang/cktakj3dg6sdb17lpomyyqbtp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWluZ3J1aWh1YW5nIiwiYSI6ImNrdGFrZmNuOTFuN3MycXA0b2Q0eGhxOHUifQ.FFEWESFqX_rTrQC_vr_PmQ', {
   minZoom: 3,
   attribution: 'Map Data &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>, Create By Mingrui Huang, 2022'
});

var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWluZ3J1aWh1YW5nIiwiYSI6ImNrdGFrZmNuOTFuN3MycXA0b2Q0eGhxOHUifQ.FFEWESFqX_rTrQC_vr_PmQ',{
  minZoom: 3,
  attribution: 'Map Data &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox Satellite</a>, Create By Mingrui Huang, 2022'
});

var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    attribution: 'Map Data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, Create By Mingrui Huang, 2022'
});

map.setMaxBounds(map.getBounds());
mapboxmap.addTo(map);

var pop1960 = L.geoJson(pop,{
  style: style,
  onEachFeature: backgroundLayer
})

var nikesites = L.geoJSON(Nikesites, {
  onEachFeature: SitePopups,
  pointToLayer: SiteIcon
})

var bomarcsites = L.geoJSON(BomarcSites, {
  onEachFeature: BSitePopups,
  pointToLayer: BSiteIcon
})

//legend.addTo(map);

//pop1960.addTo(map);

nikesites.addTo(map);

bomarcsites.addTo(map);

var layerControl = L.control.layers().addTo(map);

layerControl.addOverlay(nikesites, "Nike Missile Sites");

layerControl.addOverlay(bomarcsites, "BOMARC Missile Sites");

layerControl.addOverlay(pop1960, "Population Choropleth");

layerControl.addBaseLayer(openstreetmap, "Open Street Map");

layerControl.addBaseLayer(mapboxmap, "Mapbox Map");

layerControl.addBaseLayer(satellitemap, "Satellite Map")

map.on('overlayadd', function(eventLayer){
    if (eventLayer.name === 'Population Choropleth'){
        map.addControl(legend);
    }
})

map.on('overlayremove', function(eventLayer){
    if (eventLayer.name === 'Population Choropleth'){
         map.removeControl(legend);
    }
})
