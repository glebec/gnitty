;'use strict';

var data = [5, 20, 6, 8, 61]; //This will come from our analysis.  Use associative array here to add labels?  Otherwise can add labels using a corresponding array and a for loop.
var r = 300;

var color = d3.scale.ordinal() // Do I need the same number of colors as data points?
  .range({"red", "yellow", "blue", "green", "purple"});

var canvas = d3.select("body").append("svg")
  .attr("width", 1500)
  .attr("height", 1500);

var group = canvas.append("g") //grounps end up looking like divs in chrome inspector
  .attr("transform", "translate(300, 300)");

var arc = d3.svg.arc()
  .innerRadius(0)
  .outerRadius(r);

var pie = d3.layout.pie()
  .value(function (d) {
    return d;
  });

var arcs = group.selectAll(".arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs.append("path")
  .attr("d", arc)
  .attr("fill", function(d) {
    return color(d.data);
  });

arcs.append("text")
  .attr("transform", function(d) {
    return "translate("+arc.centroid(d) + ")";
  });
  .attr("text-anchor", "middle") //text-anchor is an attribute of canvas
  .attr("font-size", "1.5em") //may be able to do some of this in CSS.  ?
  .text(function(d) {
    return d.data; //need to add a label here for each point. return d.data+label.
  });