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

    // deep copy of player_data obj
    var data = JSON.parse(JSON.stringify(player_data))

    for (var i = 0; i < data.length; i++)
        data[i].Goals = data[i]["Goals"] * data[i]["90s"];

    data = data.sort((a, b) => b["Goals"] - a["Goals"]).slice(0, 15);

    d3.selectAll(".barPlot").remove();

    var svg = d3.select("#barPlot").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("class", "barPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d["Goals"]))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d["Player"]))
        .range([0, height])
        .padding(0.15);

    // Make y axis to show bar names
    const yAxis = d3.axisLeft(y).tickSize(0);

    svg.append("g")
        .attr("class", "y axisBarPlot")
        .call(yAxis);

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    // Append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d["Player"]))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d["Goals"]));

    // Add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        .attr("y", d => y(d["Player"]) + y.bandwidth() / 2 + 4)
        .attr("x", d => x(d["Goals"]) - 30) // Adjust the x position for the label
        .text(d => parseInt(d["Goals"]))
        .style("fill", "white")
        .style("font-weight", "bold")
}
export { barPlot }