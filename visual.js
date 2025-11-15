
let selectedCountries = []; 
let currentIndicator = "gdp";
let currentIndicatorName = "GDP";
let currentChartType = "line"; 

const Y_AXIS_LABELS = {
  gdp: "GDP (Current US$)",
  inflation: "Inflation (Annual %)",
  unemployment: "Unemployment (%)"
};
const chartPanel = document.getElementById('chart-panel');
const closePanelButton = document.getElementById('close-panel-btn');
const indicatorSelect = document.getElementById('indicator-select');
const chartTypeSelect = document.getElementById('chart-type-select'); // New
const clearButton = document.getElementById('clear-selection-btn');   // New
const tooltip = d3.select("#tooltip");

//CHART UPDATE FUNCTION 

async function updateChart() {
  if (selectedCountries.length === 0) {
    chartPanel.classList.remove('visible');
    return;
  }

  const chartDiv = document.getElementById('plotly-chart');
  chartDiv.innerHTML = `<h2>Loading ${currentIndicatorName} data for ${selectedCountries.length} countries...</h2>`;

  if (currentChartType === 'pie') {
    chartDiv.innerHTML = `<h2>Loading latest ${currentIndicatorName} data...</h2>`;
    
    //compare the *latest* value for each country
    let pieLabels = [];
    let pieValues = [];
    
    const promises = selectedCountries.map(async (country) => {
      const apiUrl = `http://127.0.0.1:5000/api/data/${currentIndicator}/${country.code}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.length > 0) {
      
        const latestData = data.reverse().find(d => d.value !== null);
        if (latestData) {
          pieLabels.push(country.name);
          pieValues.push(latestData.value);
        }
      }
    });
    await Promise.all(promises);

    const plotData = [{
      type: 'pie',
      labels: pieLabels,
      values: pieValues,
      textinfo: "label+percent",
      insidetextorientation: "radial"
    }];
    
    const layout = {
      title: `Latest ${currentIndicatorName} Comparison`
    };

    Plotly.newPlot('plotly-chart', plotData, layout, {responsive: true});

  } else {
    let plotData = [];
    
    const promises = selectedCountries.map(async (country) => {
      const apiUrl = `http://127.0.0.1:5000/api/data/${currentIndicator}/${country.code}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.length > 0) {
        const years = data.map(item => item.date).reverse();
        const values = data.map(item => item.value).reverse();
        const trace = {
          x: years,
          y: values,
          type: currentChartType === 'line' ? 'scatter' : 'bar',
          mode: currentChartType === 'line' ? 'lines+markers' : undefined,
          name: country.name // This adds the legend
        };
        plotData.push(trace);
      }
    });
    await Promise.all(promises);

    const layout = {
      title: `${currentIndicatorName} Comparison`,
      xaxis: { title: 'Year' },
      yaxis: { title: Y_AXIS_LABELS[currentIndicator] },
      barmode: 'group' // Groups bars side-by-side
    };
    
    Plotly.newPlot('plotly-chart', plotData, layout, {responsive: true});
  }
}

// 1. D3 Map Setup and Click Listener
const mapSvg = d3.select("#map").append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

const projection = d3.geoNaturalEarth1()
  .scale(d3.min([window.innerWidth / 2.5 / Math.PI, window.innerHeight / 2.5 / Math.PI]) * 2.5)
  .translate([window.innerWidth / 2, window.innerHeight / 2]);
  
const path = d3.geoPath().projection(projection);

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
  mapSvg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("id", (d) => `country-${d.id}`) // Give each country path an ID
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1)
        .html(d.properties.name) // Display country name
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      
      const countryCode = d.id;
      const countryName = d.properties.name;
      const countryPath = d3.select(this); 

      const selectedIndex = selectedCountries.findIndex(c => c.code === countryCode);

      if (selectedIndex > -1) {
        selectedCountries.splice(selectedIndex, 1); 
        countryPath.classed('country-selected', false); // Remove CSS class
      } else {

        selectedCountries.push({ code: countryCode, name: countryName }); 
        countryPath.classed('country-selected', true); // Add CSS class
      }
      
      // Update the chart
      updateChart();
      if (selectedCountries.length > 0) {
        chartPanel.classList.add('visible');
      } else {
        chartPanel.classList.remove('visible');
      }
    });
});

indicatorSelect.addEventListener('change', (event) => {
  currentIndicator = event.target.value;
  currentIndicatorName = event.target.options[event.target.selectedIndex].text;
  updateChart(); 
});

chartTypeSelect.addEventListener('change', (event) => {
  currentChartType = event.target.value;
  updateChart(); 
});

clearButton.addEventListener('click', () => {
  selectedCountries = []; 
  mapSvg.selectAll('.country-selected').classed('country-selected', false); // Clear map styles
  updateChart(); 
});

closePanelButton.addEventListener('click', () => {
  chartPanel.classList.remove('visible');
});

console.log("Dashboard ready. Click countries to compare them.");