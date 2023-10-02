function starPlot() {
    // Configurazione delle costanti
    const width = 1200;
    const height = 650;
    const idleOpacity = 0.5;
    const idleWidth = 4;
    const pointRadius = 5;

    // Dati dei giocatori
    const data = [
        {
            player: "Tammy Abraham",
            goals: 0.50,
            shots: 2.71,
            pasTotCmp: 14.6,
            assists: 0.12,
            aerWon: 2.39
        },
        {
            player: "Francesco Acerbi",
            goals: 0.14,
            shots: 0.57,
            pasTotCmp: 64.3,
            assists: 0.00,
            aerWon: 2.84
        },
        // Aggiungi più oggetti giocatore se necessario
    ];

    let names = data.map(d => d.player);

    // Rimozione del nome dall'oggetto
    data.forEach(d => delete d.player);

    // Nomi delle variabili (features)
    const variables = Object.keys(data[0]);

    // Calcola dominio per la radialScale basato sui dati
    const maxStatValue = Math.max(
        ...data.map(item =>
            Math.max(item.goals, item.shots, item.pasTotCmp, item.assists, item.aerWon)
        )
    );
    const minStatValue = Math.min(
        ...data.map(item =>
            Math.min(item.goals, item.shots, item.pasTotCmp, item.assists, item.aerWon)
        )
    );

    // Funzione per calcolare le coordinate del percorso
    function getPathCoordinates(data_point) {
        return variables.map((ft_name, i) => {
            const angle = (Math.PI / 2) + (2 * Math.PI * i / variables.length);
            return angleToCoordinate(angle, data_point[ft_name]);
        });
    }

    // Funzione per ottenere un colore più chiaro
    function lighterColor(color) {
        const c = d3.color(color);
        c.opacity = c.opacity - 0.4;
        return c.toString();
    }

    // Gestisce l'evento di click su una stella
    function on_click(event, d) {
        const g = svg.selectAll("g");

        g.selectAll("path")
            .attr("fill", "none")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", idleWidth)
            .attr("opacity", idleOpacity);

        g.selectAll("circle")
            .attr("r", pointRadius);

        const clickedGroup = d3.select(this.parentNode);

        const clickedPath = clickedGroup.selectAll("path");
        clickedPath
            .transition()
            .duration(400)
            .attr("fill", lighterColor(clickedPath.attr("stroke")))
            .attr("stroke-opacity", 1)
            .attr("opacity", 1)
            .attr("stroke-width", idleWidth + 2);

        clickedGroup.selectAll("circle")
            .transition()
            .duration(400)
            .attr("r", pointRadius + 4);
    }

    // Funzione per calcolare le coordinate di un punto sulla circonferenza
    function angleToCoordinate(angle, value) {
        const x = Math.cos(angle) * radialScale(value);
        const y = Math.sin(angle) * radialScale(value);
        return { "x": width / 2 + x, "y": height / 2 - y };
    }

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "svg-style");

    // Scala utilizzata per mappare i valori al raggio
    const radialScale = d3.scaleLinear()
        .domain([minStatValue, maxStatValue])
        .range([0, 280]);

    const ticks = d3.ticks(minStatValue, maxStatValue, 6);

    svg.selectAll("circle")
        .data(ticks)
        .join("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", d => radialScale(d))
        .attr("stroke-opacity", 0.5);

    svg.selectAll(".ticklabel")
        .data(ticks)
        .join("text")
        .attr("class", "ticklabel")
        .attr("x", width / 2 + 5)
        .attr("y", d => height / 2 - radialScale(d) - 5)
        .text(d => d.toString());

    const featureData = variables.map((f, i) => {
        const angle = (Math.PI / 2) + (2 * Math.PI * i / variables.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, maxStatValue),
            "label_coord": angleToCoordinate(angle, maxStatValue + 0.5)
        };
    });

    svg.selectAll("line")
        .data(featureData)
        .join("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", d => d.line_coord.x)
        .attr("y2", d => d.line_coord.y)
        .attr("stroke", "black");

    // ...

    svg.selectAll(".axislabel")
        .data(featureData)
        .join("text")
        .attr("x", d => calculateXPosition(d, featureData.indexOf(d)))
        .attr("y", d => calculateYPosition(d, featureData.indexOf(d)))
        .text(d => d.name)
        .attr("id", d => d.name);

    svg.selectAll(".axislabel")
        .data(featureData)
        .join("text")
        .attr("x", d => calculateXPosition(d, featureData.indexOf(d)))
        .attr("y", d => calculateYPosition(d, featureData.indexOf(d)))
        .text(d => d.name)
        .attr("id", d => d.name);

    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    // Scala utilizzata per mappare il nome del giocatore a un colore
    const colors = d3.scaleOrdinal()
        .domain(names)
        .range(d3.schemeTableau10);

    svg.selectAll("myCircles")
        .data(data)
        .join("g")
        .attr("id", (d, i) => "group" + (i + 1))
        .selectAll("path")
        .data(d => {
            const pathCoordinates = getPathCoordinates(d);
            // Aggiungi il punto finale uguale al punto di partenza
            pathCoordinates.push(pathCoordinates[0]);
            return [pathCoordinates];
        })
        .join("path")
        .attr("d", line)
        .attr("stroke-width", idleWidth)
        .attr("stroke", d => colors(d3.select(this.parentNode).attr("id")))
        .attr("fill", "none")
        .attr("stroke-opacity", 1)
        .attr("opacity", idleOpacity)
        .on("click", on_click);

    svg.selectAll("myCircles")
        .data(data)
        .join("g")
        .selectAll("circle")
        .data(d => getPathCoordinates(d))
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => colors(d3.select(this.parentNode).attr("id")))
        .attr("r", pointRadius);

    // Legenda - Dots
    svg.selectAll(".mydots")
        .data(names)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", (d, i) => 100 + i * 25) // 100 è dove appare il primo punto. 25 è la distanza tra i punti
        .attr("r", 7)
        .style("fill", d => colors(d));

    // Legenda - Labels
    svg.selectAll("mylabels")
        .data(names)
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", (d, i) => 100 + i * 25) // 100 è dove appare il primo punto. 25 è la distanza tra i punti
        .style("fill", d => colors(d))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");


    // ...

    function calculateXPosition(d, i) {
        if (i === 0) {
            return d.line_coord.x - 25;
        } else if (i === 1) {
            return d.line_coord.x - 90;
        } else if (i === 2) {
            return d.line_coord.x - 40;
        } else if (i === 4) {
            return d.line_coord.x + 11;
        }
        return d.line_coord.x;
    }

    function calculateYPosition(d, i) {
        if (i === 0) {
            return d.line_coord.y - 27;
        } else if (i === 1) {
            return d.line_coord.y - 5;
        } else if (i === 2) {
            return d.line_coord.y + 20;
        } else if (i === 3) {
            return d.line_coord.y + 20;
        }
        return d.line_coord.y;
    }

    // ...

    // Ora puoi utilizzare calculateXPosition e calculateYPosition nel tuo codice.

    // ...



}

export { starPlot };
