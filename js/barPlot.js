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

var colorScale;
var metric;
var leaguesArray;

var updateColorScale = function updateColorScale(cScale) {
    colorScale = cScale
}

var updateMetric = function updateMetric(m) {
    metric = m
}

var updateLeaguesArray = function updateLeaguesArray(l) {
    leaguesArray = l
}

var updateChart = function updateChart(leaguesList, p_data) {
    updateLeaguesArray(leaguesList);

    const svg = d3.select(".barPlot");

    svg.selectAll(".axisBarPlot").remove(); // remove old axis
    svg.selectAll(".label").remove(); // remove old labels
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

    // deep copy of player_data obj
    var data = JSON.parse(JSON.stringify(p_data));

    for (var i = 0; i < data.length; i++) {
        data[i][metric] = Math.round(data[i][metric] * data[i]["90s"]);
    }

    data = data.sort((a, b) => b[metric] - a[metric]).slice(0, 15);

    const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d[metric]))])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d["Player"]))
        .range([0, height])
        .padding(0.15);

    const yAxis = d3.axisLeft(y).tickSize(0);

    svg
        .attr("class", "y axisBarPlot")
        .style("font-size", "1.1vw")
        .style("color", "gray")
        .transition()
        .duration(1000)
        .call(yAxis);

    const bars = svg.selectAll(".bar")
        .data(data, d => d["Player"]);

    bars.exit().remove(); // Rimuovi le vecchie barre

    const enterBars = bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "#0066b2")
        .attr("y", d => y(d["Player"]))
        .attr("height", y.bandwidth())
        .attr("x", 0);

    bars.merge(enterBars)
        .transition()
        .duration(1000)
        .attr("width", d => x(d[metric]))
        .attr("y", d => y(d["Player"]));

    // Aggiorna le etichette delle barre
    svg.selectAll(".label")
        .data(data, d => d["Player"])
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("y", d => y(d["Player"]) + y.bandwidth() / 2 + 7)
        .attr("x", d => {
            if (d[metric].toString().length == 1)
                return x(d[metric]) - 10;
            else return x(d[metric]) - 15;
        })
        .text(d => parseInt(d[metric]))
        .style("font-size", "1.5vw")
        .style("fill", "white")
        .style("font-weight", "bold");
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

    d3.select("#barPlot").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("class", "barPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
            updateChart(leaguesArray, player_data)
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
            updateChart(leaguesArray, player_data)
        });

    updateMetric(feature1);
    updateChart(leaguesArray, player_data)
    d3.select("#showFeature1").dispatch("click"); // Goals at the startup'll be clicked
}
export { barPlot, updateChart }