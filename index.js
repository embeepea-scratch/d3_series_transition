(function($) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: './data/data.json',
        success: function(data) {
            setup(data);
        },
        error: function(jqXHR, textStatus, e) {
            console.log('parse error in data.json');
            console.log(textStatus);
            console.log(e);
        }
    });

    function setup(data) {
        $('#plot_scenarios').d3_timeseries_scenario_display({
            "x_axis" : {
                "title"  : "Year",
                "domain" : [1900,2100],
                "ticks" : 10,
                "tickFormat" : "1d"
            },
            "y_axis" : {
                "title"  : "Average Global Temperature Change (°F)",
                "domain" : [-2.0,10.0],
                "ticks" : 5,
                "tickFormat" : "1d"
            },
            "series" : [
                {
                    "type" : "area",
                    "class" : "cmip5_historical_fill",
                    "data" : data.cmip5_historical.range.data
                },
                {
                    "type" : "line",
                    "class" : "cmip5_historical_line",
                    "data" : data.cmip5_historical.value.data
                },
                {
                    "type" : "area",
                    "class" : "proj_fill",
                    "states" : {
                        "rcp26" : {
                            "data" : data.rcp26_projections.range.data,
                            "fill" : "#00AAAA",
                            "stroke" : undefined
                        },
                        "rcp85" : {
                            "data" : data.rcp85_projections.range.data,
                            "fill" : "#AA0000",
                            "stroke" : undefined
                        }
                    },
                    "default_state" : "rcp26"
                },

                {
                    "type" : "line",
                    "class" : "proj_line",
                    "states" : {
                        "rcp26" : {
                            "data" : data.rcp26_projections.value.data,
                            "fill" : undefined,
                            "stroke" : "#00FFFF"
                        },
                        "rcp85" : {
                            "data" : data.rcp85_projections.value.data,
                            "fill" : undefined,
                            "stroke" : "#FF0000"
                        }
                    },
                    "default_state" : "rcp26"
                }

            ]
        });


        $('#proj_rcp85').click(function() {
            $('#plot_scenarios').d3_timeseries_scenario_display('transition_to_state', 'rcp85');
        });
        $('#proj_rcp26').click(function() {
            $('#plot_scenarios').d3_timeseries_scenario_display('transition_to_state', 'rcp26');
        });

    }

}(jQuery));
