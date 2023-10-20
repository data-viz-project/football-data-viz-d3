const margin = { top: 20, right: 30, bottom: 80, left: 80 },
    width = parseInt(d3.select('#scatter-plot').style('width'), 10) - margin.left - margin.right,
    height = parseInt(d3.select('#scatter-plot').style('height'), 10) - margin.top - margin.bottom;

var calculateMinMaxValue = function (feature, data) {
    let minMax = d3.extent(data, function (d) {
        return d[feature];
    });
    return minMax;
};


var reverseArray = function reverseArray(arr) {
    var reversed = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        reversed.push(arr[i]);
    }
    return reversed;
}


function scatterPlot(players_data, acronyms, features, colorScale, leaguesArray) {
    var tooltip = d3.select("#scatter-plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("display", "flex")
        .style("flex-direction", "row"); // Imposta il flex-direction a "column" per posizionare i div dei dati uno sotto l'altro.

    var mouseover = function (event, d) {
        d3.selectAll(".scatterDots")
            .attr("r", 7)
            .style("fill", function (d) { return colorScale(d.Comp); })

        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 15)

        tooltip
            .transition()
            .duration(200)
            .style("opacity", 1);
    };

    var mouseout = function (event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", function (d) { return colorScale(d.Comp); })
            .attr("r", 7);

        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0);
    }

    var mousemove = function (event, d) {
        let x_label = d3.select("#x-axis").property("value")
        let y_label = d3.select("#y-axis").property("value")

        tooltip.html(""); // Cancella il contenuto esistente.

        tooltip
            .style('left', event.pageX - 100 + 'px')
            .style('top', event.pageY - 85 + 'px');

        const playerExactValue = tooltip
            .append("div")
            .style("padding-right", "1vw")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("flex-grow", "1")

        playerExactValue.append("div")
            .html("Player" + ": <span style='font-weight: bold;'>" + d["Player"] + "</span>");

        playerExactValue.append("div")
            .html(acronyms[x_label] + ": <span style='font-weight: bold;'>" + d[x_label] + "</span>");

        playerExactValue.append("div")
            .html(acronyms[y_label] + ": <span style='font-weight: bold;'>" + d[y_label] + "</span>");

        tooltip
            .append("div")
            .html('<img src="' + d["PlayerFaceUrl"] + '" width="50" height="50"/>')
    }

    d3.selectAll(".scatterPlot").remove();

    // append the svg object to the body of the page

    const container = d3.select("#scatter-plot")
    const svg = container
        .append("svg")
        .attr("class", "scatterPlot")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    svg.selectAll(".group").remove();

    var points = svg.append('g')
        .attr("class", "group")
        .selectAll("points");

    function drawPoints(x_label, y_label) {
        let minMax = calculateMinMaxValue(x_label, players_data)

        // Add X axis
        const x = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([0, width]);

        svg.selectAll(".axis").remove();

        // Append a new X axis group
        var axis_x = svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${height})`)
            .attr("opacity", "0"); // Start with opacity set to 0

        // Transition the opacity of the old axis to 0
        d3.select(".axis")
            .transition()
            .duration(1000)
            .attr("opacity", "0")

        // Transition the opacity of the new axis to 1
        axis_x
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .call(d3.axisBottom(x));

        minMax = calculateMinMaxValue(y_label, players_data)
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([minMax[0], minMax[1]])
            .range([height, 0]);

        let axis_y = svg.append("g")
            .attr("class", "axis")
            .attr("opacity", "0"); // Start with opacity set to 0

        axis_y
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .call(d3.axisLeft(y));

        // Seleziona tutti i gruppi con classe "axis" all'interno dell'elemento SVG
        svg.selectAll("g.axis")
            .selectAll("line")

        svg.selectAll(".axis-label").remove();

        // Add X axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + 30)
            .attr("y", height + 40)
            .text(acronyms[x_label]);

        // Y axis label:
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", height / -8)
            .text(acronyms[y_label])

        d3.select("#scatter-plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        // Aggiungi i punti, nascondili e imposta le coordinate
        points = points
            .data(players_data)
            .join("circle")
            .style("fill", function (d) { return colorScale(d.Comp); })
            .style("stroke", "black")
            .style("class", "scatterDots")
            .attr("id", function (d) {
                // Dividi il nome completo in spazi e prendi il secondo elemento come cognome
                const nameParts = d.Player.split(" ");
                if (nameParts.length > 1) {
                    return nameParts[1].toLowerCase();
                } else {
                    return d.Player.toLowerCase(); // Se il nome non ha spazi, usa il nome completo come ID
                }
            })
            .attr("cx", function (d) { return x(d[x_label]); })
            .attr("cy", function (d) { return y(d[y_label]); })
            .attr("r", 7)
            .style("opacity", 0); // Nascondi i punti inizialmente

        // Aggiungi la transizione per far apparire gradualmente i punti
        points
            .transition() // Inizia la transizione
            .duration(1000) // Durata della transizione in millisecondi
            .style("opacity", 1); // Gradualmente aumenta l'opacità fino a 1 per far apparire i punti

    }

    // d3.select("#search-bar")
    //     .on("input", function () {
    //         d3.selectAll("circle")
    //             .attr("r", 7)
    //             .style("fill", "white")

    //         const searchQuery = this.value.toLowerCase();

    //         d3.select("#" + searchQuery)
    //             .transition()
    //             .duration(200)
    //             .attr("r", 15)
    //             .style("fill", "green");
    //     });

    var badgeContainer = d3.select("#badge-container-scatter")

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




    const dropMenuX = d3.select("#x-axis");
    const dropMenuY = d3.select("#y-axis");

    dropMenuX.selectAll("option").remove();
    dropMenuY.selectAll("option").remove();

    dropMenuX
        .selectAll("option")
        .data(function () { return features; })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuX.on('change', function (event) {
        drawPoints(event.target.value, dropMenuY.property("value"));
    });

    dropMenuY
        .selectAll("option")
        .data(function () { return reverseArray(features); })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuY.on('change', function (event) {
        drawPoints(dropMenuX.property('value'), event.target.value);
    });

    drawPoints(dropMenuX.property('value'), dropMenuY.property('value'));
}
export { scatterPlot };