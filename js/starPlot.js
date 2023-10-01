function starPlot(data) {
    var playerData = [
        { feature: "Goals", value: 0.8 },
        { feature: "Passing Accuracy", value: 0.65 },
        { feature: "Defensive Actions", value: 0.75 },
        { feature: "Dribbling Success", value: 0.7 },
        { feature: "Assists", value: 0.6 }
    ];

    // Imposta le dimensioni del tuo star plot
    var width = 300;
    var height = 300;

    // Imposta il numero di feature
    var numFeatures = playerData.length;

    // Calcola l'angolo per ogni feature
    var angleSlice = (Math.PI * 2) / numFeatures;

    // Seleziona l'elemento SVG nel tuo documento
    var svg = d3.select("#starPlot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Crea un gruppo per il tuo star plot al centro del SVG
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Crea una scala per i valori delle feature
    var scale = d3.scaleLinear()
        .domain([0, 1]) // Valori normalizzati tra 0 e 1
        .range([0, Math.min(width, height) / 2]); // Raggio del cerchio

    // Crea il perimetro del cerchio esterno
    var perimeter = g.selectAll(".perimeter")
        .data([1])
        .enter()
        .append("polygon")
        .attr("class", "perimeter")
        .attr("points", createStarPoints(5, scale(1)));

    // Crea un percorso per connettere i punti stella al centro
    var radialLine = d3.lineRadial()
        .radius(function (d) { return scale(d.value); })
        .angle(function (d, i) { return i * angleSlice; });

    // Crea i punti stella
    var stars = g.selectAll(".star")
        .data([playerData])
        .enter()
        .append("path")
        .attr("class", "star")
        .attr("d", radialLine)
        .attr("transform", "translate(0,0)")
        .style("fill", "blue"); // Colore della stella

    // Funzione per creare i punti per il perimetro stella
    function createStarPoints(arms, outerRadius) {
        var angle = Math.PI / arms;
        var starPoints = [];

        for (var i = 0; i < 2 * arms; i++) {
            var r = (i % 2) === 0 ? outerRadius * 1 : outerRadius * 0.4;
            var x = Math.cos(i * angle) * r;
            var y = Math.sin(i * angle) * r;
            starPoints.push([x, y]);
        }

        return starPoints;
    }
}


export { starPlot };