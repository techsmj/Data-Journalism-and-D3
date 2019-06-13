// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
 top: 20,
 right: 40,
 bottom: 60,
 left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight);

var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../StarterCode/assets/data/data.csv", function(err, stateData) {
    if (err) throw err;
   // Step 1: Parse Data/Cast as numbers
   // ==============================
   stateData.forEach(function(data) {
   data.poverty = +data.poverty;
   // data.povertyMoe = parsefloat(data.povertyMoe);
   data.age = +data.age;
   data.income = +data.income;
   data.healthcare = +data.healthcare;
   });

   // Step 2: Create scale functions
   // ==============================
   var xLinearScale = d3.scaleLinear()
     .domain([20, d3.max(stateData, d => d.age)])
     .range([0, width]);

   var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(stateData, d => d.income)])
     .range([height, 0]);

 

   // Step 3: Create axis functions
   // ==============================
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);

   // Step 4: Append Axes to the chart
   // ==============================
   chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

   chartGroup.append("g")
     .call(leftAxis);

   // Step 5: Create Circles
   // ==============================
   var circlesGroup = chartGroup.selectAll("circle").data(stateData).enter()
   var circlesTip =circlesGroup
   .append("circle")
   .classed("stateCircle", true)
   .attr("cx", d => xLinearScale(d.age))
   .attr("cy", d => yLinearScale(d.income))
   .attr("r", "15")
  //  .attr("fill", "pink")
   .attr("opacity", ".5")

   // Step 6: Create State names in the Circles
   // ==============================
   circlesGroup

   .append("text")
   .classed("stateText", true)
   .attr("x", d => xLinearScale(d.age))
   .attr("y", d => yLinearScale(d.income))
   .attr("stroke", "teal")
   .attr("font-size", "10px")
   // .attr("fill", "black")
   .text(d => d.abbr);

  

// // Step 6: Initialize tool tip
   // // ==============================
   var toolTip = d3.tip()
     .attr("class", "d3-tip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.state}<br>Poverty: ${d.poverty}<br> Healthcare: ${d.healthcare}`);
     });

   // // Step 7: Create tooltip in the chart
   // // ==============================
   circlesTip.call(toolTip);

   // // Step 8: Create event listeners to display and hide the tooltip
   // // ==============================
   circlesTip.on("click", function(data) {
     toolTip.show(data, this);
   })
     // onmouseout event
     .on("mouseout", function(data, index) {
      d3.select(this).style("stroke", "blue")
      .attr("r", "10")
      toolTip.hide(d);
       
     });

   // Create axes labels
   chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Income");

   chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("Age");
 });