var plotscale = 750

var margin = {
    top: (plotscale * (14.86 / 960)),
    right: (plotscale * (20 / 960)),
    bottom: (plotscale * (24 / 960)),
    left: (plotscale * (40 / 960))
},
    width = plotscale - margin.left - margin.right,
    height = (plotscale * (68 / 105) - margin.top - margin.bottom);
console.log(68 / 105, height / width)

function soccerField(attk_data, cen_data, dif_data) {
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    var svg = d3.select("#field").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("stroke-width", 3);

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("class", "mesh")
        .attr("width", width)
        .attr("height", height);

    // field outline    
    svg.append("rect")
        .attr("id", "outline")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "black");

    // right penalty area 
    svg.append("rect")
        .attr("id", "six")
        .attr("x", x(83))
        .attr("y", y(78.9))
        .attr("width", x(100) - x(83))
        .attr("height", y(21.1) - y(78.9))
        .attr("fill", "none")
        .attr("stroke", "black");

    // right six yard box
    svg.append("rect")
        .attr("id", "penarea")
        .attr("x", x(94.2))
        .attr("y", y(63.2))
        .attr("width", x(100) - x(94.2))
        .attr("height", y(36.8) - y(63.2))
        .attr("fill", "none")
        .attr("stroke", "black");



    // left penalty area 
    svg.append("rect")
        .attr("id", "six")
        .attr("x", x(0))
        .attr("y", y(78.9))
        .attr("width", x(100) - x(83))
        .attr("height", y(21.1) - y(78.9))
        .attr("fill", "none")
        .attr("stroke", "black");

    // six yard box
    svg.append("rect")
        .attr("id", "penarea")
        .attr("x", x(0))
        .attr("y", y(63.2))
        .attr("width", x(100) - x(94.2))
        .attr("height", y(36.8) - y(63.2))
        .attr("fill", "none")
        .attr("stroke", "black");

    // 50 yd line
    svg.append("line")
        .attr("id", "half")
        .attr("x1", x(50))
        .attr("x2", x(50))
        .attr("y1", y(0))
        .attr("y2", y(100))
        .attr("stroke", "black");

    // center circle
    svg.append("circle")
        .attr("cx", x(50))
        .attr("cy", y(50))
        .attr("r", x(10))
        .attr("fill", "none")
        .attr("stroke", "black");

    // Crea una scala per le coordinate x
    var xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    // Crea una scala per le coordinate y
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // Posizioni dei giocatori nel modulo 4-4-2
    var playerPositions = [
        { cx: xScale(50), cy: yScale(80), fill: "green" }, // Cen sinistro
        { cx: xScale(50), cy: yScale(60), fill: "green" }, // Cen centrale 1
        { cx: xScale(50), cy: yScale(40), fill: "green" }, // Cen centrale 2
        { cx: xScale(50), cy: yScale(20), fill: "green" }, // Cen destro
        { cx: xScale(75), cy: yScale(60), fill: "red" },   // Attaccante
        { cx: xScale(75), cy: yScale(40), fill: "red" },   // Attaccante
        { cx: xScale(30), cy: yScale(80), fill: "blue" },  // Difensore sinistro
        { cx: xScale(30), cy: yScale(60), fill: "blue" },  // Difensore centrale 1
        { cx: xScale(30), cy: yScale(40), fill: "blue" },  // Difensore centrale 2
        { cx: xScale(30), cy: yScale(20), fill: "blue" },  // Difensore destro
        { cx: xScale(10), cy: yScale(50), fill: "orange" } // Portiere
    ];

    // Aggiungi i cerchi dei giocatori usando forEach
    playerPositions.forEach(function (position, index) {
        svg.append("circle")
            .attr("cx", position.cx)
            .attr("cy", position.cy)
            .attr("r", xScale(3.5))
            .attr("fill", position.fill)
            .attr("stroke", "black")
            .attr("id", "player" + index); // Aggiungi un ID univoco per ciascun giocatore
    });
}
export { soccerField };