// Function to show the sidebar with district and precincts
function showSidebar(district, clickedPrecinct, precincts) {
    const sidebar = document.getElementById('sidebar');
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarContent = document.getElementById('sidebar-content');

    sidebarTitle.innerText = `District ${district}`;

    // Convert precincts array to a list
    let precinctsList = '<ul class="list-group">';
    precincts.forEach(precinct => {
        precinctsList += `<li class="list-group-item">Precinct: ${precinct}</li>`;
    });
    precinctsList += '</ul>';

    // Update sidebar content with clicked precinct and precincts list
    sidebarContent.innerHTML = `
        <div class="accordion" id="sidebarAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingClickedPrecinct">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClickedPrecinct" aria-expanded="false" aria-controls="collapseClickedPrecinct">
                        Clicked Precinct
                    </button>
                </h2>
                <div id="collapseClickedPrecinct" class="accordion-collapse collapse" aria-labelledby="headingClickedPrecinct" data-bs-parent="#sidebarAccordion">
                    <div class="accordion-body">
                        <p>Precinct: ${clickedPrecinct}</p>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingPrecincts">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrecincts" aria-expanded="false" aria-controls="collapsePrecincts">
                        All Precincts
                    </button>
                </h2>
                <div id="collapsePrecincts" class="accordion-collapse collapse" aria-labelledby="headingPrecincts" data-bs-parent="#sidebarAccordion">
                    <div class="accordion-body">
                        ${precinctsList}
                    </div>
                </div>
            </div>
        </div>
    `;

    sidebar.style.display = 'block';
}

// Add click event listener to the map
map.on("click", "districts-fill", function (e) {
    if (e.features.length > 0) {
        const feature = e.features[0];
        const district = feature.properties.CoP_Dist;
        const clickedPrecinct = feature.properties.Precinct;

        console.log("Feature properties:", feature.properties); // Debugging line to check properties

        // Collect all precincts for the district
        const allFeatures = map.queryRenderedFeatures({ layers: ["districts-fill"] });
        let precinctsSet = new Set();

        allFeatures.forEach(feat => {
            if (feat.properties.CoP_Dist === district) {
                const precincts = feat.properties.Precinct.split(",").map(p => p.trim());
                precincts.forEach(precinct => precinctsSet.add(precinct));
            }
        });

        const precinctsArray = Array.from(precinctsSet);

        showSidebar(district, clickedPrecinct, precinctsArray);
    }
});

// Change the cursor to a pointer when over the districts
map.on("mouseenter", "districts-fill", function () {
    map.getCanvas().style.cursor = "pointer";
});
map.on("mouseleave", "districts-fill", function () {
    map.getCanvas().style.cursor = "";
});
