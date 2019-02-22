let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let formatToYears = function(d) {
  // TO BE OPTIMIZED WITH A DICTIONARY
  if (d == 1) return 1850;
  if (d == 2) return 1900;
  if (d == 3) return 1910;
  if (d == 4) return 1945;
  if (d == 5) return 1980;
  if (d == 6) return 2015;
  if (d == 7) return "SSP1";
  if (d == 8) return "SSP3";
  if (d == 9) return "SSP5";
}

// We start with the food energy data
let dataset_graph = "dataset/plot_energy.csv";

// Set the dimensions of the canvas / graph
let margin = {
    top: 30,
    right: 30,
    bottom: 80,
    left: 50
  },
  width_plot = 470 - margin.left - margin.right,
  height_plot = 300 - margin.top - margin.bottom;


// Set the ranges
let x_graph = d3.scaleLinear().range([0, width_plot]);
let y_graph = d3.scaleLinear().range([height_plot, 0]);

class lineGraph {
  updateGraph(country) {
    let svg_remove = d3.select(".graph");
    svg_remove.selectAll("*").remove();

    let line_draw = d3.line()
      .x(function(d) {
        return x_graph(d.date);
      })
      .y(function(d) {
        return y_graph(d[country]);
      });


    // Adds the svg canvas
    let svg_plot = d3.select(".graph")
      .append("svg")
      .attr("class", "svg_graph")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv(dataset_graph, function(error, data) {

      // Scale the range of the data
      x_graph.domain(d3.extent(data, function(d) {
        return d.date;
      }));
      y_graph.domain([0, 100]);

      // Nest the entries by symbol
      let dataNest = d3.nest()
        .key(function(d) {
          return d.name;
        })
        .entries(data);

      let legendSpace = width_plot / dataNest.length; // spacing for the legend

      // Loop through each symbol / key
      dataNest.forEach(function(d, i) {

        svg_plot.append("path")
          .attr("class", "line2")
          .style("stroke", function() { // Add the colours dynamically

            return d.color_graph = color_graph(d.key);
          })
          .attr("id", 'tag' + d.key.replace(/\s+/g, '')) // assign an ID
          .attr("d", line_draw(d.values));

        // Add the Text
        svg_plot.append("text")
          .attr("x", (legendSpace / 2) + i * legendSpace + 5) // space legend
          .attr("y", height_plot + (margin.bottom / 2) + 5)
          .attr("class", "legend") // style the legend
          .style("fill", function() { // Add the colours dynamically
            return d.color_graph = color_graph(d.key);
          })
          .text(d.key);
      });
      // Add the X Axis
      svg_plot.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height_plot + ")")
        .call(d3.axisBottom(x_graph).tickValues(numbers).tickFormat(formatToYears));
      // Add the Y Axis
      svg_plot.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y_graph));
    });
  }
}