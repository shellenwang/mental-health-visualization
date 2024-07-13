document.addEventListener("DOMContentLoaded", function() {
    var data = [10, 20, 30, 40, 50];

    var svg = d3.select("#visualization")
                .append("svg")
                .attr("width", 500)
                .attr("height", 500);

    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", (d, i) => i * 60)
       .attr("y", d => 500 - d * 10)
       .attr("width", 50)
       .attr("height", d => d * 10)
       .attr("fill", "teal");
});
