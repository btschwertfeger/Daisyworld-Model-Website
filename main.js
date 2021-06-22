/*
The Daisyworld model discussed here are explained by Watson, 
A.J., Lovelock J.E (1983) in "Biological homeostatis of the global environment: the parable of Daisyworld". (1983)
(Tellus.35B: 286-9. Bibcode:1983TellB..35..284W. doi:10.1111/j.1600-0889.1983.tb00031.x.)

Implementation in Python by Andrew Bennet, Peter Greve, and Eric Jaeger. They made it available
via Github (https://gist.github.com/arbennett/26c124aeeb1e397b9e35ab8f2047709a (2021-06-18)).

Benjamin Thomas Schwertfeger has received permission from Andrew Bennett to translate and
implement their code in JavaScript to help students better understand the learning content,
among other things. 

2021 June

*/

/*
########################################
## @author Benjamin Thomas Schwertfeger
############
*/

/* FUNCTIONS */

// returns array from start to end with steps 
function range(start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }
    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }
    if (typeofStart == "number") {
        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }
    } else if (typeofStart == "string") {
        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }
        start = start.charCodeAt(0);
        end = end.charCodeAt(0);
        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }
    } else {
        throw TypeError("Only string and number types are supported");
    }
    return range;
}

/* DAISYWORLD */
let KELVIN_OFFSET = 273.15;
window.default_parameters = {
    REVERSE: false,
    // Temperatures
    KELVIN_OFFSET: KELVIN_OFFSET,
    Td_min: 5 + KELVIN_OFFSET,
    Td_max: 40 + KELVIN_OFFSET,
    Td_ideal_black: 22.5 + KELVIN_OFFSET,
    Td_ideal_white: 22.5 + KELVIN_OFFSET,

    // Albedo
    alb_white: 0.75,
    area_white: 0.01,
    alb_black: 0.25,
    area_black: 0.01,
    alb_barren: 0.5,
    insul: 20,
    drate: 0.3,

    // Convergence criteria
    maxconv: 1000,
    tol: 0.000001,

    // Fraction of fertile ground
    p: 1,

    // Flux termx
    So: 1000,
    sigma: 5.67032e-8,

    // Flux limits and step
    Sflux_min: 0.5,
    Sflux_max: 1.6,
    Sflux_step: 0.002,
}

// PLOTTING
window.updatePlots = function (input = window.default_parameters) {
    let RESULT = doDaisyWorld(input);

    document.getElementById('daisyworld-area-plot').remove();
    document.getElementById('daisyworld-area-plot-container').innerHTML = '<canvas id="daisyworld-area-plot"></canvas>';

    let black_data = new Array(RESULT['area_black_vec'].length),
        white_data = new Array(RESULT['area_white_vec'].length);

    for (let entry = 0; entry < black_data.length; entry++) {
        black_data[entry] = RESULT['area_black_vec'][entry] * 100;
        white_data[entry] = RESULT['area_white_vec'][entry] * 100;
    }

    let ctx1 = document.getElementById('daisyworld-area-plot');
    let daisyworld_area_lumi = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: RESULT['fluxes'],
            datasets: [{
                label: 'black',
                data: black_data,
                fill: false,
                borderColor: 'rgb(0,0,0)',
                pointRadius: 0
            }, {
                label: 'white',
                data: white_data,
                fill: false,
                borderColor: 'rgb(255,0,03)',
                pointRadius: 0
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Fraction of diasies as function of the luminosity',
                    font: {
                        Family: 'Helvetica',
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                }
            },

            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'solar luminosity',
                        font: {
                            family: 'Helvetica',
                            size: 16,
                        }
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return Math.round(RESULT['fluxes'][index] * 100) / 100;
                        }
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Area fractions (%)',
                        font: {
                            family: 'Helvetica',
                            size: 16
                        }
                    }
                }
            },
            animations: {
                radius: {
                    duration: 400,
                    easing: 'linear',
                    loop: (ctx) => ctx.activate
                }
            },
            hoverRadius: 12,
            hoverBackgroundColor: 'yellow',
            interaction: {
                mode: 'nearest',
                intersect: false,
                axis: 'x'
            }

        }
    });

    document.getElementById('daisyworld-temperature-plot').remove();
    document.getElementById('daisyworld-temperature-plot-container').innerHTML = '<canvas id="daisyworld-temperature-plot"></canvas>';

    let temp_lumi_data = new Array(RESULT['Tp_vec'].length);

    for (let entry = 0; entry < temp_lumi_data.length; entry++) {
        temp_lumi_data[entry] = RESULT['Tp_vec'][entry] - RESULT['KELVIN_OFFSET'];
    }

    let temp_data = [{
        label: 'global temperature',
        data: temp_lumi_data,
        fill: false,
        borderColor: 'rgb(255,0,0)',
        pointRadius: 0,
    }, {
        label: 'optimal temperature',
        data: new Array(temp_lumi_data.length).fill(22.5),
        fill: false,
        borderColor: 'rgb(236,193,20)',
        pointRadius: 0,
    }];

    if (document.getElementById('showTempWithoutLife-checkbox').checked) {
        temp_data.push({
            label: 'Temperature without life',
            data: RESULT['temp_without_life'],
            fill: false,
            borderColor: 'rgb(0,0,0)',
            pointRadius: 0,
        })
    }
    let ctx2 = document.getElementById('daisyworld-temperature-plot');
    let daisyworld_temp_lumi = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: RESULT['fluxes'],
            datasets: temp_data,
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature by luminosity',
                    font: {
                        Family: 'Helvetica',
                        size: 18
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'solar luminosity',
                        font: {
                            family: 'Helvetica',
                            size: 16,
                        }
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return Math.round(RESULT['fluxes'][index] * 100) / 100;
                        }
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            family: 'Helvetica',
                            size: 16
                        }
                    }
                }
            },
            animations: {
                radius: {
                    duration: 400,
                    easing: 'linear',
                    loop: (ctx) => ctx.activate
                }
            },
            hoverRadius: 12,
            hoverBackgroundColor: 'yellow',
            interaction: {
                mode: 'nearest',
                intersect: false,
                axis: 'x'
            }

        }
    });
}

// CALCULATION
function doDaisyWorld(input = window.default_parameters) {

    let REVERSE = input['REVERSE'];

    // Temperatures
    let KELVIN_OFFSET = parseFloat(input['KELVIN_OFFSET']);
    let Td_min = 5 + KELVIN_OFFSET,
        Td_max = 40 + KELVIN_OFFSET;
    let Td_ideal_black = 22.5 + KELVIN_OFFSET,
        Td_ideal_white = 22.5 + KELVIN_OFFSET;
    let Tp = 0;

    // Albedo
    let alb_white = parseFloat(input['alb_white']),
        area_white = parseFloat(window.default_parameters['area_white']); //parseFloat(input['area_white']);
    let alb_black = parseFloat(input['alb_black']),
        area_black = parseFloat(window.default_parameters['area_black']); //parseFloat(input['area_black']);
    let alb_barren = parseFloat(input['alb_barren']),
        insul = parseFloat(input['insul']),
        drate = parseFloat(input['drate']);

    // Convergence criteria
    let maxconv = window.default_parameters['maxconv'],
        tol = window.default_parameters['tol'];

    let p = window.default_parameters['p'];
    // Flux termx
    let So = window.default_parameters['So'],
        sigma = window.default_parameters['sigma'];

    // Flux limits and step
    let Sflux_min = parseFloat(input['Sflux_min']),
        Sflux_max = parseFloat(input['Sflux_max']),
        Sflux_step = parseFloat(input['Sflux_step']);

    // Init
    let fluxes = range(Sflux_min, Sflux_max, Sflux_step);
    if (REVERSE) {
        fluxes = fluxes.reverse();
    }

    let area_black_vec = new Array(fluxes.length).fill(0);
    let area_white_vec = new Array(fluxes.length).fill(0);
    let area_barren_vec = new Array(fluxes.length).fill(0);
    let temp_without_life_vec = new Array(fluxes.length).fill(0);
    let Tp_vec = new Array(fluxes.length).fill(0);

    // LOOP over fluxes
    fluxes.forEach(function (flux, index) {
        // Minimum daisy coverage
        if (area_black < 0.01) {
            area_black = 0.01;
        }
        if (area_white < 0.01) {
            area_white = 0.01;
        }
        area_barren = 1 - (area_black + area_white);

        // reset iteration metrics
        let it = 0;
        let dA_black = 2 * tol,
            dA_white = 2 * tol;
        let darea_black_old = 0,
            darea_white_old = 0;

        while (it <= maxconv && dA_black > tol && dA_white > tol) {

            // Planetary albedo
            let alb_p = (area_black * alb_black + area_white * alb_white + area_barren * alb_barren);

            // Planetary temperature
            Tp = Math.pow(flux * So * (1 - alb_p) / sigma, 0.25)

            // Local temperatures
            let Td_black = insul * (alb_p - alb_black) + Tp;
            let Td_white = insul * (alb_p - alb_white) + Tp;

            // Determine birth rates
            if (Td_black >= Td_min && Td_black <= Td_max && area_black >= 0.01) {
                birth_black = 1 - 0.003265 * Math.pow((Td_ideal_black - Td_black), 2);
            } else {
                birth_black = 0.0;
            }
            if (Td_white >= Td_min && Td_white <= Td_max && area_white >= 0.01) {
                birth_white = 1 - 0.003265 * Math.pow((Td_ideal_white - Td_white), 2);
            } else {
                birth_white = 0.0;
            }

            // Change in areal extents
            darea_black = area_black * (birth_black * area_barren - drate);
            darea_white = area_white * (birth_white * area_barren - drate);

            // Change from previous iteration
            dA_black = Math.abs(darea_black - darea_black_old);
            dA_white = Math.abs(darea_white - darea_white_old);

            // Update areas, states, and iteration count
            darea_black_old = darea_black;
            darea_white_old = darea_white;
            area_black = area_black + darea_black;
            area_white = area_white + darea_white;
            area_barren = 1 - (area_black + area_white);
            it += 1;
        }
        // Save states
        area_black_vec[index] = area_black;
        area_white_vec[index] = area_white;
        area_barren_vec[index] = area_barren;
        temp_without_life_vec[index] = Math.pow(((So * flux / sigma) * (1 - alb_barren * p)), 1 / 4) - KELVIN_OFFSET;
        Tp_vec[index] = Tp;

    });

    const RESULT = {
        fluxes: fluxes,
        area_black_vec: area_black_vec,
        area_white_vec: area_white_vec,
        area_barren_vec: area_barren_vec,
        temp_without_life: temp_without_life_vec,
        Tp_vec: Tp_vec,
        KELVIN_OFFSET: KELVIN_OFFSET,
    }
    if (input == window.default_parameters) {
        window.defaultResult = RESULT;
    }

    return RESULT;
}

window.onload = window.updatePlots()