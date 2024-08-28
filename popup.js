// Function to show the sidebar with district, precinct, and split information
function showSidebar(district, clickedPrecinct, clickedSplit, precincts) {
    const sidebar = document.getElementById("sidebar");
    const sidebarTitle = document.getElementById("sidebar-title");
    const sidebarContent = document.getElementById("sidebar-content");
  
    sidebarTitle.innerText = `District ${district}`;
  
    // Convert precincts array to a list
    let precinctsList = '<ul class="list-group">';
    precincts.forEach((precinct) => {
      precinctsList += `<li class="list-group-item">Precinct: ${precinct}</li>`;
    });
    precinctsList += "</ul>";
  
    // Add search input field and update sidebar content
    sidebarContent.innerHTML = `
      <button id="closeSidebar" class="btn btn-sm btn-secondary" style="float: right;">Close</button>
      <div>
          <input type="text" id="precinctSearch" class="form-control mb-2" placeholder="Search for a Precinct...">
          <button id="searchButton" class="btn btn-primary btn-sm mb-3">Search</button>
          <p><strong>Clicked Precinct:</strong> ${clickedPrecinct}</p>
          <p><strong>Split:</strong> ${clickedSplit}</p>
          <h5>All Precincts</h5>
          <div class="accordion" id="precinctAccordion">
              <div class="accordion-item">
                  <h2 class="accordion-header" id="headingPrecincts">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrecincts" aria-expanded="false" aria-controls="collapsePrecincts">
                          Precinct List
                      </button>
                  </h2>
                  <div id="collapsePrecincts" class="accordion-collapse collapse" aria-labelledby="headingPrecincts" data-bs-parent="#precinctAccordion">
                      <div class="accordion-body">
                          ${precinctsList}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
  
    sidebar.style.display = "block";
  
    // Add event listener to close the sidebar when the button is clicked
    document.getElementById("closeSidebar").onclick = function () {
      closeSidebar();
    };
  
    // Add event listener for search button
    document.getElementById("searchButton").onclick = function () {
      searchPrecinct();
    };
  }
  

// Add click event listener to the map
map.on("click", "districts-fill", function (e) {
  if (e.features.length > 0) {
    const feature = e.features[0];
    const district = feature.properties.CoP_Dist;
    const clickedPrecinct = feature.properties.Precinct;
    const clickedSplit = feature.properties.Split;

    console.log("Feature properties:", feature.properties); // Debugging line to check properties

    // Collect all precincts for the district
    const allFeatures = map.queryRenderedFeatures({
      layers: ["districts-fill"],
    });
    let precinctsSet = new Set();

    allFeatures.forEach((feat) => {
      if (feat.properties.CoP_Dist === district) {
        const precincts = feat.properties.Precinct.split(",").map((p) =>
          p.trim()
        );
        precincts.forEach((precinct) => precinctsSet.add(precinct));
      }
    });

    const precinctsArray = Array.from(precinctsSet);

    // Show the sidebar with the new clickedSplit parameter
    showSidebar(district, clickedPrecinct, clickedSplit, precinctsArray);

    // Highlight the clicked precinct with the split
    map.setFilter("precinct-highlight", [
      "all",
      ["==", "Precinct", clickedPrecinct],
      ["==", "Split", clickedSplit],
    ]);
  }
});
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = "none";
  }