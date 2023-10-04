const margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
    var min = d3.min(data, function (d) {
        return d[feature];
    });
    var max = d3.max(data, function (d) {
        return d[feature];
    });
    return [min, max];
};

var tooltip = d3.select("#dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

var mouseover = function (event, d) {
    d3.selectAll("circle")
        .style("r", 7)
        .style("fill", "white")

    //change color to a point
    d3.select(this)
        .transition()
        .duration(200)
        .style("r", 10)
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
        .style("r", 7);

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

    const svg = d3.select("#dataviz")
        .append("svg")
        .attr("class", "scatterPlot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


    svg.selectAll(".group").remove();

    var points = svg.append('g')
        .attr("class", "group")
        .selectAll("points");

    function drawPoints(x_label, y_label) {
        let minMax = calculateMinMaxValue(x_label, players_data)

        // Add X axis
        const x = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([0, width]);

        svg.selectAll(".axis").remove();

        // Append a new X axis group
        var axis_x = svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${height})`)
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
            .range([height, 0]);

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
            .attr("x", width / 2)
            .attr("y", height + margin.top + 25)
            .text(acronyms[x_label]);

        // Y axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", height / -3)
            .text(acronyms[y_label])

        d3.select("#dataviz")
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
            .style("cursor", "pointer")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("click", (event, d) => {
                console.log("TODO: Add to the starplot comparization");
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
        .data(function () { if (position == "attk") return forward_features; })
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