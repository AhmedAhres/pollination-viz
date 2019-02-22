// Do initialization for zoom3D and zoom2D
let zoom_3D, zoom_2D = null

// Click function which is called when you zoom into a country
// and shows you all the datapoints for that country with country centerd
function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  // Get info of the active country/feature
  let active_info = active.node();

  // For centering the globe to that particular country
  geo_centroid = d3.geoCentroid(active_info.__data__);

  let bounds = path.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,

    // Change the scale to change the zoom when you select a country
    scale = Math.max(1, Math.min(12, 0.9 / Math.max(dx / width, dy / height)));
  // translate = [width / 2 - scale * geo_centroid[0], height / 2 - scale * geo_centroid[1]];

  // For disabling the toggle button when you are zoomed in
  document.getElementById("checked3D").disabled = true;
  document.getElementById("checked2D").disabled = true;

  svg.transition()
    .duration(750)
    .tween('rotate', function() {
      let r = d3.interpolate(projection.rotate(), [-geo_centroid[0], -geo_centroid[1]]);
      return function(t) {
        projection.rotate(r(t));
        svg.selectAll("path").attr("d", path);
      }
    })
    // TODO: Need to set it on the basis of the size of the country to fit in the whole svg
    .call(zoom_3D.scaleTo, scale);

  $('.box-container').css({
    'background': 'radial-gradient(circle at 37%, rgb(236, 246, 255) 36%, rgb(228, 255, 255) 42%, rgb(215, 254, 255) 49%, rgb(204, 245, 255) 56%, rgb(191, 234, 255) 63%, rgb(147, 193, 227) 70%, rgb(147, 193, 227) 77%, rgb(147, 193, 227) 84%, rgb(81, 119, 164) 91%)'
  });

  countryName.innerHTML = active_info.__data__.properties.name;

  country_data_2D = Object.keys(data_2D).filter(function(k) {
    return k.indexOf(active_info.__data__.properties.iso3) == 0;
  }).reduce(function(newData, k) {
    newData[k] = data_2D[k];
    return newData;
  }, {});

  // Get 2D points for the map
  let coordstoplot = initialize_2D(current_year, country_data_2D);

  if (Object.keys(country_data_2D).length != 0) {
    if (previousCountryClicked !== null) {
      svg.selectAll('.plot-point').remove();
    }

    // The regions should appear after we zoom in the country
    setTimeout(function() {
      showData(g, coordstoplot);
    }, 751) // Should be more than 750 -> more than duration
  } else {
    if (previousCountryClicked !== null) {
      svg.selectAll('.plot-point').remove();
    }
  }

  previousCountryClicked = active_info.__data__.properties.iso3
  current_nature_contribution = data_c[active_info.__data__.properties.iso3];
  current_unmet_need = 100 - current_nature_contribution;
  change_percentage_animation(current_nature_contribution, current_unmet_need);
  lineGraphObject.updateGraph(previousCountryClicked);
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

// Zoomed for 3D
function zoomed() {
  // 1.5 here refers to the stroke width of the borders
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform);
}

// Reset function switches back the zoom to normal globe in 3D when you zoom out from a country
// also works when changing the projection from 2D to 3D
function reset() {
  active.classed("active", false);
  active = d3.select(null);

  // Remove everything from map which is not selected anymore
  svg.selectAll('.plot-point').remove();

  svg.transition()
    .duration(750)
    .call(zoom_3D.transform, d3.zoomIdentity);

  // Change the toggle back to enabled
  document.getElementById("checked3D").disabled = false;
  document.getElementById("checked2D").disabled = false;

  $('.box-container').css({
    'background': ''
  });

  countryName.innerHTML = "World";
  previousCountryClicked = 'WLD';
  current_unmet_need = 100 - data_c[previousCountryClicked];
  change_percentage_animation(data_c[previousCountryClicked], current_unmet_need);
  lineGraphObject.updateGraph(previousCountryClicked);
}

// Changes both groups in 2D
function zoomed_2D() {
  g.attr("transform", d3.event.transform);
  g_map2.attr("transform", d3.event.transform);
}