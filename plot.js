//Width and height
var w = 1000;
var h = 600;
var padding = 50;


//Static dataset
var dataset = [
				[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
				[410, 12], [475, 44], [25, 67], [85, 21], [220, 88],
				[600, 150]
			  ];


//Dynamic, random dataset
/*
var dataset = [];					//Initialize empty array
var numDataPoints = 50;				//Number of dummy data points to create
var xRange = Math.random() * 1000;	//Max range of new x values
var yRange = Math.random() * 1000;	//Max range of new y values
for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
	var newNumber1 = Math.floor(Math.random() * xRange);	//New random integer
	var newNumber2 = Math.floor(Math.random() * yRange);	//New random integer
	dataset.push([newNumber1, newNumber2]);					//Add new number to array
}
*/

//Create scale functions
var xScale = d3.scale.linear()
					 .domain([1900, 2100])
					 .range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
					 .domain([-2.0, 10.0])
					 .range([h - padding, padding]);

//Define X axis
var xAxis = d3.svg.axis()
				  .scale(xScale)
				  .orient("bottom")
				  .ticks(5)
                  .tickFormat(d3.format("1d"));

//Define Y axis
var yAxis = d3.svg.axis()
				  .scale(yScale)
				  .orient("left")
				  .ticks(5);

//Create SVG element
var svg = d3.select("svg")
			.attr("width", w)
			.attr("height", h);


/*
//Create labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
   		return d[0] + "," + d[1];
   })
   .attr("x", function(d) {
   		return xScale(d[0]);
   })
   .attr("y", function(d) {
   		return yScale(d[1]);
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "red");
*/

//Create X axis
svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (h - padding) + ")")
	.call(xAxis);

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w/2)
    .attr("y", h-5)
    .text("Year");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", 6)
    .attr("x", -h/2+30)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average Global Temperature Change (°F)");


//Create Y axis
svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + padding + ",0)")
	.call(yAxis);

var line = d3.svg.line()
    .x(function(d,i) { 
        return xScale(d[0]);
    })
    .y(function(d) { 
        return yScale(d[1]);
    })

var area = d3.svg.area()
    .x(function(d) { return xScale(d[0]); })
    .y0(function(d) { return yScale(d[1]); })
    .y1(function(d) { return yScale(d[2]); });


var csv = {};
var nOutstanding = 0;

function incrOutstanding() {
    ++nOutstanding;
}
function decrOutstanding() {
    --nOutstanding;
    if (nOutstanding <= 0) {
        whenDataDone();
    }
}

function csvLoaded(name, data) {
    csv[name] = data;
    decrOutstanding();
}

function doCsv(file, name, mapFunc) {
    incrOutstanding();
    d3.csv(file, function(stringData) {
        csvLoaded(name, _.map(stringData, mapFunc));
    });
}


incrOutstanding();

doCsv("data/a1b.csv", "a1b", function(d) {
    return [parseInt(d.year,10), parseFloat(d.value)];
});
doCsv("data/a2.csv", "a2", function(d) {
    return [parseInt(d.year,10), parseFloat(d.value)];
});
doCsv("data/cmip5_historical.csv", "cmip5_historical", function(d) {
    return [parseInt(d.year,10),parseFloat(d.high),parseFloat(d.low),parseFloat(d.value)];
});
doCsv("data/s0_CMIP5_rcp26.csv", "rcp26", function(d) {
    return [parseInt(d.year,10),parseFloat(d.high),parseFloat(d.low),parseFloat(d.value)];
});
doCsv("data/s1_CMIP5_rcp85.csv", "rcp85", function(d) {
    return [parseInt(d.year,10),parseFloat(d.high),parseFloat(d.low),parseFloat(d.value)];
});



decrOutstanding();

var ready_d = {};
var current_proj, current_proj_line, current_proj_fill, current_proj_line_color, current_proj_fill_color;

var rcp26_fill_color  = "#00AAAA";
var rcp26_line_color  = "#00FFFF";
var rcp85_fill_color  = "#AA0000";
var rcp85_line_color  = "#FF0000";
    

function whenDataDone() {

    svg.append("svg:path").attr("class", "cmip5_historical_fill")
        .attr("d", area(_.map(csv.cmip5_historical, function(r) { return [r[0],r[1],r[2]]; })));
    svg.append("svg:path").attr("class", "cmip5_historical_line")
        .attr("d", line(_.map(csv.cmip5_historical, function(r) { return [r[0],r[3]]; })));

    ready_d.rcp26_fill = _.map(csv.rcp26, function(r) { return [r[0],r[1],r[2]]; }) ;
    ready_d.rcp26_line = _.map(csv.rcp26, function(r) { return [r[0],r[3]]; })
    ready_d.rcp85_fill = _.map(csv.rcp85, function(r) { return [r[0],r[1],r[2]]; }) ;
    ready_d.rcp85_line = _.map(csv.rcp85, function(r) { return [r[0],r[3]]; })

    current_proj_line = ready_d.rcp26_line;
    current_proj_fill = ready_d.rcp26_fill;
    current_proj_line_color = rcp26_line_color;
    current_proj_fill_color = rcp26_fill_color;
    current_proj = "rcp26";

    svg.append("svg:path").attr("class", "proj_fill")
        .attr("d", area(ready_d.rcp26_fill));
    svg.append("svg:path").attr("class", "proj_line")
        .attr("d", line(ready_d.rcp26_line));

/*
    svg.append("svg:path").attr("class", "rcp85_fill")
        .attr("d", area(_.map(csv.rcp85, function(r) { return [r[0],r[1],r[2]]; })));
    svg.append("svg:path").attr("class", "rcp85_line")
        .attr("d", line(_.map(csv.rcp85, function(r) { return [r[0],r[3]]; })));
*/

//    svg.append("svg:path").attr("class", "a1b").attr("d", line(csv.a1b));



//    svg.append("svg:path").attr("class", "a2").attr("d", line(csv.a2));

}

function interp_data(d1,d2,f) {
    return _.map(d1, function(r,i) {
        return _.map(d1[i], function(e,j) {
            if (j===0) {
                return e;
            } else {
                return (1-f)*e + f*d2[i][j];
            }
        });
    });
}

function transition(N,delay,callback,t) {
    if (t===undefined) { t = 0.0; }
    callback(t);
    if (t<1.0) {
        setTimeout(function() {
            transition(N, delay, callback, t+1/N);
        }, delay);
    }
}


function interpolateColor(minColor,maxColor,f){
 
    function d2h(d) {return d.toString(16);}
    function h2d(h) {return parseInt(h,16);}
 
    if(f <= 0.0) {
        return minColor;
    }
    if(f >= 1.0) {
        return maxColor;
    }
 
    var color = "#";
 
    for(var i=1; i <= 6; i+=2){
        var minVal = new Number(h2d(minColor.substr(i,2)));
        var maxVal = new Number(h2d(maxColor.substr(i,2)));
        var nVal = minVal + (maxVal-minVal) * f;
        var val = d2h(Math.floor(nVal));
        while(val.length < 2){
            val = "0"+val;
        }
        color += val;
    }
    return color;
}


function do_proj(next_proj) {

    if (next_proj !== current_proj) {
        if (next_proj === "rcp85") {
            transition(20,30,function(t) {
                svg.select(".proj_fill")
                    .attr("d", area(interp_data(ready_d.rcp26_fill,
                                                ready_d.rcp85_fill,
                                                t)))
                    .attr("style", "fill: " + interpolateColor("#00AAAA", "#AA0000", t));

                svg.select(".proj_line")
                    .attr("d", line(interp_data(ready_d.rcp26_line,
                                                ready_d.rcp85_line,
                                                t)))
                    .attr("style", "stroke: " + interpolateColor("#00FFFF", "#FF0000", t));
            });
        } else {
            transition(20,30,function(t) {
                svg.select(".proj_fill")
                    .attr("d", area(interp_data(ready_d.rcp85_fill,
                                                ready_d.rcp26_fill,
                                                t)))
                    .attr("style", "fill: " + interpolateColor("#AA0000", "#00AAAA", t));

                svg.select(".proj_line")
                    .attr("d", line(interp_data(ready_d.rcp85_line,
                                                ready_d.rcp26_line,
                                                t)))
                    .attr("style", "stroke: " + interpolateColor("#FF0000", "#00FFFF", t));
            });
        }
        current_proj = next_proj;
    }

}



$(document).ready(function() {


/*
    $('#go').click(function() {
        console.log('go');
        transition(20,30,function(t) {
            svg.select(".a1b")
               .attr("d", line(interp_data(csv.a1b,csv.a2,t)))
               .attr("style", "stroke: " + interpolateColor("#0000CC", "#CCCC00", t));
        });
    });
*/

    $('#go').click(function() {
        console.log('go');
        transition(20,30,function(t) {
            svg.select(".proj_fill")
               .attr("d", area(interp_data(ready_d.rcp26_fill,
                                           ready_d.rcp85_fill,
                                           t)))
               .attr("style", "fill: " + interpolateColor("#00AAAA", "#AA0000", t));

            svg.select(".proj_line")
               .attr("d", line(interp_data(ready_d.rcp26_line,
                                           ready_d.rcp85_line,
                                           t)))
               .attr("style", "stroke: " + interpolateColor("#00FFFF", "#FF0000", t));
        });
    });

    $('#proj_rcp26').click(function() {
        do_proj("rcp26");
    });
    $('#proj_rcp85').click(function() {
        do_proj("rcp85");
    });




    $('#reset').click(function() {
        svg.select(".a1b").attr("d", line(csv.a1b));
    });



});



//d3.csv("data/a1b.csv", function(stringData) {
//
//    var data = _.map(stringData, function(d) {
//        return [parseInt(d.year,10), parseFloat(d.value)];
//    });
//
//
///*
//    //Create circles
//    svg.selectAll("circle")
//        .data(data)
//        .enter()
//        .append("circle")
//        .attr("cx", function(d) {
//   		    return xScale(d[0]);
//        })
//        .attr("cy", function(d) {
//   		    return yScale(d[1]);
//        })
//        .attr("r", function(d) {
//   		    return 10.0;
//        });
//*/
//
//
//});
