document.addEventListener("DOMContentLoaded", function () {
  const datasetUrl =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

  d3.json(datasetUrl).then(function (data) {
    // Create SVG and groups for the treemap
    const width = 960;
    const height = 600;
    const svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create a color scale for different categories
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.children.map((d) => d.name))
      .range([
        "#FF5733",
        "#33FF57",
        "#5733FF",
        "#FF33D1",
        "#33D1FF",
        "#D1FF33"
      ]);

    // Create a treemap layout
    const treemap = d3.treemap().size([width, height]).paddingInner(1);

    // Process data
    const root = d3.hierarchy(data).sum((d) => d.value);
    treemap(root);

    // Tooltip setup
    const tooltip = d3
      .select("#tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none");

    // Create cells
    const cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    // Add tooltips to the tiles
    cell
      .append("rect")
      .attr("class", "tile")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .style("fill", (d) => colorScale(d.data.category))
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 0.9)
          .style("visibility", "visible")
          .html(
            `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
          )
          .attr("data-value", d.data.value)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0).style("visibility", "hidden");
      });

    // Create legend
    const legendWidth = 300;
    const legendHeight = data.children.length * 25;
    const legendRectSize = 20; // Size of the legend rectangles
    const legendSpacing = 5; // Spacing between legend items

    const legendSvg = d3
      .select("#legend")
      .append("svg")
      .attr("width", legendWidth)
      .attr("height", legendHeight);

    const categories = data.children.map((d) => d.name);

    // Create a group for each legend item
    const legendItem = legendSvg
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, i) => "translate(0," + i * (legendRectSize + legendSpacing) + ")"
      );

    // Append a rectangle to each legend item with class 'legend-item'
    legendItem
      .append("rect")
      .attr("class", "legend-item") // Assigning class 'legend-item' to each rect
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", (d) => colorScale(d));

    // Append text to each legend item
    legendItem
      .append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", legendRectSize / 2)
      .attr("dy", "0.35em") // Center text vertically
      .text((d) => d);
  });
});
