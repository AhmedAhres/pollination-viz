// Current dataset depending on what we visualize
// and also the initializations
let firstTime = true;
let dataset = 'dataset/country_en.csv';
let dataset_2D = 'dataset/pixel_energy.csv';
let current_viz = "Food Energy";
let change_dataset = 'dataset/change_en.csv';
let country_data_2D;

// plot points on the map for 2D and 3D map
function showData(the_g, coordinates) {
  // Add circles to the country which has been selected
  // Removing part is within
  if (checked3D == 'true') {
    the_g.selectAll(".plot-point")
      .data(coordinates).enter()
      .append("circle")
      .classed('plot-point', true)
      .attr("cx", function(d) {
        return projection(d)[0];
      })
      .attr("cy", function(d) {
        return projection(d)[1];
      })
      .attr("r", "1px")
      .attr("fill", function(d) {
        color = d[2] || 0;
        return colorScale(color);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  } else {
    // This is just for 2D, we are creating a raster by creating a rectangle
    the_g.selectAll(".plot-point")
      .data(coordinates).enter()
      .append("rect")
      .classed('plot-point', true)
      .attr("x", function(d) {
        return projection(d)[0];
      })
      .attr("y", function(d) {
        return projection(d)[1];
      })
      .attr("width", "3")
      .attr("height", "3")
      .attr("fill", function(d) {
        color = d[2] || 0;
        return colorScale(color);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  }
}

// Update data loads the data depending upon the columns for Vitamin, Energy and Folate
// and changes the storytelling
function updateData(data_type) {
  switch (data_type) {
    case "Vitamin":
      current_viz = "Vitamin A";
      region_text = "Pollination Contribution to Vitamin A";
      title.innerHTML = "Pollination Contribution to Nutrition (Vitamin A) in " + current_year;
      contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
        current_viz + " in " + current_year + "?";
      colorScheme = d3.schemeGreens[6];
      title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs " + current_SSP + " (Top)";
      dataset = 'dataset/country_va.csv';
      dataset_graph = 'dataset/plot_vitamin.csv';
      dataset_2D = 'dataset/pixel_vitamin.csv';
      change_dataset = 'dataset/change_va.csv';
      color_graph = colorScale_vitamin;
      lineGraphObject.updateGraph(previousCountryClicked);

      break;
    case "Energy":
      current_viz = "Food Energy";
      region_text = "Pollination Contribution to Food Energy";
      title.innerHTML = "Pollination Contribution to Nutrition (Food Energy) in " + current_year;
      contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
        current_viz + " in " + current_year + "?";
      title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs " + current_SSP + " (Top)";
      colorScheme = d3.schemeReds[6];
      dataset = 'dataset/country_en.csv';
      dataset_graph = 'dataset/plot_energy.csv';
      dataset_2D = 'dataset/pixel_energy.csv';
      color_graph = colorScale_energy;
      change_dataset = 'dataset/change_en.csv';
      lineGraphObject.updateGraph(previousCountryClicked);
      break;
    case "Folate":
      current_viz = "Folate";
      region_text = "Pollination Contribution to Folate";
      title.innerHTML = "Pollination Contribution to Nutrition (Folate) in " + current_year;
      contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
        current_viz + " in " + current_year + "?";
      title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs " + current_SSP + " (Top)";
      colorScheme = d3.schemePurples[6];
      dataset = 'dataset/country_fo.csv';
      dataset_graph = 'dataset/plot_folate.csv';
      dataset_2D = 'dataset/pixel_folate.csv';
      color_graph = colorScale_folate;
      change_dataset = 'dataset/change_fo.csv';
      lineGraphObject.updateGraph(previousCountryClicked)
      break;
  }
  colorScale = d3.scaleThreshold()
    .domain([20, 40, 60, 80, 99, 100])
    .range(colorScheme);
  updateLegend(colorScale);
  let promise = new Promise(function(resolve, reject) {
    loadGlobalData(dataset);
    data_2D = load(dataset_2D);
    change_data = load(change_dataset)
    setTimeout(() => resolve(1), 10);
  });
  promise.then(function(result) {
    update_percentages(current_year);
    change_pollination_contribution(current_year);
    accessData();
  });
}

// Access data loads the daa for 3D and 2D and depending upon that colors
function accessData() {
  g.selectAll("path").attr("fill", function(d) {
      // Pull data for particular iso and set color - Not able to fill it
      if (checked3D == 'true') {
        d.total = data_c[d.properties.iso3] || 0;
        return colorScale(d.total);
      } else {
        return '#D3D3D3';
      }
    })
    .attr("d", path);
}

// Construct the static Map for 2D visualization by showData and initializing
// the 2D coordsplot
function make2015staticMap() {
  if (firstTime) {
    let coordstoplot = initialize_2D("2015", data_2D);
    showData(g_map2, coordstoplot);
    firstTime = false;
  }
}

// Loading the global data depending upon the dataset you give
// and make a data structure as a dictionary depending upon iso3 - this is more for 3D
function loadGlobalData(dataset) {
  global_data_c = load(dataset);
  data_c = {};
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      data_c[d.iso3] = global_data_c[d.iso3][current_year];
    });

  });
}

// Load the data from the dataset but construction a different kind of dictionary
// and does not take into account the current year into account - and is for 2D since
// the data is not aggregated
function load(dataset) {
  let result = {};
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      result[d.iso3] = d;
    });
  });
  return result;
}

// Initialize the data for 2D by making a list
function initialize_2D(period, data_) {
  let coordstoplot = [];
  for (let key in data_) {
    coordstoplot.push([data_[key]['lat'], data_[key]['long'], data_[key][period]]);
  }
  return coordstoplot;
}