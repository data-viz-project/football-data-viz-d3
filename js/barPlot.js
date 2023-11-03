//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 150
};

var currentWidth = parseInt(d3.select('#barPlot').style('width'), 10)
var currentHeight = parseInt(d3.select('#barPlot').style('height'), 10)

var width = currentWidth - margin.left - margin.right,
    height = currentHeight - margin.top - margin.bottom;

var backgroundButtonColor = "#f0f0f0"
var buttonColor = "#36454F"

var feature1 = "Goals"
var feature2 = "Assists"

var svg;
var yAxis;

var x = d3.scaleLinear()
    .range([0, width])

var y = d3.scaleBand()
    .range([0, height])
    .padding(0.15)

var colorScale;
var metric;
var leaguesArray;
var data;

var updateColorScale = function updateColorScale(cScale) {
    colorScale = cScale
}

var updateMetric = function updateMetric(m) {
    metric = m
}

var updateLeaguesArray = function updateLeaguesArray(l) {
    leaguesArray = l
}

var upadateData = function upadateData(d) {
    data = d
}

var updateChart = function updateChart(leaguesList, p_data) {
    updateLeaguesArray(leaguesList)
    upadateData(p_data)

    svg.selectAll(".label").remove();
    d3.select(".badge-container").remove();

    var badgeContainer = d3.select(".bar-plot-title")
        .append("div")
        .style("margin-bottom", "15px")
        .attr("class", "badge-container");

    var badges = badgeContainer.selectAll("span")
        .data(leaguesArray)
        .enter()
        .append("span")
        .attr("class", "badge")
        .text(d => d)
        .style("font-size", "1vw")
        .style("background-color", (d, i) => colorScale(d))
        .style("margin", "5px");

    badges.style("color", "white")
        .style("padding", "4px 8px")
        .style("text-align", "center")
        .style("border-radius", "5px");

    // deep copy of data obj
    var data_mult_90 = JSON.parse(JSON.stringify(data));

    for (var i = 0; i < data_mult_90.length; i++) {
        data_mult_90[i][metric] = Math.round(data_mult_90[i][metric] * data_mult_90[i]["90s"]);
    }

    data_mult_90 = data_mult_90.sort((a, b) => b[metric] - a[metric]).slice(0, 15);

    x.domain([0, Math.max(...data_mult_90.map(d => d[metric]))])

    y.domain(data_mult_90.map(d => d["Player"]))

    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).tickSize(0))

    const bars = d3.select(".group-bar")
        .selectAll(".bars")
        .data(data_mult_90, d => d["Player"]);

    const enterBars = bars
        .enter()
        .append("rect")
        .attr("class", "bars")
        .style("fill", "#0066b2")
        .attr("y", d => y(d["Player"]))
        .attr("height", y.bandwidth())
        .attr("x", 0);

    bars.merge(enterBars)
        .transition()
        .duration(1000)
        .attr("width", d => x(d[metric]))
        .attr("y", d => y(d["Player"]))
        .on("end", function () {
            svg.selectAll(".label")
                .data(data_mult_90, d => d["Player"])
                .enter()
                .append("text")
                .attr("class", "label")
                .each(function (d) {
                    if (!isNaN(y(d["Player"]))) {
                        d3.select(this)
                            .attr("y", y(d["Player"]) + y.bandwidth() / 2 + 7)
                            .attr("x", d => {
                                if (d[metric].toString().length == 1)
                                    return x(d[metric]) - 20;
                                else if (d[metric].toString().length == 2)
                                    return x(d[metric]) - 30;
                                else
                                    return x(d[metric]) - 45;
                            })
                            .text(d => parseInt(d[metric]))
                            .style("font-size", "1.5vw")
                            .style("fill", "white")
                            .style("font-weight", "bold");
                    }
                });
        });


    bars.exit().remove();
}

function barPlot(player_data, leaguesList, playerPos, cScale, features) {
    if (playerPos === "Forward") {
        feature1 = "Goals"
        feature2 = "Assists"
    }
    else if (playerPos === "Midfielder") {
        feature1 = "Goals"
        feature2 = "SCA"
    }
    else {
        feature1 = "AerWon"
        feature2 = "Blocks"
    }

    updateColorScale(cScale)
    updateLeaguesArray(leaguesList)
    upadateData(player_data)

    d3.selectAll(".barPlot").remove();

    svg = d3.select("#barPlot").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("class", "barPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    yAxis = svg
        .append("g")
        .attr("class", "group-bar")
        .style("font-size", "1.1vw")
        .style("color", "gray")

    d3.select(".bar-plot-title").select("h2").remove();

    d3.select(".bar-plot-title")
        .append("h2")
        .style("margin-top", "0px")
        .style("margin-bottom", "2.5vh")
        .style("font-size", "2vw")
        .text(`Top ${playerPos}s`)

    d3
        .select("#showFeature1")
        .text(feature1)
        .style("background-color", backgroundButtonColor)
        .style("color", buttonColor)
        .style("border", "1px solid")
        .style("padding", "0.4em 0.4em 0.4em")
        .on("click", () => {
            d3.select("#showFeature1")
                .style("background-color", buttonColor)
                .style("color", backgroundButtonColor)

            d3.select("#showFeature2")
                .style("background-color", backgroundButtonColor)
                .style("color", buttonColor)

            updateMetric(feature1)
            updateChart(leaguesArray, data)
        });

    d3
        .select("#showFeature2")
        .text(feature2)
        .style("background-color", backgroundButtonColor)
        .style("color", buttonColor)
        .style("border", "1px solid")
        .style("padding", "0.4em 0.4em 0.4em")
        .on("click", () => {
            d3.select("#showFeature1")
                .style("background-color", backgroundButtonColor)
                .style("color", buttonColor)

            d3.select("#showFeature2")
                .style("background-color", buttonColor)
                .style("color", backgroundButtonColor)

            updateMetric(feature2)
            updateChart(leaguesArray, data)
        });

    updateMetric(feature1)
    updateChart(leaguesArray, data)
    d3.select("#showFeature1").dispatch("click"); // Goals at the startup'll be clicked
}
export { barPlot, updateChart }