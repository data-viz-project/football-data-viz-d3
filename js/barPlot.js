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

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleBand()
    .range([0, height])
    .padding(0.15);

var metric;

var updateMetric = function updateMetric(actualMetric) {
    metric = actualMetric
}

function updateBars(p_data) {
    const svg = d3.select(".barPlot")

    const bars = svg.selectAll(".bar")
        .data(p_data, d => d["Player"]); // Associa i dati tramite la chiave "Player"

    // Enter selection
    const enterBars = bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "#0066b2")
        .attr("y", d => y(d["Player"]))
        .attr("height", y.bandwidth())
        .attr("x", 0);

    // Aggiorna la selezione (inclusa la transizione)
    bars.merge(enterBars)
        .transition()
        .duration(1000)
        .attr("width", d => x(d[metric]))
        .attr("y", d => y(d["Player"])) // Aggiorna la posizione y delle barre
        .on("end", function () {
            // Aggiungi o aggiorna le etichette dopo la transizione delle barre
            svg.selectAll(".label")
                .data(p_data, d => d["Player"])
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
        });

    // Rimuovi le barre e i testi in eccesso
    bars.exit().remove();

}

function barPlot(player_data, leaguesArray, playerPos, colorScale, features) {
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

    d3.selectAll(".barPlot").remove();

    var svg = d3.select("#barPlot").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("class", "barPlot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".axisBarPlot").remove(); // remove old axis
    svg.selectAll(".label").remove(); // remove old labels
    d3.select(".bar-plot-title").select("h2").remove();
    d3.select(".badge-container").remove();

    var barPlotTitle = d3.select(".bar-plot-title")

    barPlotTitle
        .append("h2")
        .style("margin-top", "0px")
        .style("margin-bottom", "2.5vh")
        .style("font-size", "2vw")
        .text(`Top ${playerPos}s`)

    var badgeContainer = barPlotTitle.append("div")
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

    function drawAxis(data) {
        // deep copy of player_data obj
        var data = JSON.parse(JSON.stringify(data));

        for (var i = 0; i < data.length; i++) {
            data[i][metric] = Math.round(data[i][metric] * data[i]["90s"]);
        }

        data = data.sort((a, b) => b[metric] - a[metric]).slice(0, 15);

        x = x.domain([0, Math.max(...data.map(d => d[metric]))])
        y = y.domain(data.map(d => d["Player"]))

        // Make y axis to show bar names
        const yAxis = d3.axisLeft(y).tickSize(0);

        // Aggiorna l'asse y
        svg
            .attr("class", "y axisBarPlot")
            .style("font-size", "1.1vw")
            .style("color", "gray")
            .transition() // Aggiungi una transizione all'aggiornamento dell'asse y
            .duration(1000) // Durata dell'animazione
            .call(yAxis);

        updateBars(data);
    }


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

            updateMetric(feature1);
            drawAxis(player_data);
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

            updateMetric(feature2);
            drawAxis(player_data);
        });

    d3.select("#showFeature1").dispatch("click"); // Goals at the startup'll be clicked
    updateMetric(feature1)
    drawAxis(player_data);
}
export { barPlot, updateBars }