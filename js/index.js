import { scatterPlot } from "./scatterPlot.js";
import { barPlot } from "./barPlot.js";

// map to explain features inside the csv 
var acronyms = await d3.json("../data/acronyms.json", data => {
    return data;
});

// read the csv dataset
var data = await d3.csv('../data/dataset-preproc/forward.csv', data => {
    for (var key in data) {
        if (key === "Player" || key === "Comp" || key === "Squad" || key === "PlayerFaceUrl" || key === "ClubLogoUrl" || key === "Pos")
            data[key] = data[key];
        else
            data[key] = parseFloat(data[key]);
    }
    return data;
});

var features = ["Goals", "Shots", "SoT", "G/Sh", "G/SoT", "ShoDist", "GCA", "SCA", "Off", "PKwon", "ScaDrib", "Assists",
    "ScaPassLive", "Car3rd", "ScaFld", "Carries", "CarTotDist", "CarPrgDist", 'CPA', "CarMis", "CarDis"]

const playerTypeSelect = d3.select("#pick-position");

playerTypeSelect
    .selectAll("option")
    .data(["Forward", "Midfielder"]) // "Defender"
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);


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
    selectedLeagues.add("Serie A")

    var checkboxData = ["Serie A", "Premier League", "La Liga", "Bundesliga", "Ligue 1"];

    d3.select("#dropMenuLeague")
        .selectAll("div")
        .data(checkboxData)
        .join(
            enter => {
                const group = enter.append("div")
                    .style("border", "4px solid #ccc")
                    .style("margin", "5px"); // Aggiungi margine al gruppo

                group.append("label") // Aggiungi una label al gruppo
                    .attr("for", d => "checkbox-" + d) // Associa la label alla checkbox tramite l'attributo "for"
                    .text(d => d) // Il testo della label è il valore d
                    .style("color", "rgb(128, 128, 128)")
                    .style("padding", "10px");

                group.append("input") // Aggiungi la checkbox al gruppo
                    .attr("type", "checkbox")
                    .attr("class", "checkbox")
                    .attr("value", d => d)
                    .attr("checked", d => d === "Serie A" ? "checked" : null)
                    .on("change", (event) => {
                        d3.selectAll(".checkbox").each(function (d) {
                            if (d3.select(this).property("checked")) {
                                selectedLeagues.add(d);
                                loadAndDisplayData(selectedLeagues, data, features, playerTypeSelect.property("value"));
                            } else {
                                selectedLeagues.delete(d);
                                loadAndDisplayData(selectedLeagues, data, features, playerTypeSelect.property("value"));
                            }
                        });
                    });
            }
        );

    playerTypeSelect.on("change", async function (d, event) {
        if (this.value.toLowerCase() === "forward")
            features = ["Goals", "Shots", "SoT", "G/Sh", "G/SoT", "ShoDist", "GCA", "SCA", "Off", "PKwon", "ScaDrib", "Assists",
                "ScaPassLive", "Car3rd", "ScaFld", "Carries", "CarTotDist", "CarPrgDist", 'CPA', "CarMis", "CarDis"]
        else if (this.value.toLowerCase() === "midfielder")
            features = ["Goals", "PasTotCmp", "PasTotCmp%", "PasTotDist", "PasTotPrgDist", "Assists", "PasAss", "Pas3rd", "Crs", "PasCmp",
                "PasOff", "PasBlocks", "SCA", "ScaPassLive", "ScaPassDead", "ScaDrib", "ScaSh", "ScaFld", "GCA", "GcaPassLive",
                "GcaPassDead", "GcaDrib", "GcaSh", "GcaFld", "Tkl", "TklWon", "TklDef3rd", "TklMid3rd", "TklAtt3rd", "TklDri",
                "TklDriAtt", "TklDri%", "TklDriPast", "Blocks", "BlkSh", "Int", "Recov", "Carries", "CarTotDist", "CarPrgDist", "Fld"]
        else
            features = ["PasTotCmp", "PasTotDist", "PasTotPrgDist", "Tkl", "TklWon", "TklDef3rd", "TklMid3rd", "TklAtt3rd", "TklDri", "TklDriAtt", "TklDriPast", "Blocks",
                "BlkSh", "Int", "Tkl+Int", "Recov", "AerWon", "AerLost", "Carries", "CarTotDist", "CarPrgDist", "CrdY", "CrdR", "Fls", "Clr"]

        // read the CSV
        data = await d3.csv(`../data/dataset-preproc/${this.value.toLowerCase()}.csv`, data => {
            for (var key in data) {
                if (key === "Player" || key === "Comp" || key === "Squad" || key === "PlayerFaceUrl" || key === "ClubLogoUrl" || key === "Pos")
                    data[key] = data[key];
                else
                    data[key] = parseFloat(data[key]);
            }
            return data;
        });

        loadAndDisplayData(selectedLeagues, data, features, this.value);
    });



    async function loadAndDisplayData(leagueSet, data, features, playerPos) {
        const leaguesArray = Array.from(leagueSet);

        let selectedData = await loadSelectedData(leaguesArray, data);

        scatterPlot(selectedData, acronyms, features);
        barPlot(selectedData, leaguesArray, playerPos);
    }

    async function loadSelectedData(selectedLeagues, data) {
        var selectedData = data.filter(d => d["Comp"] === selectedLeagues[0])

        for (let i = 1; i < selectedLeagues.length; i++)
            selectedData = selectedData.concat(data.filter(d => d["Comp"] === selectedLeagues[i]));

        return selectedData;
    }


    loadAndDisplayData([checkboxData[0]], data, features, "Forward")
}

showDashboard();