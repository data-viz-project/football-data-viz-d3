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
    }];

    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.descending(a.value, b.value);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 15,
        right: 25,
        bottom: 15,
        left: 60
    };

    var width = 960 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var svg = d3.select("#barPlot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);

    var y = d3.scaleBand()
        .range([0, width])
        .padding(10)
        .domain(data.map(function (d) {
            return d.player;
        }));

    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        // no tick marks
        .tickSize(0);

    var gy = svg.append("g")
        .attr("class", "y axisBarPlot")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.player);
        })
        .attr("height", 20)
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value);
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.player) + 20 / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) - 20;
        })
        .text(function (d) {
            return d.value;
        })
        .style("fill", "white");

}
export { barPlot }