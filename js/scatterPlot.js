const margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var position = "attacco"

var calculateMinMaxValue = function (feature, data) {
    var min = d3.min(data, function (d) {
        return d[feature];
    });
    var max = d3.max(data, function (d) {
        return d[feature];
    });
    return [min, max];
}


var mouseover = function (d) {
    tooltip
        .style("opacity", 1)
}

var mousemove = function (event, d) {
    tooltip
        .html(acronyms["Player"] + ": " + d.Player)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');

    tooltip.append("div")
        .html(acronyms["Shots"] + ": " + d[x_label])
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 8 + 'px'); // Puoi regolare la posizione verticale a tuo piacimento

    tooltip.append("div")
        .html(acronyms["Goals"] + ": " + d.Goals)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 8 + 'px'); // Puoi regolare la posizione verticale a tuo piacimento
}

var mouseleave = function (_) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}


function scatterPlot(players_data, acronyms) {
    let y_label = "Goals";

    // append the svg object to the body of the page
    const svg = d3.select("#dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    var points = svg.append('g')
        .selectAll("points")

    function drawPoints(x_label, y_label = "Goals") {
        var minMax = calculateMinMaxValue(x_label, players_data)

        // Add X axis
        const x = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([0, width]);

        svg.select(".axis-x").remove();

        // Append a new X axis group
        var axis_x = svg.append("g")
            .attr("class", "axis-x")
            .attr("transform", `translate(0, ${height})`)
            .attr("opacity", "0"); // Start with opacity set to 0

        // Transition the opacity of the old axis to 0
        d3.select(".axis-x")
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        // Transition the opacity of the new axis to 1
        axis_x
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        var minMax = calculateMinMaxValue(y_label, players_data)
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([height, 0]);
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // Seleziona tutti i gruppi con classe "axis" all'interno dell'elemento SVG
        svg.selectAll("g.axis")
            .selectAll("line")

        svg.select(".axis-label").remove();

        // Add X axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 25)
            .text(acronyms[x_label]);

        // Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", height / -3)
            .text(acronyms[y_label])

        var tooltip = d3.select("#dataviz")
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
            .join('circle')
            .style("fill", "black")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        points
            .transition()
            .duration(1000)
            .attr("cx", function (d) { return x(d[x_label]); })
            .attr("cy", function (d) { return y(d.Goals); })
            .attr("r", 5)
    }

    const dropMenuX = d3.select("#x-axis");

    dropMenuX
        .selectAll("option")
        .data(function () { if (position == "attacco") return ["Shots", "Goals"]; })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuX.on('change', function (event) {
        drawPoints(event.target.value);
    });

    drawPoints(dropMenuX.property('value'));
}
export { scatterPlot };