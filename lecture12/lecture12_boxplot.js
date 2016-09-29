//Width and height
var margin = {top: 10, right: 20, bottom: 10, left: 20};
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var xScale;
var yScale;

var input = [[3, 13, 7, 5, 21, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29],[1,12,5,8,4,20,1,13,16,1,18,17,6,13,14,3,10]]

function plotMax(argument) {
	d3.select("svg")
		.selectAll("line.max")
		.data(argument)
		.enter()
		.append("line")
		.attr("class","max")
		.attr("x1", function(d, i){
			return xScale(i * (width/argument.length)) + margin.left + 10;
		})
		.attr("y1", function(d){
			return yScale(d.max) + margin.bottom ;
		})
		.attr("x2", function(d, i){
			return xScale(i * (width/argument.length)) + 2*margin.left + 10;
		})
		.attr("y2", function(d){
			return yScale(d.max) + margin.bottom;
		})
		.attr("stroke", "black")
		.attr("stroke-width", "3");
}

function plotMin(argument) {
	d3.select("svg")
		.selectAll("line.min")
		.data(argument)
		.enter()
		.append("line")
		.attr("class","min")
		.attr("x1", function(d, i){
			return xScale(i * (width/argument.length)) + margin.left + 10;
		})
		.attr("y1", function(d){
			return yScale(d.min) + margin.bottom ;
		})
		.attr("x2", function(d, i){
			return xScale(i * (width/argument.length)) + 2*margin.left + 10;
		})
		.attr("y2", function(d){
			return yScale(d.min) + margin.bottom;
		})
		.attr("stroke", "black")
		.attr("stroke-width", "3");
}

function renderDataset(dataset, maxDataset, minDataset) {
    xScale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([margin.left, width]);

    yScale = d3.scaleLinear()
        .domain([0, maxDataset])
	.range([height,0]);

    var xAxis = d3.axisBottom(xScale).ticks(6);		  
    var xAxisGroup = d3.select("#xAxis").attr("transform","translate(0," + (height - margin.bottom) + ")").call(xAxis);

    var yAxis = d3.axisLeft(yScale).ticks(6);		  
    var yAxisGroup = d3.select("#yAxis").attr("transform","translate(" + (margin.left) + ",0)").call(yAxis);	

    plotMax(dataset);	
    plotMin(dataset);    
}

function buildValues(input){
	
	var min = d3.min(input);
	var max = d3.max(input);

	var sortedInput = input.sort();
	var middle = Math.floor(sortedInput.length/2);
    var median = sortedInput.length % 2 ? sortedInput[middle] : ((sortedInput[middle-1] + sortedInput[middle]) / 2.0);

    var quartile1 = sortedInput[sortedInput.length/2];
    var quartile2 = 0;

    var data = {
    	"min":min,
    	"max":max,
    	"median":median,
    	"quartile1":quartile1,
    	"quartile2":quartile2
    };

    return data;
}

function parseDataset(input){
	var dataset = [];
	for (var element in input){
		var data = buildValues(input[element]);
		dataset.push(data);
	}
	var maxDataset = d3.max(dataset, function(d){ return d.max; });
	var minDataset = d3.max(dataset, function(d){ return d.min; });
	renderDataset(dataset, maxDataset, minDataset);
}

function init(){
    var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("id","xAxis");
    svg.append("g").attr("id","yAxis");

    parseDataset(input);	
	
    return svg;
}		  		  		  

//
var svg = init();
