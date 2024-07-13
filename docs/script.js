document.addEventListener("DOMContentLoaded", function() {
    // Function to create Scene 1
    function createScene1() {
        d3.select("#visualization").html("");

        var data = [
            { year: 1990, Afghanistan: 4.07, USA: 5.3, India: 3.8, China: 4.2, Brazil: 4.9 },
            { year: 2000, Afghanistan: 4.1, USA: 5.5, India: 3.9, China: 4.3, Brazil: 5.0 },
            { year: 2010, Afghanistan: 4.3, USA: 6.0, India: 4.0, China: 4.4, Brazil: 5.1 },
            { year: 2017, Afghanistan: 4.5, USA: 6.5, India: 4.2, China: 4.5, Brazil: 5.2 }
        ];

        var svg = d3.select("#visualization").append("svg")
                    .attr("width", 800)
                    .attr("height", 500);

        var margin = { top: 50, right: 30, bottom: 50, left: 60 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
                  .domain([1990, 2017])
                  .range([0, width]);

        var y = d3.scaleLinear()
                  .domain([3, 7])
                  .range([height, 0]);

        var line = d3.line()
                     .x(d => x(d.year))
                     .y(d => y(d.USA));

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format("d")));

        g.append("g")
         .call(d3.axisLeft(y));

        g.append("path")
         .datum(data)
         .attr("fill", "none")
         .attr("stroke", "steelblue")
         .attr("stroke-width", 2)
         .attr("d", line);

        g.selectAll(".dot")
         .data(data)
         .enter().append("circle")
         .attr("class", "dot")
         .attr("cx", d => x(d.year))
         .attr("cy", d => y(d.USA))
         .attr("r", 5)
         .attr("fill", "steelblue");

        // Add annotations
        g.append("text")
         .attr("x", x(2017))
         .attr("y", y(6.5))
         .attr("dy", "-1em")
         .attr("text-anchor", "end")
         .attr("fill", "black")
         .text("USA: Significant increase in 2017");

        g.append("text")
         .attr("x", x(1990))
		 .attr("y", y(5.3))
         .attr("dy", "-1em")
         .attr("text-anchor", "start")
         .attr("fill", "black")
         .text("USA: Initial data point in 1990");

        // Create more lines and dots for other countries
        var countries = ["Afghanistan", "India", "China", "Brazil"];
        var colors = ["red", "green", "orange", "purple"];

        countries.forEach((country, index) => {
            var countryLine = d3.line()
                                .x(d => x(d.year))
                                .y(d => y(d[country]));

            g.append("path")
             .datum(data)
             .attr("fill", "none")
             .attr("stroke", colors[index])
             .attr("stroke-width", 2)
             .attr("d", countryLine);

            g.selectAll(`.dot-${country}`)
             .data(data)
             .enter().append("circle")
             .attr("class", `dot-${country}`)
             .attr("cx", d => x(d.year))
             .attr("cy", d => y(d[country]))
             .attr("r", 5)
             .attr("fill", colors[index]);

            // Add annotations for each country
            g.append("text")
             .attr("x", x(2017))
             .attr("y", y(data[data.length - 1][country]))
             .attr("dy", "-1em")
             .attr("text-anchor", "end")
             .attr("fill", colors[index])
             .text(`${country}: ${data[data.length - 1][country]}% in 2017`);
        });
    }

    // Function to create Scene 2
    function createScene2() {
        d3.select("#visualization").html("");

        // Data for Scene 2
        var ageData = [
            { ageGroup: "10-14", value: 1.5 },
            { ageGroup: "15-19", value: 3.4 },
            { ageGroup: "20-24", value: 4.4 },
            { ageGroup: "25-29", value: 4.8 },
            { ageGroup: "30-34", value: 5.1 },
            { ageGroup: "50-69", value: 6.0 },
            { ageGroup: "70+", value: 7.2 }
        ];

        var svg = d3.select("#visualization").append("svg")
                    .attr("width", 800)
                    .attr("height", 500);

        var margin = { top: 50, right: 30, bottom: 50, left: 60 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
                  .domain(ageData.map(d => d.ageGroup))
                  .range([0, width])
                  .padding(0.1);

        var y = d3.scaleLinear()
                  .domain([0, 8])
                  .range([height, 0]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));

        g.append("g")
         .call(d3.axisLeft(y));

        g.selectAll(".bar")
         .data(ageData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", d => x(d.ageGroup))
         .attr("y", d => y(d.value))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.value))
         .attr("fill", "teal");

        // Add annotations
        g.selectAll(".label")
         .data(ageData)
         .enter().append("text")
         .attr("class", "label")
         .attr("x", d => x(d.ageGroup) + x.bandwidth() / 2)
         .attr("y", d => y(d.value) - 5)
         .attr("text-anchor", "middle")
         .attr("fill", "black")
         .text(d => `${d.value}%`);
    }

    // Function to create Scene 3
    function createScene3() {
        d3.select("#visualization").html("");

        // Data for Scene 3
        var scatterData = [
            { country: "Afghanistan", depression: 4.5, suicide: 7.2 },
            { country: "USA", depression: 6.5, suicide: 14.2 },
            { country: "India", depression: 4.2, suicide: 11.1 },
            { country: "China", depression: 4.5, suicide: 10.4 },
            { country: "Brazil", depression: 5.2, suicide: 8.7 }
        ];

        var svg = d3.select("#visualization").append("svg")
                    .attr("width", 800)
                    .attr("height", 500);

        var margin = { top: 50, right: 30, bottom: 50, left: 60 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
                  .domain([4, 7])
                  .range([0, width]);

        var y = d3.scaleLinear()
                  .domain([0, 15])
                  .range([height, 0]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));

        g.append("g")
         .call(d3.axisLeft(y));

        g.selectAll(".dot")
         .data(scatterData)
         .enter().append("circle")
         .attr("class", "dot")
         .attr("cx", d => x(d.depression))
         .attr("cy", d => y(d.suicide))
         .attr("r", 5)
         .attr("fill", "purple");

        g.selectAll(".label")
         .data(scatterData)
         .enter().append("text")
         .attr("class", "label")
         .attr("x", d => x(d.depression))
         .attr("y", d => y(d.suicide) - 10)
         .attr("text-anchor", "middle")
         .attr("fill", "black")
         .text(d => d.country);
    }

    // Event listeners for buttons
    document.getElementById("scene1-btn").addEventListener("click", createScene1);
    document.getElementById("scene2-btn").addEventListener("click", createScene2);
    document.getElementById("scene3-btn").addEventListener("click", createScene3);

    // Initialize with Scene 1
    createScene1();
});

