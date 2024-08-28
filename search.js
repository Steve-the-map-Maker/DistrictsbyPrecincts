function searchPrecinct() {
    const searchInput = document.getElementById("precinctSearch").value.trim();
  
    if (searchInput === "") {
      alert("Please enter a precinct to search.");
      return;
    }
  
    // Find the feature that matches the search input
    const features = map.querySourceFeatures("districts", {
      sourceLayer: "districts-fill",
    });
  
    const matchedFeature = features.find(
      (feature) =>
        feature.properties.Precinct === searchInput ||
        `${feature.properties.Precinct}${feature.properties.Split}` ===
          searchInput
    );
  
    if (matchedFeature) {
      const precinct = matchedFeature.properties.Precinct;
      const split = matchedFeature.properties.Split;
  
      // Update the sidebar to show the matched precinct
      showSidebar(matchedFeature.properties.CoP_Dist, precinct, split, [
        precinct,
      ]);
  
      // Highlight the matched precinct
      map.setFilter("precinct-highlight", [
        "all",
        ["==", "Precinct", precinct],
        ["==", "Split", split],
      ]);
  
      // Zoom to the matched precinct
      const coordinates = matchedFeature.geometry.coordinates;
      map.fitBounds(
        coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
        )
      );
    } else {
      alert("No precinct found with that name or ID.");
    }
  }