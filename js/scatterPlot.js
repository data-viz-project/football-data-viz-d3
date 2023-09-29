const margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

function scatterPlot(players_data, acronyms) {
    let x_label = "Shots";
    let y_label = "Goals";

    // append the svg object to the body of the page
    const svg = d3.select("#dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 7.5])
        .range([0, width]);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 1.5])
        .range([height, 0]);
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

    // Seleziona tutti i gruppi con classe "axis" all'interno dell'elemento SVG
    svg.selectAll("g.axis")
        .selectAll("line")

    // Add X axis label:
    svg.append("text")
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
        .style("padding", "10px")

    var mouseover = function (_) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (event, d) {
        tooltip
            .html(acronyms["Player"] + ": " + d.Player)
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (_) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(players_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Shots); })
        .attr("cy", function (d) { return y(d.Goals); })
        .attr("r", 5)
        .style("fill", "black")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

}
export { scatterPlot };