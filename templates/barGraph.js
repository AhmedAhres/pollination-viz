/*
  Javascript file for the bar graph representing the population impacted
  when visualizing the 2D maps
*/

// We initialize the data structures in which the data will be used
let data_regions = {};
let data_regions_array = {};

// Function to load the dataset
function load2D(dataset) {
  let result = {};
  d3.csv(dataset, function(error, data) {
    data.forEach(function(d) {
      result[d.continent] = d;
    });
  });
  return result;
}

// Used for formatting the X-axis of the bar graph
let numbersToContinents = function(d) {
  if (d == 0) return "Africa";
  if (d == 1) return "Eurasia";
  if (d == 2) return "N. America";
  if (d == 3) return "N. Asia";
  if (d == 4) return "Oceania";
  if (d == 5) return "S. America";
  if (d == 6) return "S. Asia";
}

class BarGraph {

  // Function to initialize the 2D graph
  initializeBarGraph() {
    let svg_remove = d3.select(".graph2d");
    svg_remove.selectAll("*").remove();
    // Initialize the x and y scale
    let yScale2D = d3.scaleLinear().range([height_plot, 0]).domain([0, 3]);
    let xScale2D = d3.scaleLinear().range([0, width_plot + 10]).domain([-1, 7]);

    // Select the SVG for the bar graph
    let svg2D = d3.select('.graph2d');
    let chart = svg2D.append('g')
      .append("svg")
      .attr("width", width_plot + margin.left + margin.right)
      .attr("height", height_plot + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Put the y scale (people in millions)
    chart.append('g')
      .call(d3.axisLeft(yScale2D));

    // Put the x scale (continents)
    // We use tickformat such that continents are evenly separated
    chart.append('g')
      .attr("transform", "translate(0," + height_plot + ")")
      .call(d3.axisBottom(xScale2D).ticks(8).tickFormat(numbersToContinents));

    // We add for each data point a rectangle
    const rectangles = chart.selectAll()
      .data(data_regions_array)
      .enter()
      .append('g');

    rectangles
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale2D(d.continent) - 18)
      .attr('y', (d) => yScale2D(d.log_value))
      .attr('height', (d) => height_plot - yScale2D(d.log_value))
      .attr('width', '41')
      // We take care of the interaction
      .on('mouseenter', function(actual, i) {
        d3.selectAll('.divergence')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('width', '44');

        const y = yScale2D(actual.log_value);

        let line = chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width_plot)
          .attr('y2', y);

        rectangles.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale2D(a.continent) + 4 / 2)
          .attr('y', (a) => yScale2D(a.log_value) + 18)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            const divergence = (a.value - actual.value).toFixed(1)

            let text = ''
            if (divergence > 0) text += '+'
            text += `${divergence}`

            return idx !== i ? text : '';
          })
      }).on('mouseleave', function() {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('width', '41')

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()

        // We add the value in the middle of the rectangle
        rectangles
          .append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale2D(a.continent) + 4 / 2)
          .attr('y', (a) => yScale2D(a.log_value) + 18)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a) => `${a.value}`)

      });

    // We add the value in the middle of the rectangle
    rectangles
      .append('text')
      .attr('class', 'divergence')
      .attr('x', (a) => xScale2D(a.continent) + 4 / 2)
      .attr('y', (a) => yScale2D(a.log_value) + 18)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}`)
  }

  // Method to update bar graph in 2D given the dataset
  // A promise is used to make sure that the dataset is loaded before displaying
  // the graph. The dataset is passed as a parameter to be able
  // to change the dataset depending on what is being visualized
  updateBarGraph(dataset) {
    let promise_graph2d = new Promise(function(resolve, reject) {
      data_regions = load2D(dataset);
      setTimeout(() => resolve(1), 10);
    });
    promise_graph2d.then(() => {
      // We use data_regions_array instead of data_regions because
      // this allows to plot rectangles since data_regions is just an Object
      data_regions_array = Object.values(data_regions);
      // We initialize the graph
      this.initializeBarGraph();
    })
  }
}