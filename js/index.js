import { scatterPlot } from "./scatterPlot.js";
import { myTeam } from "./myTeam.js";
import { starPlot } from "./starPlot.js";

// map to explain features inside the csv 
var acronyms = await d3.json("../data/acronyms.json", data => {
    return data;
});


async function showDashboard() {
    const dropMenuLeague = d3.select("#pick-league");

    dropMenuLeague
        .selectAll("option")
        .data(["Serie A", "Premier League", "La Liga", "Bundesliga", "Ligue 1"])
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    dropMenuLeague.on('change', async function (event) {
        let league = event.target.value;
        console.log(league);

        // read the CSV
        // Carica il file CSV
        var attk_data = await d3.csv(`../data/${league}/attk.csv`, data => {
            // Cicla attraverso ciascun record nel CSV
            for (var key in data) {
                // Controlla se la chiave è una delle feature da convertire a numero
                if (key === "Player" || key === "Comp" || key === "Squad") {
                    // Lascia il valore come stringa
                    data[key] = data[key];
                } else {
                    // Altrimenti, converte il valore in numero (se possibile)
                    data[key] = parseFloat(data[key]);
                }
            }
            return data;
        });


        console.log(attk_data);

        var cen_data = await d3.csv(`../data/${league}/cen.csv`, data => {
            return data;
        });

        var dif_data = await d3.csv(`../data/${league}/dif.csv`, data => {
            return data;
        });

        scatterPlot(attk_data, acronyms);
    });


    // read the CSV
    var attk_data = await d3.csv(`../data/${dropMenuLeague.property('value')}/attk.csv`, data => {
        // Cicla attraverso ciascun record nel CSV
        for (var key in data) {
            // Controlla se la chiave è una delle feature da convertire a numero
            if (key === "Player" || key === "Comp" || key === "Squad") {
                // Lascia il valore come stringa
                data[key] = data[key];
            } else {
                // Altrimenti, converte il valore in numero (se possibile)
                data[key] = parseFloat(data[key]);
            }
        }
        return data;
    });

    var cen_data = await d3.csv(`../data/${dropMenuLeague.property('value')}/cen.csv`, data => {
        return data;
    });

    var dif_data = await d3.csv(`../data/${dropMenuLeague.property('value')}/dif.csv`, data => {
        return data;
    });

    scatterPlot(attk_data, acronyms);
    //starPlot();
    //myTeam(attk_data, cen_data, dif_data);
}

showDashboard();