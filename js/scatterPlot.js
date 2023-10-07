const margin = { top: 10, right: 30, bottom: 50, left: 80 }
var width = 100
var height = 100

var width_graph = parseInt(d3.select('#scatter-plot').style('width'), 10) / 1.1
var height_graph = parseInt(d3.select('#scatter-plot').style('height'), 10) / 1.3

let common_features = ["Player", "Squad", "Comp", "MP", "Min", "Pos"]

var forward_features = ["Goals", "Shots", "SoT", "G/Sh", "G/SoT", "ShoDist", "GCA", "SCA", "Off", "PKwon", "ScaDrib", "Assists",
    "ScaPassLive", "Car3rd", "ScaFld", "Carries", "CarTotDist", "CarPrgDist", 'CPA', "CarMis", "CarDis"]

var midfielder_features = ["Goals", "PasTotCmp", "PasTotCmp%", "PasTotDist", "PasTotPrgDist", "Assists", "PasAss", "Pas3rd", "Crs", "PasCmp",
    "PasOff", "PasBlocks", "SCA", "ScaPassLive", "ScaPassDead", "ScaDrib", "ScaSh", "ScaFld", "GCA", "GcaPassLive",
    "GcaPassDead", "GcaDrib", "GcaSh", "GcaFld", "Tkl", "TklWon", "TklDef3rd", "TklMid3rd", "TklAtt3rd", "TklDri",
    "TklDriAtt", "TklDri%", "TklDriPast", "Blocks", "BlkSh", "Int", "Recov", "Carries", "CarTotDist", "CarPrgDist", "Fld"]

var defender_features = ["PasTotCmp", "PasTotDist", "PasTotPrgDist", "Tkl", "TklWon", "TklDef3rd", "TklMid3rd", "TklAtt3rd", "TklDri", "TklDriAtt", "TklDriPast", "Blocks",
    "BlkSh", "Int", "Tkl+Int", "Recov", "AerWon", "AerLost", "Carries", "CarTotDist", "CarPrgDist", "CrdY", "CrdR", "Fls", "Clr"]

// variable to change set of features
var position = "attk";

var calculateMinMaxValue = function (feature, data) {
    let minMax = d3.extent(data, function (d) {
        return d[feature];
    });
    return minMax;
};


var shuffleArray = function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

var tooltip = d3.select("#scatter-plot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

var mouseover = function (event, d) {
    d3.selectAll(".scatterDots")
        .attr("r", 7)
        .style("fill", "white")

    //change color to a point
    d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 12)
        .style("fill", "green");

    tooltip
        .transition()
        .duration(200)
        .style("opacity", 1);
};

var mouseout = function (event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .style("fill", "white")
        .attr("r", 7);

    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0);
}


function scatterPlot(players_data, acronyms) {

    var mousemove = function (event, d) {
        let x_label = d3.select("#x-axis").property("value")
        let y_label = d3.select("#y-axis").property("value")

        tooltip
            .html(acronyms["Player"] + ": " + d.Player)
            .style("font-size", "14px")
            .style('left', event.pageX - 100 + 'px')
            .style('top', event.pageY - 85 + 'px');

        tooltip.append("div")
            .html(acronyms[x_label] + ": " + d[x_label])
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 8 + 'px');

        tooltip.append("div")
            .html(acronyms[y_label] + ": " + d[y_label])
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 8 + 'px');
    }

    d3.selectAll(".scatterPlot").remove();

    // append the svg object to the body of the page

    const container = d3.select("#scatter-plot")
    const svg = container
        .append("svg")
        .attr("class", "scatterPlot")
        .attr("width", `${width}%`)
        .attr("height", `${height}%`)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


    svg.selectAll(".group").remove();

    var points = svg.append('g')
        .attr("class", "group")
        .selectAll("points");

    function drawPoints(x_label, y_label) {
        let minMax = calculateMinMaxValue(x_label, players_data)
        console.log(minMax);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([0, width_graph]);

        svg.selectAll(".axis").remove();

        // Append a new X axis group
        var axis_x = svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${height_graph})`)
            .attr("opacity", "0"); // Start with opacity set to 0

        // Transition the opacity of the old axis to 0
        d3.select(".axis")
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        // Transition the opacity of the new axis to 1
        axis_x
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        minMax = calculateMinMaxValue(y_label, players_data)
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([height_graph, 0]);

        let axis_y = svg.append("g")
            .attr("class", "axis")
            .attr("opacity", "0"); // Start with opacity set to 0

        axis_y
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .call(d3.axisLeft(y));

        // Seleziona tutti i gruppi con classe "axis" all'interno dell'elemento SVG
        svg.selectAll("g.axis")
            .selectAll("line")

        svg.selectAll(".axis-label").remove();

        // Add X axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", width_graph / 2 + 30)
            .attr("y", height_graph + 40)
            .text(acronyms[x_label]);

        // Y axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", height / -3)
            .text(acronyms[y_label])

        d3.select("#scatter-plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        // Add dots
        points = points
            .data(players_data)
            .join("circle")
            .style("fill", "white")
            .style("stroke", "black")
            .style("class", "scatterDots")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("click", (event, d) => {
                window.scrollTo(0, document.body.scrollHeight);
                d3.select("#barPlot").style("width", "35%")
                d3.select("#player-vis").transition().duration(1000).style("width", "65%")
            });

        points
            .transition()
            .duration(1000)
            .attr("cx", function (d) { return x(d[x_label]); })
            .attr("cy", function (d) { return y(d[y_label]); })
            .attr("r", 7);
    }

    const dropMenuX = d3.select("#x-axis");
    const dropMenuY = d3.select("#y-axis");

    dropMenuX
        .selectAll("option")
        .data(function () { if (position == "attk") return forward_features; })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuX.on('change', function (event) {
        drawPoints(event.target.value, dropMenuY.property("value"));
    });

    dropMenuY
        .selectAll("option")
        .data(function () { if (position == "attk") return shuffleArray(forward_features); })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuY.on('change', function (event) {
        drawPoints(dropMenuX.property('value'), event.target.value);
    });

    drawPoints(dropMenuX.property('value'), dropMenuY.property('value'));
}
export { scatterPlot };