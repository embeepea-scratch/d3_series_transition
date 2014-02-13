(function($) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: './cmip3.json',
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
                "title_class" : "x-label",
                "domain" : [1900,2100],
                "ticks" : 10,
                "tickFormat" : "1d"
            },
            "y_axis" : {
                "title"  : "Average Global Temperature Change (°F)",
                "title_class" : "y-label",
                "domain" : [-2.0,10.0],
                "ticks" : 5,
                "tickFormat" : "1d"
            },
            "series" : [

                {
                    "type" : "line",
                    "class" : "cmip3_historical",
                    "data" : data.cmip3_historical.value.data
                },

                {
                    "type" : "line",
                    "class" : "noaa_obs",
                    "data" : data.noaa_obs.data
                },

                {
                    "type" : "line",
                    "data" : data.a2_projections.value.data,
                    "class" : "a2_transparent",
                },
                {
                    "type" : "line",
                    "data" : data.a1b_projections.value.data,
                    "class" : "a1b_transparent",
                },
                {
                    "type" : "line",
                    "data" : data.b1_projections.value.data,
                    "class" : "b1_transparent",
                },

                {
                    "type" : "line",
                    "class" : "proj_line",
                    "states" : {
                        "a2" : {
                            "data" : data.a2_projections.value.data,
                            "fill" : undefined,
                            "stroke" : "#CC0000"
                        },
                        "a1b" : {
                            "data" : data.a1b_projections.value.data,
                            "fill" : undefined,
                            "stroke" : "#CCCC00"
                        },
                        "b1" : {
                            "data" : data.b1_projections.value.data,
                            "fill" : undefined,
                            "stroke" : "#00CCCC"
                        }
                    },
                    "default_state" : "b1"
                }

            ]
        });


        $('#proj_a2').click(function() {
            $('#plot_scenarios').d3_timeseries_scenario_display('transition_to_state', 'a2');
        });
        $('#proj_a1b').click(function() {
            $('#plot_scenarios').d3_timeseries_scenario_display('transition_to_state', 'a1b');
        });
        $('#proj_b1').click(function() {
            $('#plot_scenarios').d3_timeseries_scenario_display('transition_to_state', 'b1');
        });

    }

}(jQuery));
