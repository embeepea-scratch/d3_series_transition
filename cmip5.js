(function($) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: './cmip5.json',
        success: function(data) {
            setup(data);
        },
        error: function(jqXHR, textStatus, e) {
            console.log('parse error in cmip5.json');
            console.log(textStatus);
            console.log(e);
        }
    });

    function setup(data) {
        $('#plot_scenarios').d3_series_transition({
            "x_axis" : {
                "title"       : "Year",
                "title_class" : "x-label",
                "domain"      : [1900,2100],
                "ticks"       : 10,
                "tickFormat"  : "1d"
            },
            "y_axis" : {
                "title"       : "Average Global Temperature Change (°F)",
                "title_class" : "y-label",
                "domain"      : [-2.0,10.0],
                "ticks"       : 5,
                "tickFormat"  : "1d"
            },
            "series" : [

                {
                    "type"  : "area",
                    "data"  : data.cmip5_historical.range.data,
                    "style" : {
                        "stroke-width" : "1",
                        "fill"         : "#AAAAAA"
                    }

                },
                {
                    "type"  : "line",
                    "data"  : data.cmip5_historical.value.data,
                    "style" : {
                        "stroke"       : "#000000",
                        "stroke-width" : "3",
                        "fill"         : "none"
                    }

                },
                {
                    "type"  : "line",
                    "style" : {
                        "stroke"       : "#000000",
                        "stroke-width" : "2",
                        "fill"         : "none"
                    },
                    "data"  : data.noaa_obs.data
                },

                {   "type"  : "group",
                    "style" : {
                        "opacity"      : 0.05
                    },
                    "series" : [
                        {   "type"  : "group",
                            "style" : {
                                "stroke-width" : "1"
                            },
                            "series" : [

                                {
                                    "type"   : "area",
                                    "style" : {
                                        "fill"         : "#00AAAA"
                                    },
                                    "data"   : data.rcp26_projections.range.data,
                                },
                                {
                                    "type"   : "area",
                                    "style" : {
                                        "fill"         : "#AA0000"
                                    },
                                    "data"   : data.rcp85_projections.range.data
                                }
                            ]
                        },
                        {   "type"  : "group",
                            "style" : {
                                "stroke-width" : "3",
                                "fill"         : "none",
                            },
                            "series" : [
                                {
                                    "type"   : "line",
                                    "style" : {
                                        "stroke"       : "#00FFFF"
                                    },
                                    "data"   : data.rcp26_projections.value.data
                                },
                                {
                                    "type"   : "line",
                                    "style" : {
                                        "stroke"       : "#FF0000"
                                    },
                                    "data"   : data.rcp85_projections.value.data
                                }
                            ]
                        }
                    ]
                },

                {
                    "type"   : "area",
                    "style" : {
                        "stroke-width" : "1",
                        "opacity"      : "0.5"
                    },
                    "states" : {
                        "rcp26" : {
                            "data"   : data.rcp26_projections.range.data,
                            "style" : {
                                "fill" : "#00AAAA"
                            }
                        },
                        "rcp85" : {
                            "data"   : data.rcp85_projections.range.data,
                            "style" : {
                                "fill" : "#AA0000"
                            }
                        }
                    },
                    "default_state" : "rcp26"
                },

                {
                    "type"   : "line",
                    "style" : {
                        "stroke-width" : "3",
                        "fill"         : "none"
                    },
                    "states" : {
                        "rcp26" : {
                            "data"   : data.rcp26_projections.value.data,
                            "style" : {
                                "stroke"       : "#00FFFF"
                            }
                        },
                        "rcp85" : {
                            "data"   : data.rcp85_projections.value.data,
                            "style" : {
                                "stroke"       : "#FF0000"
                            }
                        }
                    },
                    "default_state" : "rcp26"
                }

            ]
        });


        $('#proj_rcp85').click(function() {
            $('#plot_scenarios').d3_series_transition('transition_to_state', 'rcp85');
        });
        $('#proj_rcp26').click(function() {
            $('#plot_scenarios').d3_series_transition('transition_to_state', 'rcp26');
        });

    }

}(jQuery));
