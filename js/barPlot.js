//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 60
};

var currentWidth = parseInt(d3.select('#barPlot').style('width'), 10)
var currentHeight = parseInt(d3.select('#barPlot').style('height'), 10)

var width = currentWidth - margin.left - margin.right,
    height = currentHeight - margin.top - margin.bottom;

function barPlot() {
    var data = [{
        "player": "Apples",
        "value": 20,
    },
    {
        "player": "Bananas",
        "value": 12,
    },
    {
        "player": "Grapes",
        "value": 19,
    },
    {
        "player": "Lemons",
        "value": 5,
    },
    {
        "player": "Limes",
        "value": 16,
    },
    {
        "player": "Oranges",
        "value": 26,
    },
    {
        "player": "Pears",
        "value": 30,
    },
    {
        "player": "Cocco",
        "value": 80,
    },
    {
        "player": "Cocco2",
        "value": 80,
    }, {
        "player": "Cocco3",
        "value": 80,
    },
    {
        "player": "Cocco4",
        "value": 80,
    }

    ];

    data = data.sort((a, b) => b.value - a.value).slice(0, 15);

    var svg = d3.select("#barPlot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d.value))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.player))
        .range([0, height])
        .padding(0.2);

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
        .attr("y", d => y(d.player))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.value));

    // Add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        .attr("y", d => y(d.player) + y.bandwidth() / 2 + 4)
        .attr("x", d => x(d.value) - 20) // Adjust the x position for the label
        .text(d => d.value)
        .style("fill", "white")
        .style("font-weight", "bold")
}
export { barPlot }