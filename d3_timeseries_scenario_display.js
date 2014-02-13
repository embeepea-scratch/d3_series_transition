(function($) {

    function construct(element, settings) {

        var obj = {};

        //Create SVG element
        var svg = d3.select(element)
                .append("svg")
		        .attr("width", settings.width)
		        .attr("height", settings.height);
        

        //Create scales
        var xScale = d3.scale.linear()
		        .domain(settings.x_axis.domain)
		        .range([settings.padding, settings.width - settings.padding * 2]);
        var yScale = d3.scale.linear()
		        .domain(settings.y_axis.domain)
		        .range([settings.height - settings.padding, settings.padding]);
        
        var text;

        // Set up X axis
        var xAxis = d3.svg.axis()
		        .scale(xScale)
		        .orient("bottom")
		        .ticks(settings.x_axis.ticks)
                .tickFormat(d3.format(settings.x_axis.tickFormat));
        svg.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(0," + (settings.height - settings.padding) + ")")
	        .call(xAxis);
        if (settings.x_axis.title !== undefined) {
            text = svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", settings.width/2)
                .attr("y", settings.height-5)
                .text(settings.x_axis.title);
            if (settings.x_axis.title_class !== undefined) {
                text.attr("class", settings.x_axis.title_class);
            }
        }

        // Set up Y axis
        var yAxis = d3.svg.axis()
		        .scale(yScale)
		        .orient("left")
		        .ticks(settings.y_axis.ticks)
                .tickFormat(d3.format(settings.y_axis.tickFormat));
        svg.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(" + settings.padding + ",0)")
	        .call(yAxis);
        if (settings.y_axis.title !== undefined) {        
            text = svg.append("text")
                .attr("text-anchor", "middle")
                .attr("y", 6)
                .attr("x", -settings.height/2+30)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text(settings.y_axis.title);
            if (settings.y_axis.title_class !== undefined) {
                text.attr("class", settings.y_axis.title_class);
            }
        }
        
        
        var d3_data_funcs = {
            "line" : d3.svg.line()
                .x(function(d) { return xScale(d[0]); })
                .y(function(d) { return yScale(d[1]); }),
            "area" : d3.svg.area()
                .x(function(d) { return xScale(d[0]); })
                .y0(function(d) { return yScale(d[1]); })
                .y1(function(d) { return yScale(d[2]); })
        }
        
        var transitions = [];

        _.each(settings.series, function(series) {
            var path;
            if (series.data !== undefined) {
                path = svg.append("svg:path")
                    .attr("d", d3_data_funcs[series.type](series.data));
                if (series["class"] !== undefined) {
                    path.attr("class", series["class"]);
                }
            } else if (series.states !== undefined) {
                transitions.push( create_transition(series) );
            }
        });

        function create_transition(series) {
            var obj = {};
            var current_state = series.states[series.default_state];
            var target_state;
            var path = svg.append("svg:path").attr("class", series["class"]).attr("d", d3_data_funcs[series.type](current_state.data));
            obj.states = series.states;
            obj.set_target_state = function(state_name) {
                target_state = series.states[state_name];
            };
            obj.set_transition_t = function(t) {
                path.attr("d", d3_data_funcs[series.type](interpoldateData(current_state.data, target_state.data, t)))
                if (current_state.stroke !== undefined && target_state.stroke !== undefined) {
                    path.attr("style", "stroke: " + interpolateColor(current_state.stroke, target_state.stroke, t));
                }
                if (current_state.fill !== undefined && target_state.fill !== undefined) {
                    path.attr("style", "fill: " + interpolateColor(current_state.fill, target_state.fill, t));
                }
            };
            obj.set_transition_done = function() {
                current_state = target_state;
            };
            return obj;
        }

        function interpoldateData(d1,d2,f) {
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
        
        function transition(N,delay,callback,done,t) {
            if (t===undefined) { t = 0.0; }
            callback(t);
            if (t<1.0) {
                setTimeout(function() {
                    transition(N, delay, callback, done, t+1/N);
                }, delay);
            } else {
                if (done !== undefined) {
                    done();
                }
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


        obj.transition_to_state = function(state_name) {

            _.each(transitions, function(at) {
                at.set_target_state(state_name);
            });
            transition(20,30,function(t) {
                _.each(transitions, function(at) {
                    at.set_transition_t(t);
                });
            },
                       function() {
                           _.each(transitions, function(at) {
                               at.set_transition_done();
                           });
                       });
            
        };

        return obj;
        
    }

    var methods = {
        init : function (options) {
            if (options === undefined) { options = {}; }
            // inherit size from the targeted HTML element itself, if no size was explicitly set in the options
            if (options.width === undefined) {
                options.width = $(this).width();
            }
            if (options.height === undefined) {
                options.height = $(this).height();
            }
            var defaults = {
                'padding' : 50,
                'x_title' : 'x',
                'y_title' : 'y'
            };
            var settings = $.extend({}, defaults, options);
            return this.each(function () {
                var $this = $(this);
                // get or set this instance's data object
                var data = $this.data('d3_timeseries_scenario_display');
                if ( ! data ) {
                    data = {
                        'settings' : settings
                    };
                    $this.data('d3_timeseries_scenario_display', data);
                }
                // store the constructor object in this instance's data
                data.obj = construct(this, settings);
                return this;
            });
        },

        transition_to_state : function(proj) {
            $(this).data('d3_timeseries_scenario_display').obj.transition_to_state(proj);
        }

    };

    $.fn.d3_timeseries_scenario_display = function (method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on d3_timeseries_scenario_display');
            return null;
        }
    };


}(jQuery));
