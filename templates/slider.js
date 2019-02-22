let years = ["1850", "1900", "1950", "2000", "2050", "2100", "2150"];
let sliderSSPs = ['50', '100', '150']
let actualData = ["1850", "1900", "1910", "1945", "1980", "2015", "2050"];

// Function that formats the data to make it ready for the slider
// For 3D and 2D
let formatToData = function(d) {
  // TO BE OPTIMIZED WITH A DICTIONARY
  if (d == 1850 || d == 1900) return d;
  else if (d == 1950) return 1910;
  else if (d == 2000) return 1945;
  else if (d == 2050) return 1980;
  else if (d == 2100) return 2015;
  else if (d == 2150) return 2050;
  else if (d == 50) return "SSP1";
  else if (d == 100) return "SSP3";
  else return "SSP5";
}


// These are initializations which are used in both slider and story telling
let current_SSP = "SSP1";
let current_year = "1945"

// Changes the values displayed on the map depending on the period the user Chooses
// On the slider
// For 3D and 2D
function change_pollination_contribution(period) {
  if (checked3D == "true") {
    d3.csv(dataset, function(error, data) {
      data.forEach(function(d) {
        data_c[d.iso3] = global_data_c[d.iso3][period];
      });
      current_nature_contribution = data_c[previousCountryClicked];
      current_unmet_need = 100 - current_nature_contribution;
      change_percentage_animation(current_nature_contribution, current_unmet_need);
      g.selectAll("path").attr("fill", function(d) {
        // Pull data for particular iso and set color - Not able to fill it
        if (d.type == 'Feature') {
          d.total = data_c[d.properties.iso3] || 0;
          return colorScale(d.total);

        } else {}
      });
      // Update the regions data with the slider when zoomed in
      let coordstoplot = initialize_2D(period, country_data_2D);
      g.selectAll(".plot-point").data(coordstoplot).attr("fill", function(d) {
        color = d[2] || 0;
        return colorScale(color);
      });
    });
  }
  if (checked2D == "true") {
    d3.csv(change_dataset, function(error, data) {
      let promise = new Promise(function(resolve, reject) {
        // loadGlobalData('dataset/pixel_energy.csv');
        setTimeout(() => resolve(1), 10);
      });
      promise.then(function(result) {
        // TODO: Make the year not hard coded
        let coordstoplot = initialize_2D(period, change_data);
        g.selectAll(".plot-point").data(coordstoplot).attr("fill", function(d) {
          color = d[2] || 0;
          return changeColorScale(color);
        });
        let coordstoplot_static = initialize_2D('2015', data_2D);
        g_map2.selectAll(".plot-point").data(coordstoplot_static).attr("fill", function(d) {
          color = d[2] || 0;
          return colorScale(color);
        });
      });
    });

  }
}

// Changes the text in the story telling depending on the period chosen in the slider
function change_ssp_period(period) {
  if (period === "ssp1") {
    selector.style.left = 0;
    selector.style.width = ssp1.clientWidth + "px";
    selector.style.backgroundColor = "#777777";
    selector.innerHTML = "SSP1";
    current_SSP = "SSP1";
  } else if (period === "ssp3") {
    selector.style.left = ssp1.clientWidth + "px";
    selector.style.width = ssp3.clientWidth + "px";
    selector.innerHTML = "SSP3";
    selector.style.backgroundColor = "#418d92";
    current_SSP = "SSP3";
  } else {
    selector.style.left = ssp1.clientWidth + ssp3.clientWidth + 1 + "px";
    selector.style.width = ssp5.clientWidth + "px";
    selector.innerHTML = "SSP5";
    selector.style.backgroundColor = "#4d7ea9";
    current_SSP = "SSP5";
  }
  change_pollination_contribution(current_SSP);
  title.innerHTML = "Pollination Contribution to Nutrition (" + current_viz + ") in 2050 - " + current_SSP;
  update_percentages(current_SSP);
  contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
    current_viz + " in " + current_SSP + "?";

}

// Creates the slider depending on the projection type (2D or 3D)
function createSlider() {
  let min_year, max_year, width, default_, tickvalues;
  if (checked2D == "false") {
    min_year = 1850;
    max_year = 2150;
    width = 400;
    default_ = "2000";
    tickvalues = years;
  } else {
    min_year = 50;
    max_year = 150;
    width = 400;
    default_ = "50";
    tickvalues = sliderSSPs;
  }
  let slider = d3.sliderHorizontal()
    .min(min_year)
    .max(max_year)
    .step(50)
    .default(default_)
    .width(width)
    .tickValues(tickvalues)
    .tickFormat(formatToData)
    .on("onchange", val => {
      if (checked3D == "true") {
        // Here, the value we check for is still the original one, not the formatted one
        if (val == 1850) runSlider("1850", false);
        if (val == 1900) runSlider("1900", false);
        if (val == 1950) runSlider("1910", false);
        if (val == 2000) runSlider("1945", false);
        if (val == 2050) runSlider("1980", false);
        if (val == 2100) runSlider("2015", false);
        if (val == 2150) runSlider("2050", true);
      } else {
        if (val == 50) {
          runSlider("SSP1", false);
          BarGraphObject.updateBarGraph('dataset/ssp1_impacted.csv');
          title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs SSP1 (Top)";
          current_SSP = "SSP1";
        }
        if (val == 100) {
          runSlider("SSP3", false);
          BarGraphObject.updateBarGraph('dataset/ssp3_impacted.csv');
          title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs SSP3 (Top)";
          current_SSP = "SSP3";
        }
        if (val == 150) {
          runSlider("SSP5", false);
          BarGraphObject.updateBarGraph('dataset/ssp5_impacted.csv');
          title_map.innerHTML = "Pollination Contribution to " + current_viz + " in 2015 (Bottom) vs SSP5 (Top)";
          current_SSP = "SSP5";
        }
      }
    });

  let group = d3.select(".map-slider").append("svg")
    .attr("width", 900)
    .attr("height", 70)
    .append("g")
    .attr("transform", "translate(" + 200 + "," + 12 + ")")
    .call(slider);
}

// Update the data according to the projection (2D or 3D)
function runSlider(period, if_ssp) {
  if (!if_ssp) {
    title.innerHTML = "Pollination Contribution to Nutrition (" + current_viz + ") in " + period;
    contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
      current_viz + " in " + period + "?";
    current_year = period;
    removeSSPs();
    change_pollination_contribution(period);
    update_percentages(period);
  } else {
    if (checked3D == "true") showSSPs();
    if (checked2D == "true") change_period(period);
    title.innerHTML = "Pollination Contribution to Nutrition (" + current_viz + ") in 2050 - " + current_SSP;
    contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
      current_viz + " in " + current_SSP + "?";
    change_pollination_contribution(current_SSP);
    update_percentages(current_SSP);
    current_year = current_SSP;
  }
}