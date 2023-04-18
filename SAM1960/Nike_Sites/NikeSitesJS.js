function SitePopups(feature, layer){
  if(feature.properties){
    layer.bindPopup("US Army " + "<br>" + "Nike Missile " + feature.properties.name)
  }
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
    radius: 5,
    fillColor: fillColorVar,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  };
  let circleMarker = L.circleMarker(LatLng, geojsonMarkerOptions);
  return circleMarker;
}

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

var nikesites = L.geoJSON(Nikesites, {
  onEachFeature: SitePopups,
  pointToLayer: SiteIcon
})

nikesites.addTo(map);

var layerControl = L.control.layers().addTo(map);

layerControl.addBaseLayer(openstreetmap, "Open Street Map");

layerControl.addBaseLayer(mapboxmap, "Mapbox Map");

layerControl.addBaseLayer(satellitemap, "Satellite Map");
