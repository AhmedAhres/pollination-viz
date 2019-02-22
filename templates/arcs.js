// This class is for 3D

// Initialize the variables which help us get to make arcs
let width_circle = 20,
  height_circle = 20,
  twoPi = 2 * Math.PI,
  progress = 0,
  progress_unmet = 0,
  formatPercent = d3.format(".0%");

// Initialize the arcs
let arc = d3.arc()
  .startAngle(0)
  .innerRadius(52)
  .outerRadius(59);

// Pollination contribution to food energy arc initialization
let svg_arc1 = d3.select(".docsChart").append("svg")
  .attr("class", "percentage")
  .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
  .attr(
    "transform",
    "translate(" + width_circle * 3.5 + "," + height_circle * 3.5 + ")");
// Setting the fill color and the arc angle for the type of data for arc1
svg_arc1.append("path")
  .attr("fill", "#E6E7E8")
  .attr("d", arc.endAngle(twoPi));
let foreground = svg_arc1.append("path")
  .attr("fill", "#00D2B6");
let percentComplete = svg_arc1.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.3em");

// Unmet need percentage starts here
let svg_arc2 = d3.select(".docsChart2").append("svg")
  .attr("class", "percentage")
  .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
  .attr(
    "transform",
    "translate(" + width_circle * 4.2 + "," + height_circle * 3.5 + ")"
  );
// Setting the fill color and the arc angle for the type of data for arc2
svg_arc2.append("path")
  .attr("fill", "#E6E7E8")
  .attr("d", arc.endAngle(twoPi));
let foreground2 = svg_arc2.append("path")
  .attr("fill", "#00D2B6");
let percentComplete2 = svg_arc2.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.3em");

// Update the percentages of the arcs in 3D Map depending upon the size and
// type of the data
function update_percentages(period) {
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      data_c[d.iso3] = global_data_c[d.iso3][period];
    });
    current_nature_contribution = data_c[previousCountryClicked];
    current_unmet_need = 100 - current_nature_contribution
    change_percentage_animation(current_nature_contribution, current_unmet_need);
    if (checked3D == 'true') {
      g.selectAll("path").attr("fill", function(d) {
        // Pull data for particular iso and set color - Not able to fill it
        if (d.type == 'Feature') {
          d.total = data_c[d.properties.iso3] || 0;
        } else {}
        return colorScale(d.total);
      })
    }
  });
}

// Method for changing the percentage animation depending upon the type of data
// Takes into account the percentage change and fill in the arc for that mapped
// percentage.
function change_percentage_animation(contribution, unmet) {
  let contrib_interpolation = d3.interpolate(progress, contribution);
  let unmet_interpolation = d3.interpolate(progress_unmet, unmet);
  d3.transition().duration(1000).tween("contribution", function() {
    return function(t) {
      progress = contrib_interpolation(t);
      progress_unmet = unmet_interpolation(t);
      foreground.attr("d", arc.endAngle(twoPi * progress / 100));
      foreground2.attr("d", arc.endAngle(twoPi * progress_unmet / 100));
      // In case the data is measured, we put "NM" for "Not Measured"
      if (contribution == null)
        percentComplete.text("NM");
      else
        percentComplete.text(formatPercent(progress / 100));
      if (unmet == null)
        percentComplete2.text("NM");
      else
        percentComplete2.text(formatPercent(progress_unmet / 100));
    };
  });
}