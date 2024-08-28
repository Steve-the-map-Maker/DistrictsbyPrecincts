console.log("Loading map.js file...");

fetch("data/MultnomahCounty2024_transformed_updated.geojson")
  .then((response) => response.json())
  .then((json) => {
    var geojson = json; // Store the GeoJSON data in a variable
    assignUniqueColors(geojson);
    initializeMap(geojson); // Call initializeMap with the GeoJSON data
  });

const style = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

const map = new maplibregl.Map({
  container: "map",
  style: style,
  center: [-122.62283427563828, 45.50856459753845],
  zoom: 10.5,
});

function assignUniqueColors(geojsonData) {
  const colorMapping = {
    "1": "#e6194B", // Red
    "2": "#3cb44b", // Green
    "3": "#ffe119", // Yellow
    "4": "#4363d8", // Blue
  };

  geojsonData.features.forEach((feature) => {
    const copDist = feature.properties.CoP_Dist;
    feature.properties.color = colorMapping[copDist] || "#000000"; // Default to black if CoP_Dist is not in the mapping
  });
}

function initializeMap(geojsonData) {
  map.on("load", function () {
    map.addSource("districts", {
      type: "geojson",
      data: geojsonData,
    });

    // Existing district layers...
    map.addLayer({
      id: "districts-fill",
      type: "fill",
      source: "districts",
      layout: {},
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.5,
        "fill-outline-color": "#000000", // Black outline for polygons
      },
    });

    map.addLayer({
      id: "districts-outline",
      type: "line",
      source: "districts",
      layout: {},
      paint: {
        "line-color": "#000000",
        "line-width": 2,
      },
    });

    map.addLayer({
      id: "districts-labels",
      type: "symbol",
      source: "districts",
      layout: {
        "text-field": ["get", "DISTRICT"],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 14,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
      },
    });

    map.addLayer({
      id: "precinct-highlight",
      type: "line",
      source: "districts",
      layout: {},
      paint: {
        "line-color": "#ff0000", // Highlight color, red
        "line-width": 3,
      },
      filter: ["all", ["==", "Precinct", ""], ["==", "Split", ""]], // No precinct highlighted initially
    });
    
  });

  // Change the cursor to a pointer when over the districts
map.on("mouseenter", "districts-fill", function () {
  map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "districts-fill", function () {
  map.getCanvas().style.cursor = "";
});



}
