//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 140
};

var currentWidth = parseInt(d3.select('#barPlot').style('width'), 10)
var currentHeight = parseInt(d3.select('#barPlot').style('height'), 10)

var width = currentWidth - margin.left - margin.right,
    height = currentHeight - margin.top - margin.bottom;

function barPlot(player_data) {

    d3.select("#showGoals").on("click", () => {
        updateChart("Goals", player_data);
    });

    d3.select("#showAssists").on("click", () => {
        updateChart("Assists", player_data);
    });

    d3.selectAll(".barPlot").remove();
    d3.select(".bar-plot-title").select("h2").remove();

    d3.select(".bar-plot-title")
        .data(player_data)
        .append("h2")
        .style("margin-top", "0")
        .style("margin-bottom", "5")
        .style("font-size", "2vw")
        .text(d => (d["Comp"] + " top scorers and assists"));

    var svg = d3.select("#barPlot").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("class", "barPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    function updateChart(metric, p_data) {
        svg.selectAll(".axisBarPlot").remove(); // remove old axis
        svg.selectAll(".label").remove(); // remove old labels

        // deep copy of player_data obj
        var data = JSON.parse(JSON.stringify(p_data));

        for (var i = 0; i < data.length; i++)
            data[i][metric] = data[i][metric] * data[i]["90s"];

        data = data.sort((a, b) => b[metric] - a[metric]).slice(0, 15);

        const x = d3.scaleLinear()
            .domain([0, Math.max(...data.map(d => d[metric]))])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d["Player"]))
            .range([0, height])
            .padding(0.15);

        // Make y axis to show bar names
        const yAxis = d3.axisLeft(y).tickSize(0);

        svg.append("g")
            .attr("class", "y axisBarPlot")
            .style("font-size", "16px")
            .style("color", "gray")
            .call(yAxis);

        const bars = svg.selectAll(".bar")
            .data(data);

        // Enter selection
        const enterBars = bars.enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", "#0066b2")
            .attr("y", d => y(d["Player"]))
            .attr("height", y.bandwidth())
            .attr("x", 0);

        // Update selection (including transition)
        bars.merge(enterBars)
            .transition()
            .duration(800)
            .attr("width", d => x(d[metric]))
            .on("end", () => {
                // Add labels after the transition is complete
                svg.selectAll(".label")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .attr("y", d => y(d["Player"]) + y.bandwidth() / 2 + 7)
                    .attr("x", d => x(d[metric]) - 30)
                    .text(d => parseInt(d[metric]))
                    .style("font-size", "23px")
                    .style("fill", "white")
                    .style("font-weight", "bold");
            });
    }

    updateChart("Goals", player_data);
}
export { barPlot }