const margin = { top: 10, right: 30, bottom: 50, left: 80 },
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

function scatterPlot(players_data, acronyms) {
    // pick the max value in a data feature
    //var max_value = d3.max(players_data, function (d) { return d["Goals"]; });

    //for (var i = 0; i < players_data.length; i++) {
    //    if (players_data[i].Goals == max_value) {
    //        console.log("max value is " + max_value + " and is in " + players_data[i].Player);
    //    }
    //}

    //console.log(max_value);

    let x_label = "Player";
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
        .domain([0, 3000])
        .range([0, width]);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 400000])
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
}
export { scatterPlot };