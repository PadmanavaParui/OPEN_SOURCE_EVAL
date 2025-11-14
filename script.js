// --- PART 1: YOUR TEAMMATE'S D3 MAP CODE (with one small change) ---

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
async function updateChart(countryCode, countryName) {
  
  // Show a loading message
  document.getElementById('plotly-chart').innerHTML = `<h2>Loading ${countryName}'s GDP data...</h2>`;

  // Build the new dynamic API URL
  const apiUrl = `http://127.0.0.1:5000/api/gdp/${countryCode}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log(`Data received from Flask for ${countryCode}:`, data);

    // Check if the server returned empty data (e.g., no data for that country)
    if (data.length === 0) {
      document.getElementById('plotly-chart').innerHTML = 
        `<h2>Sorry, no GDP data is available for ${countryName}.</h2>`;
      return;
    }

    // Prepare the data for Plotly
    const years = data.map(item => item.date).reverse();
    const gdpValues = data.map(item => item.gdp).reverse();

    // Define the chart data
    const plotData = [{
      x: years,
      y: gdpValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: `${countryName} GDP`
    }];

    // Define the chart layout (now with a dynamic title)
    const layout = {
      title: `${countryName} - GDP (in USD) Over Time`,
      xaxis: { title: 'Year' },
      yaxis: { title: 'GDP ($)' }
    };

    // Draw the chart.
    // We use Plotly.react() instead of newPlot() because it's
    // much faster for updating a chart that already exists.
    Plotly.react('plotly-chart', plotData, layout);

  } catch (error) {
    // If the fetch fails
    console.error('Error fetching data:', error);
    document.getElementById('plotly-chart').innerHTML =
      "<h2>Could not load chart. Is the Python server running?</h2>";
  }
}

// --- PART 3: INITIAL PAGE LOAD ---

// When the page first loads, call updateChart() with India's
// data so the chart isn't empty.
updateChart("IND", "India");