const margin = { top: 20, right: 30, bottom: 80, left: 80 },
    width = parseInt(d3.select('#scatter-plot').style('width'), 10) - margin.left - margin.right,
    height = parseInt(d3.select('#scatter-plot').style('height'), 10) - margin.top - margin.bottom;

const checkboxData = ["Serie A", "Premier League", "La Liga", "Bundesliga", "Ligue 1"];

// color scale mapped to competition values
var colorScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10)
    .domain(checkboxData);
// x scale axis 
var x = d3.scaleLinear()
    .range([0, width]);
// y scale axis
var y = d3.scaleLinear()
    .range([height, 0])

var x_label = "Goals"
var y_label = "Assists"

var selectedData;

var initialStrokeWidth = 1.7
var initialRadius = 6

const dropMenuX = d3.select("#x-axis");
const dropMenuY = d3.select("#y-axis");

var badgeContainer = d3.select("#badge-container-scatter")
var badges = badgeContainer.selectAll("span")
    .data(checkboxData)
    .enter()
    .append("span")
    .attr("class", "badge")
    .attr("id", (d, i) => "badge" + d.replace(" ", "-"))
    .text(d => d)
    .style("font-size", "1vw")
    .style("background-color", (d, i) => colorScale(d))
    .style("margin", "5px")
    .style("display", "none")

badges.style("color", "white")
    .style("padding", "4px 8px")
    .style("text-align", "center")
    .style("border-radius", "5px");

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

var mouseover = function (event, d) {
    d3.select(".tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1);
};

var mouseout = function (event, d) {
    d3.select(".tooltip")
        .transition()
        .duration(200)
        .style("opacity", 0);
}

var mousemove = function (event, d) {
    let tooltip = d3.select(".tooltip")
    let x_label = d3.select("#x-axis").property("value")
    let y_label = d3.select("#y-axis").property("value")

    tooltip.html("");

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
        .html(x_label + ": <span style='font-weight: bold;'>" + d[x_label] + "</span>");

    playerExactValue.append("div")
        .html(y_label + ": <span style='font-weight: bold;'>" + d[y_label] + "</span>");

    tooltip
        .append("div")
        .html('<img src="' + d["PlayerFaceUrl"] + '" width="50" height="50"/>')
}

var getPointId = function (d) {
    // Dividi il nome completo in spazi e prendi il secondo elemento come cognome
    const nameParts = d.Player.split(" ");
    if (nameParts.length > 1) {
        return nameParts[1].toLowerCase();
    } else {
        return d.Player.toLowerCase(); // Se il nome non ha spazi, usa il nome completo come ID
    }
}

var updateData = function updateData(data) {
    selectedData = data
}

var updatePoints = function updatePoints(data) {
    updateData(data)

    let points = d3
        .select(".group")
        .selectAll("circle")

    // Add new points to the group
    var newPoints = d3
        .select(".group")
        .selectAll("circle")
        .data(selectedData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return width / 2 })
        .attr("cy", function (d) { return height / 2 })
        .style("fill", function (d) { return colorScale(d.Comp); })
        .style("stroke", "black")
        .style("stroke-width", initialStrokeWidth)
        .style("r", initialRadius)
        .style("cursor", "pointer")
        .style("class", "scatterDots")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("click", function (d) {
            console.log(d3.select(this).style("fill"));
            if (d3.select(this).style("fill") == "yellow") {
                d3.select(this).style("fill", function (d) { return colorScale(d.Comp); })
                d3.select(this).style("stroke", "black")
            }
            else {
                d3.select(this).style("fill", "yellow")
                d3.select(this).style("stroke", function (d) { return colorScale(d.Comp); })
            }
        })

    // Merge the new points with the existing points and apply transitions
    points = newPoints.merge(points)
        .transition()
        .duration(1000)
        .attr("id", getPointId)
        .attr("cx", function (d) { return x(d[x_label]); })
        .attr("cy", function (d) { return y(d[y_label]); })
        .attr("r", 7);
}


function scatterPlot(data, acronyms, features, leaguesArray, allData) {
    if (features.indexOf(x_label) == -1)
        x_label = "Goals"
    else
        x_label = x_label

    if (features.indexOf(y_label) == -1)
        y_label = "Assists"
    else
        y_label = y_label


    updateData(data)

    d3.select("#scatter-plot")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("display", "flex")
        .style("flex-direction", "row");

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

    // Select the existing or newly created group
    svg.append("g")
        .attr("class", "group")

    function drawAxis() {
        // update x-axis domain
        let minMax = calculateMinMaxValue(x_label, allData)
        x = x.domain([minMax[0], minMax[1]])

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

        // update y-axis domain
        minMax = calculateMinMaxValue(y_label, allData)
        y = y.domain([minMax[0], minMax[1]])

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

        if (selectedData == null)
            updatePoints(data)
        else
            updatePoints(selectedData)
    }

    dropMenuX.selectAll("option").remove();
    dropMenuY.selectAll("option").remove();

    dropMenuX
        .selectAll("option")
        .data(function () { return features; })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)
        .property("selected", function (d) { return d === "Goals"; });

    dropMenuX.on('change', function (event) {
        x_label = event.target.value
        y_label = dropMenuY.property("value")
        drawAxis();
    });

    dropMenuY
        .selectAll("option")
        .data(function () { return features })
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)
        .property("selected", function (d) { return d === "Assists"; });

    dropMenuY.on('change', function (event) {
        x_label = dropMenuX.property('value')
        y_label = event.target.value
        drawAxis();
    });

    drawAxis();
}
export { scatterPlot, updatePoints };