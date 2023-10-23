import { scatterPlot, updatePoints } from "./scatterPlot.js";
import { barPlot } from "./barPlot.js";

const checkboxData = ["Serie A", "Premier League", "La Liga", "Bundesliga", "Ligue 1"];

// color scale mapped to competition values
var colorScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10)
    .domain(checkboxData);

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

var mouseOverHandler = function () {
    d3.select(this.parentNode).style("background-color", "#f0f0f0");
    d3.select(this).style("color", "green");
};

var mouseOutHandler = function () {
    d3.select(this.parentNode).style("background-color", "transparent");
    d3.select(this).style("color", "black");
};

const playerTypeSelect = d3.select("#pick-position");

playerTypeSelect
    .selectAll("option")
    .data(["Forward", "Midfielder"]) // "Defender"
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d)

const buttonLeague = d3.selectAll("#showDropMenuLeague")
    .style("padding", "1.5%")
    .style("margin", "5%")
    .style("width", "100%")
    .style("display", "flex")
    .style("justify-content", "center")
    .append("button")
    .style("width", "100%")
    .text("Pick The League")
    .style("font-size", "1.3vw")
    .style("font-weight", "bold")
    .style("cursor", "pointer");

buttonLeague
    .style("background", "none")
    .style("border", "none")
    .style("padding", "0")
    .style("margin", "0");

buttonLeague.on("click", () => {
    const dropMenu = d3.select("#dropMenuLeague");
    const displayStyle = dropMenu.style("display");
    dropMenu.style("display", displayStyle === "block" ? "none" : "block");
});

buttonLeague.on("mouseover", mouseOverHandler);
buttonLeague.on("mouseout", mouseOutHandler);

const buttonPosition = d3.selectAll("#showPickPosition")
    .style("padding", "1.5%")
    .style("margin", "5%")
    .style("width", "100%")
    .style("display", "flex")
    .style("justify-content", "center")
    .append("button")
    .style("width", "100%")
    .text("And Pick a Position")
    .style("font-size", "1.3vw")
    .style("font-weight", "bold")
    .style("cursor", "pointer");

buttonPosition
    .style("background", "none")
    .style("border", "none")
    .style("padding", "0")
    .style("margin", "0");

buttonPosition.on("click", () => {
    const pickPosition = d3.select("#pick-position");
    const displayStyle = pickPosition.style("display");
    pickPosition.style("display", displayStyle === "block" ? "none" : "block");
});

buttonPosition.on("mouseover", mouseOverHandler)
buttonPosition.on("mouseout", mouseOutHandler)

d3.select("#dropMenuLeague")
    .style("display", "none")

d3.select("#pick-position")
    .style("display", "none")

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

    d3.select("#dropMenuLeague")
        .style("display", "none")
        .style("padding-bottom", "5%")
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
                    .style("color", function (d) { return colorScale(d); })
                    .style("font-weight", "bold")
                    .style("padding", "10px");

                group.append("input") // Aggiungi la checkbox al gruppo
                    .attr("type", "checkbox")
                    .attr("class", "checkbox")
                    .attr("value", d => d)
                    .attr("checked", d => d === "Serie A" ? "checked" : null)
                    .on("change", async (event) => {
                        const clickedCheckbox = d3.select(event.target);

                        if (clickedCheckbox.property("checked")) {
                            selectedLeagues.add(clickedCheckbox.datum());
                        } else {
                            selectedLeagues.delete(clickedCheckbox.datum());
                        }

                        let selectedData = await loadSelectedData(Array.from(selectedLeagues), data);
                        updatePoints(selectedData);
                        barPlot(selectedData, Array.from(selectedLeagues), playerTypeSelect.property("value"), colorScale);
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

        scatterPlot(selectedData, acronyms, features, leaguesArray, data);
        barPlot(selectedData, leaguesArray, playerPos, colorScale);
    }

    async function loadSelectedData(selectedLeagues, data) {
        var selectedData = data.filter(d => d["Comp"] === selectedLeagues[0])

        for (let i = 1; i < selectedLeagues.length; i++)
            selectedData = selectedData.concat(data.filter(d => d["Comp"] === selectedLeagues[i]));

        return selectedData;
    }

    loadAndDisplayData([checkboxData[0]], data, features, "Forward", data)
}

showDashboard();