// D3 Scatter plot

// // When the browser window is resized, responsify() is called.
// d3.select(window).on('resize', makeResponsive);

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // The code for the chart is wrapped inside a function that automatically resizes the chart
// function makeResponsive() {
//     var svgArea = d3.select('body').select('svg');
//     if (!svgArea.empty()) {
//         svgArea.remove();
//     }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = { top: 20, right: 150, bottom: 100, left: 130 };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    
    var svg = d3
        .select('.chart')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append an SVG group
    var chart = svg.append("g");

    // Append a div to the body to create tooltips, assign it a class
    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

    // var selDataset = document.getElementById("selDataset");

    /////////////////////////////////////

    function bubble(country) {
    // function optionChanged(country) {
        var url = "/bubble/" + country;    
        d3.json(url, function(error, response) {
            if (error) return console.warn(error);
            console.log(response);
            console.log(response["know"])
            
            
    // Create scale functions
        var yLinearScale = d3.scaleLinear().range([height, 0]);
        var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

    // These variables store the minimum and maximum values in a column in data.csv
        var xMin;
        var xMax;
        var yMin;
        var yMax;

    // This function identifies the minimum and maximum values in a column in data.csv
    // and assign them to xMin, xMax, yMin, yMax variables, which will define the axis domain
        function findMinAndMax(xAxis, yAxis) {
            xMin = d3.min(response[xAxis]) * 0.8;
            xMax = d3.max(response[xAxis]) * 1.1;
            yMin = d3.min(response[yAxis]) * 0.8;
            yMax = d3.max(response[yAxis]) * 1.1;
        }

    // The default x-axis is 'bachelorOrHigher'
    // Other axises assigned to the variable during an onclick event.
    // This variable is key to the ability to change axis/data column
        var xAxis = "know";
        var yAxis = "sentiment";
    // Call findMinAndMax() with 'bachelorOrHigher' as default
        findMinAndMax(xAxis, yAxis);
        console.log(yMin);
        console.log(yMax);
    // Set the domain of an axis to extend from the min to the max value of the data column
        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([yMin, yMax]);

    // Initialize tooltip
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        // Define position
        .offset([0, 0])
        // The html() method allows us to mix JavaScript with HTML in the callback function
        .html(function(data) {
            var language = data.languages;
            var valueX = data.know;
            var valueY = data.sentiment;
            var valueZ = data.competency;
        
        // Tooltip text depends on which axis is active/has been clicked
            return language +
                "<br>" +
                "Know: " +
                valueX +
                "<br>" +
                "Love: " +
                valueY +
                "<br>" +
                "Competency: " +
                valueZ;
        });
        
    // // Create tooltip
    chart.call(toolTip);
    console.log("tesst", response.know);
    // Create circle
    chart
        .selectAll(".circle")
        .data(response)
        .enter()
        .append("circle")
        .attr("cx", function(data) {
            return xLinearScale(data.sentiment);
        })
        .attr("cy", function(data) {
            return yLinearScale(data.know);
        })
        // .attr("cx", 50)
        // .attr("cy", 0.5)
        .attr("r", "18")
        .attr("fill", "black")
        .attr("class", "circle")
        // display tooltip by d3-Tip
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
    
        console.log(xLinearScale(response.know));
        
    // Create abbrivation of states to show on the circle
    // chart
    //     .selectAll("text")
    //     .data(response)
    //     .enter()
    //     .append("text")
    //     .attr("x", function(data, index) {
    //       return xLinearScale(data[know]);
    //     })
    //     .attr("y", function(data, index) {
    //       return yLinearScale(data[sentiment]);
    //     })
    //     .attr("dx", "-0.65em")
    //     .attr("dy", "0.4em")
    //     .style("font-size", "13px")
    //     .style("fill", "white")
    //     .attr("class", "language")
    //     .text(function(data, index) {
    //       return data.languages;
    //     });

    // Append an SVG group for the x-axis, then display the x-axis
    chart
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        // The class name assigned here will be used for transition effects
        .attr("class", "x-axis")
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart
        .append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text change")
        .attr("data-axis-name", "allTeethRemoved")
        .attr("id", "allTeethRemoved")
        .text("65+ with All Teeth Removed (%)");

    // Append x-axis labels
    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
        )
        // This axis label is active by default
        .attr("class", "axis-text active")
        .attr("data-axis-name", "bachelorOrHigher")
        .text("Education level: Bachelor or higher (%)")
    });
}

bubble("United States");
// var country = "United States"
// optionChanged(country);
// }

//     // Change an axis's status from inactive to active when clicked (if it was inactive)
//     // Change the status of all active axes to inactive otherwise
//     function labelChange(clickedAxis, corrAxis) {
//         d3
//         .selectAll(".axis-text")
//         .filter(".active")
//         // An alternative to .attr("class", <className>) method. Used to toggle classes.
//         .classed("active", false)
//         .classed("inactive", true);

//         d3
//         .selectAll(".axis-text")
//         .filter(".change")
//         .classed("change", false)
//         .classed("unchange", true);

//         clickedAxis.classed("inactive", false).classed("active", true);
//         corrAxis.classed("unchange", false).classed("change", true);
//     }

//     d3.selectAll(".axis-text").on("click", function() {
//         // Assign a variable to current axis
//         var clickedSelection = d3.select(this);
//         // "true" or "false" based on whether the axis is currently selected
//         var isClickedSelectionInactive = clickedSelection.classed("inactive");
        
//         // console.log("this axis is inactive", isClickedSelectionInactive)
//         // Grab the data-attribute of the axis and assign it to a variable
//         // e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
//         var clickedAxis = clickedSelection.attr("data-axis-name");
        
//         // Create corresponding change of y-axis when x-axis is active
//         var corrAxis;

//         if (clickedAxis === "bachelorOrHigher") {
//             // x = corrAxis.attr(((d,i) => d.attr("id") === "allTeethRemoved"));
//             corrAxis = d3.select("#allTeethRemoved");
//         }
//         else if (clickedAxis === "white") {
//             corrAxis = d3.select("#skinCancer");
//         }
//         else {
//             corrAxis = d3.select("#smoke");
//         }

//         // The onclick events below take place only if the x-axis is inactive
//         // Clicking on an already active axis will therefore do nothing
//         if (isClickedSelectionInactive) {
//         // Assign the clicked axis to the variable currentAxisLabelX
//         currentAxisLabelX = clickedAxis;
//         currentAxisLabelY = corrAxis.attr("data-axis-name");
//         // Call findMinAndMax() to define the min and max domain values.
//         findMinAndMax(currentAxisLabelX, currentAxisLabelY);
//         // Set the domain for the x-axis
//         xLinearScale.domain([xMin, xMax]);
//         yLinearScale.domain([yMin, yMax]);

//         // Create a transition effect for the x-axis
//         svg
//             .select(".x-axis")
//             .transition()
//             // .ease(d3.easeElastic)
//             .duration(1800)
//             .call(bottomAxis);

//         // Create a transition effect for the y-axis
//         svg
//             .select(".y-axis")
//             .transition()
//             // .ease(d3.easeElastic)
//             .duration(1800)
//             .call(leftAxis);

//         // Select all circles to create a transition effect, then relocate its location
//         // based on the new axis that was selected/clicked
//         d3.selectAll("circle").each(function() {
//             d3
//             .select(this)
//             .transition()
//             .ease(d3.easeBounce)
//             .attr("cx", function(data) {
//                 return xLinearScale(+data[currentAxisLabelX]);
//             })
//             .attr("cy", function(data, index) {
//                 return yLinearScale(+data[currentAxisLabelY]);
//             })
//             .duration(1800);
//         });

//         // Select all texts on circle to create a transition effect, then relocate its location
//         // based on the new axis that was selected/clicked
//         d3.selectAll(".abbr").each(function() {
//             d3
//             .select(this)
//             .transition()
//             .ease(d3.easeBounce)
//             .attr("x", function(data) {
//                 return xLinearScale(+data[currentAxisLabelX]);
//             })
//             .attr("y", function(data, index) {
//                 return yLinearScale(+data[currentAxisLabelY]);
//             })
//             .duration(1800);
//         });
//         // Change the status of the axes. See above for more info on this function.
//         labelChange(clickedSelection, corrAxis);
//         }
//     });
//     });
// 