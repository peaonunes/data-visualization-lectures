//Width and height
var margin = {top: 10, right: 20, bottom: 10, left: 20};
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//
var generator = d3.randomUniform(0, 1);

// Global var of rectangle zoom position
var xOffset = 0;
var yOffset = 0;
var initialMousePosition  = [0,0] 
var state = "idle";
var scaleFactor = 1.0;


//			
var dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88],
    [600, 150],
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88],
    [600, 150]
];

function updateDataset(){
    var newDataset = [];
    
    var numPoints = dataset.length;
    for(var i = 0 ; i < numPoints ; ++i){
	var x = 600 * generator();
	var y = 200 * generator();
	newDataset.push([x,y]);
    }

    for(var i = 0 ; i < numPoints ; ++i){
	var x = 200 + 1 * Math.sin(2*Math.PI*i/numPoints);
	var y = 150 + 1 * Math.cos(2*Math.PI*i/numPoints);
	newDataset.push([x,y]);
    }

    
    dataset = newDataset;
}

function renderDataset(){
	// Scale
	var xDomain = [xOffset,(xOffset+d3.max(dataset, function(d) { return d[0]; }))]
	var yDomain = [yOffset,(yOffset+d3.max(dataset, function(d) { return d[1]; }))]
	
	// Zoom scale
	//xDomain = [scaleFactor*xDomain[0],scaleFactor*xDomain[1]]
	//yDomain = [scaleFactor*yDomain[0],scaleFactor*yDomain[1]]

	var xCenter = (xDomain[0]+xDomain[1])/2;
    xDomain = [scaleFactor*xDomain[0] + (1-scaleFactor)*xCenter,scaleFactor*xDomain[1] + (1-scaleFactor)*xCenter] 

	var yCenter = (yDomain[0]+yDomain[1])/2;
    yDomain = [scaleFactor*yDomain[0] + (1-scaleFactor)*yCenter,scaleFactor*yDomain[1] + (1-scaleFactor)*yCenter]

    //
    var xScale = d3.scaleLinear()
        .domain(xDomain)
        .range([0, width]);
    //
    var yScale = d3.scaleLinear()
        .domain(yDomain)
	.range([height,0]);

    //
    var rScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) { return d[1]; })])
	.range([5,8]);
    
    //
    var xAxis = d3.axisBottom(xScale).ticks(6);		  
    var xAxisGroup = d3.select("#xAxis").attr("transform","translate(0," + (height - margin.bottom) + ")").call(xAxis);

    //
    var yAxis = d3.axisLeft(yScale).ticks(6);		  
    var yAxisGroup = d3.select("#yAxis").attr("transform","translate(" + (margin.left) + ",0)").call(yAxis);		    		  	

    //
    var circleSelection = svg.selectAll("circle")
	.data(dataset);

    //Remove circles that are not needed
    circleSelection
	.exit()
	.remove();
    
    //Create circles
    circleSelection
	.enter()
	.append("circle")
	.attr("cx", function(d) {
	    return xScale(d[0]);
	})
	.attr("cy", function(d) {
	    return yScale(d[1]);
	})
	.attr("r", function(d) {
	    return rScale(d[1]);
	}).on("mouseover", function() {
            d3.select(this)
		.attr("fill", "orange");
	}).on("mouseout", function() {
            d3.select(this)
		.attr("fill", "black");
	});


    //
    circleSelection
	.attr("cx", function(d) {
	    return xScale(d[0]);
	})
	.attr("cy", function(d) {
	    return yScale(d[1]);
	})
	.attr("r", function(d) {
	    return rScale(d[1]);
	}).on("mouseover", function() {
            d3.select(this)
		.attr("fill", "orange");
	}).on("mouseout", function() {
            d3.select(this)
		.attr("fill", "black");
	});

    
}

function init(){
    //create clickable paragraph
    d3.select("body")
	.append("p")
	.text("Click on me!")
	.on("click", function() {
	    updateDataset();
	    renderDataset();
	});
    
    //Create SVG element
    var svg = d3.select("body")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //
    svg.append("g").attr("id","xAxis");
    svg.append("g").attr("id","yAxis");
    
	// Mouse operations
	d3.select("svg")
	.on("mousedown",function(d){
		d3.event.stopPropagation();
		d3.event.preventDefault();	    
	    var p = d3.mouse(this);
	    initialMousePosition = p;
	    state = "pan";
	})
	.on("mousemove",function(d){
		d3.event.stopPropagation();
		d3.event.preventDefault();
	    if(state === "pan"){
			var p = d3.mouse(this),
				move = {
					x : p[0] - initialMousePosition[0],
					y : p[1] - initialMousePosition[1]
				};
			xOffset -= (move.x/width) * d3.max(dataset, function(d) { return d[0]; });
			yOffset += (move.y/height)* d3.max(dataset, function(d) { return d[1]; });
			initialMousePosition = p;    
			renderDataset();
		}
	})
	.on("mouseup",function(d){	
		d3.event.stopPropagation();
		d3.event.preventDefault();
	    state = "idle";
	    renderDataset();
	})
	.on("wheel.zoom",function(d){
	    d3.event.stopPropagation();
	    d3.event.preventDefault();
	    if(d3.event.wheelDeltaY > 0)
			scaleFactor *= 1.1;
	    else
			scaleFactor *= 0.9;
	    renderDataset();  
	});


	
    return svg;
}		  		  		  

//
var svg = init();
