// @TODO: YOUR CODE HERE!
var width= parseInt(d3.select("#scatter").style("width"));

var height=width- width/4;

var margin=20;
//word spacing
var labelArea=110;

//padding
var tpadbot=40;
var tpadleft=40;

var svg= d3
    .select("#scatter")
    .append("svg")
    .attr("width",width)
    .attr("height", height)
    .attr("class","chart");

var circRadius;

function crGet() {
    if (width <=530) {
        circRadius=5;
    }
    else{
        circRadius=10;
    }
}
crGet();
//nest for bottom axis labels
svg.append("g").attr("class", "xText")

var xText=d3.select(".xText");

//append pover  ty to the svg files

    xText
    .append("text")
    .attr("y",-26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty  (%)");

var leftTextX= margin + tpadleft;
var leftTextY= (height +labelArea) /2- labelArea;

svg.append("g").attr("class","yText");

var ytext= d3.select(".ytext");

ytext
.append("text")
.attr("y",0)
.attr("data-name", "healthcare")
.attr("data-axis", "y")
.attr("class", "axis-text")
.text("Lacks HealthCare", "%");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
function  xScale(data, chosenXaxis){
     // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
    d3.max(data, d => d[chosenXAxis]) * 1.2
  ])
  .range([0, width]);

return xLinearScale;


}
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "poverty:";
    }
    //else {
    //  label = "# of Albums:";
    //}
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.healthcare}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
d3.csv("assets/data/data.csv").then(function(data,err){
    if (err) throw err;

    data. forEach(function(data){
        data.poverty= +data.poverty;
        data.healthcare= +data.healthcare;
    });

    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);  
})
    .catch(function(error) {
        console.log(error);
  });
  
