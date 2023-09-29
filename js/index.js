import { scatterPlot } from "./scatterPlot.js";
import { soccerField } from "./soccerField.js";

// read the CSV
var attk_data = await d3.csv("../data/Serie A/attk.csv", data => {
    return data;
});

var cen_data = await d3.csv("../data/Serie A/cen.csv", data => {
    return data;
});

var dif_data = await d3.csv("../data/Serie A/dif.csv", data => {
    return data;
});

// map to explain features inside the csv 
var acronyms = await d3.json("../data/acronyms.json", data => {
    return data;
});


function showDashboard() {
    scatterPlot(attk_data, acronyms);
    soccerField(attk_data, cen_data, dif_data);
}

showDashboard();