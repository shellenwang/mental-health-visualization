document.addEventListener("DOMContentLoaded", function() {
    const scenes = [
        {
            message: "Global Prevalence of Depression",
            dataFile: "prevalence-by-mental-and-substa.csv",
            render: renderScene1
        },
        {
            message: "Age Distribution of Depression",
            dataFile: "prevalence-of-depression-by-age.csv",
            render: renderScene2
        },
        {
            message: "Comparison of Mental Disorders in the US",
            dataFile: "prevalence-by-mental-and-substa.csv",
            render: renderScene3
        }
    ];
    
    let currentScene = 0;
    
    function loadCSV(file, callback) {
        d3.csv(file).then(data => {
            console.log(`Loaded data from ${file}`, data);
            callback(data);
        }).catch(error => {
            console.error(`Error loading ${file}:`, error);
        });
    }
    
    function renderScene1(data) {
        console.log("Rendering Scene 1");

        const countrySelect = document.getElementById("country-select");
        countrySelect.style.display = "none";
    
        // Filter and parse the data for the relevant columns
        const countries = ['United States', 'India', 'China', 'Brazil', 'Russia'];
        const parsedData = data.filter(d => countries.includes(d.Entity)).map(d => ({
            country: d.Entity,
            year: +d.Year,
            depression: +d['Depression (%)']
        }));
    
        const svgWidth = 960;
        const svgHeight = 600;
        const margin = {top: 60, right: 150, bottom: 60, left: 80};
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
    
        const svg = d3.select("#visualization").html("")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight)
                      .style("display", "block")
                      .style("margin", "0 auto")
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Add subheading
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", -30)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .attr("font-weight", "bold")
           .text("Trends in Depression Prevalence (1990-2017)");
    
        const x = d3.scaleLinear().domain([1990, 2017]).range([0, width]);
        const y = d3.scaleLinear().domain([d3.min(parsedData, d => d.depression) - 1, d3.max(parsedData, d => d.depression) + 1]).range([height, 0]);
    
        const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);
    
        // Add the x-axis
        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    
        // Add x-axis label
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height + 40)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Year");
    
        // Add the y-axis
        svg.append("g")
           .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + "%"));
    
        // Add y-axis label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", -60)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Depression Prevalence (%)");
    
        // Add the lines
        const line = d3.line()
                       .x(d => x(d.year))
                       .y(d => y(d.depression));
    
        const dataGroup = d3.group(parsedData, d => d.country);
    
        dataGroup.forEach(function(values, key) {
            svg.append("path")
               .datum(values)
               .attr("fill", "none")
               .attr("stroke", color(key))
               .attr("stroke-width", 1.5)
               .attr("d", line);
        });
    
        // Add a legend
        const legend = svg.selectAll(".legend")
                          .data(countries)
                          .enter().append("g")
                          .attr("class", "legend")
                          .attr("transform", (d, i) => `translate(${width + 40},${i * 20})`);
    
        legend.append("rect")
              .attr("x", 0)
              .attr("y", 4)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);
    
        legend.append("text")
              .attr("x", 25)
              .attr("y", 13)
              .attr("dy", "0.35em")
              .style("text-anchor", "start")
              .text(d => d);
    
        // Add tooltips
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);
    
        svg.selectAll("circle")
           .data(parsedData)
           .enter().append("circle")
           .attr("cx", d => x(d.year))
           .attr("cy", d => y(d.depression))
           .attr("r", 3)
           .attr("fill", d => color(d.country))
           .on("mouseover", function(event, d) {
               tooltip.transition().duration(200).style("opacity", .9);
               tooltip.html(`Country: ${d.country}<br/>Year: ${d.year}<br/>Depression: ${d.depression}%`)
                      .style("left", (event.pageX + 5) + "px")
                      .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function() {
               tooltip.transition().duration(500).style("opacity", 0);
           });
    }
      
    function renderScene2(data) {
        console.log("Rendering Scene 2");

        const countrySelect = document.getElementById("country-select");
        countrySelect.style.display = "inline";
        countrySelect.onchange = function() {
            updateScene2(data, this.value);
        };

        // Initial render
        updateScene2(data, countrySelect.value);
    }

    function updateScene2(data, country) {
        const filteredData = data.filter(d => d.Entity === country);
    
        if (filteredData.length === 0) {
            console.error(`No data found for country: ${country}`);
            return;
        }
    
        const ageGroups = [
            '10-14 years old (%)', '15-19 years old (%)', '20-24 years old (%)', 
            '25-29 years old (%)', '30-34 years old (%)', '35-39 years old (%)', 
            '40-44 years old (%)', '45-49 years old (%)', '50-54 years old (%)', 
            '55-59 years old (%)', '60-64 years old (%)', '65-69 years old (%)', 
            '70-74 years old (%)', '75-79 years old (%)', '80+ years old (%)'
        ];
    
        const ageData = ageGroups.map(ageGroup => {
            const prevalence = +filteredData[0][ageGroup];
            if (isNaN(prevalence)) {
                console.error(`Invalid prevalence data for age group: ${ageGroup}`);
                return {
                    ageGroup: ageGroup.replace(' years old (%)', ''),
                    prevalence: 0 // Default to 0 if data is invalid
                };
            }
            return {
                ageGroup: ageGroup.replace(' years old (%)', ''),
                prevalence: prevalence
            };
        }).filter(d => d.prevalence > 0); // Filter out entries with 0 prevalence
    
        console.log("Age Data:", ageData);
    
        if (ageData.length === 0) {
            console.error("No valid age data available.");
            return;
        }
    
        const maxPrevalence = d3.max(ageData, d => d.prevalence);
    
        const svgWidth = 960;
        const svgHeight = 500;
        const margin = {top: 60, right: 30, bottom: 60, left: 80};
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
    
        const svg = d3.select("#visualization").html("")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight)
                      .style("display", "block")
                      .style("margin", "0 auto")
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Add subheading
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", -30)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .attr("font-weight", "bold")
           .text(`Age Distribution of Depression in ${country} (Most Recent Year)`);
    
        const x = d3.scaleBand().domain(ageData.map(d => d.ageGroup)).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, maxPrevalence]).range([height, 0]);
    
        // Add the x-axis
        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));
    
        // Add x-axis label
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height + 40)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Age Group");
    
        // Add the y-axis
        svg.append("g")
           .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + "%"));
    
        // Add y-axis label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", -60)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Depression Prevalence (%)");
    
        // Add the bars
        const bars = svg.selectAll(".bar")
           .data(ageData)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", d => x(d.ageGroup))
           .attr("y", d => y(d.prevalence))
           .attr("width", x.bandwidth())
           .attr("height", d => height - y(d.prevalence))
           .attr("fill", d => d.prevalence === maxPrevalence ? "red" : "steelblue");
    
        // Add labels
        svg.selectAll(".label")
           .data(ageData)
           .enter().append("text")
           .attr("class", "label")
           .attr("x", d => x(d.ageGroup) + x.bandwidth() / 2)
           .attr("y", d => y(d.prevalence) - 5)
           .attr("text-anchor", "middle")
           .attr("font-size", "10px")
           .attr("font-weight", "bold")
           .text(d => d.prevalence + "%");
    
        // Add tooltips
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);
    
        bars.on("mouseover", function(event, d) {
               tooltip.transition().duration(200).style("opacity", .9);
               tooltip.html(`Age Group: ${d.ageGroup}<br/>Prevalence: ${d.prevalence}%`)
                      .style("left", (event.pageX + 5) + "px")
                      .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function() {
               tooltip.transition().duration(500).style("opacity", 0);
           });
    }   
    
    function renderScene3(data) {
        console.log("Rendering Scene 3");

        const countrySelect = document.getElementById("country-select");
        countrySelect.style.display = "inline";
        countrySelect.onchange = function() {
            updateScene3(data, this.value);
        };

        // Initial render
        updateScene3(data, countrySelect.value);
    }

    function updateScene3(data, country) {
        const filteredData = data.filter(d => d.Entity === country);
    
        if (filteredData.length === 0) {
            console.error(`No data found for country: ${country}`);
            return;
        }
    
        const disorderGroups = [
            'Schizophrenia (%)', 'Bipolar disorder (%)', 'Eating disorders (%)',
            'Anxiety disorders (%)', 'Drug use disorders (%)', 'Depressive disorders (%)'
        ];
    
        const disorderData = disorderGroups.map(disorder => {
            const prevalence = +filteredData[0][disorder];
            if (isNaN(prevalence)) {
                console.error(`Invalid prevalence data for disorder: ${disorder}`);
                return {
                    disorder: disorder.replace(' (%)', ''),
                    prevalence: 0 // Default to 0 if data is invalid
                };
            }
            return {
                disorder: disorder.replace(' (%)', ''),
                prevalence: prevalence
            };
        }).filter(d => d.prevalence > 0); // Filter out entries with 0 prevalence
    
        console.log("Disorder Data:", disorderData);
    
        if (disorderData.length === 0) {
            console.error("No valid disorder data available.");
            return;
        }
    
        const maxPrevalence = d3.max(disorderData, d => d.prevalence);
    
        const svgWidth = 960;
        const svgHeight = 500;
        const margin = {top: 60, right: 30, bottom: 60, left: 80};
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
    
        const svg = d3.select("#visualization").html("")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight)
                      .style("display", "block")
                      .style("margin", "0 auto")
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Add subheading
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", -30)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .attr("font-weight", "bold")
           .text(`Comparison of Mental Disorders Prevalence in ${country}`);
    
        const x = d3.scaleBand().domain(disorderData.map(d => d.disorder)).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, maxPrevalence]).range([height, 0]);
    
        // Add the x-axis
        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x));
    
        // Add x-axis label
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height + 40)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Mental Disorders");
    
        // Add the y-axis
        svg.append("g")
           .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + "%"));
    
        // Add y-axis label
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", -60)
           .attr("text-anchor", "middle")
           .attr("font-size", "12px")
           .attr("font-weight", "bold")
           .text("Prevalence (%)");
    
        // Add the bars
        const bars = svg.selectAll(".bar")
           .data(disorderData)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", d => x(d.disorder))
           .attr("y", d => y(d.prevalence))
           .attr("width", x.bandwidth())
           .attr("height", d => height - y(d.prevalence))
           .attr("fill", d => d.prevalence === maxPrevalence ? "red" : "steelblue");
    
        // Add labels
        svg.selectAll(".label")
           .data(disorderData)
           .enter().append("text")
           .attr("class", "label")
           .attr("x", d => x(d.disorder) + x.bandwidth() / 2)
           .attr("y", d => y(d.prevalence) - 5)
           .attr("text-anchor", "middle")
           .attr("font-size", "10px")
           .attr("font-weight", "bold")
           .text(d => d.prevalence + "%");
    
        // Add tooltips
        const tooltip = d3.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);
    
        bars.on("mouseover", function(event, d) {
               tooltip.transition().duration(200).style("opacity", .9);
               tooltip.html(`Disorder: ${d.disorder}<br/>Prevalence: ${d.prevalence}%`)
                      .style("left", (event.pageX + 5) + "px")
                      .style("top", (event.pageY - 28) + "px");
           })
           .on("mouseout", function() {
               tooltip.transition().duration(500).style("opacity", 0);
           });
    }
    
    
    function renderCurrentScene() {
        const scene = scenes[currentScene];
        console.log(`Rendering scene: ${scene.message}`);
        loadCSV(scene.dataFile, scene.render);
    }

    document.getElementById("prev").addEventListener("click", function() {
        if (currentScene > 0) {
            currentScene--;
            renderCurrentScene();
        }
    });

    document.getElementById("next").addEventListener("click", function() {
        if (currentScene < scenes.length - 1) {
            currentScene++;
            renderCurrentScene();
        }
    });

    renderCurrentScene();
});
