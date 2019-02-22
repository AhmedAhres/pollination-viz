// Initializations
let colorScheme = d3.schemeReds[6];
let changeColorScheme = d3.schemeRdYlGn[5];

//Data and color scale and legend
let colorScale = d3.scaleThreshold()
  .domain([20, 40, 60, 80, 99, 100])
  .range(colorScheme);

// Color scale for changes for 2D Map
let changeColorScale = d3.scaleThreshold()
  .domain([-99, -49, 1, 51, 101])
  .range(changeColorScheme);

// Getting the Legend and setting the color scale on the legend
let svg_legend = d3.select(".box.box-1").append("svg");
let svg_change_legend = d3.select(".box.box-1").append("svg");

function makeChangeLegend(colorScale) {
  // This is for 2D Maps
  // Getting the Legend and setting the color scale on the legend
  let change_legend = svg_change_legend.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(0,40)");

  change_legend.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -4)
    .text("% change");

  let labels_change = ['<= 100%', '-50%', '0%', '50%', '>= 100%'];
  let c_legend = d3.legendColor()
    .labels(function(d) {
      return labels_change[d.i];
    })
    .shapePadding(4)
    .scale(changeColorScale);
  svg_change_legend.select(".legendThreshold")
    .call(c_legend);
}

function makeLegend(colorScale) {
  // This is for 3D Maps
  // Getting the Legend and setting the color scale on the legend
  let g_legend = svg_legend.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(0,20)");

  g_legend.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -4)
    .text("% contrib.");

  let labels = ['1-20', '21-40', '41-60', '61-80', '81-99', '100'];
  let legend = d3.legendColor()
    .labels(function(d) {
      return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
  svg_legend.select(".legendThreshold")
    .call(legend);
}

// Updating the legend since we change between different projections
function updateLegend(colorScale) {
  svg_legend.selectAll('*').remove();
  makeLegend(colorScale);
}

// Function to update the legend position when switching to 2D/3D
// since 2D has 2 legends (one for change map and one for normal map)
function updateLegendPosition(twoLegends) {
  if (twoLegends) {
    makeChangeLegend(changeColorScheme);
    svg_change_legend.attr("transform", "translate(0, -430)");
    svg_legend.attr("transform", "translate(0, 250)");
    svg_change_legend.attr("width", 100).attr("height", 170);
    document.getElementsByClassName('info-button')[0].style.top = "15%";
    document.getElementsByClassName('switch-proj')[0].style.top = "15%";
  } else {
    document.getElementsByClassName('info-button')[0].style.top = "0%";
    document.getElementsByClassName('switch-proj')[0].style.top = "0%";
    svg_legend.attr("transform", "translate(0, 20)");
    svg_change_legend.attr("width", 0);
  }
}