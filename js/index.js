import { scatterPlot } from "./scatterPlot.js";

// read the CSV
var players_data = await d3.csv("../data/2021-2022-player-stats-refined.csv", data => {
    return data;
});
console.log(players_data);

// map to explain features inside the csv 
var acronyms = await d3.json("../data/acronyms.json", data => {
    return data;
});
console.log(acronyms);


function showDashboard() {
    scatterPlot(players_data, acronyms);
}

showDashboard();