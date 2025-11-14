

const width = 960;
const height = 600;
const projection = d3.geoNaturalEarth1()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);
const svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);
const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1)
        .html(d.properties.name)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      // --- THIS IS THE D3 CHANGE ---
      // Instead of alert(), we get the country's ID and Name
      // The 'd.id' is the 3-letter code (e.g., "FRA" for France)
      const countryCode = d.id;
      const countryName = d.properties.name;
      
      console.log(`Country clicked: ${countryName} (${countryCode})`);
      
      // And we call our new function to update the chart!
      updateChart(countryCode, countryName);
    });
});

// --- PART 2: OUR NEW PLOTLY CHART FUNCTION ---

/**
 * Fetches data for a specific country and updates the Plotly chart.
 * @param {string} countryCode - The 3-letter ISO code (e.g., "IND", "USA").
 * @param {string} countryName - The full name (e.g., "India", "United States").
 */
// --- PART 2: OUR NEW PLOTLY CHART FUNCTION (WITH MORE LOGGING) ---

async function updateChart(countryCode, countryName) {
  
  console.log("Step 1: updateChart started.");
  const chartDiv = document.getElementById('plotly-chart');
  
  if (!chartDiv) {
    console.error("CRITICAL ERROR: Cannot find <div id='plotly-chart'>");
    return;
  }
  
  chartDiv.innerHTML = `<h2>Loading ${countryName}'s GDP data...</h2>`;
  const apiUrl = `http://127.0.0.1:5000/api/gdp/${countryCode}`;

  try {
    console.log("Step 2: Starting fetch in try...catch block...");
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(`Step 3: Data received from Flask for ${countryCode}:`, data);

    if (data.length === 0) {
      console.log("Step 4: Data is empty, showing 'No data' message.");
      chartDiv.innerHTML = `<h2>Sorry, no GDP data is available for ${countryName}.</h2>`;
      return;
    }

    console.log("Step 5: Preparing data for Plotly...");
    const years = data.map(item => item.date).reverse();
    const gdpValues = data.map(item => item.gdp).reverse();

    const plotData = [{
      x: years,
      y: gdpValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: `${countryName} GDP`
    }];

    const layout = {
      title: `${countryName} - GDP (in USD) Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'GDP ($)' }
    };

    console.log("Step 6: Calling Plotly.newPlot() to draw the chart...");
    Plotly.newPlot('plotly-chart', plotData, layout); // <-- FIXED
    console.log("Step 7: Chart draw call complete.");

  } catch (error) {
    console.error('Step 8: CATCH BLOCK ERROR:', error);
    chartDiv.innerHTML = "<h2>Could not load chart. An error occurred. (Check console)</h2>";
  }
}

// --- PART 3: INITIAL PAGE LOAD ---
console.log("Page loaded. Drawing initial chart for India...");
updateChart("IND", "India");