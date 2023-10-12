import { scatterPlot } from "./scatterPlot.js";
import { barPlot } from "./barPlot.js";

// map to explain features inside the csv 
var acronyms = await d3.json("../data/acronyms.json", data => {
    return data;
});

// read the csv dataset
var attk_data = await d3.csv('../data/dataset-preproc/attk.csv', data => {
    for (var key in data) {
        if (key === "Player" || key === "Comp" || key === "Squad" || key === "PlayerFaceUrl" || key === "ClubLogoUrl" || key === "Pos")
            data[key] = data[key];
        else
            data[key] = parseFloat(data[key]);
    }
    return data;
});



async function showDashboard() {
    // sidebar interaction
    const toggleSidebar = () => {
        const sidebar = d3.select(".sidebar");
        if (sidebar.style("display") === "none")
            sidebar.style("display", "flex")
        else
            sidebar.style("display", "none")
    };

    const sidebar = d3.select(".sidebar-toggle");
    sidebar.on("click", toggleSidebar);

    // dropmenu interaction
    const selectedLeagues = new Set();

    var checkboxData = ["Serie A", "Premier League", "La Liga", "Bundesliga", "Ligue 1"];

    d3.select("#dropMenuLeague")
        .selectAll("div") // Usiamo un contenitore div per ciascuna coppia di checkbox e label
        .data(checkboxData)
        .join(
            enter => {
                const group = enter.append("div") // Crea un div per ogni gruppo di checkbox-label e il rettangolo
                    .style("border", "4px solid #ccc") // Aggiungi un bordo al gruppo
                    .style("margin", "5px"); // Aggiungi margine al gruppo

                const label = group.append("label") // Aggiungi una label al gruppo
                    .attr("for", d => "checkbox-" + d) // Associa la label alla checkbox tramite l'attributo "for"
                    .text(d => d) // Il testo della label è il valore d
                    .style("color", "rgb(128, 128, 128)")
                    .style("padding", "10px");

                const checkbox = group.append("input") // Aggiungi la checkbox al gruppo
                    .attr("type", "checkbox")
                    .attr("class", "checkbox")
                    .attr("value", d => d)
                    .attr("checked", d => d === "Serie A" ? "checked" : null)
                    .on("change", (event) => {
                        d3.selectAll(".checkbox").each(function (d) {
                            if (d3.select(this).property("checked")) {
                                selectedLeagues.add(d);
                                loadAndDisplayData(selectedLeagues);
                            } else {
                                selectedLeagues.delete(d);
                                loadAndDisplayData(selectedLeagues);
                            }
                        });
                    });
            }
        );



    async function loadAndDisplayData(leagueSet) {
        const leaguesArray = Array.from(leagueSet);

        let selectedData = await loadSelectedData(leaguesArray);

        scatterPlot(selectedData, acronyms);
        barPlot(selectedData, leaguesArray);
    }

    async function loadSelectedData(selectedLeagues) {
        var selectedData = attk_data.filter(d => d["Comp"] === selectedLeagues[0])

        for (let i = 1; i < selectedLeagues.length; i++)
            selectedData = selectedData.concat(attk_data.filter(d => d["Comp"] === selectedLeagues[i]));

        return selectedData;
    }

    loadAndDisplayData([checkboxData[0]])
}

showDashboard();